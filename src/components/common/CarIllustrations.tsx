// ============================================================
// Distinct Vector Car Illustrations (<1-2 KB each)
// Cool Car Workshop — SVG Silhouette Renderers
// 6 Distinct Categories: Sedan, Mini SUV, Full SUV, Hatchback, Jeep 4x4, MUV
// Plus Exact Signboard Speed-Car
// Integrated with live internet automotive classification
// ============================================================

import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';
import {
  CarBodyType,
  classifyCarSync,
  classifyCarLive,
  BODY_TYPE_SHORT_BADGES,
} from '../../services/carClassifierService';

interface CarIllustrationProps {
  size?: number;
  color?: string;
}

// 1. Signboard Aerodynamic Car with Speed Lines (Directly matching Cool Car Shop Board)
export function SignboardSpeedCar({
  size = 120,
  color = '#FFFFFF',
}: {
  size?: number;
  color?: string;
}) {
  const width = size;
  const height = size * 0.42;

  return (
    <Svg width={width} height={height} viewBox="0 0 200 84" fill="none">
      {/* Aerodynamic Wind Speed Lines (Left) */}
      <Path
        d="M10 32C24 32 38 35 48 38"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Path
        d="M4 44C20 44 34 46 45 49"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Path
        d="M14 56C28 56 36 57 44 59"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Aerodynamic Car Body Outline */}
      <Path
        d="M52 46C56 38 66 26 88 18C108 10 144 10 162 20C176 27 186 38 190 48C193 55 190 62 182 64C172 66 166 66 156 66C152 57 143 51 132 51C121 51 112 57 108 66H88C84 57 75 51 64 51C53 51 44 57 40 66C34 65 32 60 35 54C38 48 45 46 52 46Z"
        stroke={color}
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Window Arch */}
      <Path
        d="M86 23C104 16 136 16 152 25C158 29 164 36 166 42H82C82 34 84 26 86 23Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* B-Pillar divider */}
      <Path d="M124 17V42" stroke={color} strokeWidth="2" />

      {/* Left Wheel Arch & Rim */}
      <Circle cx="64" cy="64" r="13" stroke={color} strokeWidth="3" />
      <Circle cx="64" cy="64" r="5" fill={color} />

      {/* Right Wheel Arch & Rim */}
      <Circle cx="132" cy="64" r="13" stroke={color} strokeWidth="3" />
      <Circle cx="132" cy="64" r="5" fill={color} />

      {/* Rear Wing / Spoiler Accent */}
      <Path
        d="M44 42C40 37 36 34 32 34"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Aerodynamic Wind Speed Lines (Right) */}
      <Path
        d="M172 26C182 23 192 20 200 18"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <Path
        d="M178 36C188 34 196 32 202 30"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </Svg>
  );
}

// 2. Sedan Silhouette (Honda City, Dzire, Verna, Ciaz, Amaze)
export function SedanIllustration({ size = 80, color = '#2563EB' }: CarIllustrationProps) {
  const w = size;
  const h = size * 0.44;
  return (
    <Svg width={w} height={h} viewBox="0 0 100 44" fill="none">
      {/* 3-Box Sedan Body with Distinct Boot */}
      <Path
        d="M4 31C4 29 8 26 15 26H28L40 14H68L82 26H93C97 26 98 29 98 32C98 34 96 35 92 35H84C82 28 76 24 69 24C62 24 56 28 54 35H38C36 28 30 24 23 24C16 24 10 28 8 35H5C3 35 3 33 4 31Z"
        fill={color}
        opacity={0.92}
      />
      {/* Front & Rear Glass */}
      <Path d="M41 16L32 24H52V16H41Z" fill="#FFFFFF" opacity={0.65} />
      <Path d="M55 16V24H78L68 16H55Z" fill="#FFFFFF" opacity={0.65} />
      {/* Wheels */}
      <Circle cx="23" cy="35" r="7" fill="#0C1829" stroke="#E2E8F0" strokeWidth="2" />
      <Circle cx="69" cy="35" r="7" fill="#0C1829" stroke="#E2E8F0" strokeWidth="2" />
    </Svg>
  );
}

// 3. Mini SUV / Compact Crossover (Creta, Seltos, Brezza, Nexon, Punch, Venue)
export function MiniSuvIllustration({ size = 80, color = '#F59E0B' }: CarIllustrationProps) {
  const w = size;
  const h = size * 0.48;
  return (
    <Svg width={w} height={h} viewBox="0 0 100 48" fill="none">
      {/* Roof Rails */}
      <Path d="M34 8H72" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      {/* Compact SUV High Ground Clearance Body */}
      <Path
        d="M6 34C6 31 10 28 17 28H25L35 11H74L87 28H94C97 28 98 31 98 34C98 36 96 37 92 37H84C82 30 76 26 69 26C62 26 56 30 54 37H38C36 30 30 26 23 26C16 26 10 30 8 37H5C3 37 3 35 6 34Z"
        fill={color}
        opacity={0.92}
      />
      {/* Windows */}
      <Path d="M37 13L29 25H50V13H37Z" fill="#FFFFFF" opacity={0.65} />
      <Path d="M53 13V25H77L73 13H53Z" fill="#FFFFFF" opacity={0.65} />
      {/* Chunky Alloy Wheels */}
      <Circle cx="23" cy="37" r="7.8" fill="#0C1829" stroke="#E2E8F0" strokeWidth="2" />
      <Circle cx="69" cy="37" r="7.8" fill="#0C1829" stroke="#E2E8F0" strokeWidth="2" />
    </Svg>
  );
}

// 4. Full-Size SUV (Fortuner, Scorpio, XUV700, Safari, Harrier)
export function SuvIllustration({ size = 80, color = '#EA580C' }: CarIllustrationProps) {
  const w = size;
  const h = size * 0.52;
  return (
    <Svg width={w} height={h} viewBox="0 0 100 52" fill="none">
      {/* Roof Rack & Aggressive Stance */}
      <Path d="M28 6H78" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
      <Path
        d="M4 38C4 33 8 30 16 30H24L32 10H82L92 30H96C99 30 100 33 100 37C100 40 98 41 94 41H85C83 34 77 29 69 29C61 29 55 34 53 41H38C36 34 30 29 22 29C14 29 8 34 6 41H3C2 41 2 39 4 38Z"
        fill={color}
        opacity={0.92}
      />
      {/* 3-Row Windows */}
      <Path d="M34 13L27 27H48V13H34Z" fill="#FFFFFF" opacity={0.65} />
      <Path d="M51 13V27H68V13H51Z" fill="#FFFFFF" opacity={0.65} />
      <Path d="M71 13V27H81L78 13H71Z" fill="#FFFFFF" opacity={0.65} />
      {/* Large Offroad Wheels */}
      <Circle cx="22" cy="41" r="8.5" fill="#0C1829" stroke="#E2E8F0" strokeWidth="2.5" />
      <Circle cx="69" cy="41" r="8.5" fill="#0C1829" stroke="#E2E8F0" strokeWidth="2.5" />
    </Svg>
  );
}

// 5. Hatchback Silhouette (Swift, Baleno, i20, WagonR, Tiago, Alto)
export function HatchbackIllustration({ size = 80, color = '#DC2626' }: CarIllustrationProps) {
  const w = size;
  const h = size * 0.46;
  return (
    <Svg width={w} height={h} viewBox="0 0 100 46" fill="none">
      {/* Compact Sloping Tail Hatchback Body */}
      <Path
        d="M8 33C8 30 11 27 16 27H24L38 13H64L76 27H90C94 27 96 29 96 33C96 35 94 36 90 36H82C80 30 74 26 68 26C62 26 56 30 54 36H36C34 30 28 26 22 26C16 26 10 30 8 36H6C4 36 4 34 8 33Z"
        fill={color}
        opacity={0.92}
      />
      {/* Windows */}
      <Path d="M40 16L28 25H48V16H40Z" fill="#FFFFFF" opacity={0.65} />
      <Path d="M51 16V25H72L63 16H51Z" fill="#FFFFFF" opacity={0.65} />
      {/* Wheels */}
      <Circle cx="22" cy="36" r="7" fill="#0C1829" stroke="#E2E8F0" strokeWidth="2" />
      <Circle cx="68" cy="36" r="7" fill="#0C1829" stroke="#E2E8F0" strokeWidth="2" />
    </Svg>
  );
}

// 6. Rugged 4x4 / Jeep (Mahindra Thar, Jimny, Gypsy, Gurkha)
export function JeepIllustration({ size = 80, color = '#7C3AED' }: CarIllustrationProps) {
  const w = size;
  const h = size * 0.52;
  return (
    <Svg width={w} height={h} viewBox="0 0 100 52" fill="none">
      {/* Tailgate Mounted Full Spare Wheel (Signature Thar / 4x4 Look) */}
      <Circle cx="8" cy="27" r="7.5" fill="#0C1829" stroke="#94A3B8" strokeWidth="2.5" />
      <Circle cx="8" cy="27" r="2.5" fill="#E2E8F0" />
      {/* Upright Boxy Jeep Silhouette */}
      <Path
        d="M13 38V15H64L82 28H94C97 28 98 31 98 35C98 38 96 39 92 39H84C82 32 75 27 67 27C59 27 52 32 50 39H38C36 32 29 27 21 27C14 27 13 31 13 38Z"
        fill={color}
        opacity={0.92}
      />
      {/* Upright Windows */}
      <Path d="M20 18H42V26H20V18Z" fill="#FFFFFF" opacity={0.65} />
      <Path d="M45 18H62L73 26H45V18Z" fill="#FFFFFF" opacity={0.65} />
      {/* Flared Heavy-Duty Rims */}
      <Circle cx="21" cy="39" r="8.5" fill="#0C1829" stroke="#E2E8F0" strokeWidth="2.5" />
      <Circle cx="67" cy="39" r="8.5" fill="#0C1829" stroke="#E2E8F0" strokeWidth="2.5" />
    </Svg>
  );
}

// 7. Multi-Utility Van / MUV (Toyota Innova, Maruti Ertiga, Carens)
export function MuvIllustration({ size = 80, color = '#0D9488' }: CarIllustrationProps) {
  const w = size;
  const h = size * 0.48;
  return (
    <Svg width={w} height={h} viewBox="0 0 100 48" fill="none">
      {/* Long MPV/MUV Aerodynamic Aerovane Body */}
      <Path
        d="M6 35C6 31 10 27 18 27H26L38 12H84L94 27H98C99 27 100 30 100 34C100 37 98 38 94 38H84C82 31 76 26 69 26C62 26 56 31 54 38H38C36 31 30 26 23 26C16 26 10 31 8 38H5C3 38 3 36 6 35Z"
        fill={color}
        opacity={0.92}
      />
      {/* Extended Glasshouse with 3-Row Windows */}
      <Path d="M40 14L28 25H48V14H40Z" fill="#FFFFFF" opacity={0.65} />
      <Path d="M51 14V25H68V14H51Z" fill="#FFFFFF" opacity={0.65} />
      <Path d="M71 14V25H84L81 14H71Z" fill="#FFFFFF" opacity={0.65} />
      {/* Wheels */}
      <Circle cx="23" cy="38" r="7.5" fill="#0C1829" stroke="#E2E8F0" strokeWidth="2" />
      <Circle cx="69" cy="38" r="7.5" fill="#0C1829" stroke="#E2E8F0" strokeWidth="2" />
    </Svg>
  );
}

// Backward compatibility alias
export const FourByFourIllustration = JeepIllustration;

/**
 * Master Render Component:
 * Auto-detects whether the car is Sedan, Mini SUV, Full SUV, Hatchback, Jeep, or MUV
 * Checks memory, local dictionary, and queries live internet if needed
 */
export function DynamicCarIllustration({
  modelName = '',
  bodyType: forcedBodyType,
  size = 75,
  color,
  showBadge = false,
}: {
  modelName?: string;
  bodyType?: string;
  size?: number;
  color?: string;
  showBadge?: boolean;
}) {
  const [detectedType, setDetectedType] = useState<CarBodyType>(() => {
    if (forcedBodyType) {
      const fb = forcedBodyType.toLowerCase();
      if (fb.includes('jeep') || fb.includes('4x4')) return 'jeep';
      if (fb.includes('mini') || fb.includes('crossover')) return 'mini_suv';
      if (fb.includes('suv')) return 'suv';
      if (fb.includes('hatch')) return 'hatchback';
      if (fb.includes('muv') || fb.includes('mpv')) return 'muv';
      return 'sedan';
    }
    return classifyCarSync(modelName);
  });

  // Query live internet / cache asynchronously if modelName changes
  useEffect(() => {
    if (!modelName || forcedBodyType) return;
    let isCancelled = false;

    classifyCarLive(modelName).then((result) => {
      if (!isCancelled) {
        setDetectedType(result.bodyType);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [modelName, forcedBodyType]);

  const renderIllustration = () => {
    switch (detectedType) {
      case 'jeep':
        return <JeepIllustration size={size} color={color || '#7C3AED'} />;
      case 'muv':
        return <MuvIllustration size={size} color={color || '#0D9488'} />;
      case 'mini_suv':
        return <MiniSuvIllustration size={size} color={color || '#F59E0B'} />;
      case 'suv':
        return <SuvIllustration size={size} color={color || '#EA580C'} />;
      case 'hatchback':
        return <HatchbackIllustration size={size} color={color || '#DC2626'} />;
      case 'sedan':
      default:
        return <SedanIllustration size={size} color={color || '#2563EB'} />;
    }
  };

  if (!showBadge) {
    return renderIllustration();
  }

  const badgeText = BODY_TYPE_SHORT_BADGES[detectedType] || 'SEDAN';

  return (
    <View style={{ alignItems: 'center' }}>
      {renderIllustration()}
      <View
        style={{
          marginTop: 2,
          paddingHorizontal: 6,
          paddingVertical: 1.5,
          borderRadius: 6,
          backgroundColor: 'rgba(100, 116, 139, 0.15)',
        }}
      >
        <Text style={{ fontSize: 9, fontWeight: '800', color: '#64748B', letterSpacing: 0.5 }}>
          {badgeText}
        </Text>
      </View>
    </View>
  );
}
