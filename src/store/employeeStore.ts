// ============================================================
// Employee & Salary Store — Cool Car Staff Management
// Plain, Simple English Terms: Documents, Joining & Leaving Dates
// ============================================================

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Employee, SalaryPayment } from '../types/employee.types';

const DEFAULT_EMPLOYEES: Employee[] = [];

const DEFAULT_PAYMENTS: SalaryPayment[] = [];

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
