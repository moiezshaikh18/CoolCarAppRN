// ============================================================
// Car Classifier Service — Cool Car Workshop
// Checks the internet (Wikipedia Commons & automotive data) live
// to accurately detect car body type:
// sedan, mini_suv, suv, hatchback, jeep (4x4), muv
// With offline cache & instant pattern matcher
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';

export type CarBodyType = 'sedan' | 'mini_suv' | 'suv' | 'hatchback' | 'jeep' | 'muv';

export interface CarClassificationResult {
  bodyType: CarBodyType;
  label: string;
  source: 'cache' | 'local_pattern' | 'live_internet';
  description?: string;
}

const STORAGE_KEY = '@coolcar_car_body_types_v1';

// In-memory cache for 0ms lookups during user session
const memoryCache = new Map<string, CarBodyType>();

// Pre-seeded local catalog for India's most popular workshop vehicles (instant 0ms response)
const LOCAL_CATALOG: Record<string, CarBodyType> = {
  // Sedans
  'city': 'sedan',
  'honda city': 'sedan',
  'dzire': 'sedan',
  'swift dzire': 'sedan',
  'verna': 'sedan',
  'ciaz': 'sedan',
  'amaze': 'sedan',
  'aura': 'sedan',
  'tigor': 'sedan',
  'slavia': 'sedan',
  'virtus': 'sedan',
  'accent': 'sedan',
  'civic': 'sedan',
  'corolla': 'sedan',
  'octavia': 'sedan',
  'superb': 'sedan',
  'etios': 'sedan',

  // Mini SUVs / Compact Crossovers
  'creta': 'mini_suv',
  'seltos': 'mini_suv',
  'brezza': 'mini_suv',
  'vitara brezza': 'mini_suv',
  'nexon': 'mini_suv',
  'venue': 'mini_suv',
  'punch': 'mini_suv',
  'sonet': 'mini_suv',
  'fronx': 'mini_suv',
  'kiger': 'mini_suv',
  'magnite': 'mini_suv',
  'ecosport': 'mini_suv',
  'kuv100': 'mini_suv',
  'exter': 'mini_suv',
  'grand vitara': 'mini_suv',
  'hyryder': 'mini_suv',
  'urban cruiser': 'mini_suv',
  'taigun': 'mini_suv',
  'kushaq': 'mini_suv',

  // Full-size SUVs
  'fortuner': 'suv',
  'scorpio': 'suv',
  'scorpio n': 'suv',
  'scorpio-n': 'suv',
  'scorpio classic': 'suv',
  'xuv700': 'suv',
  'xuv 700': 'suv',
  'xuv500': 'suv',
  'safari': 'suv',
  'tata safari': 'suv',
  'harrier': 'suv',
  'hector': 'suv',
  'gloster': 'suv',
  'endeavour': 'suv',
  'pajero': 'suv',

  // Jeep / Boxy 4x4 Offroaders
  'thar': 'jeep',
  'mahindra thar': 'jeep',
  'thar roxx': 'jeep',
  'jimny': 'jeep',
  'gypsy': 'jeep',
  'maruti gypsy': 'jeep',
  'gurkha': 'jeep',
  'force gurkha': 'jeep',
  'compass': 'jeep',
  'jeep compass': 'jeep',
  'wrangler': 'jeep',
  'rubicon': 'jeep',
  'bolero': 'jeep',
  'bolero neo': 'jeep',

  // Hatchbacks
  'swift': 'hatchback',
  'maruti swift': 'hatchback',
  'baleno': 'hatchback',
  'i20': 'hatchback',
  'hyundai i20': 'hatchback',
  'i10': 'hatchback',
  'grand i10': 'hatchback',
  'wagon r': 'hatchback',
  'wagonr': 'hatchback',
  'tiago': 'hatchback',
  'altroz': 'hatchback',
  'alto': 'hatchback',
  'alto 800': 'hatchback',
  'alto k10': 'hatchback',
  'celerio': 'hatchback',
  'kwid': 'hatchback',
  'ignis': 'hatchback',
  'polo': 'hatchback',
  'santro': 'hatchback',
  's-presso': 'hatchback',
  'spresso': 'hatchback',
  'brio': 'hatchback',
  'glanza': 'hatchback',
  'micra': 'hatchback',
  'figo': 'hatchback',

  // MUVs / MPVs
  'innova': 'muv',
  'innova crysta': 'muv',
  'innova hycross': 'muv',
  'ertiga': 'muv',
  'maruti ertiga': 'muv',
  'xl6': 'muv',
  'carens': 'muv',
  'kia carens': 'muv',
  'triber': 'muv',
  'eeco': 'muv',
  'omni': 'muv',
  'marazzo': 'muv',
  'lodgy': 'muv',
  'tavera': 'muv',
  'xylo': 'muv',
};

export const BODY_TYPE_LABELS: Record<CarBodyType, string> = {
  sedan: 'Executive Sedan',
  mini_suv: 'Compact Crossover / Mini SUV',
  suv: 'Full-Size SUV',
  hatchback: 'Hatchback',
  jeep: 'Rugged 4x4 / Jeep',
  muv: 'Multi-Utility Van (MUV)',
};

export const BODY_TYPE_SHORT_BADGES: Record<CarBodyType, string> = {
  sedan: 'SEDAN',
  mini_suv: 'MINI SUV',
  suv: 'SUV',
  hatchback: 'HATCHBACK',
  jeep: '4x4 JEEP',
  muv: 'MUV',
};

// Normalize search strings
function normalizeModelName(name: string): string {
  return name.trim().toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, ' ');
}

// Live query to Wikipedia/Internet to classify unknown vehicles
async function queryInternetForBodyType(rawModel: string): Promise<CarBodyType | null> {
  try {
    const clean = rawModel.trim();
    if (!clean || clean.length < 2) return null;

    const endpoint = `https://en.wikipedia.org/w/api.php?action=query&format=json&generator=search&gsrsearch=${encodeURIComponent(
      clean + ' car automobile'
    )}&gsrlimit=1&prop=extracts&exintro=1&explaintext=1&origin=*`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(endpoint, {
      signal: controller.signal,
      headers: {
        'User-Agent': 'CoolCarGarageApp/1.0 (Pune, India; contact: workshop@coolcar.in)',
      },
    });
    clearTimeout(timeoutId);

    if (!res.ok) return null;

    const data = await res.json();
    const pages = data.query?.pages;
    if (!pages) return null;

    const page = Object.values(pages)[0] as any;
    const text = (page?.extract || page?.title || '').toLowerCase();

    // Check internet extract for automotive taxonomy
    if (text.includes('jeep') || text.includes('off-road') || text.includes('four-wheel drive') || text.includes('4x4') || text.includes('4wd')) {
      return 'jeep';
    }
    if (text.includes('mpv') || text.includes('multi-purpose') || text.includes('minivan') || text.includes('van') || text.includes('muv')) {
      return 'muv';
    }
    if (text.includes('subcompact crossover') || text.includes('compact crossover') || text.includes('mini suv') || text.includes('subcompact suv')) {
      return 'mini_suv';
    }
    if (text.includes('sport utility') || text.includes('mid-size suv') || text.includes('full-size suv') || text.includes('suv')) {
      return 'suv';
    }
    if (text.includes('sedan') || text.includes('saloon') || text.includes('notchback') || text.includes('three-box')) {
      return 'sedan';
    }
    if (text.includes('hatchback') || text.includes('city car') || text.includes('supermini') || text.includes('liftback')) {
      return 'hatchback';
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Live Car Classifier
 * Checks memory -> AsyncStorage -> Local Catalog -> Live Internet
 */
export async function classifyCarLive(modelName: string): Promise<CarClassificationResult> {
  const norm = normalizeModelName(modelName);
  if (!norm) {
    return { bodyType: 'sedan', label: BODY_TYPE_LABELS.sedan, source: 'local_pattern' };
  }

  // 1. Check in-memory session cache
  if (memoryCache.has(norm)) {
    const cached = memoryCache.get(norm)!;
    return { bodyType: cached, label: BODY_TYPE_LABELS[cached], source: 'cache' };
  }

  // 2. Direct exact or substring match in Local Catalog
  for (const [key, type] of Object.entries(LOCAL_CATALOG)) {
    if (norm === key || norm.includes(key) || key.includes(norm)) {
      memoryCache.set(norm, type);
      return { bodyType: type, label: BODY_TYPE_LABELS[type], source: 'local_pattern' };
    }
  }

  // 3. Check persistent AsyncStorage
  try {
    const rawStored = await AsyncStorage.getItem(STORAGE_KEY);
    if (rawStored) {
      const parsed = JSON.parse(rawStored);
      if (parsed[norm]) {
        const type = parsed[norm] as CarBodyType;
        memoryCache.set(norm, type);
        return { bodyType: type, label: BODY_TYPE_LABELS[type], source: 'cache' };
      }
    }
  } catch {
    // Ignore storage read error
  }

  // 4. Live Internet check via Wikipedia Automotive Taxonomy
  const internetType = await queryInternetForBodyType(modelName);
  if (internetType) {
    memoryCache.set(norm, internetType);
    // Persist to AsyncStorage for offline speed
    try {
      const rawStored = await AsyncStorage.getItem(STORAGE_KEY);
      const storeObj = rawStored ? JSON.parse(rawStored) : {};
      storeObj[norm] = internetType;
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(storeObj));
    } catch {
      // Ignore
    }
    return {
      bodyType: internetType,
      label: BODY_TYPE_LABELS[internetType],
      source: 'live_internet',
      description: 'Verified live via internet automotive database',
    };
  }

  // 5. Intelligent Fallback: Check common words
  if (norm.includes('suv') || norm.includes('cross')) {
    return { bodyType: 'mini_suv', label: BODY_TYPE_LABELS.mini_suv, source: 'local_pattern' };
  }
  if (norm.includes('4x4') || norm.includes('jeep')) {
    return { bodyType: 'jeep', label: BODY_TYPE_LABELS.jeep, source: 'local_pattern' };
  }

  // Default to Hatchback for compact or Sedan
  const fallback: CarBodyType = norm.length <= 5 ? 'hatchback' : 'sedan';
  memoryCache.set(norm, fallback);
  return { bodyType: fallback, label: BODY_TYPE_LABELS[fallback], source: 'local_pattern' };
}

/**
 * Synchronous instant classifier for rapid keystroke UI rendering
 */
export function classifyCarSync(modelName: string): CarBodyType {
  const norm = normalizeModelName(modelName);
  if (!norm) return 'sedan';

  if (memoryCache.has(norm)) {
    return memoryCache.get(norm)!;
  }

  for (const [key, type] of Object.entries(LOCAL_CATALOG)) {
    if (norm === key || norm.includes(key) || key.includes(norm)) {
      return type;
    }
  }

  if (norm.includes('4x4') || norm.includes('jeep') || norm.includes('thar')) return 'jeep';
  if (norm.includes('innova') || norm.includes('ertiga') || norm.includes('carens') || norm.includes('van')) return 'muv';
  if (norm.includes('creta') || norm.includes('seltos') || norm.includes('brezza') || norm.includes('nexon')) return 'mini_suv';
  if (norm.includes('fortuner') || norm.includes('scorpio') || norm.includes('xuv')) return 'suv';
  if (norm.includes('swift') || norm.includes('i20') || norm.includes('baleno') || norm.includes('wagon')) return 'hatchback';
  if (norm.includes('city') || norm.includes('dzire') || norm.includes('verna') || norm.includes('ciaz')) return 'sedan';

  return norm.length <= 5 ? 'hatchback' : 'sedan';
}
