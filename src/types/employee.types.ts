// ============================================================
// Employee / Staff & Salary Types — Cool Car Workshop
// Plain, Simple English Terms: Documents, Joining & Leaving Dates
// ============================================================

export type SalaryType = 'MONTHLY' | 'DAILY' | 'WEEKLY';

export type PaymentType = 'SALARY' | 'ADVANCE';

export type OfficialDocType = 'AADHAAR' | 'PAN' | 'DRIVING_LICENSE' | 'VOTER_ID' | 'OTHER';

export interface Employee {
  id: string;
  enterpriseId: string;
  name: string;
  phone: string;
  role: string; // e.g. "Head AC Mechanic", "AC Helper", "Mechanical Technician", "Electrician"
  salaryType: SalaryType;
  salaryAmount: number; // e.g. 20000 for monthly or 700 for daily
  joiningDate: string; // e.g. "2024-01-15"
  leavingDate?: string; // e.g. "2026-08-30" if left
  status: 'ACTIVE' | 'LEFT';
  officialDocType: OfficialDocType;
  officialDocNumber: string; // e.g. "1234 5678 9012" or "ABCDE1234F"
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
  date: string; // YYYY-MM-DD
  paymentMode: 'CASH' | 'UPI';
  bankAccountId?: string;
  bankAccountName?: string;
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
  joiningDate: string;
  leavingDate?: string;
  officialDocType: OfficialDocType;
  officialDocNumber: string;
  notes?: string;
}
