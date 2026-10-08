// ============================================================
// Screen 2: Welcome Screen — Cool Car Garage Expense Tracker
// Matches HD Reference Mockup 100%:
// Ultra-HD 3D Blue Car + Thumbs-Up Mechanic with Tool Chest & Tires,
// "Welcome to Cool Car Garage Expense Tracker" typography,
// "Get Started →" Button, Skip button & 3 Pagination Dots
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
import { ArrowRight } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  const handleNext = () => {
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 22 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header: Skip Button (Top Right) */}
      <View style={styles.topBar}>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={handleNext} activeOpacity={0.7} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.contentArea}>
        {/* Exact Typography matching Screen 2 in HD Reference */}
        <View style={styles.headerTextGroup}>
          <Text style={styles.welcomeLabel}>Welcome to</Text>
          <Text style={styles.mainTitle}>
            <Text style={{ color: '#0B2564' }}>Cool Car Garage</Text>{'\n'}
            <Text style={{ color: '#0C1829' }}>Expense Tracker</Text>
          </Text>
          <Text style={styles.subtitle}>
            Track daily income, expenses,{'\n'}customers and more. All in one place.
          </Text>
        </View>

        {/* Ultra-HD 3D Blue Car + Mechanic with Tool Chest Graphic */}
        <View style={styles.graphicWrapper}>
          <Image
            source={require('../../assets/welcome_3d_car_mechanic_hd.png')}
            style={styles.graphicImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Bottom Section: "Get Started →" Button & 3 Pagination Dots */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          onPress={handleNext}
          activeOpacity={0.88}
          style={styles.primaryButton}
        >
          <View style={styles.buttonContent}>
            <Text style={styles.primaryButtonText}>Get Started</Text>
            <ArrowRight size={20} color="#FFFFFF" strokeWidth={2.8} />
          </View>
        </TouchableOpacity>

        {/* 3 Pagination Dots below button matching Screen 2 */}
        <View style={styles.dotsRow}>
          <View style={[styles.dot, styles.dotActive]} />
          <View style={[styles.dot, styles.dotInactive]} />
          <View style={[styles.dot, styles.dotInactive]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 26,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    height: 36,
  },
  skipButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  skipText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0B2564',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTextGroup: {
    marginBottom: 16,
  },
  welcomeLabel: {
    fontSize: 22,
    fontWeight: '600',
    color: '#334155',
    letterSpacing: -0.3,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: -0.8,
    marginTop: 4,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 23,
    fontWeight: '500',
    marginTop: 12,
  },
  graphicWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  graphicImage: {
    width: Math.min(width * 0.94, 380),
    height: Math.min(width * 0.94, 380) * (332 / 460),
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
    gap: 18,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#0B2564',
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0B2564',
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 5,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
  dotsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
  },
  dotActive: {
    backgroundColor: '#0B2564',
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotInactive: {
    backgroundColor: '#CBD5E1',
  },
});
