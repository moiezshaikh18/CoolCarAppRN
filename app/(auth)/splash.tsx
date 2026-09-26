// ============================================================
// Modern Animated Splash Screen — Cool Car Workshop
// Fluid Reanimated Animations, Glowing Ambient Aura,
// Floating Seamless Logo (No Box/Border), No Phone Numbers,
// Modern Sleek Typography & Progress Indicator
// ============================================================

import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Snowflake, Wrench } from 'lucide-react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withRepeat,
  withSequence,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { useAuthStore } from '../../src/store/authStore';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const authState = useAuthStore((s) => s.authState);

  // Reanimated shared values
  const logoScale = useSharedValue(0.8);
  const logoOpacity = useSharedValue(0);
  const logoFloat = useSharedValue(0);

  const glowScale = useSharedValue(0.9);
  const glowOpacity = useSharedValue(0.3);

  const contentTranslateY = useSharedValue(24);
  const contentOpacity = useSharedValue(0);

  const progressBarWidth = useSharedValue(0);
  const footerOpacity = useSharedValue(0);

  useEffect(() => {
    // 1. Logo blooming spring entrance
    logoScale.value = withSpring(1, {
      damping: 12,
      stiffness: 85,
    });
    logoOpacity.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.cubic),
    });

    // 2. Idle subtle float (luxury automotive breathing feel)
    logoFloat.value = withDelay(
      800,
      withRepeat(
        withSequence(
          withTiming(-4, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
          withTiming(4, { duration: 1600, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );

    // 3. Ambient aura glow pulse
    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.18, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.95, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );
    glowOpacity.value = withRepeat(
      withSequence(
        withTiming(0.65, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
        withTiming(0.35, { duration: 2000, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      true
    );

    // 4. Staggered Content slide up & fade in
    contentTranslateY.value = withDelay(
      350,
      withSpring(0, { damping: 14, stiffness: 90 })
    );
    contentOpacity.value = withDelay(
      350,
      withTiming(1, { duration: 700, easing: Easing.out(Easing.quad) })
    );

    // 5. Sleek modern progress bar fill (0% -> 100%)
    progressBarWidth.value = withDelay(
      400,
      withTiming(1, { duration: 1800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) })
    );
    footerOpacity.value = withDelay(
      500,
      withTiming(1, { duration: 800 })
    );

    // 6. Seamless Navigation transition
    const timer = setTimeout(() => {
      const currentAuth = useAuthStore.getState().authState;
      if (currentAuth === 'authenticated') {
        router.replace('/(tabs)');
      } else {
        router.replace('/(auth)/welcome');
      }
    }, 2600);

    return () => clearTimeout(timer);
  }, []);

  // Animated Styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: logoScale.value },
      { translateY: logoFloat.value },
    ],
    opacity: logoOpacity.value,
  }));

  const glowAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: glowOpacity.value,
  }));

  const contentAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: contentTranslateY.value }],
    opacity: contentOpacity.value,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progressBarWidth.value * 100}%`,
  }));

  const footerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Deep Automotive Midnight Gradient */}
      <LinearGradient
        colors={['#050811', '#0B132B', '#070C1B', '#04060C']}
        locations={[0, 0.4, 0.75, 1]}
        style={StyleSheet.absoluteFill}
      />

      {/* Ambient Radial Glowing Halos */}
      <Animated.View style={[styles.outerGlow, glowAnimatedStyle]} />
      <View style={styles.innerGlow} />

      {/* Center Branding Hero — No container box, floating seamlessly */}
      <View style={styles.centerHero}>
        {/* Floating Official White & Cyan Logo */}
        <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
          <Image
            source={require('../../assets/cool_car_logo_white.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Staggered Modern Typography Section */}
        <Animated.View style={[styles.textSection, contentAnimatedStyle]}>
          {/* Frosted Modern Badge Pill */}
          <View style={styles.badgePill}>
            <Snowflake size={13} color="#60A5FA" />
            <Text style={styles.badgeText}>CAR A/C SPECIALIST & WORKSHOP</Text>
            <Wrench size={13} color="#F59E0B" />
          </View>

          {/* Marathi Calligraphy Brand Subtitle */}
          <Text style={styles.marathiSubtitle}>कूल कार ए. सी. रिपेअर्स</Text>

          {/* Elegant Automotive Tagline */}
          <Text style={styles.tagline}>
            {"'Our Perfection... Your Satisfaction'"}
          </Text>
        </Animated.View>
      </View>

      {/* Modern Minimalist Loading Footer */}
      <Animated.View style={[styles.footer, footerAnimatedStyle]}>
        {/* Sleek Progress Track & Fill Bar */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, progressAnimatedStyle]}>
            <LinearGradient
              colors={['#38BDF8', '#2563EB', '#60A5FA']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>

        {/* Micro Subtitle */}
        <Text style={styles.footerText}>
          PUNE • ESTD 2004 • WORKSHOP OS
        </Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050811',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  outerGlow: {
    position: 'absolute',
    width: Math.min(width * 1.1, 460),
    height: Math.min(width * 1.1, 460),
    borderRadius: Math.min(width * 0.55, 230),
    backgroundColor: 'rgba(21, 53, 128, 0.38)',
  },
  innerGlow: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(56, 189, 248, 0.16)',
  },
  centerHero: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  // Seamless logo floating — No white box, no border
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 22,
    shadowColor: '#38BDF8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.35,
    shadowRadius: 28,
    elevation: 10,
  },
  logoImage: {
    width: Math.min(width * 0.84, 340),
    height: Math.min(width * 0.84, 340) * (384 / 1024),
  },
  textSection: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.07)',
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.14)',
    marginBottom: 14,
  },
  badgeText: {
    color: '#93C5FD',
    fontSize: 10.5,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  marathiSubtitle: {
    fontSize: 16,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.82)',
    letterSpacing: 0.5,
    marginBottom: 6,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 13,
    fontWeight: '600',
    fontStyle: 'italic',
    color: '#94A3B8',
    letterSpacing: 0.4,
    textAlign: 'center',
  },
  footer: {
    position: 'absolute',
    bottom: 44,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  progressTrack: {
    width: 140,
    height: 3.5,
    borderRadius: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
    overflow: 'hidden',
  },
  footerText: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255, 255, 255, 0.45)',
    letterSpacing: 1.8,
  },
});
