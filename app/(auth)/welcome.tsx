// ============================================================
// Welcome Screen — Cool Car Workshop
// Clean Center-Aligned Luxury Layout (No Back Button)
// Dedicated exclusively to Cool Car
// ============================================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Wrench, ShieldCheck, Sparkles, Snowflake } from 'lucide-react-native';
import { SignboardSpeedCar } from '../../src/components/common/CarIllustrations';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Decorative Top Glow */}
      <View style={styles.topGlow} />

      {/* Center Content Section */}
      <View style={[styles.centerWrapper, { paddingTop: insets.top + 20 }]}>
        {/* Signboard Aerodynamic Speed Car */}
        <View style={styles.illustrationBox}>
          <SignboardSpeedCar size={width * 0.75} color="#FFFFFF" />
        </View>

        {/* Brand Display Title */}
        <Text style={styles.brandTitle}>Cool Car</Text>

        <View style={styles.badgePill}>
          <Snowflake size={14} color="#60A5FA" />
          <Text style={styles.badgeText}>
            CAR A/C REPAIRS & MECHANICAL WORKSHOP
          </Text>
        </View>

        <Text style={styles.marathiSub}>
          कूल कार ए. सी. रिपेअर्स
        </Text>

        <Text style={styles.sloganText}>
          "Our Perfection... Your Satisfaction"
        </Text>

        {/* Feature Highlights Grid */}
        <View style={styles.featuresRow}>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>❄️</Text>
            <Text style={styles.featureLabel}>AC Service</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🔧</Text>
            <Text style={styles.featureLabel}>Mechanical</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>📋</Text>
            <Text style={styles.featureLabel}>Job Sheets</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureEmoji}>🏦</Text>
            <Text style={styles.featureLabel}>Bank Ledger</Text>
          </View>
        </View>
      </View>

      {/* Bottom Center CTA */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 24 }]}>
        <TouchableOpacity
          onPress={() => router.replace('/(tabs)')}
          activeOpacity={0.9}
          style={styles.pillButton}
        >
          <Text style={styles.pillButtonText}>Enter Cool Car Garage</Text>
          <View style={styles.arrowCircle}>
            <ChevronRight size={18} color="#0C1829" strokeWidth={2.8} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0A1222', // Deep Obsidian Navy
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
    backgroundColor: 'rgba(30, 64, 175, 0.3)',
  },
  centerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  illustrationBox: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  brandTitle: {
    fontSize: 44,
    fontWeight: '900',
    color: '#FFFFFF',
    fontStyle: 'italic',
    letterSpacing: -0.6,
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 8,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 10,
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#93C5FD',
    letterSpacing: 0.8,
  },
  marathiSub: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.75)',
    marginTop: 8,
    fontWeight: '700',
  },
  sloganText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontStyle: 'italic',
    marginTop: 12,
    textAlign: 'center',
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 32,
    paddingVertical: 14,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  featureItem: {
    alignItems: 'center',
    gap: 4,
  },
  featureEmoji: {
    fontSize: 20,
  },
  featureLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '700',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
  pillButton: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  pillButtonText: {
    color: '#0C1829',
    fontSize: 16,
    fontWeight: '900',
    paddingLeft: 8,
  },
  arrowCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
