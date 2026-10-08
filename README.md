# 🏎️ Cool Car — Garage Workshop OS

[![Expo SDK](https://img.shields.io/badge/Expo_SDK-~57.0.25-blue.svg)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-0.86.3-61DAFB.svg)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178C6.svg)](https://www.typescriptlang.org)
[![Tailwind / NativeWind](https://img.shields.io/badge/Styling-NativeWind_v4-38BDF8.svg)](https://www.nativewind.dev)
[![Cloud Firestore](https://img.shields.io/badge/Database-Cloud_Firestore-FFA611.svg)](https://firebase.google.com/docs/firestore)

A **production-grade, multi-tenant mobile ERP application** built for automobile workshops and car A/C repair centers. Designed specifically for **Cool Car — Car A/C Repairs & Mechanical Auto Workshop (Pune, Maharashtra)**.

---

## 🌟 Core Modules & Features

### 📋 1. Job Cards & Job Sheets
- **Dual Category Intake**: Full support for both **❄️ Car A/C Specialist Repairs** and **🔧 Mechanical Auto Work** (or Both).
- **Physical 18-Point Routine AC Check-Up**:
  - Replicates the physical garage inspection sheet (Actual Pressure, Condenser Fan, Vacuum Leak Testing, Auto Cut-off Temp, Nitrogen Pressure, Oil Charge, Blower Speed, Stickers, etc.).
  - 100% manual entry support with custom readings (e.g. `35 psi`, `4.5 °C`), quick `[ OK ✓ ]` chips, and blank slots for physical pen writing on paper.
- **B&W Official Printout**:
  - Native print spooler integration via `expo-print` for instant printing to WiFi/Bluetooth thermal & desktop printers.
  - Built-in Android / iOS **"Save as PDF"** generation without permission errors.
- **Billed Services & Spare Parts**:
  - Quick catalog presets, 1-tap item chips, quantity, and unit pricing.

---

### 💳 2. Billing, Accounts & Split Payments
- **Flexible Settlement Options**: Cash Counter, Direct UPI (Google Pay, PhonePe, Paytm), and POS Card Swiping.
- **Multi-Bank Account Management**: Associate payments with multiple active garage bank accounts.
- **Split Payments**: Receive split amounts on a single bill (e.g. ₹1,000 Cash + ₹3,000 UPI).
- **Balance & Udhari Tracking**: Automatic balance calculation (`Pending`, `Partially Paid`, `Fully Paid`) with customer ledger tracking.

---

### 📦 3. Inventory & Chalan System
- **Spare Parts Catalog**: Stock tracking for AC gas cans (R134a), cooling coils, condensers, compressors, engine oil, filters, and brake pads.
- **Vendor Chalans**: Log incoming vendor deliveries with items, unit costs, and pending dues.
- **Chalan Dues Settlement**: Single-tap clearance of supplier payments with transaction history.

---

### 🚗 4. Customer & Fleet Management
- **Vehicle Registration Search**: Instant search by car number plate (e.g. `MH12AB1234`).
- **Dynamic Vehicle Illustrations**: Vector vehicle silhouettes customized by make, model, and year.
- **Service History**: View all previous job sheets, repairs, and lifetime spend per vehicle.
- **Customer Directory**: Phone-to-call shortcuts, address records, and outstanding balance summary.

---

### 👥 5. Staff & Payroll Management
- **Team Roster**: Assign jobs to Head Mechanics, AC Technicians, and Managers.
- **Salary & Advances**: Log employee salary advances, calculate pending monthly payouts, and track disbursements.

---

### 📊 6. Expenses & Business Analytics
- **Workshop Expense Log**: Categorized operational expenses (Parts Purchase, Shop Rent, Electricity, Tools, Tea & Snacks).
- **Financial Breakdown**: Real-time revenue vs. expense comparisons and profit margin calculation.

---

### 🎬 7. Modern Animated Mobile UX
- **Animated Splash Screen**:
  - Fluid **React Native Reanimated** spring and breathing float animations.
  - Seamless floating branding logo with ambient background aura.
  - Minimalist animated progress loader bar.
- **Glassmorphism UI**: High-contrast dark and light theme palettes with zero blue bleed and native mobile tactile feedback.

---

## 🛠️ Technology Stack

| Layer | Library / Tool | Description |
|---|---|---|
| **Framework** | Expo SDK 57 (Managed CNG) | Cross-platform runtime |
| **Language** | TypeScript (Strict mode) | Type safety & zero runtime exceptions |
| **Routing** | Expo Router v4 | File-based routing (`app/` directory) |
| **Styling** | NativeWind v4 + Tailwind CSS | Atomic styling optimized for mobile |
| **State** | Zustand v5 | Lightweight modular state stores |
| **Animations** | React Native Reanimated v4 | 60/120 FPS UI-thread animations |
| **Backend** | Firebase Auth + Cloud Firestore | Real-time cloud sync & data storage |
| **Printing / PDF** | `expo-print` + `expo-file-system` | Native printer spooler & PDF generator |
| **Icons** | `lucide-react-native` | Clean vector iconography |

---

## 📁 Project Directory Structure

```
cool-car-garage-app/
├── app/                              # Expo Router Screens & Layouts
│   ├── _layout.tsx                   # Root layout, theme & splash controller
│   ├── index.tsx                     # Auth routing guard
│   ├── (auth)/                       # Authentication & Onboarding
│   │   ├── splash.tsx                # Modern Animated Splash Screen
│   │   ├── welcome.tsx               # Brand Welcome & Overview
│   │   ├── login.tsx                 # Phone & OTP Login
│   │   └── create-profile.tsx        # Enterprise setup
│   ├── (tabs)/                       # Main Tab Navigators
│   │   ├── index.tsx                 # Dashboard & Quick Metrics
│   │   ├── job-sheets.tsx            # Job Cards Tab
│   │   ├── expenses.tsx              # Expense Tracker Tab
│   │   └── reports.tsx               # Analytics & Financials Tab
│   ├── job-sheets/                   # Job Sheet Workflows
│   │   ├── index.tsx                 # Job Cards List (Search & Filter)
│   │   ├── create.tsx                # Intake Form with 18-Point AC Checklist
│   │   └── [id].tsx                  # Job Card Details, Print & Status Manager
│   ├── inventory/                    # Inventory & Supplier Chalans
│   ├── vehicles/                     # Vehicle Fleet Directory
│   ├── customers/                    # Customer Directory & History
│   ├── staff/                        # Staff & Payroll
│   └── settings/                     # Garage Branding & App Settings
│
├── src/
│   ├── components/common/            # Reusable UI (AppHeader, GlassCard, ThemedAlert)
│   ├── constants/                    # Standard Checkpoints, Car Database, Routes
│   │   └── routineCheckup.ts         # 18-Point Standard AC Checkpoints
│   ├── hooks/                        # Custom Hooks (useTheme, useEnterprise, useAuth)
│   ├── services/firebase/            # Firebase SDK setup, Auth & Firestore services
│   ├── store/                        # Zustand stores (jobSheet, chalan, employee, etc.)
│   ├── types/                        # TypeScript Interfaces & Models
│   └── utils/                        # PDF generator, currency formatting, calculations
│
├── assets/                           # Official Logos, Car Badges & Icons
├── app.json                          # Expo configuration & plugins
└── package.json                      # Project dependencies & scripts
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- Node.js (v18 or higher)
- Expo Go app on your Android / iOS device (or Android Studio emulator)

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the project root:
```env
EXPO_PUBLIC_USE_MOCK=false
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
```
*(Set `EXPO_PUBLIC_USE_MOCK=true` to test offline without Firebase connection).*

### 4. Start Development Server
```bash
npx expo start
```
- Press **`a`** to open in Android Emulator.
- Scan the QR code using the **Expo Go** app on your physical device.
- Press **`r`** in the terminal to hot-reload.
- Press **`c`** to clear the Metro bundler cache.

---

## 🔒 Multi-Tenant Firestore Schema

All enterprise data is isolated using strict tenancy paths:
```
enterprises/{enterpriseId}/
  ├── jobSheets/{jobSheetId}      # Job orders, 18-point checks, itemized bill
  ├── customers/{customerId}      # Customer profiles & balances
  ├── vehicles/{vehicleId}        # Registered cars & service logs
  ├── payments/{paymentId}        # Receipts & bank settlements
  ├── chalans/{chalanId}          # Supplier spare part delivery chalans
  ├── inventory/{partId}          # Current stock quantity & costs
  ├── employees/{employeeId}      # Staff roster & attendance
  └── expenses/{expenseId}        # Daily operational garage expenses
```

---

## 🧪 Verification & Code Quality

Always verify code health before committing changes:
```bash
# Typecheck
npx tsc --noEmit

# Linting
npx expo lint

# Dependency Health
npx expo-doctor
```

---

## 📄 License
Private repository. Developed for **Cool Car — Car A/C Repairs & Mechanical Workshop, Pune**. All rights reserved.
