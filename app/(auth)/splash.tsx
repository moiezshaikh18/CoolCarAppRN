// ============================================================
// Screen 1: Splash Screen — Cool Car Garage Expense Tracker
// Matches HD Reference Mockup 100%:
// Ultra-HD Workshop Visual, Garage Shelter Icon,
// "COOL CAR GARAGE EXPENSE TRACKER", and "Track • Manage • Grow"
// ============================================================

import React, { useEffect } from 'react';
import {
  Image,
  StyleSheet,
  StatusBar,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { router } from 'expo-router';
import { useAuthStore } from '../../src/store/authStore';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function SplashScreen() {
  const opacity = useSharedValue(0.1);
  const scale = useSharedValue(1.04);

  const handleNext = () => {
    const authState = useAuthStore.getState().authState;
    const user = useAuthStore.getState().user;
    if (user || authState === 'authenticated') {
      router.replace('/(tabs)');
    } else {
      router.replace('/(auth)/welcome');
    }
  };

  useEffect(() => {
    const authState = useAuthStore.getState().authState;
    const user = useAuthStore.getState().user;
    if (user || authState === 'authenticated') {
      router.replace('/(tabs)');
      return;
    }

    // Smooth cinematic zoom & fade entrance
    opacity.value = withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1, { duration: 1800, easing: Easing.out(Easing.quad) });

    const timer = setTimeout(() => {
      handleNext();
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={handleNext}
      style={styles.container}
    >
      <StatusBar barStyle="light-content" translucent backgroundColor="transparent" />

      {/* Ultra-HD Master Splash Asset matching user image */}
      <Animated.View style={[StyleSheet.absoluteFill, animatedStyle]}>
        <Image
          source={require('../../assets/screen1_splash_clean_hd.png')}
          style={styles.fullScreenImage}
          resizeMode="cover"
        />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#031636',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fullScreenImage: {
    width: width,
    height: height,
  },
});
