// ============================================================
// Screen 2: Welcome Screen — Cool Car Workshop OS
// Matches Reference Design Mockup (Screen 2):
// Clear 3D Automotive Illustration with Mechanic & Tools,
// Workshop Typography (34px bold), No 3 Dots, No Skip button,
// Wide Midnight Navy "Get Started" CTA Button
// ============================================================

import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
} from 'react-native';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, {
  Path,
  Rect,
  Circle,
  Defs,
  LinearGradient,
  Stop,
  G,
  Ellipse,
  RadialGradient,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

// High-Fidelity 3D Isometric Automotive Illustration matching Reference Mockup Screen 2
function ThreeDCarMechanicGraphic({ size = 320 }: { size?: number }) {
  const s = size;
  return (
    <Svg width={s} height={s * 0.9} viewBox="0 0 320 288" fill="none">
      <Defs>
        {/* Car Metallic 3D Gradients */}
        <LinearGradient id="carBody3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#60A5FA" />
          <Stop offset="30%" stopColor="#2563EB" />
          <Stop offset="75%" stopColor="#1D4ED8" />
          <Stop offset="100%" stopColor="#0F172A" />
        </LinearGradient>

        <LinearGradient id="carRoof3D" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor="#93C5FD" />
          <Stop offset="50%" stopColor="#1E40AF" />
          <Stop offset="100%" stopColor="#0B1329" />
        </LinearGradient>

        <LinearGradient id="specularGlow" x1="0%" y1="0%" x2="100%" y2="0%">
          <Stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.8" />
          <Stop offset="50%" stopColor="#93C5FD" stopOpacity="0.4" />
          <Stop offset="100%" stopColor="#3B82F6" stopOpacity="0" />
        </LinearGradient>

        <LinearGradient id="tintGlass" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#BAE6FD" stopOpacity="0.95" />
          <Stop offset="45%" stopColor="#0284C7" stopOpacity="0.85" />
          <Stop offset="100%" stopColor="#0369A1" stopOpacity="0.95" />
        </LinearGradient>

        <RadialGradient id="tireRubber" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#334155" />
          <Stop offset="65%" stopColor="#0F172A" />
          <Stop offset="100%" stopColor="#020617" />
        </RadialGradient>

        <LinearGradient id="rimChrome" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#F8FAFC" />
          <Stop offset="50%" stopColor="#94A3B8" />
          <Stop offset="100%" stopColor="#475569" />
        </LinearGradient>

        <RadialGradient id="groundShadow" cx="50%" cy="50%" r="50%">
          <Stop offset="0%" stopColor="#0F172A" stopOpacity="0.45" />
          <Stop offset="60%" stopColor="#1E293B" stopOpacity="0.2" />
          <Stop offset="100%" stopColor="#0F172A" stopOpacity="0" />
        </RadialGradient>

        {/* Mechanic Gradients */}
        <LinearGradient id="overalls3D" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#1E40AF" />
          <Stop offset="60%" stopColor="#172554" />
          <Stop offset="100%" stopColor="#0B1329" />
        </LinearGradient>

        <LinearGradient id="chromeTool" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor="#FFFFFF" />
          <Stop offset="40%" stopColor="#CBD5E1" />
          <Stop offset="100%" stopColor="#64748B" />
        </LinearGradient>
      </Defs>

      {/* Ground Soft Ambient Shadow */}
      <Ellipse cx="140" cy="242" rx="115" ry="20" fill="url(#groundShadow)" />

      {/* 3D Modern Sleek Car */}
      <G>
        {/* Wheels */}
        <Circle cx="72" cy="224" r="23" fill="url(#tireRubber)" />
        <Circle cx="72" cy="224" r="16" fill="url(#rimChrome)" />
        <Circle cx="72" cy="224" r="7" fill="#0F172A" />
        <Circle cx="72" cy="224" r="3" fill="#38BDF8" />

        <Circle cx="184" cy="224" r="23" fill="url(#tireRubber)" />
        <Circle cx="184" cy="224" r="16" fill="url(#rimChrome)" />
        <Circle cx="184" cy="224" r="7" fill="#0F172A" />
        <Circle cx="184" cy="224" r="3" fill="#38BDF8" />

        <Path d="M48 224C48 210 58 200 72 200C86 200 96 210 96 224H48Z" fill="#0A0F1D" opacity="0.7" />
        <Path d="M160 224C160 210 170 200 184 200C198 200 208 210 208 224H160Z" fill="#0A0F1D" opacity="0.7" />

        <Path
          d="M34 220C34 214 38 210 44 208L96 208C102 216 114 220 128 220C142 220 154 216 160 208L212 208C218 210 224 216 224 222V226C224 228 220 230 214 230H44C38 230 34 228 34 226V220Z"
          fill="#0B1329"
        />

        <Path
          d="M36 206C34 196 38 184 48 180L84 174L104 136C110 126 120 120 132 120H176C186 120 196 126 202 136L218 174L230 180C240 184 244 194 244 204C244 214 238 218 228 218H206C200 204 188 196 174 196C160 196 148 204 142 218H100C94 204 82 196 68 196C54 196 42 204 36 218H34C34 214 34 210 36 206Z"
          fill="url(#carBody3D)"
        />

        <Path d="M48 182C58 178 84 174 104 174C84 178 58 182 48 186Z" fill="url(#specularGlow)" />
        <Path d="M134 122H174C184 122 192 126 198 134L208 152H124L134 122Z" fill="url(#carRoof3D)" />

        <Path d="M108 140C112 134 118 130 126 130H152V170H88L108 140Z" fill="url(#tintGlass)" />
        <Path d="M158 130H172C178 130 184 134 188 140L202 170H158V130Z" fill="url(#tintGlass)" />
        <Path d="M120 132L94 168H104L130 132H120Z" fill="#FFFFFF" opacity="0.6" />

        <Path d="M92 186C122 182 174 182 212 186" stroke="#1E40AF" strokeWidth="2.5" strokeLinecap="round" />
        <Path d="M94 188C124 184 176 184 214 188" stroke="#60A5FA" strokeWidth="1.2" strokeLinecap="round" />
        <Rect x="140" y="180" width="16" height="4" rx="2" fill="#FFFFFF" />

        <Path d="M36 190C36 184 42 180 50 182L54 196H40C37 196 36 193 36 190Z" fill="#FEF08A" />
        <Path d="M38 188C38 185 42 183 48 184L50 192H40C38 192 38 190 38 188Z" fill="#FFFFFF" />
        <Rect x="34" y="198" width="6" height="12" rx="3" fill="#38BDF8" />
      </G>

      {/* Mechanic with Diagnostic Clipboard & Tools */}
      <G>
        <Ellipse cx="254" cy="254" rx="28" ry="7" fill="#0F172A" opacity="0.35" />
        <Path d="M236 242C236 238 240 236 246 236H254V252H234C234 248 235 244 236 242Z" fill="#1E293B" />
        <Path d="M258 242C258 238 262 236 268 236H276V252H256C256 248 257 244 258 242Z" fill="#1E293B" />
        <Rect x="238" y="246" width="16" height="3" rx="1.5" fill="#475569" />
        <Rect x="260" y="246" width="16" height="3" rx="1.5" fill="#475569" />

        <Rect x="239" y="184" width="14" height="54" rx="4" fill="url(#overalls3D)" />
        <Rect x="259" y="184" width="14" height="54" rx="4" fill="url(#overalls3D)" />

        <Path
          d="M236 116C234 120 232 130 232 144L238 190H274L280 144C280 130 278 120 276 116L266 112H246L236 116Z"
          fill="url(#overalls3D)"
        />

        <Path d="M252 112L256 122L260 112H252Z" fill="#FFFFFF" />
        <Rect x="240" y="136" width="14" height="18" rx="3" fill="#1E3A8A" />
        <Rect x="258" y="136" width="14" height="18" rx="3" fill="#1E3A8A" />
        <Rect x="243" y="126" width="4" height="14" rx="2" fill="#EF4444" />
        <Rect x="263" y="124" width="3" height="16" rx="1.5" fill="url(#chromeTool)" />

        <Rect x="236" y="184" width="40" height="7" rx="2" fill="#334155" />
        <Rect x="252" y="183" width="8" height="9" rx="2" fill="#F59E0B" />

        <Rect x="252" y="100" width="8" height="14" rx="3" fill="#F59E0B" />
        <Circle cx="256" cy="94" r="15" fill="#FBBF24" />
        <Circle cx="241" cy="94" r="3.5" fill="#F59E0B" />
        <Circle cx="271" cy="94" r="3.5" fill="#F59E0B" />

        <Path d="M240 86C240 76 248 70 256 70C264 70 272 76 272 86H280V91H236V86H240Z" fill="#1E3A8A" />
        <Path d="M250 86H280V90H250V86Z" fill="#2563EB" />
        <Circle cx="256" cy="78" r="3" fill="#38BDF8" />

        <Circle cx="250" cy="92" r="2" fill="#78350F" />
        <Circle cx="262" cy="92" r="2" fill="#78350F" />
        <Path d="M252 98C254 101 258 101 260 98" stroke="#92400E" strokeWidth="1.8" strokeLinecap="round" />

        <Path d="M234 124L216 154C214 158 217 166 222 168L228 170" stroke="#1E40AF" strokeWidth="11" strokeLinecap="round" />
        <Rect x="198" y="148" width="28" height="38" rx="4" fill="#0F172A" />
        <Rect x="201" y="152" width="22" height="30" rx="2" fill="#0284C7" />
        <Path d="M204 168L209 162L214 165L220 156" stroke="#38BDF8" strokeWidth="2" strokeLinecap="round" />
        <Circle cx="220" cy="156" r="1.5" fill="#FEF08A" />

        <Path d="M276 124L294 148C297 153 296 160 291 163L284 166" stroke="#1E40AF" strokeWidth="11" strokeLinecap="round" />
        <Circle cx="292" cy="158" r="6" fill="#FBBF24" />
      </G>

      {/* Floating 3D Tools */}
      <G transform="translate(45, 78) rotate(-22)">
        <Path d="M0 0H26L30 5L26 10H0L4 5L0 0Z" fill="url(#chromeTool)" />
        <Circle cx="26" cy="5" r="7" fill="none" stroke="#64748B" strokeWidth="3" />
      </G>

      <G transform="translate(260, 48)">
        <Path d="M16 0L30 6V18C30 26 24 32 16 35C8 32 2 26 2 18V6L16 0Z" fill="#10B981" />
        <Path d="M9 17L14 22L23 12" stroke="#FFFFFF" strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round" />
      </G>
    </Svg>
  );
}

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  const handleGetStarted = () => {
    // Navigate straight to dashboard / tabs
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + 32, paddingBottom: insets.bottom + 32 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Main Content Area */}
      <View style={styles.contentArea}>
        {/* Bold, Clear, Workshop-Friendly Typography */}
        <View style={styles.headerTextGroup}>
          <Text style={styles.welcomeLabel}>Welcome to</Text>
          <Text style={styles.mainTitle}>Cool Car Garage</Text>
          <Text style={styles.subtitle}>
            Track daily income, expenses, customers and more. All in one place.
          </Text>
        </View>

        {/* High-Fidelity 3D Automotive Illustration */}
        <View style={styles.illustrationWrapper}>
          <ThreeDCarMechanicGraphic size={Math.min(width * 0.92, 350)} />
        </View>
      </View>

      {/* Bottom Section: Single Wide Midnight Navy "Get Started" Button (NO 3 Dots, NO Skip) */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          onPress={handleGetStarted}
          activeOpacity={0.88}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>
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
  contentArea: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTextGroup: {
    marginBottom: 20,
  },
  welcomeLabel: {
    fontSize: 20,
    fontWeight: '700',
    color: '#475569',
    letterSpacing: -0.2,
  },
  mainTitle: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0C1829',
    letterSpacing: -0.8,
    marginTop: 4,
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: '#334155',
    lineHeight: 25,
    fontWeight: '600',
    maxWidth: 320,
  },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 14,
  },
  bottomSection: {
    width: '100%',
    paddingTop: 8,
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#0C1829',
    paddingVertical: 18,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0C1829',
    shadowOpacity: 0.25,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 5,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
});
