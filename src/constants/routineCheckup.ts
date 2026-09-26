// ============================================================
// Routine Checkup Standard 18 Checkpoints
// Matches the Cool Car physical job card inspection block
// ============================================================

export interface RoutineCheckupItem {
  key: string;
  label: string;
  placeholder: string;
  defaultVal: string;
}

export const STANDARD_18_ROUTINE_ITEMS: RoutineCheckupItem[] = [
  { key: 'actualPressure', label: '1. Actual Pressure', placeholder: 'e.g. 35 psi', defaultVal: 'OK ✓' },
  { key: 'airMode', label: '2. Air Mode / Circulation', placeholder: 'e.g. Recirculation OK', defaultVal: 'OK ✓' },
  { key: 'condenserFan', label: '3. Condenser / Fan', placeholder: 'e.g. High Speed OK', defaultVal: 'OK ✓' },
  { key: 'coolingCoil', label: '4. Cooling Coil', placeholder: 'e.g. Cleaned / Tested', defaultVal: 'OK ✓' },
  { key: 'beltCheck', label: '5. Belt / Noise Check', placeholder: 'e.g. Tight & Silent', defaultVal: 'OK ✓' },
  { key: 'leakTesting', label: '6. Leak testing in Vaccum', placeholder: 'e.g. Held 30 min', defaultVal: 'OK ✓' },
  { key: 'autoCutoff', label: '7. Auto Cut-off On ___ °C', placeholder: 'e.g. 4.5 °C', defaultVal: '4.5 °C' },
  { key: 'heater', label: '8. Heater', placeholder: 'e.g. Checked / Blocked', defaultVal: 'OK ✓' },
  { key: 'drainPipe', label: '9. Drain Pipe / Water Leak', placeholder: 'e.g. Flow Clear', defaultVal: 'OK ✓' },
  { key: 'nitrogenPressure', label: '10. Nitrogen Pressure ___ psi', placeholder: 'e.g. 250 psi', defaultVal: '250 psi' },
  { key: 'crimping', label: '11. All Crimping / Joints', placeholder: 'e.g. Soap Tested', defaultVal: 'OK ✓' },
  { key: 'oilCharge', label: '12. Oil Charge', placeholder: 'e.g. 60 ml PAG 46', defaultVal: 'OK ✓' },
  { key: 'blowerSpeed', label: '13. Blower Speed', placeholder: 'e.g. 1-2-3-4 OK', defaultVal: 'OK ✓' },
  { key: 'pressurePin', label: '14. Pressure Pin', placeholder: 'e.g. Replaced / OK', defaultVal: 'OK ✓' },
  { key: 'electricalCheck', label: '15. Electrical Check-up', placeholder: 'e.g. Relay & Fuse OK', defaultVal: 'OK ✓' },
  { key: 'spannerCheck', label: '16. Spanner Check', placeholder: 'e.g. Tightened', defaultVal: 'OK ✓' },
  { key: 'fullCharge', label: '17. Full Charge / Top up', placeholder: 'e.g. 450g R134a', defaultVal: 'Full Charge' },
  { key: 'sticker', label: '18. Sticker', placeholder: 'e.g. Pasted On Door', defaultVal: 'Pasted ✓' },
];
