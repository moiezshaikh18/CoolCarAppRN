// ============================================================
// Employee & Salary Store — Cool Car Staff Management
// Plain, Simple English Terms: Documents, Joining & Leaving Dates
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Employee, SalaryPayment } from '../types/employee.types';

const DEFAULT_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    enterpriseId: 'enterprise-cool-car',
    name: 'Irfan Khan',
    phone: '+91 98200 11223',
    role: 'Head AC Mechanic',
    salaryType: 'MONTHLY',
    salaryAmount: 24000,
    joiningDate: '2023-04-10',
    status: 'ACTIVE',
    officialDocType: 'AADHAAR',
    officialDocNumber: '4821 9081 2341',
    currentAdvance: 3000,
    totalPaidSalary: 144000,
    isActive: true,
    notes: 'Expert in AC compressor & cooling coil overhaul',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'emp-002',
    enterpriseId: 'enterprise-cool-car',
    name: 'Suresh Patil',
    phone: '+91 98333 44556',
    role: 'AC Helper',
    salaryType: 'MONTHLY',
    salaryAmount: 14000,
    joiningDate: '2024-01-15',
    status: 'ACTIVE',
    officialDocType: 'AADHAAR',
    officialDocNumber: '8910 2345 6712',
    currentAdvance: 1500,
    totalPaidSalary: 56000,
    isActive: true,
    notes: 'Handles bumper opening, gas refilling & condenser wash',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'emp-003',
    enterpriseId: 'enterprise-cool-car',
    name: 'Imran Sheikh',
    phone: '+91 98111 77889',
    role: 'Car Electrician',
    salaryType: 'MONTHLY',
    salaryAmount: 20000,
    joiningDate: '2023-08-01',
    status: 'ACTIVE',
    officialDocType: 'PAN',
    officialDocNumber: 'ABCPS8912K',
    currentAdvance: 0,
    totalPaidSalary: 120000,
    isActive: true,
    notes: 'Blower wiring, AC relays & thermostat sensor specialist',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const DEFAULT_PAYMENTS: SalaryPayment[] = [
  {
    id: 'sp-001',
    enterpriseId: 'enterprise-cool-car',
    employeeId: 'emp-001',
    employeeName: 'Irfan Khan',
    type: 'SALARY',
    amount: 24000,
    date: '2026-09-05',
    paymentMode: 'UPI',
    bankAccountId: 'bank-hdfc',
    bankAccountName: 'HDFC Current A/c (Primary)',
    forMonth: 'August 2026',
    notes: 'Full monthly salary transferred via UPI',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sp-002',
    enterpriseId: 'enterprise-cool-car',
    employeeId: 'emp-001',
    employeeName: 'Irfan Khan',
    type: 'ADVANCE',
    amount: 3000,
    date: '2026-09-18',
    paymentMode: 'CASH',
    bankAccountId: 'bank-cash',
    bankAccountName: 'Cash Counter / In Hand',
    notes: 'Family medical advance',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'sp-003',
    enterpriseId: 'enterprise-cool-car',
    employeeId: 'emp-002',
    employeeName: 'Suresh Patil',
    type: 'ADVANCE',
    amount: 1500,
    date: '2026-09-12',
    paymentMode: 'CASH',
    bankAccountId: 'bank-cash',
    bankAccountName: 'Cash Counter / In Hand',
    notes: 'Travel emergency advance',
    createdAt: new Date().toISOString(),
  },
];

interface EmployeeStore {
  employees: Employee[];
  salaryPayments: SalaryPayment[];
  isLoading: boolean;
  error: string | null;

  setEmployees: (employees: Employee[]) => void;
  setSalaryPayments: (payments: SalaryPayment[]) => void;
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, updates: Partial<Employee>) => void;
  markEmployeeAsLeft: (id: string, leavingDate: string) => void;
  deleteEmployee: (id: string) => void;
  recordSalaryPayment: (payment: SalaryPayment) => void;
  getEmployeeById: (id: string) => Employee | undefined;
  getPaymentsByEmployeeId: (employeeId: string) => SalaryPayment[];
}

export const useEmployeeStore = create<EmployeeStore>()(
  persist(
    (set, get) => ({
      employees: DEFAULT_EMPLOYEES,
      salaryPayments: DEFAULT_PAYMENTS,
      isLoading: false,
      error: null,

      setEmployees: (employees) => set({ employees }),
      setSalaryPayments: (salaryPayments) => set({ salaryPayments }),

      addEmployee: (employee) =>
        set((state) => ({ employees: [employee, ...state.employees] })),

      updateEmployee: (id, updates) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id ? { ...emp, ...updates, updatedAt: new Date().toISOString() } : emp
          ),
        })),

      markEmployeeAsLeft: (id, leavingDate) =>
        set((state) => ({
          employees: state.employees.map((emp) =>
            emp.id === id
              ? {
                  ...emp,
                  status: 'LEFT',
                  isActive: false,
                  leavingDate: leavingDate || new Date().toISOString().split('T')[0],
                  updatedAt: new Date().toISOString(),
                }
              : emp
          ),
        })),

      deleteEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        })),

      recordSalaryPayment: (payment) =>
        set((state) => {
          const updatedPayments = [payment, ...state.salaryPayments];
          const updatedEmployees = state.employees.map((emp) => {
            if (emp.id !== payment.employeeId) return emp;
            if (payment.type === 'ADVANCE') {
              return {
                ...emp,
                currentAdvance: (emp.currentAdvance || 0) + payment.amount,
                updatedAt: new Date().toISOString(),
              };
            } else {
              // Salary payment
              return {
                ...emp,
                totalPaidSalary: (emp.totalPaidSalary || 0) + payment.amount,
                updatedAt: new Date().toISOString(),
              };
            }
          });

          return {
            salaryPayments: updatedPayments,
            employees: updatedEmployees,
          };
        }),

      getEmployeeById: (id) => get().employees.find((e) => e.id === id),

      getPaymentsByEmployeeId: (employeeId) =>
        get().salaryPayments.filter((p) => p.employeeId === employeeId),
    }),
    {
      name: 'cool-car-employee-store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        employees: state.employees,
        salaryPayments: state.salaryPayments,
      }),
    }
  )
);
