// ============================================================
// Employee / Staff & Salary Types — Cool Car AC Repair
// Plain, Simple English Terms
// ============================================================

export type SalaryType = 'MONTHLY' | 'DAILY' | 'WEEKLY';

export type PaymentType = 'SALARY' | 'ADVANCE';

export interface Employee {
  id: string;
  enterpriseId: string;
  name: string;
  phone: string;
  role: string; // e.g. "AC Mechanic", "Helper", "Electrician", "Supervisor"
  salaryType: SalaryType;
  salaryAmount: number; // e.g. 20000 for monthly or 700 for daily
  joiningDate?: string;
  currentAdvance: number; // total advance taken minus settled
  totalPaidSalary: number; // lifetime salary paid
  isActive: boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SalaryPayment {
  id: string;
  enterpriseId: string;
  employeeId: string;
  employeeName: string;
  type: PaymentType; // 'SALARY' or 'ADVANCE'
  amount: number;
  date: string; // YYYY-MM-DD or DD/MM/YYYY
  paymentMode: 'CASH' | 'UPI';
  bankAccountId?: string;
  forMonth?: string; // e.g. "September 2026"
  notes?: string;
  createdAt: string;
}

export interface EmployeeFormData {
  name: string;
  phone: string;
  role: string;
  salaryType: SalaryType;
  salaryAmount: number;
  joiningDate?: string;
  notes?: string;
}

