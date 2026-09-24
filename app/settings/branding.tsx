// ============================================================
// Enterprise Branding & Themes Screen — Master Section 4 & 5
// Multi-Enterprise Dynamic Color Schemes & Garage Branding
// Signature Sky Blue Header & Mega-Curved Lower Sheet
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  StatusBar,
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
    Alert.alert('Branding Updated', `Applied theme for ${themeOption.name}!`);
  };

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
            Branding & Themes
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 1, fontWeight: '600' }}>
            Multi-enterprise color palette customization
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
          {/* Active Enterprise Banner */}
          <View
            style={{
              backgroundColor: '#0C1829',
              borderRadius: 26,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOpacity: 0.3,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 6,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: 'rgba(255,255,255,0.15)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Building2 size={24} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '800' }}>
                {activeEnterprise?.name || 'Active Garage'}
              </Text>
              <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 2 }}>
                Current Palette: {ENTERPRISE_THEMES.find((t) => t.id === selectedThemeId)?.name || 'Custom'}
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: theme.textMuted,
              fontSize: 11,
              fontWeight: '800',
              letterSpacing: 1.2,
              textTransform: 'uppercase',
              marginBottom: 14,
              paddingLeft: 4,
            }}
          >
            Available Enterprise Palettes
          </Text>

          {/* Theme Options */}
          <View style={{ gap: 14 }}>
            {ENTERPRISE_THEMES.map((themeOption) => {
              const isSelected = selectedThemeId === themeOption.id;
              return (
                <TouchableOpacity
                  key={themeOption.id}
                  activeOpacity={0.88}
                  onPress={() => handleApplyTheme(themeOption)}
                  style={{
                    backgroundColor: cardBg,
                    borderRadius: 24,
                    padding: 18,
                    borderWidth: 1,
                    borderColor: isSelected ? '#0C1829' : borderColor,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    shadowColor: '#000',
                    shadowOpacity: isDark ? 0.3 : 0.04,
                    shadowRadius: 10,
                    shadowOffset: { width: 0, height: 4 },
                    elevation: 2,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14, flex: 1 }}>
                    {/* Color Swatch Circle */}
                    <View
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 24,
                        backgroundColor: themeOption.primary,
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: themeOption.primary,
                        shadowOpacity: 0.4,
                        shadowRadius: 8,
                        elevation: 4,
                      }}
                    >
                      <Palette size={20} color="#FFFFFF" />
                    </View>

                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.text, fontSize: 16, fontWeight: '800' }}>
                        {themeOption.name}
                      </Text>
                      <Text style={{ color: theme.textMuted, fontSize: 12, marginTop: 2 }}>
                        {themeOption.description}
                      </Text>
                      <View style={{ flexDirection: 'row', gap: 6, marginTop: 8 }}>
                        <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: themeOption.primary }} />
                        <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: themeOption.secondary }} />
                        <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: themeOption.accent }} />
                      </View>
                    </View>
                  </View>

                  {/* Active indicator */}
                  {isSelected && (
                    <View
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 16,
                        backgroundColor: '#0C1829',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Check size={16} color="#FFFFFF" strokeWidth={2.5} />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
}
