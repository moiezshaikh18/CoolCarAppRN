// ============================================================
// Welcome Screen — Cool Car Workshop
// Clean Center-Aligned Luxury Layout (No Back Button)
// Featuring Official Cool Car Logo
// ============================================================

import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Snowflake } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const canvasBg = isDark ? '#181A20' : '#F4F6F9';
  const cardBg = isDark ? '#242834' : '#FFFFFF';
  const textPrimary = isDark ? '#F1F5F9' : '#0F172A';
  const textSecondary = isDark ? '#94A3B8' : '#64748B';
  const brandBlue = isDark ? '#60A5FA' : '#153580';
  const borderCol = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.06)';

  return (
    <View style={[styles.container, { backgroundColor: canvasBg }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} backgroundColor={canvasBg} />

      {/* Decorative Glow */}
      <View
        style={[
          styles.topGlow,
          {
            backgroundColor: isDark
              ? 'rgba(30, 64, 175, 0.25)'
              : 'rgba(21, 53, 128, 0.08)',
          },
        ]}
      />

      {/* Center Content Section */}
      <View style={[styles.centerWrapper, { paddingTop: insets.top + 24 }]}>
        {/* Official Cool Car Logo Container */}
        <View
          style={[
            styles.logoContainer,
            {
              backgroundColor: '#FFFFFF',
              borderColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(21, 53, 128, 0.12)',
            },
          ]}
        >
          <Image
            source={require('../../assets/cool_car_logo.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        <View style={[styles.badgePill, { backgroundColor: isDark ? 'rgba(59, 130, 246, 0.15)' : 'rgba(21, 53, 128, 0.08)' }]}>
          <Snowflake size={14} color={brandBlue} />
          <Text style={[styles.badgeText, { color: brandBlue }]}>
            CAR A/C REPAIRS & MECHANICAL WORKSHOP
          </Text>
        </View>

        <Text style={[styles.marathiSub, { color: textSecondary }]}>
          कूल कार ए. सी. रिपेअर्स
        </Text>

        <Text style={[styles.sloganText, { color: textSecondary }]}>
          {"'Our Perfection... Your Satisfaction'"}
        </Text>

        {/* Feature Highlights Grid */}
        <View
          style={[
            styles.featuresRow,
            {
              backgroundColor: cardBg,
              borderColor: borderCol,
            },
          ]}
        >
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>❄️</Text>
            <Text style={[styles.featureLabel, { color: textSecondary }]}>AC Service</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🔧</Text>
            <Text style={[styles.featureLabel, { color: textSecondary }]}>Mechanical</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📋</Text>
            <Text style={[styles.featureLabel, { color: textSecondary }]}>Job Sheets</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🏦</Text>
            <Text style={[styles.featureLabel, { color: textSecondary }]}>Bank Ledger</Text>
          </View>
        </View>
      </View>

      {/* Bottom Center CTA */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 28 }]}>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.9}
          style={styles.pillButton}
        >
          <Text style={styles.pillButtonText}>Login</Text>
          <View style={styles.arrowCircle}>
            <ChevronRight size={18} color="#FFFFFF" strokeWidth={2.8} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
  },
  topGlow: {
    position: 'absolute',
    top: -80,
    width: 320,
    height: 320,
    borderRadius: 160,
  },
  centerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoContainer: {
    width: '100%',
    maxWidth: 340,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 5,
    marginBottom: 16,
  },
  logoImage: {
    width: Math.min(width * 0.74, 290),
    height: Math.min(width * 0.74, 290) * (384 / 1024),
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  marathiSub: {
    fontSize: 14,
    marginTop: 10,
    fontWeight: '700',
  },
  sloganText: {
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 6,
    textAlign: 'center',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 32,
    paddingVertical: 16,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  featureItem: {
    alignItems: 'center',
    gap: 4,
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureLabel: {
    fontSize: 11,
    fontWeight: '700',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
  pillButton: {
    width: '100%',
    backgroundColor: '#153580', // Royal Blue
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#153580',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  },
  pillButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    paddingLeft: 8,
    letterSpacing: 0.5,
  },
  arrowCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
