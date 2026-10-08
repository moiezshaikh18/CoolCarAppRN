// ============================================================
// Screen 2: Welcome / Onboarding Screen — Cool Car Workshop
// Matches Reference Design:
// Top-right "Skip" button, Left-aligned Welcome title & subtitle,
// Sleek Car + Mechanic Auto Technician Vector Illustration,
// Midnight Navy "Get Started" Pill Button & Pagination Dots (● ○ ○)
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
  Circle,
  Rect,
  Defs,
  LinearGradient as SvgGradient,
  Stop,
} from 'react-native-svg';

const { width } = Dimensions.get('window');

// High-fidelity Car + Mechanic Auto Specialist Vector Illustration
function CarAndMechanicIllustration({ size = 260 }: { size?: number }) {
  const h = size * 0.85;
  return (
    <Svg width={size} height={h} viewBox="0 0 320 270" fill="none">
      <Defs>
        <SvgGradient id="bgGlow" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#EFF6FF" stopOpacity="1" />
          <Stop offset="100%" stopColor="#DBEAFE" stopOpacity="0.4" />
        </SvgGradient>
        <SvgGradient id="carGrad" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0%" stopColor="#1E40AF" />
          <Stop offset="50%" stopColor="#2563EB" />
          <Stop offset="100%" stopColor="#3B82F6" />
        </SvgGradient>
        <SvgGradient id="glassGrad" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#93C5FD" />
          <Stop offset="100%" stopColor="#60A5FA" />
        </SvgGradient>
      </Defs>

      {/* Soft Circular Backdrop Halo */}
      <Circle cx="160" cy="135" r="115" fill="url(#bgGlow)" />

      {/* Ground Floor Shadow */}
      <Path
        d="M20 220C60 216 260 216 300 220C260 224 60 224 20 220Z"
        fill="#CBD5E1"
        opacity="0.6"
      />

      {/* ================= MODERN BLUE CAR (Left-Center) ================= */}
      {/* Car Body Shadow */}
      <Path
        d="M35 208C70 205 180 205 210 208C180 212 70 212 35 208Z"
        fill="#94A3B8"
        opacity="0.5"
      />

      {/* Wheels */}
      {/* Front Wheel */}
      <Circle cx="68" cy="195" r="19" fill="#1E293B" />
      <Circle cx="68" cy="195" r="12" fill="#64748B" />
      <Circle cx="68" cy="195" r="6" fill="#F1F5F9" />
      {/* Rear Wheel */}
      <Circle cx="172" cy="195" r="19" fill="#1E293B" />
      <Circle cx="172" cy="195" r="12" fill="#64748B" />
      <Circle cx="172" cy="195" r="6" fill="#F1F5F9" />

      {/* Main Car Chassis */}
      <Path
        d="M38 185C38 175 42 165 52 163L78 160L96 132C101 125 108 120 118 120H158C166 120 174 125 178 132L192 160L208 164C216 166 220 174 220 182V192C220 196 216 198 212 198H192C192 186 182 178 172 178C162 178 152 186 152 198H88C88 186 78 178 68 178C58 178 48 186 48 198H38C34 198 32 194 32 190L38 185Z"
        fill="url(#carGrad)"
      />

      {/* Car Windshield & Side Windows */}
      <Path
        d="M100 135C103 130 108 127 115 127H136V156H88L100 135Z"
        fill="url(#glassGrad)"
      />
      <Path
        d="M142 127H156C162 127 167 130 170 135L182 156H142V127Z"
        fill="url(#glassGrad)"
      />

      {/* Front Headlight & Grill Accent */}
      <Path
        d="M34 172C34 168 38 166 44 167L46 177H36C34 177 34 175 34 172Z"
        fill="#FEF08A"
      />
      {/* Sleek Chrome Door Handle */}
      <Rect x="122" y="164" width="12" height="3" rx="1.5" fill="#FFFFFF" />

      {/* ================= MECHANIC / AUTO SPECIALIST (Right) ================= */}
      {/* Cap */}
      <Path
        d="M242 78C242 72 248 68 256 68C264 68 270 72 270 78H276V82H238V78H242Z"
        fill="#1E3A8A"
      />
      {/* Face & Ears */}
      <Circle cx="256" cy="88" r="13" fill="#FBBF24" />
      <Circle cx="243" cy="88" r="3" fill="#F59E0B" />
      <Circle cx="269" cy="88" r="3" fill="#F59E0B" />
      {/* Hair */}
      <Path d="M244 80C246 75 252 74 256 74C260 74 266 75 268 80Z" fill="#78350F" />
      {/* Friendly Smile */}
      <Path d="M253 93C254 95 258 95 259 93" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />

      {/* Workshop Uniform / Overalls */}
      {/* Torso */}
      <Path
        d="M242 104C240 106 238 112 238 120L242 165H270L274 120C274 112 272 106 270 104L262 101H250L242 104Z"
        fill="#2563EB"
      />
      {/* White T-shirt collar */}
      <Path d="M252 101L256 109L260 101H252Z" fill="#FFFFFF" />
      {/* Red/Orange Tool in pocket */}
      <Rect x="260" y="116" width="3" height="14" rx="1" fill="#EF4444" />
      <Rect x="256" y="122" width="12" height="10" rx="2" fill="#1D4ED8" />

      {/* Arms & Hands */}
      {/* Left Arm holding Checklist Clipboard */}
      <Path
        d="M239 108L225 132C223 136 225 142 229 143L234 144"
        stroke="#2563EB"
        strokeWidth="9"
        strokeLinecap="round"
      />
      {/* Clipboard */}
      <Rect x="214" y="132" width="22" height="30" rx="3" fill="#B45309" />
      <Rect x="216" y="136" width="18" height="24" rx="2" fill="#FFFFFF" />
      <Rect x="221" y="130" width="8" height="4" rx="1" fill="#475569" />
      {/* Checklist Lines on paper */}
      <Rect x="219" y="140" width="12" height="2" rx="1" fill="#94A3B8" />
      <Rect x="219" y="145" width="10" height="2" rx="1" fill="#94A3B8" />
      <Rect x="219" y="150" width="12" height="2" rx="1" fill="#94A3B8" />

      {/* Right Arm Thumbs Up / Welcoming Gesture */}
      <Path
        d="M272 108L284 128C286 132 285 138 281 140L275 142"
        stroke="#2563EB"
        strokeWidth="9"
        strokeLinecap="round"
      />
      <Circle cx="282" cy="136" r="5" fill="#FBBF24" />

      {/* Legs & Workshop Boots */}
      {/* Left Leg */}
      <Rect x="244" y="165" width="10" height="44" rx="3" fill="#1E3A8A" />
      <Path d="M241 206C241 203 244 202 248 202H255V212H239C239 209 240 207 241 206Z" fill="#1E293B" />
      {/* Right Leg */}
      <Rect x="258" y="165" width="10" height="44" rx="3" fill="#1E3A8A" />
      <Path d="M257 206C257 203 260 202 264 202H271V212H255C255 209 256 207 257 206Z" fill="#1E293B" />
    </Svg>
  );
}

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { paddingTop: insets.top + 16, paddingBottom: insets.bottom + 24 }]}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header: "Skip" Button (Right-aligned matching reference Screen 2) */}
      <View style={styles.topBar}>
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>
      </View>

      {/* Main Content Area */}
      <View style={styles.contentArea}>
        {/* Left-Aligned Headline & Subtitle matching reference Screen 2 */}
        <View style={styles.headerTextGroup}>
          <Text style={styles.welcomeLabel}>Welcome to</Text>
          <Text style={styles.mainTitle}>Cool Car Garage</Text>
          <Text style={styles.subtitle}>
            Track daily income, expenses, customers and more. All in one place.
          </Text>
        </View>

        {/* Center Vector Illustration matching reference Screen 2 */}
        <View style={styles.illustrationWrapper}>
          <CarAndMechanicIllustration size={Math.min(width * 0.85, 320)} />
        </View>
      </View>

      {/* Bottom Section: Primary Pill Button & Pagination Dots */}
      <View style={styles.bottomSection}>
        {/* Midnight Navy "Get Started" Pill Button */}
        <TouchableOpacity
          onPress={() => router.push('/(auth)/login')}
          activeOpacity={0.88}
          style={styles.primaryButton}
        >
          <Text style={styles.primaryButtonText}>Get Started</Text>
        </TouchableOpacity>

        {/* 3 Pagination Dots (● ○ ○) matching reference Screen 2 */}
        <View style={styles.paginationRow}>
          <View style={[styles.dot, styles.activeDot]} />
          <View style={styles.dot} />
          <View style={styles.dot} />
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
    width: '100%',
  },
  skipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748B',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
    paddingTop: 10,
  },
  headerTextGroup: {
    marginBottom: 24,
  },
  welcomeLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  mainTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#0F172A',
    letterSpacing: -0.6,
    marginTop: 2,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
    maxWidth: 300,
    fontWeight: '500',
  },
  illustrationWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 18,
  },
  bottomSection: {
    alignItems: 'center',
    width: '100%',
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#0C1829', // Exact Midnight Navy from Screen 2
    paddingVertical: 16,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0C1829',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 0.2,
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 22,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#CBD5E1',
  },
  activeDot: {
    width: 22,
    backgroundColor: '#0C1829', // Active elongated pill dot
  },
});
