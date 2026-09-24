// ============================================================
// Export Data Screen — Data Portability & Reports
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Download, FileSpreadsheet, Check, Share2 } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';

export default function ExportDataScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const [selectedData, setSelectedData] = useState('All Data');
  const [selectedFormat, setSelectedFormat] = useState('Excel (.xlsx)');

  const dataOptions = ['All Data', 'Job Sheets Only', 'Expenses Only', 'Customer List', 'Vehicle Fleet'];
  const formatOptions = ['Excel (.xlsx)', 'CSV (.csv)', 'PDF Report (.pdf)'];

  const handleExport = () => {
    Alert.alert(
      'Export Ready',
      `Your garage data (${selectedData}) has been prepared in ${selectedFormat} format. Ready for sharing and cloud backup.`,
      [{ text: 'Share File', onPress: () => router.back() }, { text: 'Done', style: 'cancel' }]
    );
  };

  const skyBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';
  const cardBg = isDark ? '#101927' : '#FFFFFF';
  const inputBg = isDark ? '#141926' : '#F8FAFC';
  const borderColor = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';

  return (
    <View style={{ flex: 1, backgroundColor: skyBg }}>
      <StatusBar barStyle={isDark ? 'light-content' : 'light-content'} backgroundColor={skyBg} />

      {/* Symmetrical Sky Blue Top Header */}
      <View
        style={{
          paddingTop: insets.top + 10,
          paddingHorizontal: 20,
          paddingBottom: 20,
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

      {/* Signature Mega-Curved Lower Content Sheet */}
      <View
        style={{
          flex: 1,
          backgroundColor: sheetBg,
          borderTopLeftRadius: 36,
          borderTopRightRadius: 36,
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
            <Download size={20} color="#FFFFFF" strokeWidth={2.5} />
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              Export {selectedData}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
