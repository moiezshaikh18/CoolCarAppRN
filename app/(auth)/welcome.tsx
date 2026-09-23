// ============================================================
// Welcome Onboarding Screen — Screen 1 in media_1790116823022.png
// Modern Luxury Architectural Style (Editorial Typography & Nested Pill CTA)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ChevronRight, Wrench, ShieldCheck, Sparkles } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* Editorial Workshop Visual Backdrop with Architectural Depth */}
      <LinearGradient
        colors={['#1E2430', '#141822', '#0D1017']}
        style={StyleSheet.absoluteFill}
      />

      {/* Subtle Luxury Architectural Glow */}
      <View style={styles.topGlow} />

      {/* Top Header */}
      <View style={[styles.header, { paddingTop: insets.top + 16 }]}>
        <View style={styles.brandRow}>
          <View style={styles.brandIconBox}>
            <Wrench size={16} color="#FFFFFF" strokeWidth={2.5} />
          </View>
          <Text style={styles.brandText}>GARAGE MASTER</Text>
        </View>

        <TouchableOpacity
          onPress={() => router.replace('/(auth)/login')}
          style={styles.skipButton}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Display Typography (Matching Screen 1 "PERFECT PLACE") */}
      <View style={styles.contentSection}>
        <View style={styles.headlineBox}>
          <Text style={styles.headlineTop}>PERFECT</Text>
          <Text style={styles.headlineBottom}>GARAGE</Text>
        </View>

        {/* Center Architectural Workshop Graphic Card */}
        <View style={styles.visualCard}>
          <LinearGradient
            colors={['rgba(255,255,255,0.08)', 'rgba(255,255,255,0.02)']}
            style={styles.visualInner}
          >
            <View style={styles.carSilhouetteBox}>
              <Text style={{ fontSize: 54 }}>🏎️</Text>
            </View>

            <View style={styles.floatingSpecBadge}>
              <ShieldCheck size={14} color="#10B981" />
              <Text style={styles.specBadgeText}>Multi-Tenant Cloud Sync</Text>
            </View>
          </LinearGradient>
        </View>

        {/* Subtitle (Matching Screen 1 text layout) */}
        <Text style={styles.subtitleText}>
          Your Automotive Workshop Partner Anytime, Anywhere. Track, Manage & Grow.
        </Text>
      </View>

      {/* Bottom CTA: The Iconic Nested White Pill with Circular Arrow Button */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 20 }]}>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.92}
          style={styles.nestedPillButton}
        >
          <Text style={styles.pillButtonLabel}>Start Exploring</Text>
          <View style={styles.circularArrowButton}>
            <ChevronRight size={20} color="#FFFFFF" strokeWidth={2.5} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: 'space-between',
  },
  topGlow: {
    position: 'absolute',
    top: -80,
    left: width * 0.2,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandIconBox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 1.5,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  skipText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 13,
    fontWeight: '600',
  },
  contentSection: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: 20,
  },
  headlineBox: {
    marginBottom: 20,
  },
  headlineTop: {
    color: '#FFFFFF',
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 56,
  },
  headlineBottom: {
    color: '#FFFFFF',
    fontSize: 52,
    fontWeight: '900',
    letterSpacing: -1,
    lineHeight: 56,
  },
  visualCard: {
    height: 190,
    borderRadius: 28,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    marginBottom: 24,
  },
  visualInner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  carSilhouetteBox: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingSpecBadge: {
    position: 'absolute',
    bottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
  },
  specBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  subtitleText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 15,
    lineHeight: 22,
    fontWeight: '500',
    maxWidth: 320,
  },
  bottomSection: {
    width: '100%',
  },
  // The iconic white pill with nested circular black action button from Screen 1
  nestedPillButton: {
    backgroundColor: '#FFFFFF',
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 28,
    paddingRight: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 8,
  },
  pillButtonLabel: {
    color: '#121214',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  circularArrowButton: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#121214',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
