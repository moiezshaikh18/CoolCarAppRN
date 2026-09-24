// ============================================================
// Welcome Screen — Cool Car Workshop
// Exact Match to Reference Design (media_1790287834834.png)
// Solid #181A20 Background, Telemetry Car Badges,
// "All your cars in one place!", and "Get started!" White Pill Button
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
import { ChevronRight, Wrench, Snowflake, ShieldCheck } from 'lucide-react-native';
import { useTheme } from '../../src/hooks/useTheme';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const { isDark } = useTheme();

  const canvasBg = '#181A20'; // Solid Slate matching reference design
  const textPrimary = '#FFFFFF';
  const textSecondary = '#8E95A5';

  return (
    <View style={[styles.container, { backgroundColor: canvasBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={canvasBg} />

      {/* Center Hero Section with Car Illustration & Sensor Circles */}
      <View style={[styles.centerWrapper, { paddingTop: insets.top + 24 }]}>
        {/* Car Showcase with Circular Telemetry Rings */}
        <View style={styles.carShowcaseArea}>
          {/* Top Sensor Badge (50% AC Diagnostic) */}
          <View style={[styles.sensorRing, styles.sensorTop]}>
            <View style={[styles.sensorInnerRing, { borderColor: '#EF4444' }]}>
              <Snowflake size={14} color="#EF4444" />
              <Text style={styles.sensorText}>50%</Text>
            </View>
          </View>

          {/* Left Sensor Badge (75% Mechanical) */}
          <View style={[styles.sensorRing, styles.sensorLeft]}>
            <View style={[styles.sensorInnerRing, { borderColor: '#F59E0B' }]}>
              <Wrench size={14} color="#F59E0B" />
              <Text style={styles.sensorText}>75%</Text>
            </View>
          </View>

          {/* Bottom Left Sensor Badge (85% Garage Health) */}
          <View style={[styles.sensorRing, styles.sensorBottomLeft]}>
            <View style={[styles.sensorInnerRing, { borderColor: '#10B981' }]}>
              <ShieldCheck size={14} color="#10B981" />
              <Text style={styles.sensorText}>85%</Text>
            </View>
          </View>

          {/* Cool Car Official Logo Hero Card */}
          <View style={styles.logoCard}>
            <Image
              source={require('../../assets/cool_car_logo.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Clean Center Typography directly matching reference design */}
        <View style={styles.textContainer}>
          <Text style={[styles.mainHeadline, { color: textPrimary }]}>
            All your cars{'\n'}in one place!
          </Text>

          <Text style={[styles.subHeadline, { color: textSecondary }]}>
            Create a digital garage{'\n'}by adding your cars
          </Text>
        </View>
      </View>

      {/* Bottom Center CTA: Solid Pure White Pill Button directly from reference design */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 28 }]}>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.9}
          style={styles.whitePillButton}
        >
          <Text style={styles.whitePillButtonText}>Get started!</Text>
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
  carShowcaseArea: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    height: 260,
    marginBottom: 20,
    position: 'relative',
  },
  sensorRing: {
    position: 'absolute',
    zIndex: 10,
  },
  sensorTop: {
    top: 10,
    right: 36,
  },
  sensorLeft: {
    top: 50,
    left: 20,
  },
  sensorBottomLeft: {
    bottom: 20,
    left: 30,
  },
  sensorInnerRing: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#242834',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  sensorText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  logoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    paddingVertical: 20,
    paddingHorizontal: 24,
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  logoImage: {
    width: Math.min(width * 0.7, 260),
    height: Math.min(width * 0.7, 260) * (384 / 1024),
  },
  textContainer: {
    alignItems: 'center',
    marginTop: 16,
    paddingHorizontal: 12,
  },
  mainHeadline: {
    fontSize: 32,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.6,
    lineHeight: 38,
  },
  subHeadline: {
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
  whitePillButton: {
    width: '100%',
    backgroundColor: '#FFFFFF', // Pure white solid pill button
    paddingVertical: 18,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  whitePillButtonText: {
    color: '#181A20', // Sleek dark slate text
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: -0.2,
  },
});
