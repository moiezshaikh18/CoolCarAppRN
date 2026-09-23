// ============================================================
// Enterprise Branding & Themes Screen — Master Section 4 & 5
// Multi-Enterprise Dynamic Color Schemes & Garage Branding
// Strictly follows media_1790116823022.png aesthetic
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Palette,
  Check,
  Building2,
  Sparkles,
} from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';
import { useEnterpriseStore } from '../../src/store/enterpriseStore';
import { GlassCard } from '../../src/components/common/GlassCard';

const ENTERPRISE_THEMES = [
  {
    id: 'super-auto',
    name: 'Super Auto Garage',
    description: 'Electric Violet & Cyber Azure Glass',
    primary: '#6C4CF1',
    secondary: '#4F8CFF',
    accent: '#00C896',
  },
  {
    id: 'abc-motors',
    name: 'ABC Motors',
    description: 'Performance Crimson & Flame Orange Glass',
    primary: '#EF4444',
    secondary: '#F97316',
    accent: '#FBBF24',
  },
  {
    id: 'green-auto',
    name: 'Green Auto Care',
    description: 'Eco Mint & Emerald Teal Glass',
    primary: '#10B981',
    secondary: '#06B6D4',
    accent: '#34D399',
  },
  {
    id: 'royal-garage',
    name: 'Imperial Motors',
    description: 'Executive Gold & Amber Bronze Glass',
    primary: '#D97706',
    secondary: '#F59E0B',
    accent: '#10B981',
  },
];

export default function EnterpriseBrandingScreen() {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { activeEnterprise, setActiveEnterprise } = useEnterpriseStore();

  const currentPrimary = activeEnterprise?.branding?.primaryColor || '#6C4CF1';
  const [selectedThemeId, setSelectedThemeId] = useState(
    ENTERPRISE_THEMES.find((t) => t.primary === currentPrimary)?.id || 'super-auto'
  );
  const [loading, setLoading] = useState(false);

  const handleApplyTheme = async (themeOption: typeof ENTERPRISE_THEMES[0]) => {
    setSelectedThemeId(themeOption.id);
    setLoading(true);

    const updatedBranding = {
      ...activeEnterprise?.branding,
      primaryColor: themeOption.primary,
      secondaryColor: themeOption.secondary,
      accentColor: themeOption.accent,
    };

    if (activeEnterprise) {
      setActiveEnterprise({ ...activeEnterprise, branding: updatedBranding as any });
    }

    if (activeEnterprise?.id) {
      try {
        const { doc, updateDoc } = await import('firebase/firestore');
        const { db } = await import('../../src/services/firebase/firebase.config');
        await updateDoc(doc(db, 'enterprises', activeEnterprise.id), {
          branding: updatedBranding,
          updatedAt: new Date().toISOString(),
        });
      } catch (err) {
        console.log('[Branding] Firestore sync error:', err);
      }
    }

    setLoading(false);
    Alert.alert(
      'Branding Applied',
      `Enterprise theme updated to "${themeOption.name}". Colors reflect instantly across all garage screens!`,
      [{ text: 'OK' }]
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
          Branding & Themes
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
          <Sparkles size={18} color={theme.text} />
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
              <Building2 size={18} color={theme.text} />
            </View>
            <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
              Multi-Enterprise Themes
            </Text>
          </View>
          <Text style={{ color: theme.textMuted, fontSize: 13, lineHeight: 19 }}>
            Each garage maintains its own distinct visual identity. Selecting a theme dynamically transforms accents, badges, and graphs across the entire app without code modifications.
          </Text>
        </GlassCard>

        {/* Section Title */}
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
          Select Garage Brand Preset
        </Text>

        {/* Preset Cards */}
        <View style={{ gap: 14 }}>
          {ENTERPRISE_THEMES.map((item) => {
            const isSelected = selectedThemeId === item.id;
            return (
              <TouchableOpacity
                key={item.id}
                activeOpacity={0.88}
                onPress={() => handleApplyTheme(item)}
              >
                <GlassCard
                  variant="sand"
                  padding={20}
                  style={{
                    borderRadius: 28,
                    borderWidth: isSelected ? 2 : 1,
                    borderColor: isSelected ? (isDark ? '#FFFFFF' : '#121214') : (isDark ? '#262D3B' : '#DFDCD4'),
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
                      {/* Brand Circle Preview */}
                      <View
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 24,
                          backgroundColor: item.primary,
                          alignItems: 'center',
                          justifyContent: 'center',
                          shadowColor: item.primary,
                          shadowOffset: { width: 0, height: 4 },
                          shadowOpacity: 0.3,
                          shadowRadius: 6,
                          elevation: 3,
                        }}
                      >
                        <Palette size={20} color="#FFFFFF" />
                      </View>

                      <View style={{ flex: 1 }}>
                        <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                          {item.name}
                        </Text>
                        <Text style={{ color: theme.textMuted, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                          {item.description}
                        </Text>
                      </View>
                    </View>

                    {isSelected ? (
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: primaryBtnBg,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Check size={16} color={primaryBtnText} strokeWidth={3} />
                      </View>
                    ) : (
                      <View
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          borderWidth: 2,
                          borderColor: isDark ? '#262D3B' : '#DFDCD4',
                        }}
                      />
                    )}
                  </View>

                  {/* Swatches Row */}
                  <View style={{ flexDirection: 'row', gap: 8, marginTop: 16 }}>
                    <View
                      style={{
                        flex: 1,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: item.primary,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800' }}>
                        Primary
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: item.secondary,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800' }}>
                        Secondary
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        height: 28,
                        borderRadius: 14,
                        backgroundColor: item.accent,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}
                    >
                      <Text style={{ color: '#000000', fontSize: 10, fontWeight: '800' }}>
                        Accent
                      </Text>
                    </View>
                  </View>
                </GlassCard>
              </TouchableOpacity>
            );
          })}
        </View>
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
          onPress={() => {
            const current = ENTERPRISE_THEMES.find((t) => t.id === selectedThemeId);
            if (current) handleApplyTheme(current);
          }}
          disabled={loading}
          style={{
            backgroundColor: primaryBtnBg,
            paddingVertical: 18,
            borderRadius: 34,
            alignItems: 'center',
            justifyContent: 'center',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.18,
            shadowRadius: 10,
            elevation: 4,
          }}
        >
          {loading ? (
            <ActivityIndicator color={primaryBtnText} />
          ) : (
            <Text style={{ color: primaryBtnText, fontSize: 16, fontWeight: '800' }}>
              Confirm Active Theme
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
