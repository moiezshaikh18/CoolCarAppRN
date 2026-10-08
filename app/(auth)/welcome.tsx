// ============================================================
// Welcome Screen — Cool Car Workshop
// Headline: "All Your Car Solution at One Place"
// Official Slogan: "'Our Perfection... Your Satisfaction'"
// Blended Logo directly on canvas (Zero white container/border)
// Signature Royal Blue (#153580) Action Pill: "Get started!"
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
import { Snowflake, Wrench } from 'lucide-react-native';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  const canvasBg = '#181A20'; // Sleek dark slate
  const brandBlue = '#153580'; // Signature Cool Car Royal Blue
  const textPrimary = '#FFFFFF';
  const textSecondary = '#94A3B8';

  return (
    <View style={[styles.container, { backgroundColor: canvasBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={canvasBg} />

      {/* Decorative Radial Glow */}
      <View style={styles.topGlow} />

      {/* Center Content Section */}
      <View style={[styles.centerWrapper, { paddingTop: insets.top + 20 }]}>
        {/* Blended Cool Car Official Logo — No white box, no border, blends seamlessly */}
        <View style={styles.logoWrapper}>
          <Image
            source={require('../../assets/cool_car_logo_white.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </View>

        {/* Brand Badges Bar */}
        <View style={styles.badgePill}>
          <Snowflake size={13} color="#60A5FA" />
          <Text style={styles.badgeText}>
            CAR A/C REPAIRS & MECHANICAL WORKSHOP
          </Text>
          <Wrench size={13} color="#F59E0B" />
        </View>

        {/* Clean Center Typography — Exact User Request */}
        <View style={styles.textContainer}>
          <Text style={[styles.mainHeadline, { color: textPrimary }]}>
            All Your Car Solution{'\n'}at One Place
          </Text>

          {/* Official Cool Car Slogan & Marathi Tagline */}
          <Text style={styles.marathiSub}>
            कूल कार ए. सी. रिपेअर्स
          </Text>

          <Text style={styles.sloganText}>
            {"'Our Perfection... Your Satisfaction'"}
          </Text>
        </View>
      </View>

      {/* Bottom Center CTA: Royal Blue Pill Button Matching Theme */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 28 }]}>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.88}
          style={[styles.pillButton, { backgroundColor: brandBlue }]}
        >
          <Text style={styles.pillButtonText}>Get started!</Text>
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
    top: -60,
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(21, 53, 128, 0.25)',
  },
  centerWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoWrapper: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  logoImage: {
    width: Math.min(width * 0.82, 320),
    height: Math.min(width * 0.82, 320) * (384 / 1024),
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    marginBottom: 16,
  },
  badgeText: {
    color: '#93C5FD',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  textContainer: {
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  mainHeadline: {
    fontSize: 30,
    fontWeight: '900',
    textAlign: 'center',
    letterSpacing: -0.5,
    lineHeight: 36,
    marginBottom: 12,
  },
  marathiSub: {
    fontSize: 15,
    fontWeight: '700',
    color: 'rgba(255, 255, 255, 0.75)',
    textAlign: 'center',
    marginBottom: 6,
  },
  sloganText: {
    fontSize: 14,
    fontStyle: 'italic',
    fontWeight: '600',
    color: '#94A3B8',
    textAlign: 'center',
  },
  bottomSection: {
    width: '100%',
    alignItems: 'center',
  },
  pillButton: {
    width: '100%',
    paddingVertical: 18,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#153580',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 12,
    elevation: 6,
  },
  pillButtonText: {
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
