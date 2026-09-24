// ============================================================
// Splash Screen — Cool Car Workshop
// Exact Replica of Physical Shop Signboard (media_1790196926050.png)
// Deep Royal Blue (#153580), Speed-Line Aerodynamic Car,
// Cursive 'Cool Car', 'CAR A/C REPAIRS', Pune Phone Numbers,
// Hindi/Marathi title & 'Our Perfection... Your Satisfaction'
// ============================================================

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  Image,
  Animated,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const [logoScale] = useState(() => new Animated.Value(0.9));
  const [boardOpacity] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 40,
        friction: 6,
        useNativeDriver: true,
      }),
      Animated.timing(boardOpacity, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();

    // Smooth navigation to Welcome Onboarding after 2.5 seconds
    const timer = setTimeout(() => {
      router.replace('/(auth)/welcome');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Signboard Replicating Physical Workshop Board */}
      <Animated.View
        style={[
          styles.signboardWrapper,
          {
            opacity: boardOpacity,
            transform: [{ scale: logoScale }],
          },
        ]}
      >
        <View style={styles.signboardCard}>
          {/* Top Brand Badges Bar */}
          <View style={styles.brandsBar}>
            {['MARUTI', 'HYUNDAI', 'TATA', 'HONDA', 'MAHINDRA'].map((brand, i) => (
              <View key={brand} style={styles.brandChip}>
                <Text style={styles.brandText}>{brand}</Text>
              </View>
            ))}
          </View>

          {/* Center Brand Hero: Official Cool Car Logo */}
          <View style={styles.centerHero}>
            <View style={styles.logoCard}>
              <Image
                source={require('../../assets/cool_car_logo.png')}
                style={styles.logoImage}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.mechSubtitle}>& MECHANICAL AUTO WORKSHOP</Text>

            {/* Pune Contact Numbers */}
            <View style={styles.phoneBadge}>
              <Text style={styles.phoneText}>
                9822045278, 9922452786
              </Text>
            </View>
          </View>

          {/* Bottom Row of Signboard: Marathi text (left) & Tagline (right) */}
          <View style={styles.signboardFooter}>
            <Text style={styles.marathiText}>कूल कार ए. सी. रिपेअर्स</Text>
            <Text style={styles.taglineText}>{"'Our Perfection... Your Satisfaction'"}</Text>
          </View>
        </View>
      </Animated.View>

      <View style={styles.cityPill}>
        <Text style={styles.cityText}>PUNE, MAHARASHTRA</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181A20', // Solid Slate matching reference design
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  signboardWrapper: {
    width: '100%',
    maxWidth: 420,
    alignItems: 'center',
  },
  signboardCard: {
    width: '100%',
    backgroundColor: '#153580', // Exact Signboard Royal Blue
    borderRadius: 24,
    borderWidth: 2.5,
    borderColor: '#FFFFFF',
    paddingVertical: 20,
    paddingHorizontal: 16,
    alignItems: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  brandsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginBottom: 14,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
  },
  brandChip: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.18)',
  },
  brandText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.6,
  },
  centerHero: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logoCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  logoImage: {
    width: Math.min(width * 0.72, 280),
    height: Math.min(width * 0.72, 280) * (384 / 1024),
  },
  mechSubtitle: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.9)',
    letterSpacing: 1.2,
    marginTop: 4,
    textAlign: 'center',
  },
  phoneBadge: {
    marginTop: 12,
    backgroundColor: '#0F265C',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  phoneText: {
    fontSize: 14,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: 1,
  },
  signboardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 18,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  marathiText: {
    fontSize: 12,
    color: '#FFFFFF',
    fontWeight: '700',
  },
  taglineText: {
    fontSize: 11,
    color: 'rgba(255, 255, 255, 0.85)',
    fontStyle: 'italic',
    fontWeight: '600',
  },
  cityPill: {
    marginTop: 24,
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
  },
  cityText: {
    fontSize: 11,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.65)',
    letterSpacing: 1.5,
  },
});
