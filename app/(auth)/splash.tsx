// ============================================================
// Screen 1: Splash Screen — Garage Expense Tracker
// Matches Reference Design 100%:
// Deep Midnight Navy, Garage Shelter Icon, "GARAGE EXPENSE TRACKER",
// Lower Workshop Background, "Track, Manage, Grow.", & 3-segment bar
// ============================================================

import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');

export default function SplashScreen() {
  const iconScale = useSharedValue(0.8);
  const iconOpacity = useSharedValue(0);

  const textTranslateY = useSharedValue(16);
  const textOpacity = useSharedValue(0);

  const bgOpacity = useSharedValue(0);
  const footerOpacity = useSharedValue(0);

  const handleNext = () => {
    router.replace('/(auth)/welcome');
  };

  useEffect(() => {
    // 1. Icon entrance
    iconScale.value = withSpring(1, { damping: 14, stiffness: 90 });
    iconOpacity.value = withTiming(1, { duration: 600 });

    // 2. Title entrance
    textTranslateY.value = withDelay(250, withSpring(0, { damping: 15, stiffness: 95 }));
    textOpacity.value = withDelay(250, withTiming(1, { duration: 600 }));

    // 3. Workshop Background fade in
    bgOpacity.value = withDelay(350, withTiming(1, { duration: 800 }));

    // 4. Footer entrance
    footerOpacity.value = withDelay(500, withTiming(1, { duration: 700 }));

    // 5. Auto advance to Screen 2 Welcome screen
    const timer = setTimeout(() => {
      handleNext();
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
    opacity: iconOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: textTranslateY.value }],
    opacity: textOpacity.value,
  }));

  const bgAnimatedStyle = useAnimatedStyle(() => ({
    opacity: bgOpacity.value,
  }));

  const footerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleNext}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Top Deep Midnight Navy Background */}
      <View style={styles.topBackdrop} />

      {/* Workshop Scene Photo in Middle/Lower Area */}
      <Animated.View style={[styles.bgImageContainer, bgAnimatedStyle]}>
        <Image
          source={require('../../assets/splash_garage_bg.png')}
          style={styles.bgImage}
          resizeMode="cover"
        />
        {/* Soft Gradient Overlay Blending Workshop to Top & Bottom */}
        <LinearGradient
          colors={['#071120', 'transparent', 'rgba(7, 17, 32, 0.85)', '#071120']}
          locations={[0, 0.25, 0.75, 1]}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>

      {/* Center Branding Hero — Exact Screen 1 in User Mockup */}
      <View style={styles.centerHero}>
        {/* White Garage Shelter Rooftop Icon with Car Inside */}
        <Animated.View style={[styles.iconWrapper, iconAnimatedStyle]}>
          <Image
            source={require('../../assets/splash_garage_icon.png')}
            style={styles.shelterIcon}
            resizeMode="contain"
          />
        </Animated.View>

        {/* Large Bold Caps "GARAGE" + "EXPENSE TRACKER" */}
        <Animated.View style={[styles.titleSection, textAnimatedStyle]}>
          <Text style={styles.mainTitle}>GARAGE</Text>
          <Text style={styles.subtitle}>EXPENSE TRACKER</Text>
        </Animated.View>
      </View>

      {/* Bottom Footer: "Track, Manage, Grow." and 3-Segment Progress Line */}
      <Animated.View style={[styles.bottomSection, footerAnimatedStyle]}>
        <Text style={styles.taglineText}>Track, Manage, Grow.</Text>

        {/* 3-Segment Progress Indicator Line matching Screen 1 */}
        <View style={styles.progressSegments}>
          <View style={[styles.segment, styles.segmentDim]} />
          <View style={[styles.segment, styles.segmentActive]} />
          <View style={[styles.segment, styles.segmentDim]} />
        </View>
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#071120',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topBackdrop: {
    ...StyleSheet.absoluteFill,
    backgroundColor: '#071120',
  },
  bgImageContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: '32%',
    bottom: 0,
    height: '68%',
  },
  bgImage: {
    width: '100%',
    height: '100%',
  },
  centerHero: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: '25%',
    zIndex: 10,
  },
  iconWrapper: {
    width: 90,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  shelterIcon: {
    width: 84,
    height: 76,
  },
  titleSection: {
    alignItems: 'center',
  },
  mainTitle: {
    color: '#FFFFFF',
    fontSize: 34,
    fontWeight: '900',
    letterSpacing: 2,
    textAlign: 'center',
  },
  subtitle: {
    color: '#E2E8F0',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 2.2,
    marginTop: 6,
    textAlign: 'center',
  },
  bottomSection: {
    position: 'absolute',
    bottom: 48,
    alignItems: 'center',
    width: '100%',
    zIndex: 10,
  },
  taglineText: {
    color: 'rgba(255, 255, 255, 0.75)',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.8,
    marginBottom: 16,
  },
  progressSegments: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  segment: {
    height: 3,
    borderRadius: 2,
  },
  segmentDim: {
    width: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  segmentActive: {
    width: 32,
    backgroundColor: '#38BDF8',
  },
});
