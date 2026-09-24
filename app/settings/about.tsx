// ============================================================
// About Garage OS Screen — Version & Specifications
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Wrench,
  ShieldCheck,
  Smartphone,
  Server,
  Layers,
  Globe,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';

export default function AboutScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const specs = [
    { label: 'Application Version', value: '2.4.0 (Build 2026.09)' },
    { label: 'Architecture', value: 'Multi-Tenant Cloud Sync' },
    { label: 'Framework', value: 'React Native 0.76 & Expo SDK 52' },
    { label: 'Database & Auth', value: 'Google Cloud Firestore' },
    { label: 'Offline Persistence', value: 'AsyncStorage & Zustand' },
  ];

  const skyBg = isDark ? '#070A0F' : '#153580';
  const sheetBg = isDark ? '#070A0F' : '#F8FAFC';
  const cardBg = isDark ? '#101927' : '#FFFFFF';
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
            About System
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
            Garage Expense Tracker specs
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
          {/* Hero Branding Card */}
          <View
            style={{
              backgroundColor: '#0C1829',
              borderRadius: 26,
              padding: 24,
              alignItems: 'center',
              marginBottom: 20,
              shadowColor: '#000',
              shadowOpacity: 0.35,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            }}
          >
            <View
              style={{
                width: 68,
                height: 68,
                borderRadius: 34,
                backgroundColor: 'rgba(255,255,255,0.18)',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 12,
              }}
            >
              <Wrench size={30} color="#FFFFFF" />
            </View>
            <Text style={{ color: '#FFFFFF', fontSize: 20, fontWeight: '900', letterSpacing: -0.3 }}>
              Garage Expense Tracker
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4, fontWeight: '500' }}>
              Multi-Enterprise Workshop OS
            </Text>
          </View>

          {/* Tech Specs List Card */}
          <View
            style={{
              backgroundColor: cardBg,
              borderRadius: 24,
              padding: 20,
              borderWidth: 1,
              borderColor: borderColor,
              gap: 14,
              marginBottom: 24,
            }}
          >
            <Text
              style={{
                color: theme.textMuted,
                fontSize: 11,
                fontWeight: '800',
                letterSpacing: 1.2,
                textTransform: 'uppercase',
                marginBottom: 4,
              }}
            >
              System Specifications
            </Text>

            {specs.map((item, idx) => (
              <View key={item.label}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '600' }}>{item.label}</Text>
                  <Text style={{ color: theme.text, fontSize: 14, fontWeight: '700' }}>{item.value}</Text>
                </View>
                {idx < specs.length - 1 && (
                  <View style={{ height: 1, backgroundColor: borderColor, marginTop: 12 }} />
                )}
              </View>
            ))}
          </View>

          {/* Midnight Navy CTA */}
          <TouchableOpacity
            onPress={() => Linking.openURL('https://github.com/moiezshaikh18/CoolCarAppRN.git')}
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
            <Globe size={18} color="#FFFFFF" />
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
              GitHub Repository
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
    </View>
  );
}
