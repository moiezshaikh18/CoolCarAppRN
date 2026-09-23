// ============================================================
// About Garage OS Screen — Version & Specifications
// Strictly follows media_1790116823022.png aesthetic
// ============================================================

import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
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
  Info,
  Globe,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { GlassCard } from '../../src/components/common/GlassCard';

export default function AboutScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

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
          About Garage OS
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
          <Info size={18} color={theme.text} />
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 110 }}
      >
        {/* Hero Logo Card */}
        <GlassCard
          variant="sand"
          padding={24}
          style={{
            borderRadius: 28,
            marginBottom: 20,
            alignItems: 'center',
          }}
        >
          <View
            style={{
              width: 72,
              height: 72,
              borderRadius: 36,
              backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
            }}
          >
            <Wrench size={34} color={theme.text} />
          </View>

          <Text style={{ color: theme.text, fontSize: 22, fontWeight: '800', letterSpacing: -0.5 }}>
            Garage Expense Tracker
          </Text>
          <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: '600', marginTop: 4 }}>
            Multi-Enterprise Workshop Operating System
          </Text>

          <View
            style={{
              marginTop: 14,
              paddingHorizontal: 14,
              paddingVertical: 6,
              borderRadius: 20,
              backgroundColor: isDark ? '#262D3B' : '#DFDCD4',
            }}
          >
            <Text style={{ color: theme.text, fontSize: 12, fontWeight: '800' }}>
              Version 2.4.0 Enterprise (Build 142)
            </Text>
          </View>
        </GlassCard>

        {/* Specifications 4-box spec grid */}
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
          Technical Architecture
        </Text>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
          <GlassCard
            variant="sand"
            padding={16}
            style={{
              flex: 1,
              borderRadius: 24,
            }}
          >
            <Smartphone size={20} color={theme.text} />
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600', marginTop: 10 }}>Framework</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800', marginTop: 2 }}>Expo SDK 57</Text>
          </GlassCard>

          <GlassCard
            variant="sand"
            padding={16}
            style={{
              flex: 1,
              borderRadius: 24,
            }}
          >
            <Layers size={20} color={theme.text} />
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600', marginTop: 10 }}>Core Engine</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800', marginTop: 2 }}>React Native 0.86</Text>
          </GlassCard>
        </View>

        <View style={{ flexDirection: 'row', gap: 12, marginBottom: 20 }}>
          <GlassCard
            variant="sand"
            padding={16}
            style={{
              flex: 1,
              borderRadius: 24,
            }}
          >
            <Server size={20} color={theme.text} />
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600', marginTop: 10 }}>Cloud Backend</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800', marginTop: 2 }}>Cloud Firestore</Text>
          </GlassCard>

          <GlassCard
            variant="sand"
            padding={16}
            style={{
              flex: 1,
              borderRadius: 24,
            }}
          >
            <ShieldCheck size={20} color={theme.text} />
            <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '600', marginTop: 10 }}>State & Logic</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800', marginTop: 2 }}>Zustand + Zod</Text>
          </GlassCard>
        </View>

        {/* Enterprise Compliance Details Card */}
        <GlassCard
          variant="sand"
          padding={20}
          style={{
            borderRadius: 28,
            gap: 14,
          }}
        >
          <Text style={{ color: theme.textMuted, fontSize: 11, fontWeight: '800', textTransform: 'uppercase', letterSpacing: 1.2 }}>
            Master Product Compliance
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: '600' }}>Tenant Isolation</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>Multi-Enterprise Scoped</Text>
          </View>

          <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#DFDCD4' }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: '600' }}>Cash / Bank Balances</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>Direct Ledger Sync</Text>
          </View>

          <View style={{ height: 1, backgroundColor: isDark ? 'rgba(255,255,255,0.06)' : '#DFDCD4' }} />

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: '600' }}>Offline Capability</Text>
            <Text style={{ color: theme.text, fontSize: 14, fontWeight: '800' }}>Local Persistence Cache</Text>
          </View>
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
          onPress={() => Alert.alert('Support Desk', 'Enterprise help desk: support@garageos.app\nPhone: +91 800-GARAGE-1')}
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
          <Globe size={20} color={primaryBtnText} />
          <Text style={{ color: primaryBtnText, fontSize: 16, fontWeight: '800' }}>
            Support & Documentation
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
