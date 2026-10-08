// ============================================================
// Screen 1: Splash Screen — Cool Car Workshop OS
// Matches Reference Design:
// Dark Garage Workshop Atmosphere, Workshop Shelter Icon,
// Cool Car Official Branding, and Bottom Tagline: "Track. Manage. Grow."
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
import Svg, { Path } from 'react-native-svg';
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

const { width } = Dimensions.get('window');

// Garage Shelter with Car SVG Icon matching reference Screen 1
function GarageShelterIcon({ size = 68, color = '#FFFFFF' }: { size?: number; color?: string }) {
  return (
    <Svg width={size} height={size * 0.9} viewBox="0 0 68 60" fill="none">
      <Path d="M34 4L62 20V24H6V20L34 4Z" fill={color} />
      <Path d="M10 24V54H16V24H10Z" fill={color} />
      <Path d="M52 24V54H58V24H52Z" fill={color} />
      <Path
        d="M26 34C28 30 31 27 34 27C37 27 40 30 42 34L45 38C47 39 48 41 48 43V48C48 49 47 50 46 50H45C44 50 43 49 43 48V46H25V48C25 49 24 50 23 50H22C21 50 20 49 20 48V43C20 41 21 39 23 38L26 34Z"
        fill={color}
      />
      <Path d="M24 41H27V43H24V41Z" fill="#0C1829" />
      <Path d="M41 41H44V43H41V41Z" fill="#0C1829" />
      <Path d="M28 34H40L38 31H30L28 34Z" fill="#0C1829" />
    </Svg>
  );
}

export default function SplashScreen() {
  const iconScale = useSharedValue(0.75);
  const iconOpacity = useSharedValue(0);
  const iconFloat = useSharedValue(0);

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.9);

  const textTranslateY = useSharedValue(20);
  const textOpacity = useSharedValue(0);

  const progress = useSharedValue(0);
  const footerOpacity = useSharedValue(0);

  useEffect(() => {
    iconScale.value = withSpring(1, { damping: 14, stiffness: 90 });
    iconOpacity.value = withTiming(1, { duration: 600 });

    iconFloat.value = withDelay(
      600,
      withRepeat(
        withSequence(
          withTiming(-4, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
          withTiming(4, { duration: 1500, easing: Easing.inOut(Easing.quad) })
        ),
        -1,
        true
      )
    );

    logoScale.value = withDelay(250, withSpring(1, { damping: 14, stiffness: 90 }));
    logoOpacity.value = withDelay(250, withTiming(1, { duration: 700 }));

    textTranslateY.value = withDelay(400, withSpring(0, { damping: 15, stiffness: 95 }));
    textOpacity.value = withDelay(400, withTiming(1, { duration: 700 }));

    progress.value = withDelay(450, withTiming(1, { duration: 1800, easing: Easing.bezier(0.25, 0.1, 0.25, 1) }));
    footerOpacity.value = withDelay(500, withTiming(1, { duration: 700 }));

    const timer = setTimeout(() => {
      router.replace('/(auth)/welcome');
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  const iconAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }, { translateY: iconFloat.value }],
    opacity: iconOpacity.value,
  }));

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
    opacity: logoOpacity.value,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: textTranslateY.value }],
    opacity: textOpacity.value,
  }));

  const progressAnimatedStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  const footerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: footerOpacity.value,
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      <LinearGradient
        colors={['#050811', '#0B1326', '#080E1C', '#030509']}
        locations={[0, 0.38, 0.72, 1]}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.ambientHalo} />
      <View style={styles.innerHalo} />

      <View style={styles.centerHero}>
        <Animated.View style={[styles.shelterContainer, iconAnimatedStyle]}>
          <GarageShelterIcon size={64} color="#FFFFFF" />
        </Animated.View>

        <Animated.View style={[styles.logoWrapper, logoAnimatedStyle]}>
          <Image
            source={require('../../assets/cool_car_logo_white.png')}
            style={styles.logoImage}
            resizeMode="contain"
          />
        </Animated.View>

        <Animated.View style={[styles.titleSection, textAnimatedStyle]}>
          <Text style={styles.brandTitle}>COOL CAR</Text>
          <Text style={styles.brandSubtitle}>GARAGE WORKSHOP OS</Text>
        </Animated.View>
      </View>

      <Animated.View style={[styles.bottomSection, footerAnimatedStyle]}>
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

        <Text style={styles.taglineText}>Track. Manage. Grow.</Text>
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
  },
  ambientHalo: {
    position: 'absolute',
    width: Math.min(width * 1.1, 440),
    height: Math.min(width * 1.1, 440),
    borderRadius: Math.min(width * 0.55, 220),
    backgroundColor: 'rgba(21, 53, 128, 0.35)',
  },
  innerHalo: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  centerHero: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    zIndex: 10,
  },
  shelterContainer: {
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  logoImage: {
    width: 220,
    height: 72,
  },
  titleSection: {
    alignItems: 'center',
    marginTop: 4,
  },
  brandTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    letterSpacing: 3,
  },
  brandSubtitle: {
    color: '#94A3B8',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2.5,
    marginTop: 4,
  },
  bottomSection: {
    position: 'absolute',
    bottom: 50,
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 40,
  },
  progressTrack: {
    width: 140,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: 18,
  },
  progressBar: {
    height: '100%',
    borderRadius: 2,
  },
  taglineText: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 1.5,
  },
});
