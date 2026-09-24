// ============================================================
// Cool Car Job Card PDF Generator
// Replicates the physical "Cool Car — CAR A/C REPAIRS" Job Card
// Sections: Customer Info, Demanded Work, Routine Check-up,
//           Work Done, Parts In Use, Note, Signatures
// ============================================================

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';

export interface JobCardPdfData {
  jobNumber: string;
  date?: string;
  time?: string;
  customerName?: string;
  customerPhone?: string;
  customerAddress?: string;
  vehicleNumber?: string;
  vehicleModel?: string;
  vehicleMake?: string;
  vehicleKm?: number | string;
  workCategory?: string;
  assignedMechanicName?: string;

  // "Demanded Work" - what customer asked for (max 10)
  demandedWork?: string[];

  // "Work Done" - what was actually done (items list)
  workDone?: string[];

  // "Parts In Use" - parts used
  partsInUse?: { name: string; qty?: number; price?: number }[];

  // Routine Checkup filled values (optional extras map)
  routineCheckup?: {
    actualPressure?: string;
    airMode?: string;
    condenserFan?: string;
    coolingCoil?: string;
    beltCheck?: string;
    leakTesting?: string;
    autoCutoff?: string;
    heater?: string;
    drainPipe?: string;
    nitrogenPressure?: string;
    crimping?: string;
    oilCharge?: string;
    blowerSpeed?: string;
    pressurePin?: string;
    electricalCheck?: string;
    spannerCheck?: string;
    fullCharge?: string;
    sticker?: string;
  };

  notes?: string;

  // Billing
  subtotal?: number;
  discount?: number;
  finalAmount?: number;
  totalPaid?: number;
  pendingAmount?: number;
  paymentStatus?: string;
  currencySymbol?: string;
}

// ── Helper ──────────────────────────────────────────────────
function pad(arr: string[] = [], len = 10): string[] {
  const out = [...arr];
  while (out.length < len) out.push('');
  return out.slice(0, len);
}

function twoColRows(items: string[]): string {
  let html = '';
  for (let i = 0; i < 10; i += 2) {
    const a = items[i] || '';
    const b = items[i + 1] || '';
    html += `
      <tr>
        <td class="num">${i + 1}</td>
        <td class="cell-l">${escHtml(a)}</td>
        <td class="num">${i + 2}</td>
        <td class="cell-r">${escHtml(b)}</td>
      </tr>`;
  }
  return html;
}

function escHtml(s: string): string {
  if (!s) return '';
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function routineRow(num: number, label: string, value: string | undefined): string {
  return `<tr>
    <td class="rnum">${num}</td>
    <td class="rlabel">${label}</td>
    <td class="rval">${escHtml(value || '')}</td>
  </tr>`;
}

// Safe number formatter (no Intl dependency)
function fmtNum(n: number | undefined, cs: string): string {
  if (n === undefined || n === null) return '-';
  // Simple Indian comma formatting
  const abs = Math.abs(Math.round(n));
  const str = String(abs);
  let result = '';
  if (str.length <= 3) {
    result = str;
  } else {
    const last3 = str.slice(-3);
    const rest = str.slice(0, str.length - 3);
    const restFormatted = rest.replace(/\B(?=(\d{2})+(?!\d))/g, ',');
    result = restFormatted + ',' + last3;
  }
  return (n < 0 ? '-' : '') + cs + result;
}

// Safe date formatter
function safeFormatDate(d: string | Date | undefined): string {
  if (!d) return new Date().toLocaleDateString('en-GB');
  if (typeof d === 'string') {
    // If already a human-readable string, return as-is
    if (d.includes('Today') || d.includes('/') || d.includes('-') || isNaN(Date.parse(d))) {
      return d.substring(0, 30);
    }
    try {
      return new Date(d).toLocaleDateString('en-GB');
    } catch {
      return d.substring(0, 20);
    }
  }
  try {
    return d.toLocaleDateString('en-GB');
  } catch {
    return String(d).substring(0, 20);
  }
}

// ── Main Export ─────────────────────────────────────────────
export async function generateAndShareJobCardPdf(data: JobCardPdfData): Promise<void> {
  const cs = data.currencySymbol || 'Rs.';
  const fmt = (n?: number) => fmtNum(n, cs);

  // Demanded Work — convert items to strings
  const demandedItems = pad(data.demandedWork ?? [], 10);

  // Work Done — extract item names
  const workDoneItems = pad(data.workDone ?? [], 10);

  // Parts In Use — stringify (using 'x' instead of unicode ×)
  const partsItems = pad(
    (data.partsInUse ?? []).map((p) =>
      p.qty ? `${p.name} (x${p.qty})` : p.name
    ),
    10
  );

  const rc = data.routineCheckup ?? {};

  const dateStr = safeFormatDate(data.date);

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Cool Car Job Card — ${escHtml(data.jobNumber)}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 11px;
    color: #0F172A;
    background: #fff;
    padding: 14px 18px 20px;
    max-width: 720px;
    margin: 0 auto;
  }

  /* ── Header ── */
  .top-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    border-bottom: 2px solid #000;
    padding-bottom: 8px;
    margin-bottom: 6px;
  }
  .brand-block {}
  .brand-name {
    font-size: 26px;
    font-weight: 900;
    font-style: italic;
    color: #153580;
    line-height: 1;
    letter-spacing: -0.5px;
  }
  .brand-name .car-icon { font-style: normal; }
  .brand-sub {
    font-size: 8px;
    font-weight: 700;
    letter-spacing: 1px;
    color: #475569;
    margin-top: 2px;
    text-transform: uppercase;
  }
  .job-card-badge {
    background: #000;
    color: #fff;
    font-size: 14px;
    font-weight: 900;
    padding: 6px 16px;
    letter-spacing: 1px;
    border-radius: 2px;
    align-self: flex-start;
  }

  /* ── Customer Info ── */
  .info-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0 16px;
    margin: 6px 0;
    border-bottom: 1px solid #555;
    padding-bottom: 6px;
  }
  .info-row {
    display: flex;
    align-items: baseline;
    gap: 4px;
    padding: 2px 0;
  }
  .info-label {
    font-weight: 700;
    font-size: 10px;
    white-space: nowrap;
    color: #374151;
  }
  .info-line {
    flex: 1;
    border-bottom: 1px solid #999;
    font-size: 11px;
    padding-bottom: 1px;
    font-weight: 600;
    color: #0F172A;
    min-width: 60px;
  }

  /* ── Section Header ── */
  .section-title {
    background: #E2E8F0;
    text-align: center;
    font-weight: 800;
    font-size: 11px;
    padding: 3px 0;
    letter-spacing: 0.5px;
    border: 1px solid #aaa;
    border-bottom: none;
    text-transform: uppercase;
  }

  /* ── Two-column numbered list ── */
  .two-col-table {
    width: 100%;
    border-collapse: collapse;
    border: 1px solid #aaa;
    margin-bottom: 6px;
  }
  .two-col-table td {
    border: 1px solid #aaa;
    padding: 3px 4px;
  }
  td.num {
    background: #000;
    color: #fff;
    font-weight: 900;
    font-size: 9px;
    width: 16px;
    text-align: center;
  }
  td.cell-l {
    width: calc(50% - 16px);
    font-size: 11px;
    min-height: 18px;
  }
  td.cell-r {
    width: calc(50% - 16px);
    font-size: 11px;
    min-height: 18px;
  }

  /* ── Routine Check-up ── */
  .routine-wrapper {
    display: flex;
    gap: 0;
    border: 1px solid #aaa;
    margin-bottom: 6px;
  }
  .routine-left, .routine-right {
    flex: 1;
  }
  .routine-left { border-right: 1px solid #aaa; }

  .routine-badge {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 100px;
    border-right: 1px solid #aaa;
    text-align: center;
    padding: 4px 6px;
    font-size: 13px;
    font-weight: 900;
    line-height: 1.3;
    color: #153580;
    border-left: none;
  }

  .routine-table {
    width: 100%;
    border-collapse: collapse;
  }
  .routine-table td {
    border-bottom: 1px solid #ddd;
    padding: 2px 4px;
    vertical-align: middle;
  }
  td.rnum {
    background: #000;
    color: #fff;
    font-weight: 900;
    font-size: 9px;
    width: 14px;
    text-align: center;
  }
  td.rlabel {
    font-size: 9.5px;
    font-weight: 600;
    color: #374151;
    width: 120px;
  }
  td.rval {
    font-size: 10px;
    border-bottom: 1px dotted #999;
    padding-bottom: 1px;
    color: #0F172A;
    font-weight: 700;
  }

  /* ── Billing Summary ── */
  .billing-box {
    border: 1px solid #aaa;
    margin-bottom: 6px;
    overflow: hidden;
    border-radius: 2px;
  }
  .billing-title {
    background: #153580;
    color: #fff;
    font-weight: 800;
    font-size: 10px;
    padding: 3px 8px;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }
  .billing-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 3px 10px;
    border-bottom: 1px solid #e2e8f0;
    font-size: 11px;
  }
  .billing-row:last-child { border-bottom: none; }
  .billing-label { color: #475569; font-weight: 600; }
  .billing-value { font-weight: 800; color: #0F172A; }
  .billing-final {
    background: #EFF6FF;
    font-size: 13px;
  }
  .billing-final .billing-label { color: #1D4ED8; font-weight: 900; }
  .billing-final .billing-value { color: #153580; font-weight: 900; }
  .status-paid { color: #16A34A; }
  .status-pending { color: #DC2626; }
  .status-partial { color: #D97706; }

  /* ── Bottom ── */
  .bottom-section {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 8px;
    border-top: 1px solid #aaa;
    padding-top: 8px;
    margin-top: 4px;
  }
  .sig-block { text-align: center; }
  .sig-line {
    border-bottom: 1px solid #333;
    margin-bottom: 4px;
    height: 32px;
  }
  .sig-label {
    font-size: 9px;
    font-weight: 700;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.4px;
  }
  .for-cool-car {
    font-size: 15px;
    font-style: italic;
    font-weight: 900;
    color: #153580;
    margin-bottom: 4px;
  }
  .note-block {
    border: 1px solid #aaa;
    border-radius: 2px;
    padding: 4px 8px;
    margin-bottom: 6px;
    min-height: 36px;
  }
  .note-label {
    font-size: 9px;
    font-weight: 800;
    color: #64748B;
    text-transform: uppercase;
    letter-spacing: 0.4px;
    margin-bottom: 3px;
  }
  .note-content {
    font-size: 11px;
    color: #0F172A;
    font-weight: 600;
    min-height: 22px;
  }

  .divider { height: 1px; background: #CBD5E1; margin: 4px 0; }

  @media print {
    body { padding: 8px 14px; }
  }
</style>
</head>
<body>

<!-- ══ HEADER ═════════════════════════════════════════════════ -->
<div class="top-header">
  <div class="brand-block">
    <div class="brand-name">
      <span style="font-size:14px;">✦</span> Cool Car <span style="font-size:14px;">🚗</span>
    </div>
    <div class="brand-sub">CAR A/C REPAIRS</div>
  </div>
  <div class="job-card-badge">JOB CARD</div>
</div>

<!-- ══ CUSTOMER INFO ═══════════════════════════════════════════ -->
<div class="info-grid">
  <div class="info-row">
    <span class="info-label">Name:</span>
    <span class="info-line">${escHtml(data.customerName || '')}</span>
  </div>
  <div class="info-row">
    <span class="info-label">Date:</span>
    <span class="info-line">${escHtml(dateStr)}</span>
  </div>
  <div class="info-row">
    <span class="info-label">Address:</span>
    <span class="info-line">${escHtml(data.customerAddress || '')}</span>
  </div>
  <div class="info-row">
    <span class="info-label">Mob:</span>
    <span class="info-line">${escHtml(data.customerPhone || '')}</span>
  </div>
  <div class="info-row">
    <span class="info-label">Recent K.M.:</span>
    <span class="info-line">${escHtml(String(data.vehicleKm || ''))}</span>
  </div>
  <div class="info-row">
    <span class="info-label">Vehicle No:</span>
    <span class="info-line">${escHtml(data.vehicleNumber || '')}</span>
  </div>
  <div class="info-row">
    <span class="info-label">Mechanic:</span>
    <span class="info-line">${escHtml(data.assignedMechanicName || '')}</span>
  </div>
  <div class="info-row">
    <span class="info-label">Type of Vehicle:</span>
    <span class="info-line">${escHtml(`${data.vehicleMake || ''} ${data.vehicleModel || ''}`.trim())}</span>
  </div>
</div>

<!-- ══ DEMANDED WORK ════════════════════════════════════════════ -->
<div class="section-title">Demanded Work</div>
<table class="two-col-table">
  ${twoColRows(demandedItems)}
</table>

<!-- ══ ROUTINE CHECK-UP ════════════════════════════════════════ -->
<div class="section-title">Routine Check Up</div>
<div class="routine-wrapper">
  <!-- Left column: items 1–9 -->
  <div class="routine-left">
    <table class="routine-table">
      ${routineRow(1, 'Actual Pressure', rc.actualPressure)}
      ${routineRow(2, 'Air Mode / Air Circulation', rc.airMode)}
      ${routineRow(3, 'Condenser / Condenser Fan', rc.condenserFan)}
      ${routineRow(4, 'Cooling Coil', rc.coolingCoil)}
      ${routineRow(5, 'Belt Check / Noise Check', rc.beltCheck)}
      ${routineRow(6, 'Leak testing in Vaccum', rc.leakTesting)}
      ${routineRow(7, 'Auto Cut-off On __ °C', rc.autoCutoff)}
      ${routineRow(8, 'Heater', rc.heater)}
      ${routineRow(9, 'Drain Pipe / Water Leakage', rc.drainPipe)}
    </table>
  </div>

  <!-- Center Badge -->
  <div class="routine-badge">
    Routine<br>Check<br>up
  </div>

  <!-- Right column: items 10–18 -->
  <div class="routine-right">
    <table class="routine-table">
      ${routineRow(10, 'Nitrogen Pressure ___ psi-At', rc.nitrogenPressure)}
      ${routineRow(11, 'All Crimping / All Joints', rc.crimping)}
      ${routineRow(12, 'Oil Charge', rc.oilCharge)}
      ${routineRow(13, 'Blower Speed', rc.blowerSpeed)}
      ${routineRow(14, 'Pressure Pin', rc.pressurePin)}
      ${routineRow(15, 'Electrical Check-up', rc.electricalCheck)}
      ${routineRow(16, 'Spanner Check', rc.spannerCheck)}
      ${routineRow(17, 'Full Charge / Top up', rc.fullCharge)}
      ${routineRow(18, 'Sticker', rc.sticker)}
    </table>
  </div>
</div>

<!-- ══ WORK DONE ════════════════════════════════════════════════ -->
<div class="section-title">Work Done</div>
<table class="two-col-table">
  ${twoColRows(workDoneItems)}
</table>

<!-- ══ PARTS IN USE ════════════════════════════════════════════ -->
<div class="section-title">Parts In Use</div>
<table class="two-col-table">
  ${twoColRows(partsItems)}
</table>

<!-- ══ BILLING SUMMARY ═════════════════════════════════════════ -->
<div class="billing-box">
  <div class="billing-title">Billing Summary — Job #${escHtml(data.jobNumber)}</div>
  ${data.subtotal !== undefined ? `<div class="billing-row"><span class="billing-label">Subtotal</span><span class="billing-value">${fmt(data.subtotal)}</span></div>` : ''}
  ${data.discount ? `<div class="billing-row"><span class="billing-label">Discount</span><span class="billing-value" style="color:#16A34A;">– ${fmt(data.discount)}</span></div>` : ''}
  <div class="billing-row billing-final">
    <span class="billing-label">Total Bill Amount</span>
    <span class="billing-value">${fmt(data.finalAmount)}</span>
  </div>
  ${data.totalPaid !== undefined ? `<div class="billing-row"><span class="billing-label">Amount Collected</span><span class="billing-value status-paid">${fmt(data.totalPaid)}</span></div>` : ''}
  ${(data.pendingAmount ?? 0) > 0 ? `<div class="billing-row"><span class="billing-label">Balance Due (Udhari)</span><span class="billing-value status-pending">${fmt(data.pendingAmount)}</span></div>` : '<div class="billing-row"><span class="billing-label">Payment Status</span><span class="billing-value status-paid">✓ Fully Paid</span></div>'}
</div>

<!-- ══ NOTE ════════════════════════════════════════════════════ -->
<div class="note-block">
  <div class="note-label">Note:</div>
  <div class="note-content">${escHtml(data.notes || '')}</div>
</div>

<!-- ══ SIGNATURES ══════════════════════════════════════════════ -->
<div class="bottom-section">
  <div class="sig-block">
    <div class="sig-line"></div>
    <div class="sig-label">Customer Signature</div>
  </div>
  <div class="sig-block">
    <div class="for-cool-car">For Cool Car</div>
    <div class="sig-label" style="color:#153580; font-size:8px;">CAR A/C REPAIRS</div>
  </div>
  <div class="sig-block">
    <div class="sig-line"></div>
    <div class="sig-label">Mechanic Signature</div>
  </div>
</div>

</body>
</html>`;

  try {
    // Print HTML to PDF file
    const result = await Print.printToFileAsync({ html, base64: false });
    const pdfUri = result.uri;

    // Share / Download via native sheet
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(pdfUri, {
        mimeType: 'application/pdf',
        UTI: 'com.adobe.pdf',
      });
    } else {
      // Fallback: Just print it
      await Print.printAsync({ uri: pdfUri });
    }
  } catch (printErr) {
    throw printErr;
  }
}
