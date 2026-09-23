// ============================================================
// Export Data Screen — Master Design
// Strictly follows media_1790116823022.png aesthetic
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Download, FileSpreadsheet, Check, Share2 } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { GlassCard } from '../../src/components/common/GlassCard';

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

  const canvasBg = isDark ? '#14171F' : '#F8F6F2';
  const circleBtnBg = isDark ? '#1C212B' : '#EFECE6';
  const primaryBtnBg = isDark ? '#FFFFFF' : '#121214';
  const primaryBtnText = isDark ? '#121214' : '#FFFFFF';

  return (
    <View style={{ flex: 1, backgroundColor: canvasBg }}>
      {/* Symmetrical Top Header */}
      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 20,
          paddingBottom: 14,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: circleBtnBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ArrowLeft size={20} color={theme.text} />
        </TouchableOpacity>

        <Text style={{ color: theme.text, fontSize: 18, fontWeight: '800', letterSpacing: -0.3 }}>
          Export Data
        </Text>

        <View
          style={{
            width: 44,
            height: 44,
            borderRadius: 22,
            backgroundColor: circleBtnBg,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Share2 size={18} color={theme.text} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
      >
        {/* Info Hero Card */}
        <GlassCard
          variant="sand"
          padding={20}
          style={{
            borderRadius: 28,
            marginBottom: 20,
            gap: 10,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <FileSpreadsheet size={18} color={theme.text} />
            </View>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
              Cloud Data Export
            </Text>
          </View>
          <Text style={{ color: theme.textMuted, fontSize: 13, lineHeight: 19 }}>
            Generate structured spreadsheets or print-ready financial statements for your accountant, tax filings, or local archives.
          </Text>
        </GlassCard>

        {/* Dataset Selection */}
        <Text
          style={{
            color: theme.textMuted,
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 12,
            marginLeft: 4,
          }}
        >
          Select Dataset
        </Text>

        <GlassCard
          variant="sand"
          padding={16}
          style={{
            borderRadius: 28,
            gap: 8,
            marginBottom: 20,
          }}
        >
          {dataOptions.map((opt, idx) => {
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
                  borderRadius: 18,
                  backgroundColor: isSelected ? (isDark ? '#262D3B' : '#DFDCD4') : 'transparent',
                }}
              >
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: isSelected ? '800' : '600' }}>
                  {opt}
                </Text>
                {isSelected && (
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: primaryBtnBg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={14} color={primaryBtnText} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </GlassCard>

        {/* Format Selection */}
        <Text
          style={{
            color: theme.textMuted,
            fontSize: 11,
            fontWeight: '800',
            letterSpacing: 1.2,
            textTransform: 'uppercase',
            marginBottom: 12,
            marginLeft: 4,
          }}
        >
          Export File Format
        </Text>

        <GlassCard
          variant="sand"
          padding={16}
          style={{
            borderRadius: 28,
            gap: 8,
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
                  borderRadius: 18,
                  backgroundColor: isSelected ? (isDark ? '#262D3B' : '#DFDCD4') : 'transparent',
                }}
              >
                <Text style={{ color: theme.text, fontSize: 15, fontWeight: isSelected ? '800' : '600' }}>
                  {fmt}
                </Text>
                {isSelected && (
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      backgroundColor: primaryBtnBg,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Check size={14} color={primaryBtnText} strokeWidth={3} />
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </GlassCard>
      </ScrollView>

      {/* Floating Solid Obsidian CTA Button */}
      <View
        style={{
          position: 'absolute',
          bottom: 24,
          left: 20,
          right: 20,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.88}
          onPress={handleExport}
          style={{
            backgroundColor: primaryBtnBg,
            paddingVertical: 18,
            borderRadius: 34,
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'row',
            gap: 10,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          <Download size={20} color={primaryBtnText} />
          <Text style={{ color: primaryBtnText, fontSize: 16, fontWeight: '800' }}>
            Export {selectedData}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
