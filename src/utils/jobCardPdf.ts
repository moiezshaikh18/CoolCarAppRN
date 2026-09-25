// ============================================================
// Cool Car Job Card PDF Generator
// Replicates the physical "Cool Car — CAR A/C REPAIRS" Job Card
// Sections: Customer Info, Demanded Work, Routine Check-up,
//           Work Done, Parts In Use, Note, Signatures
// ============================================================

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { File, Paths } from 'expo-file-system';

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
    color: #000000;
    background: #FFFFFF;
    padding: 12px 16px 16px;
    max-width: 720px;
    margin: 0 auto;
  }

  /* ── Header ── */
  .top-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 6px;
    margin-bottom: 4px;
  }
  .brand-block {
    display: flex;
    flex-direction: column;
  }
  .brand-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .brand-name {
    font-family: "Brush Script MT", "Segoe Script", cursive, Georgia, serif;
    font-size: 32px;
    font-weight: 700;
    color: #000000;
    line-height: 1;
  }
  .brand-sub {
    font-size: 10px;
    font-weight: 900;
    letter-spacing: 2px;
    color: #000000;
    margin-top: 4px;
    text-transform: uppercase;
  }
  .job-card-badge {
    background: #000000;
    color: #FFFFFF;
    font-size: 16px;
    font-weight: 900;
    padding: 6px 18px;
    letter-spacing: 1.5px;
    border-radius: 2px;
  }

  /* ── Customer Info Box (exact replica of physical card) ── */
  .info-box {
    border: 1.5px solid #000000;
    padding: 6px 10px;
    margin-bottom: 6px;
  }
  .info-table {
    width: 100%;
    border-collapse: collapse;
  }
  .info-table td {
    padding: 3px 4px;
    font-size: 11px;
    vertical-align: baseline;
  }
  .lbl {
    font-weight: 700;
    white-space: nowrap;
    width: 1%;
    color: #000000;
  }
  .val {
    border-bottom: 1px solid #333333;
    padding-left: 4px;
    font-weight: 600;
    color: #000000;
  }
  .val-bold {
    font-weight: 900;
  }

  /* ── Section Titles ── */
  .section-title {
    text-align: center;
    font-weight: 900;
    font-size: 13px;
    letter-spacing: 0.8px;
    padding: 3px 0;
    border: 1.5px solid #000000;
    border-bottom: none;
    color: #000000;
  }

  /* ── 2-Col Numbered Tables (Demanded Work, Work Done, Parts) ── */
  .two-col-table {
    width: 100%;
    border-collapse: collapse;
    border: 1.5px solid #000000;
    margin-bottom: 6px;
  }
  .two-col-table td {
    border: 1px solid #000000;
    padding: 3px 6px;
    height: 20px;
  }
  td.num {
    background: #000000;
    color: #FFFFFF;
    font-weight: 900;
    font-size: 11px;
    width: 22px;
    text-align: center;
  }
  td.cell-l, td.cell-r {
    width: calc(50% - 22px);
    font-size: 11px;
    color: #000000;
  }

  /* ── Routine Check Up ── */
  .routine-wrapper {
    display: flex;
    border: 1.5px solid #000000;
    margin-bottom: 6px;
  }
  .routine-col {
    flex: 1;
  }
  .routine-badge-box {
    width: 90px;
    border-left: 1px solid #000000;
    border-right: 1px solid #000000;
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    font-size: 15px;
    font-weight: 900;
    line-height: 1.3;
    color: #000000;
    padding: 4px;
  }
  .routine-table {
    width: 100%;
    border-collapse: collapse;
  }
  .routine-table td {
    border-bottom: 1px solid #000000;
    padding: 2.5px 4px;
    height: 18px;
  }
  .routine-table tr:last-child td {
    border-bottom: none;
  }
  td.rnum {
    width: 18px;
    font-weight: 900;
    font-size: 10px;
    color: #000000;
    text-align: center;
    border-right: 1px solid #000000;
  }
  td.rlabel {
    font-size: 9.5px;
    font-weight: 600;
    color: #000000;
    padding-left: 4px;
  }
  td.rval {
    font-size: 10px;
    font-weight: 900;
    color: #000000;
    text-align: right;
    padding-right: 4px;
  }

  /* ── Footer Signatures & Note (exact 3-column replica) ── */
  .footer-table {
    width: 100%;
    border-collapse: collapse;
    border: 1.5px solid #000000;
    margin-top: 4px;
  }
  .footer-table td {
    border: 1px solid #000000;
    vertical-align: bottom;
    padding: 8px 10px;
  }
  .foot-sig {
    width: 28%;
    height: 75px;
    text-align: center;
  }
  .foot-note {
    width: 44%;
    vertical-align: top !important;
  }
  .foot-mechanic {
    width: 28%;
    height: 75px;
    text-align: center;
  }
  .sig-text {
    font-size: 11px;
    font-weight: 900;
    color: #000000;
  }
  .for-cool-car {
    font-family: "Brush Script MT", "Segoe Script", cursive, Georgia, serif;
    font-size: 20px;
    font-weight: 700;
    color: #000000;
    margin-bottom: 30px;
  }
  .note-heading {
    font-weight: 900;
    font-size: 11px;
    margin-bottom: 4px;
  }
  .note-line {
    border-bottom: 1px solid #555555;
    height: 16px;
    font-size: 10px;
    font-weight: 600;
    color: #000000;
  }

  @media print {
    body { padding: 6px 10px; }
  }
</style>
</head>
<body>

<!-- ══ 1. HEADER ═════════════════════════════════════════════════ -->
<div class="top-header">
  <div class="brand-block">
    <div class="brand-row">
      <span style="font-size:20px;">🚗</span>
      <span class="brand-name">Cool Car</span>
      <span style="font-size:20px;">🚗</span>
    </div>
    <div class="brand-sub">CAR A/C REPAIRS</div>
  </div>
  <div class="job-card-badge">JOB CARD</div>
</div>

<!-- ══ 2. CUSTOMER & VEHICLE INFO ═══════════════════════════════ -->
<div class="info-box">
  <table class="info-table">
    <tr>
      <td class="lbl">Name:</td>
      <td class="val">${escHtml(data.customerName || '')}</td>
      <td class="lbl" style="padding-left:14px;">Date:</td>
      <td class="val">${escHtml(dateStr)}</td>
    </tr>
    <tr>
      <td class="lbl">Address:</td>
      <td class="val">${escHtml(data.customerAddress || '')}</td>
      <td class="lbl" style="padding-left:14px;">Mob:</td>
      <td class="val">${escHtml(data.customerPhone || '')}</td>
    </tr>
    <tr>
      <td class="lbl">Recent K.M.:</td>
      <td class="val">${escHtml(String(data.vehicleKm || ''))}</td>
      <td class="lbl" style="padding-left:14px;">Vehicle No:</td>
      <td class="val val-bold">${escHtml(data.vehicleNumber || '')}</td>
    </tr>
    <tr>
      <td class="lbl"></td>
      <td style="border:none;"></td>
      <td class="lbl" style="padding-left:14px;">Type of Vehicle:</td>
      <td class="val">${escHtml(`${data.vehicleMake || ''} ${data.vehicleModel || ''}`.trim())}</td>
    </tr>
  </table>
</div>

<!-- ══ 3. DEMANDED WORK ═════════════════════════════════════════ -->
<div class="section-title">Demanded Work</div>
<table class="two-col-table">
  ${twoColRows(demandedItems)}
</table>

<!-- ══ 4. ROUTINE CHECK UP (EXACT 18 ITEMS FROM PHOTO) ═════════ -->
<div class="routine-wrapper">
  <!-- Left column: 1 to 9 -->
  <div class="routine-col">
    <table class="routine-table">
      ${routineRow(1, 'Actual Pressure', rc.actualPressure)}
      ${routineRow(2, 'Air Mode / Air Circulation', rc.airMode)}
      ${routineRow(3, 'Condenser / Condenser Fan', rc.condenserFan)}
      ${routineRow(4, 'Cooling Coil', rc.coolingCoil)}
      ${routineRow(5, 'Belt Check / Noise Check', rc.beltCheck)}
      ${routineRow(6, 'Leak testing in Vaccum', rc.leakTesting)}
      ${routineRow(7, 'Auto Cut-off On ___ °C', rc.autoCutoff)}
      ${routineRow(8, 'Heater', rc.heater)}
      ${routineRow(9, 'Drain Pipe / Water Leakage', rc.drainPipe)}
    </table>
  </div>

  <!-- Center vertical title -->
  <div class="routine-badge-box">
    Routine<br>Check<br>up
  </div>

  <!-- Right column: 10 to 18 -->
  <div class="routine-col">
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

<!-- ══ 5. WORK DONE ═════════════════════════════════════════════ -->
<div class="section-title">Work Done</div>
<table class="two-col-table">
  ${twoColRows(workDoneItems)}
</table>

<!-- ══ 6. PARTS IN USE ══════════════════════════════════════════ -->
<div class="section-title">Parts In Use</div>
<table class="two-col-table">
  ${twoColRows(partsItems)}
</table>

<!-- ══ 7. FOOTER (CUSTOMER SIGNATURE | NOTE | FOR COOL CAR / MECHANIC) ══ -->
<table class="footer-table">
  <tr>
    <td class="foot-sig">
      <div class="sig-text">Customer Signature</div>
    </td>
    <td class="foot-note">
      <div class="note-heading">Note: ${escHtml(data.notes || '')}</div>
      <div class="note-line"></div>
      <div class="note-line"></div>
      <div class="note-line"></div>
    </td>
    <td class="foot-mechanic">
      <div class="for-cool-car">For Cool Car</div>
      <div class="sig-text">Mechanic Signature</div>
    </td>
  </tr>
</table>

</body>
</html>`;

  // Step 1: Render HTML → temp PDF (expo-print writes to an internal temp dir)
  const result = await Print.printToFileAsync({ html, base64: false });
  const tempUri = result.uri;

  // Step 2: Copy to a named file in cacheDirectory.
  // Android expo-sharing CANNOT access the raw expo-print temp path directly.
  // Copying to Paths.cache (cacheDirectory) first is the correct fix.
  const safeJobNum = (data.jobNumber || 'job').replace(/[^a-zA-Z0-9-]/g, '_');
  const destFile = new File(Paths.cache, `CoolCar_JobCard_${safeJobNum}.pdf`);
  const sourceFile = new File(tempUri);
  sourceFile.copy(destFile);

  // Step 3: Share from the accessible cache URI
  const canShare = await Sharing.isAvailableAsync();
  if (canShare) {
    await Sharing.shareAsync(destFile.uri, {
      mimeType: 'application/pdf',
      UTI: 'com.adobe.pdf',
    });
  } else {
    // Fallback: open system print dialog
    await Print.printAsync({ uri: destFile.uri });
  }
}
