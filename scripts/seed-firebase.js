// ============================================================
// Firebase Firestore Database Seeder for Cool Car Garage
// ============================================================

const { initializeApp } = require('firebase/app');
const { getFirestore, doc, setDoc } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'AIzaSyDj72_G2r6uX5tcWC5wWL9UHpy_dpdbYZU',
  authDomain: 'cool-car-garage.firebaseapp.com',
  projectId: 'cool-car-garage',
  storageBucket: 'cool-car-garage.firebasestorage.app',
  messagingSenderId: '1091102193251',
  appId: '1:1091102193251:android:b0fc6d92f3da856badaa56',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const ENTERPRISE_ID = 'enterprise-dev-001';
const USER_ID = 'user-owner-001';

async function seedDatabase() {
  console.log('🚀 Seeding test data to Firebase Firestore (Project: cool-car-garage)...');

  try {
    // 1. User Profile
    console.log('👤 Writing User Profile...');
    await setDoc(doc(db, 'users', USER_ID), {
      uid: USER_ID,
      displayName: 'Manish Kumar',
      phone: '+919876543210',
      email: 'owner@coolcargarage.com',
      enterpriseIds: [ENTERPRISE_ID],
      activeEnterpriseId: ENTERPRISE_ID,
      role: 'OWNER',
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 2. Enterprise Document
    console.log('🏢 Writing Enterprise Document...');
    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID), {
      id: ENTERPRISE_ID,
      name: 'Cool Car Garage',
      slug: 'cool-car-garage',
      ownerId: USER_ID,
      phone: '+919876543210',
      email: 'support@coolcargarage.com',
      address: 'Shop 4, Workshop Lane, Andheri West, Mumbai - 400053',
      currency: 'INR',
      currencySymbol: '₹',
      timezone: 'Asia/Kolkata',
      dateFormat: 'dd/MM/yyyy',
      branding: {
        primaryColor: '#6C4CF1',
        secondaryColor: '#4F8CFF',
        accentColor: '#00C896',
        tagline: 'Best Car Repair & Maintenance',
      },
      settings: {
        currency: 'INR',
        currencySymbol: '₹',
        timezone: 'Asia/Kolkata',
        dateFormat: 'dd/MM/yyyy',
        jobNumberPrefix: 'CCG',
        jobNumberPadding: 4,
        lowStockWarning: true,
        autoReminders: true,
        defaultPaymentMode: 'CASH',
      },
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 3. Bank Accounts
    console.log('💳 Writing Bank Accounts...');
    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID, 'bankAccounts', 'bank-hdfc-01'), {
      id: 'bank-hdfc-01',
      accountName: 'HDFC Current A/c',
      accountNumber: 'XXXX-XXXX-8921',
      bankName: 'HDFC Bank',
      branch: 'Andheri West',
      ifscCode: 'HDFC0001234',
      upiId: 'coolcargarage@hdfcbank',
      currentBalance: 145000,
      isActive: true,
      isDefault: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID, 'bankAccounts', 'bank-cash-01'), {
      id: 'bank-cash-01',
      accountName: 'Cash in Hand (Counter)',
      accountNumber: 'CASH-COUNTER',
      bankName: 'Cash',
      branch: 'Workshop Counter',
      currentBalance: 24500,
      isActive: true,
      isDefault: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 4. Customers
    console.log('👥 Writing Customers...');
    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID, 'customers', 'cust-001'), {
      id: 'cust-001',
      name: 'Rajesh Sharma',
      phone: '+919820112345',
      email: 'rajesh.sharma@gmail.com',
      address: 'Flat 402, Sea Breeze, Bandra, Mumbai',
      totalVisits: 4,
      totalSpent: 38400,
      pendingAmount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID, 'customers', 'cust-002'), {
      id: 'cust-002',
      name: 'Amit Patel',
      phone: '+919811154321',
      email: 'amit.patel@outlook.com',
      address: '12, Sunrise Tower, Juhu, Mumbai',
      totalVisits: 2,
      totalSpent: 18200,
      pendingAmount: 2500,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID, 'customers', 'cust-003'), {
      id: 'cust-003',
      name: 'Priya Verma',
      phone: '+919765432109',
      email: 'priya.v@gmail.com',
      address: 'B-104, Green Acres, Powai, Mumbai',
      totalVisits: 1,
      totalSpent: 6500,
      pendingAmount: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 5. Vehicles
    console.log('🚗 Writing Vehicles...');
    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID, 'vehicles', 'veh-001'), {
      id: 'veh-001',
      customerId: 'cust-001',
      customerName: 'Rajesh Sharma',
      customerPhone: '+919820112345',
      regNumber: 'MH02AB1234',
      make: 'Honda',
      model: 'City',
      year: 2021,
      fuelType: 'PETROL',
      transmission: 'AUTOMATIC',
      color: 'Pearl White',
      odometerKm: 34500,
      totalJobs: 3,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID, 'vehicles', 'veh-002'), {
      id: 'veh-002',
      customerId: 'cust-002',
      customerName: 'Amit Patel',
      customerPhone: '+919811154321',
      regNumber: 'MH01CD5678',
      make: 'Hyundai',
      model: 'Creta',
      year: 2022,
      fuelType: 'DIESEL',
      transmission: 'MANUAL',
      color: 'Phantom Black',
      odometerKm: 28000,
      totalJobs: 2,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID, 'vehicles', 'veh-003'), {
      id: 'veh-003',
      customerId: 'cust-003',
      customerName: 'Priya Verma',
      customerPhone: '+919765432109',
      regNumber: 'MH03EF9012',
      make: 'Maruti Suzuki',
      model: 'Swift',
      year: 2020,
      fuelType: 'PETROL',
      transmission: 'MANUAL',
      color: 'Solid Fire Red',
      odometerKm: 42100,
      totalJobs: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 6. Job Sheets
    console.log('📋 Writing Job Sheets...');
    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID, 'jobSheets', 'JS-2026-001'), {
      id: 'JS-2026-001',
      jobNumber: 'CCG-0001',
      customerId: 'cust-001',
      customerName: 'Rajesh Sharma',
      customerPhone: '+919820112345',
      vehicleId: 'veh-001',
      vehicleRegNumber: 'MH02AB1234',
      vehicleMakeModel: 'Honda City',
      status: 'COMPLETED',
      date: new Date().toISOString(),
      estimatedAmount: 8500,
      finalAmount: 8500,
      paidAmount: 8500,
      paymentMode: 'CASH',
      odometerKm: 34500,
      complaints: ['Brake noise while stopping', 'Periodic 30,000 km general service'],
      items: [
        { id: 'item-1', name: 'Front Brake Pads Set', type: 'PART', quantity: 1, unitPrice: 2800, total: 2800 },
        { id: 'item-2', name: 'Engine Oil Synth 4L', type: 'PART', quantity: 1, unitPrice: 3200, total: 3200 },
        { id: 'item-3', name: 'Oil Filter Replacement', type: 'PART', quantity: 1, unitPrice: 450, total: 450 },
        { id: 'item-4', name: 'Full General Inspection & Labor', type: 'LABOR', quantity: 1, unitPrice: 2050, total: 2050 },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID, 'jobSheets', 'JS-2026-002'), {
      id: 'JS-2026-002',
      jobNumber: 'CCG-0002',
      customerId: 'cust-002',
      customerName: 'Amit Patel',
      customerPhone: '+919811154321',
      vehicleId: 'veh-002',
      vehicleRegNumber: 'MH01CD5678',
      vehicleMakeModel: 'Hyundai Creta',
      status: 'IN_PROGRESS',
      date: new Date().toISOString(),
      estimatedAmount: 5500,
      finalAmount: 4200,
      paidAmount: 1700,
      paymentMode: 'UPI',
      odometerKm: 28000,
      complaints: ['AC cooling weak', 'Cabin filter dirty'],
      items: [
        { id: 'item-5', name: 'AC Gas R134a Top-up', type: 'PART', quantity: 1, unitPrice: 1800, total: 1800 },
        { id: 'item-6', name: 'Cabin AC Filter OEM', type: 'PART', quantity: 1, unitPrice: 900, total: 900 },
        { id: 'item-7', name: 'AC Coil Cleaning Labor', type: 'LABOR', quantity: 1, unitPrice: 1500, total: 1500 },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 7. Expenses
    console.log('💸 Writing Expenses...');
    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID, 'expenses', 'exp-001'), {
      id: 'exp-001',
      title: 'Mobil 1 Engine Oil 5W-30 (Case of 4 cans)',
      category: 'Spare Parts & Lubricants',
      amount: 4500,
      paymentMode: 'BANK_ACCOUNT',
      bankAccountId: 'bank-hdfc-01',
      bankAccountName: 'HDFC Current A/c',
      date: new Date().toISOString(),
      vendorName: 'Shell Lubricants Distributor',
      notes: 'Monthly bulk engine oil stock replenishment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID, 'expenses', 'exp-002'), {
      id: 'exp-002',
      title: 'Workshop Electricity Bill - Sept',
      category: 'Utilities',
      amount: 3200,
      paymentMode: 'BANK_ACCOUNT',
      bankAccountId: 'bank-hdfc-01',
      bankAccountName: 'HDFC Current A/c',
      date: new Date().toISOString(),
      vendorName: 'Adani Electricity Mumbai',
      notes: 'Workshop 3-phase meter electricity payment',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID, 'expenses', 'exp-003'), {
      id: 'exp-003',
      title: 'Staff Snacks & Evening Tea',
      category: 'Daily Workshop',
      amount: 450,
      paymentMode: 'CASH',
      bankAccountId: 'bank-cash-01',
      bankAccountName: 'Cash in Hand (Counter)',
      date: new Date().toISOString(),
      vendorName: 'Local Tea Stall',
      notes: 'Daily refreshment for workshop mechanics',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    // 8. Reminders
    console.log('⏰ Writing Reminders...');
    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID, 'reminders', 'rem-001'), {
      id: 'rem-001',
      customerId: 'cust-001',
      customerName: 'Rajesh Sharma',
      customerPhone: '+919820112345',
      vehicleId: 'veh-001',
      vehicleRegNumber: 'MH02AB1234',
      type: 'SERVICE',
      title: 'Periodic 40,000 km Service Due',
      dueDate: new Date(Date.now() + 15 * 86400000).toISOString(),
      status: 'UPCOMING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    await setDoc(doc(db, 'enterprises', ENTERPRISE_ID, 'reminders', 'rem-002'), {
      id: 'rem-002',
      customerId: 'cust-002',
      customerName: 'Amit Patel',
      customerPhone: '+919811154321',
      vehicleId: 'veh-002',
      vehicleRegNumber: 'MH01CD5678',
      type: 'INSURANCE',
      title: 'Car Comprehensive Insurance Renewal',
      dueDate: new Date(Date.now() + 25 * 86400000).toISOString(),
      status: 'UPCOMING',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    console.log('✅ ALL TEST DATA SEEDED SUCCESSFULLY TO FIREBASE FIRESTORE!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding data to Firebase:', error);
    process.exit(1);
  }
}

seedDatabase();

