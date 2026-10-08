// ============================================================
// Screen 24: Export Data — Excel, CSV & PDF Export Hub
// Directly matching Screen 24 in Reference Design Mockup
// ============================================================

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
import { ArrowLeft, Download, ChevronDown, Check } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useJobSheetStore } from '../../src/store/jobSheetStore';
import { useExpenseStore } from '../../src/store/expenseStore';
import { useChalanStore } from '../../src/store/chalanStore';
import { usePaymentStore } from '../../src/store/paymentStore';
import { useCustomerStore } from '../../src/store/customerStore';
import { useVehicleStore } from '../../src/store/vehicleStore';
import { generateAndShareFinancialPdf, generateAndShareCsv } from '../../src/utils/pdfReport';

export default function ExportDataScreen() {
  const { isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [selectedData, setSelectedData] = useState('All Data');
  const [selectedFormat, setSelectedFormat] = useState('Excel (.xlsx)');
  const [showDataPicker, setShowDataPicker] = useState(false);
  const [showFormatPicker, setShowFormatPicker] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const { jobSheets } = useJobSheetStore();
  const { expenses } = useExpenseStore();
  const { chalans } = useChalanStore();
  const { payments } = usePaymentStore();
  const { customers } = useCustomerStore();
  const { vehicles } = useVehicleStore();

  const DATA_OPTIONS = ['All Data', 'Job Sheets Only', 'Expenses Only', 'Customer List', 'Vehicle Fleet'];
  const FORMAT_OPTIONS = ['Excel (.xlsx)', 'CSV (.csv)', 'PDF Report (.pdf)'];

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

  const bg = isDark ? '#0C1829' : '#FFFFFF';
  const textPrimary = isDark ? '#FFFFFF' : '#0C1829';
  const textMuted = '#64748B';
  const cardBg = isDark ? '#111E33' : '#FFFFFF';
  const fieldBg = isDark ? '#1E293B' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.08)' : '#F1F5F9';

  return (
    <View style={{ flex: 1, backgroundColor: bg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={bg} />

      {/* Top Header matching Screen 24 */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottomWidth: 1,
          borderBottomColor: borderColor,
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          activeOpacity={0.7}
          style={{ width: 40, height: 40, justifyContent: 'center' }}
        >
          <ArrowLeft size={22} color={textPrimary} strokeWidth={2.4} />
        </TouchableOpacity>

        <Text style={{ fontSize: 18, fontWeight: '800', color: textPrimary }}>
          Export Data
        </Text>

        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: insets.bottom + 90,
          gap: 20,
        }}
      >
        {/* Select Data Dropdown Card matching Screen 24 */}
        <View style={{ zIndex: 20 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: textMuted, marginBottom: 8, marginLeft: 2 }}>
            Select Data
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowDataPicker(!showDataPicker);
              setShowFormatPicker(false);
            }}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: cardBg,
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: borderColor,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: textPrimary }}>
              {selectedData}
            </Text>
            <ChevronDown size={18} color={textMuted} />
          </TouchableOpacity>

          {showDataPicker && (
            <View
              style={{
                position: 'absolute',
                top: 75,
                left: 0,
                right: 0,
                backgroundColor: cardBg,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: borderColor,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 6,
                zIndex: 30,
                overflow: 'hidden',
              }}
            >
              {DATA_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setSelectedData(item);
                    setShowDataPicker(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                    backgroundColor: item === selectedData ? fieldBg : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: item === selectedData ? '800' : '600',
                      color: item === selectedData ? textPrimary : textMuted,
                    }}
                  >
                    {item}
                  </Text>
                  {item === selectedData && <Check size={16} color="#0C1829" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Select Format Dropdown Card matching Screen 24 */}
        <View style={{ zIndex: 10 }}>
          <Text style={{ fontSize: 13, fontWeight: '700', color: textMuted, marginBottom: 8, marginLeft: 2 }}>
            Select Format
          </Text>
          <TouchableOpacity
            onPress={() => {
              setShowFormatPicker(!showFormatPicker);
              setShowDataPicker(false);
            }}
            activeOpacity={0.8}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: cardBg,
              paddingHorizontal: 16,
              paddingVertical: 14,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: borderColor,
            }}
          >
            <Text style={{ fontSize: 15, fontWeight: '700', color: textPrimary }}>
              {selectedFormat}
            </Text>
            <ChevronDown size={18} color={textMuted} />
          </TouchableOpacity>

          {showFormatPicker && (
            <View
              style={{
                position: 'absolute',
                top: 75,
                left: 0,
                right: 0,
                backgroundColor: cardBg,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: borderColor,
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 6,
                zIndex: 25,
                overflow: 'hidden',
              }}
            >
              {FORMAT_OPTIONS.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setSelectedFormat(item);
                    setShowFormatPicker(false);
                  }}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    paddingHorizontal: 16,
                    paddingVertical: 14,
                    borderBottomWidth: 1,
                    borderBottomColor: borderColor,
                    backgroundColor: item === selectedFormat ? fieldBg : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: item === selectedFormat ? '800' : '600',
                      color: item === selectedFormat ? textPrimary : textMuted,
                    }}
                  >
                    {item}
                  </Text>
                  {item === selectedFormat && <Check size={16} color="#0C1829" />}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Export Now Button matching Screen 24 */}
        <TouchableOpacity
          onPress={handleExport}
          disabled={isExporting}
          activeOpacity={0.88}
          style={{
            backgroundColor: '#0C1829',
            paddingVertical: 16,
            borderRadius: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 10,
            marginTop: 10,
          }}
        >
          {isExporting ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <Download size={18} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>
                Export Now
              </Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
