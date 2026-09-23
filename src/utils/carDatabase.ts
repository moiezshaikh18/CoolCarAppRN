// ============================================================
// Car Database & Ultra-Lightweight Illustrations (<2 KB)
// Cool Car Workshop — Dedicated Model & Dynamic Year Matcher
// Distinct silhouettes & specifications per car model
// Dynamic Year list from current year down to 1950
// ============================================================

export interface CarModelInfo {
  id: string;
  make: string;
  model: string;
  bodyType: 'SEDAN' | 'SUV' | 'MINI_SUV' | 'HATCHBACK' | 'MUV' | '4X4';
  defaultAcGas: string; // e.g. R134a (450g)
  colorTheme: string;
  svgIconType: string;
}

// Dynamic years from current year down to 1950 (never hardcoded)
const CURRENT_YEAR = new Date().getFullYear();
export const YEARS_LIST: number[] = Array.from(
  { length: CURRENT_YEAR - 1950 + 1 },
  (_, i) => CURRENT_YEAR - i
);

export const POPULAR_CAR_MODELS: CarModelInfo[] = [
  {
    id: 'honda-city',
    make: 'Honda',
    model: 'City ZX / V',
    bodyType: 'SEDAN',
    defaultAcGas: 'R134a (450g)',
    colorTheme: '#0284C7',
    svgIconType: 'sedan-honda',
  },
  {
    id: 'hyundai-creta',
    make: 'Hyundai',
    model: 'Creta SX / EX',
    bodyType: 'MINI_SUV',
    defaultAcGas: 'R134a (500g)',
    colorTheme: '#2563EB',
    svgIconType: 'suv-creta',
  },
  {
    id: 'maruti-brezza',
    make: 'Maruti',
    model: 'Brezza ZDi / ZXi',
    bodyType: 'MINI_SUV',
    defaultAcGas: 'R134a (450g)',
    colorTheme: '#F59E0B',
    svgIconType: 'suv-brezza',
  },
  {
    id: 'maruti-swift',
    make: 'Maruti',
    model: 'Swift VXi / ZXi',
    bodyType: 'HATCHBACK',
    defaultAcGas: 'R134a (400g)',
    colorTheme: '#EF4444',
    svgIconType: 'hatch-swift',
  },
  {
    id: 'mahindra-thar',
    make: 'Mahindra',
    model: 'Thar 4x4 / Roxx',
    bodyType: '4X4',
    defaultAcGas: 'R134a (550g)',
    colorTheme: '#8B5CF6',
    svgIconType: '4x4-thar',
  },
  {
    id: 'toyota-innova',
    make: 'Toyota',
    model: 'Innova Crysta / Hycross',
    bodyType: 'MUV',
    defaultAcGas: 'R134a (650g)',
    colorTheme: '#0D9488',
    svgIconType: 'muv-innova',
  },
  {
    id: 'mahindra-scorpio',
    make: 'Mahindra',
    model: 'Scorpio-N / Classic',
    bodyType: 'SUV',
    defaultAcGas: 'R134a (600g)',
    colorTheme: '#D97706',
    svgIconType: 'suv-scorpio',
  },
  {
    id: 'toyota-fortuner',
    make: 'Toyota',
    model: 'Fortuner 4x4 / Legender',
    bodyType: 'SUV',
    defaultAcGas: 'R134a (700g)',
    colorTheme: '#4B5563',
    svgIconType: 'suv-fortuner',
  },
  {
    id: 'maruti-baleno',
    make: 'Maruti',
    model: 'Baleno Alpha / Zeta',
    bodyType: 'HATCHBACK',
    defaultAcGas: 'R134a (400g)',
    colorTheme: '#3B82F6',
    svgIconType: 'hatch-baleno',
  },
  {
    id: 'hyundai-i20',
    make: 'Hyundai',
    model: 'i20 Asta / Sportz',
    bodyType: 'HATCHBACK',
    defaultAcGas: 'R134a (420g)',
    colorTheme: '#EC4899',
    svgIconType: 'hatch-i20',
  },
  {
    id: 'tata-nexon',
    make: 'Tata',
    model: 'Nexon Fearless / Creative',
    bodyType: 'MINI_SUV',
    defaultAcGas: 'R134a (480g)',
    colorTheme: '#6366F1',
    svgIconType: 'suv-nexon',
  },
];

export function findCarModel(name: string): CarModelInfo | undefined {
  const q = name.toLowerCase().trim();
  return POPULAR_CAR_MODELS.find(
    (c) =>
      c.model.toLowerCase().includes(q) ||
      c.make.toLowerCase().includes(q) ||
      q.includes(c.model.toLowerCase().split(' ')[0])
  );
}
