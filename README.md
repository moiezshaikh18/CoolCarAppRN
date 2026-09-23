// ============================================================
// README — Garage Expense Tracker
// ============================================================

# 🔧 Garage Expense Tracker

A **production-quality, multi-tenant** Android-first mobile app for automobile garages/workshops.

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Expo (managed) + React Native |
| Language | TypeScript (strict) |
| Navigation | Expo Router v3 |
| Styling | NativeWind v4 (Tailwind) |
| State | Zustand |
| Auth | Firebase Phone OTP |
| Database | Cloud Firestore |
| Storage | Firebase Storage |
| Forms | React Hook Form + Zod |
| Animations | React Native Reanimated |

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Configure Firebase
Copy `.env.example` to `.env` and fill in your Firebase credentials:
```bash
cp .env.example .env
```

### 3. Run (Mock Mode — no Firebase needed)
```bash
# The app starts in mock mode by default (EXPO_PUBLIC_USE_MOCK=true)
npx expo start
```

Press `a` for Android emulator.

### 4. Run on Android device
```bash
npx expo run:android
```

## Mock Mode vs Production Mode

| Setting | Value | Effect |
|---|---|---|
| `EXPO_PUBLIC_USE_MOCK=true` | `.env` | Uses mock data, skips Firebase auth |
| `EXPO_PUBLIC_USE_MOCK=false` | `.env` | Uses real Firebase |

In mock mode:
- Enter any 10-digit phone → tap Send OTP
- Enter any 6-digit code → logs in as Demo User / Super Auto Garage

## Architecture

```
F:\cool_car_garage_app\
├── app/                    # Expo Router screens
│   ├── _layout.tsx         # Root layout (providers)
│   ├── index.tsx           # Auth guard
│   ├── (auth)/             # Login, OTP, Profile, Enterprise Select
│   └── (tabs)/             # Main tab screens
│
├── src/
│   ├── components/common/  # Glass UI components
│   ├── features/           # Feature-specific logic
│   ├── hooks/              # useTheme, useEnterprise, useAuth...
│   ├── services/firebase/  # Auth, Firestore, Storage services
│   ├── store/              # Zustand stores (12 stores)
│   ├── theme/              # Theme engine + presets
│   ├── types/              # All TypeScript types
│   ├── utils/              # Calculations, formatters, permissions
│   ├── constants/          # Routes, Firestore paths, App config
│   └── schemas/            # Zod validation schemas
│
├── firestore.rules         # Firebase Security Rules
├── firestore.indexes.json  # Composite indexes
└── .env.example            # Environment variable template
```

## Multi-Tenant Design

- Every record has `enterpriseId`
- All Firestore paths are scoped: `enterprises/{enterpriseId}/collection/{docId}`
- Security rules validate membership before any data access
- Theme, branding, features are enterprise-driven
- No hardcoded garage names, colors, or logic

## Development Phases

| Phase | Status |
|---|---|
| 1. Foundation + Auth UI | ✅ Complete |
| 2. Firebase Auth + OTP | 🔄 Ready (needs Firebase project) |
| 3. Customers + Vehicles | ⏳ Next |
| 4. Job Sheets | ⏳ Pending |
| 5. Payments + Bank | ⏳ Pending |
| 6. Expenses | ⏳ Pending |
| 7. Inventory | ⏳ Pending |
| 8. Dashboard + Reports | ⏳ Pending |
| 9. Reminders + Export | ⏳ Pending |
| 10. Security + Performance | ⏳ Pending |

## TypeScript Check
```bash
npx tsc --noEmit
```

