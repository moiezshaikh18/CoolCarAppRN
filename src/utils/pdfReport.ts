// ============================================================
// PDF & Export Report Generator — Cool Car Workshop
// Generates Clean Executive PDF / CSV and triggers Native Share
// ============================================================

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';
import { formatCurrency } from './currency';

export interface FinancialReportData {
  enterpriseName?: string;
  fromDate: string;
  toDate: string;
  currencySymbol: string;
  totalBilled: number;
  totalCollected: number;
  totalPendingReceivables: number;
  totalExpenseOutflow: number;
  totalChalanPaid: number;
  totalChalanPending: number;
  netSurplus: number;
  cashCollections: number;
  upiCollections: number;
  swipeCollections: number;
  bankCollections: { bankName: string; amount: number; mode: string }[];
  staffSalaryExpenses: number;
  partsPurchasesAmount: number;
  generalExpenses: number;
  jobsCount: number;
  chalansCount: number;
}

export async function generateAndShareFinancialPdf(data: FinancialReportData) {
  const isAvailable = await Sharing.isAvailableAsync();

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Cool Car Workshop - Financial Report</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      margin: 0;
      padding: 30px;
      color: #0F172A;
      background: #FFFFFF;
    }
    .header {
      border-bottom: 3px solid #153580;
      padding-bottom: 16px;
      margin-bottom: 24px;
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
    }
    .brand-title {
      font-size: 26px;
      font-weight: 900;
      color: #153580;
      letter-spacing: -0.5px;
      margin: 0;
    }
    .brand-subtitle {
      font-size: 13px;
      color: #64748B;
      font-weight: 600;
      margin-top: 4px;
    }
    .report-meta {
      text-align: right;
      font-size: 12px;
      color: #64748B;
    }
    .report-badge {
      display: inline-block;
      background: #153580;
      color: #FFFFFF;
      font-size: 11px;
      font-weight: 800;
      padding: 4px 10px;
      border-radius: 6px;
      margin-bottom: 6px;
    }
    .summary-grid {
      display: flex;
      gap: 14px;
      margin-bottom: 24px;
    }
    .summary-card {
      flex: 1;
      background: #F8FAFC;
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 14px;
    }
    .card-label {
      font-size: 11px;
      font-weight: 700;
      color: #64748B;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .card-val {
      font-size: 20px;
      font-weight: 900;
      margin-top: 6px;
    }
    .green { color: #10B981; }
    .red { color: #EF4444; }
    .blue { color: #153580; }
    
    .section-title {
      font-size: 15px;
      font-weight: 800;
      color: #0F172A;
      margin-top: 24px;
      margin-bottom: 12px;
      border-left: 4px solid #153580;
      padding-left: 8px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 20px;
      font-size: 13px;
    }
    th {
      background: #F1F5F9;
      text-align: left;
      padding: 10px 12px;
      font-weight: 700;
      color: #475569;
      border-bottom: 1px solid #E2E8F0;
    }
    td {
      padding: 10px 12px;
      border-bottom: 1px solid #F1F5F9;
      color: #1E293B;
    }
    .amount-col {
      text-align: right;
      font-weight: 800;
    }
    .footer {
      margin-top: 40px;
      padding-top: 14px;
      border-top: 1px solid #E2E8F0;
      font-size: 11px;
      color: #94A3B8;
      display: flex;
      justify-content: space-between;
    }
  </style>
</head>
<body>
  <div class="header">
    <div>
      <h1 class="brand-title">COOL CAR WORKSHOP</h1>
      <div class="brand-subtitle">Specialized Car AC Repair & Mechanical Diagnostics</div>
      <div style="font-size: 12px; color: #475569; margin-top: 4px;">Phone: 9323326162 / 9821817757 • Cool Car OS</div>
    </div>
    <div class="report-meta">
      <div class="report-badge">FINANCIAL REPORT</div>
      <div><strong>Period:</strong> ${data.fromDate} to ${data.toDate}</div>
      <div><strong>Generated:</strong> ${new Date().toLocaleDateString()}</div>
    </div>
  </div>

  <div class="summary-grid">
    <div class="summary-card">
      <div class="card-label">Total Inflow Collected</div>
      <div class="card-val green">${formatCurrency(data.totalCollected, data.currencySymbol)}</div>
      <div style="font-size: 11px; color: #64748B; margin-top: 4px;">From ${data.jobsCount} Job Sheets</div>
    </div>
    <div class="summary-card">
      <div class="card-label">Total Outflows</div>
      <div class="card-val red">-${formatCurrency(data.totalExpenseOutflow + data.totalChalanPaid, data.currencySymbol)}</div>
      <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Parts & Daily Expenses</div>
    </div>
    <div class="summary-card">
      <div class="card-label">Net Workshop Surplus</div>
      <div class="card-val ${data.netSurplus >= 0 ? 'green' : 'red'}">${data.netSurplus >= 0 ? '+' : ''}${formatCurrency(data.netSurplus, data.currencySymbol)}</div>
      <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Operational Balance</div>
    </div>
    <div class="summary-card">
      <div class="card-label">Pending Customer Due</div>
      <div class="card-val red">${formatCurrency(data.totalPendingReceivables, data.currencySymbol)}</div>
      <div style="font-size: 11px; color: #64748B; margin-top: 4px;">Customer Udhari</div>
    </div>
  </div>

  <div class="section-title">1. Workshop Inflows by Payment Mode & Bank Account</div>
  <table>
    <thead>
      <tr>
        <th>Collection Channel</th>
        <th>Source Account / Method</th>
        <th class="amount-col">Amount Received</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Cash Counter</strong></td>
        <td>Cash Drawer Inflow</td>
        <td class="amount-col green">${formatCurrency(data.cashCollections, data.currencySymbol)}</td>
      </tr>
      <tr>
        <td><strong>UPI Payments</strong></td>
        <td>Direct Bank UPI QR Inflow</td>
        <td class="amount-col green">${formatCurrency(data.upiCollections, data.currencySymbol)}</td>
      </tr>
      <tr>
        <td><strong>Card Swipe / POS</strong></td>
        <td>Card Machine Terminal</td>
        <td class="amount-col green">${formatCurrency(data.swipeCollections, data.currencySymbol)}</td>
      </tr>
      ${data.bankCollections.map((b) => `
        <tr style="background: #FAFAFA;">
          <td style="padding-left: 24px; color: #64748B;">↳ ${b.bankName}</td>
          <td style="color: #64748B;">${b.mode}</td>
          <td class="amount-col" style="color: #153580;">${formatCurrency(b.amount, data.currencySymbol)}</td>
        </tr>
      `).join('')}
      <tr style="background: #F1F5F9; font-weight: 800;">
        <td colspan="2">Total Collections In Period</td>
        <td class="amount-col green">${formatCurrency(data.totalCollected, data.currencySymbol)}</td>
      </tr>
    </tbody>
  </table>

  <div class="section-title">2. Workshop Outflows Breakdown (Parts & Expenses)</div>
  <table>
    <thead>
      <tr>
        <th>Expense Category</th>
        <th>Description</th>
        <th class="amount-col">Amount Spent</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td><strong>Spare Parts Purchases</strong></td>
        <td>Inward Parts Chalans (${data.chalansCount} Chalans)</td>
        <td class="amount-col red">-${formatCurrency(data.partsPurchasesAmount, data.currencySymbol)}</td>
      </tr>
      <tr>
        <td><strong>Staff Salaries & Advances</strong></td>
        <td>Mechanics & Helpers Payroll / Advance</td>
        <td class="amount-col red">-${formatCurrency(data.staffSalaryExpenses, data.currencySymbol)}</td>
      </tr>
      <tr>
        <td><strong>Workshop Operational Expenses</strong></td>
        <td>Rent, Electricity, Tea/Snacks, Consumables, Misc.</td>
        <td class="amount-col red">-${formatCurrency(data.generalExpenses, data.currencySymbol)}</td>
      </tr>
      <tr style="background: #F1F5F9; font-weight: 800;">
        <td colspan="2">Total Outflows In Period</td>
        <td class="amount-col red">-${formatCurrency(data.totalExpenseOutflow + data.totalChalanPaid, data.currencySymbol)}</td>
      </tr>
    </tbody>
  </table>

  <div class="footer">
    <div>Generated by Cool Car Garage OS • Confidential Workshop Statement</div>
    <div>Page 1 of 1</div>
  </div>
</body>
</html>
  `;

  const { uri } = await Print.printToFileAsync({ html });

  if (isAvailable) {
    await Sharing.shareAsync(uri, {
      UTI: '.pdf',
      mimeType: 'application/pdf',
      dialogTitle: `Cool Car Financial Report (${data.fromDate} to ${data.toDate})`,
    });
  }

  return uri;
}

export async function generateAndShareCsv(filename: string, csvContent: string) {
  const isAvailable = await Sharing.isAvailableAsync();
  const file = new File(Paths.cache, filename);
  if (!file.exists) {
    file.create();
  }
  file.write(csvContent);

  if (isAvailable) {
    await Sharing.shareAsync(file.uri, {
      mimeType: 'text/csv',
      dialogTitle: filename,
    });
  }

  return file.uri;
}
