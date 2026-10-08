import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Download, FileSpreadsheet, Check, Share2 } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { useExpenseStore } from '../../src/store/expenseStore';
import { useChalanStore } from '../../src/store/chalanStore';
import { usePaymentStore } from '../../src/store/paymentStore';
import { useCustomerStore } from '../../src/store/customerStore';
import { useVehicleStore } from '../../src/store/vehicleStore';
import { generateAndShareFinancialPdf, generateAndShareCsv } from '../../src/utils/pdfReport';

export default function ExportDataScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [selectedData, setSelectedData] = useState('All Data');
  const [selectedFormat, setSelectedFormat] = useState('Excel (.xlsx)');
  const [isExporting, setIsExporting] = useState(false);

  const { jobSheets } = useJobSheetStore();
  const { expenses } = useExpenseStore();
  const { chalans } = useChalanStore();
  const { payments } = usePaymentStore();
  const { customers } = useCustomerStore();
  const { vehicles } = useVehicleStore();

  const dataOptions = ['All Data', 'Job Sheets Only', 'Expenses Only', 'Customer List', 'Vehicle Fleet'];
  const formatOptions = ['Excel (.xlsx)', 'CSV (.csv)', 'PDF Report (.pdf)'];

  const handleExport = async () => {
    try {
      setIsExporting(true);

      if (selectedFormat === 'PDF Report (.pdf)') {
        const todayStr = new Date().toISOString().split('T')[0];
        const monthStartStr = `${todayStr.slice(0, 7)}-01`;
        const totalBilled = jobSheets.reduce((sum, j) => sum + (j.finalAmount || 0), 0);
        const totalCollected = payments.reduce((sum, p) => sum + p.amount, 0);
        const totalPendingReceivables = Math.max(0, totalBilled - totalCollected);
        const totalExpenseOutflow = expenses.reduce((sum, e) => sum + e.amount, 0);
        const totalChalanPaid = chalans.reduce((sum, c) => sum + (c.amountPaid || 0), 0);
        const totalChalanPending = chalans.reduce((sum, c) => sum + (c.pendingAmount || 0), 0);
        const netSurplus = totalCollected - (totalExpenseOutflow + totalChalanPaid);

        const cashCollections = payments.filter((p) => p.paymentMode === 'CASH').reduce((sum, p) => sum + p.amount, 0);
        const upiCollections = payments.filter((p) => p.paymentMode === 'UPI').reduce((sum, p) => sum + p.amount, 0);
        const swipeCollections = payments.filter((p) => p.paymentMode === 'CARD_SWIPE').reduce((sum, p) => sum + p.amount, 0);

        const map = new Map<string, { bankName: string; amount: number; mode: string }>();
        payments.forEach((p) => {
          if ((p.paymentMode === 'UPI' || p.paymentMode === 'CARD_SWIPE') && p.paymentAccountName) {
            const key = `${p.paymentAccountName}-${p.paymentMode}`;
            const existing = map.get(key) || {
              bankName: p.paymentAccountName,
              amount: 0,
              mode: p.paymentMode === 'CARD_SWIPE' ? 'Swipe (POS)' : 'UPI QR',
            };
            existing.amount += p.amount;
            map.set(key, existing);
          }
        });

        const staffSalaryExpenses = expenses
          .filter((e) => e.categoryId === 'cat-salary' || e.categoryId === 'cat-advance' || e.categoryName?.toLowerCase().includes('salary') || e.categoryName?.toLowerCase().includes('advance'))
          .reduce((sum, e) => sum + e.amount, 0);
        const generalExpenses = Math.max(0, totalExpenseOutflow - staffSalaryExpenses);

        await generateAndShareFinancialPdf({
          fromDate: monthStartStr,
          toDate: todayStr,
          currencySymbol: '₹',
          totalBilled,
          totalCollected,
          totalPendingReceivables,
          totalExpenseOutflow,
          totalChalanPaid,
          totalChalanPending,
          netSurplus,
          cashCollections,
          upiCollections,
          swipeCollections,
          bankCollections: Array.from(map.values()),
          staffSalaryExpenses,
          partsPurchasesAmount: totalChalanPaid,
          generalExpenses,
          jobsCount: jobSheets.length,
          chalansCount: chalans.length,
        });
      } else {
        // CSV or Excel format
        let csvContent = '';
        let filename = 'cool_car_export.csv';

        if (selectedData === 'Job Sheets Only') {
          filename = `job_sheets_${Date.now()}.csv`;
          csvContent = 'Job ID,Date,Vehicle Reg,Vehicle Model,Customer,Work Category,Total Amount,Paid Amount,Pending Amount,Status\n';
          jobSheets.forEach((j) => {
            csvContent += `"${j.jobNumber || j.id}","${j.date || ''}","${j.vehicleNumber || ''}","${j.vehicleModel || ''}","${j.customerName || ''}","${j.workCategory || ''}",${j.finalAmount || 0},${j.totalPaid || 0},${j.pendingAmount || 0},"${j.status}"\n`;
          });
        } else if (selectedData === 'Expenses Only') {
          filename = `expenses_${Date.now()}.csv`;
          csvContent = 'ID,Date,Description,Category,Amount,Payment Mode,Bank Account,Staff\n';
          expenses.forEach((e) => {
            csvContent += `"${e.id}","${e.date || ''}","${e.description || ''}","${e.categoryName || ''}",${e.amount || 0},"${e.paymentMode || ''}","${e.paymentAccountName || ''}","${e.spentBy || ''}"\n`;
          });
        } else if (selectedData === 'Customer List') {
          filename = `customers_${Date.now()}.csv`;
          csvContent = 'ID,Customer Name,Phone,Email,Address\n';
          customers.forEach((c) => {
            csvContent += `"${c.id}","${c.name}","${c.phone || ''}","${c.email || ''}","${c.address || ''}"\n`;
          });
        } else if (selectedData === 'Vehicle Fleet') {
          filename = `vehicles_${Date.now()}.csv`;
          csvContent = 'ID,Registration Number,Make,Model,Year,Fuel Type,Owner Name\n';
          vehicles.forEach((v) => {
            csvContent += `"${v.id}","${v.registrationNumber}","${v.make || ''}","${v.model || ''}",${v.modelYear || ''},"${v.fuelType || ''}","${v.customerName || ''}"\n`;
          });
        } else {
          // All Data
          filename = `cool_car_full_ledger_${Date.now()}.csv`;
          csvContent = '--- JOB SHEETS ---\nJob ID,Date,Vehicle Reg,Model,Customer,Total Amount,Paid Amount,Pending Amount,Status\n';
          jobSheets.forEach((j) => {
            csvContent += `"${j.jobNumber || j.id}","${j.date || ''}","${j.vehicleNumber || ''}","${j.vehicleModel || ''}","${j.customerName || ''}",${j.finalAmount || 0},${j.totalPaid || 0},${j.pendingAmount || 0},"${j.status}"\n`;
          });
          csvContent += '\n--- EXPENSES ---\nID,Date,Description,Category,Amount,Payment Mode,Bank Account\n';
          expenses.forEach((e) => {
            csvContent += `"${e.id}","${e.date || ''}","${e.description || ''}","${e.categoryName || ''}",${e.amount || 0},"${e.paymentMode || ''}","${e.paymentAccountName || ''}"\n`;
          });
        }

        await generateAndShareCsv(filename, csvContent);
      }
    } catch (err: any) {
      Alert.alert('Export Error', err?.message || 'Failed to generate and share file.');
    } finally {
      setIsExporting(false);
    }
  };

  const skyBg = isDark ? '#181A20' : '#153580';
  const sheetBg = isDark ? '#181A20' : '#F4F6F9';
  const cardBg = isDark ? '#242834' : '#FFFFFF';
  const inputBg = isDark ? '#141926' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <View style={{ flex: 1, backgroundColor: sheetBg }}>
      <StatusBar barStyle="light-content" backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          backgroundColor: skyBg,
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 22,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: 'rgba(255,255,255,0.22)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <View>
          <Text style={{ color: '#FFFFFF', fontSize: 24, fontWeight: '800', letterSpacing: -0.5 }}>
            Export Data
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
            Portability & fiscal backups
          </Text>
        </View>
      </View>

      {/* Signature Lower Content Sheet with ZERO Blue Bleed */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          marginTop: -14,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          overflow: 'hidden',
        }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 60 }}
        >
          {/* Data Category Selection */}
          <Text
            style={{
              color: theme.textMuted,
              fontSize: 11,
              fontWeight: '800',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 10,
              paddingLeft: 4,
            }}
          >
            Select Dataset
          </Text>
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 24,
              padding: 16,
              borderWidth: 1,
              borderColor: borderColor,
              gap: 8,
              marginBottom: 20,
            }}
          >
            {dataOptions.map((opt) => {
              const isSelected = selectedData === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  onPress={() => setSelectedData(opt)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    borderRadius: 16,
                    backgroundColor: isSelected ? '#0C1829' : inputBg,
                  }}
                >
                  <Text style={{ color: isSelected ? '#FFFFFF' : theme.text, fontSize: 15, fontWeight: '700' }}>
                    {opt}
                  </Text>
                  {isSelected && <Check size={18} color="#FFFFFF" strokeWidth={2.5} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Format Selection */}
          <Text
            style={{
              color: theme.textMuted,
              fontSize: 11,
              fontWeight: '800',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 10,
              paddingLeft: 4,
            }}
          >
            File Format
          </Text>
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 24,
              padding: 16,
              borderWidth: 1,
              borderColor: borderColor,
              gap: 8,
              marginBottom: 24,
            }}
          >
            {formatOptions.map((fmt) => {
              const isSelected = selectedFormat === fmt;
              return (
                <TouchableOpacity
                  key={fmt}
                  onPress={() => setSelectedFormat(fmt)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingVertical: 12,
                    paddingHorizontal: 14,
                    borderRadius: 16,
                    backgroundColor: isSelected ? '#0C1829' : inputBg,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <FileSpreadsheet size={18} color={isSelected ? '#FFFFFF' : theme.textMuted} />
                    <Text style={{ color: isSelected ? '#FFFFFF' : theme.text, fontSize: 15, fontWeight: '700' }}>
                      {fmt}
                    </Text>
                  </View>
                  {isSelected && <Check size={18} color="#FFFFFF" strokeWidth={2.5} />}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Midnight Navy CTA */}
          <TouchableOpacity
            onPress={handleExport}
            disabled={isExporting}
            activeOpacity={0.88}
            style={{
              backgroundColor: '#0C1829',
              paddingVertical: 18,
              borderRadius: 34,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              shadowColor: '#000',
              shadowOpacity: 0.35,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              elevation: 6,
            }}
          >
            {isExporting ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Download size={20} color="#FFFFFF" strokeWidth={2.5} />
            )}
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              {isExporting ? 'Generating Report...' : `Export ${selectedData}`}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
