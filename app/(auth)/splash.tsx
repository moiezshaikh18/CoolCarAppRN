// ============================================================
// Splash Screen — Master Design
// Dark luxury obsidian aesthetic matching media_1790116823022.png
// ============================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Animated,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { Warehouse, Car } from 'lucide-react-native';

export default function SplashScreen() {
  const [logoScale] = useState(() => new Animated.Value(0.75));
  const [logoOpacity] = useState(() => new Animated.Value(0));
  const [textOpacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    // Fade and scale in
    Animated.parallel([
      Animated.spring(logoScale, { toValue: 1, tension: 50, friction: 7, useNativeDriver: true }),
      Animated.timing(logoOpacity, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(textOpacity, { toValue: 1, duration: 800, delay: 200, useNativeDriver: true }),
    ]).start();

    // Auto navigate to Welcome Onboarding after 2.2 seconds
    const timer = setTimeout(() => {
      router.replace('/(auth)/welcome');
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Center Logo & Title */}
      <View style={styles.centerContent}>
        <Animated.View
          style={[
            styles.logoWrapper,
            {
              transform: [{ scale: logoScale }],
              opacity: logoOpacity,
            },
          ]}
        >
          <View style={styles.logoBadge}>
            <View style={styles.roofIcon}>
              <Warehouse size={44} color="#FFFFFF" strokeWidth={2} />
              <View style={styles.carInside}>
                <Car size={20} color="#EFECE6" />
              </View>
            </View>
          </View>
        </Animated.View>

        <Animated.View style={{ opacity: textOpacity, alignItems: 'center', marginTop: 28 }}>
          <Text style={styles.brandTitle}>GARAGE OS</Text>
          <Text style={styles.brandSubtitle}>MULTI-ENTERPRISE EXPENSE TRACKER</Text>
        </Animated.View>
      </View>

      {/* Bottom Tagline */}
      <Animated.View style={[styles.bottomContainer, { opacity: textOpacity }]}>
        <Text style={styles.tagline}>Track • Manage • Scale</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121214',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    alignItems: 'center',
  },
  logoWrapper: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 8,
  },
  logoBadge: {
    width: 96,
    height: 96,
    borderRadius: 32,
    backgroundColor: '#1C212B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
  },
  roofIcon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  carInside: {
    position: 'absolute',
    bottom: 2,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: 2,
  },
  brandSubtitle: {
    color: '#A0AEC0',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 2.5,
    marginTop: 6,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 48,
  },
  tagline: {
    color: '#718096',
    fontSize: 13,
    letterSpacing: 2,
    fontWeight: '700',
  },
});
