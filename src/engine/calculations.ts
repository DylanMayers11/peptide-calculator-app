// ─── Types ────────────────────────────────────────────────────────────────────

export interface ReconstitutionResult {
  isValid: boolean;
  error?: string;
  concentrationPerML: number;
  concentrationPerUnit: number;
  unitsToDraw: number;
  volumeToDrawML: number;
}

export interface DrawResult {
  isValid: boolean;
  error?: string;
  volumeML: number;
  volumeUnits: number;
}

export interface SyringeResult {
  isValid: boolean;
  error?: string;
  syringeUnits: number;
  volumeML: number;
}

export type UnitType = 'mcg' | 'mg' | 'mL' | 'units';

export interface ConversionResult {
  isValid: boolean;
  error?: string;
  mcg: number;
  mg: number;
  mL: number;
  units: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function round(value: number, decimals: number): number {
  const factor = Math.pow(10, decimals);
  return Math.round(value * factor) / factor;
}

function guardPositive(value: number, name: string): string | null {
  if (isNaN(value) || !isFinite(value)) return `${name} must be a valid number`;
  if (value <= 0) return `${name} must be greater than 0`;
  return null;
}

// ─── Reconstitution Calculator ────────────────────────────────────────────────
// Given: peptide vial size (mcg), diluent added (mL), target dose (mcg)
// Outputs: concentration, and how many units/mL to draw

export function calcReconstitution(
  peptideMcg: number,
  diluentML: number,
  targetDoseMcg: number,
  syringeSize: number = 100,
): ReconstitutionResult {
  const e1 = guardPositive(peptideMcg, 'Peptide amount');
  if (e1) return { isValid: false, error: e1, concentrationPerML: 0, concentrationPerUnit: 0, unitsToDraw: 0, volumeToDrawML: 0 };

  const e2 = guardPositive(diluentML, 'Diluent amount');
  if (e2) return { isValid: false, error: e2, concentrationPerML: 0, concentrationPerUnit: 0, unitsToDraw: 0, volumeToDrawML: 0 };

  const e3 = guardPositive(targetDoseMcg, 'Target dose');
  if (e3) return { isValid: false, error: e3, concentrationPerML: 0, concentrationPerUnit: 0, unitsToDraw: 0, volumeToDrawML: 0 };

  if (peptideMcg > 100_000) return { isValid: false, error: 'Peptide amount seems too high (max 100,000 mcg / 100 mg)', concentrationPerML: 0, concentrationPerUnit: 0, unitsToDraw: 0, volumeToDrawML: 0 };
  if (diluentML > 10) return { isValid: false, error: 'Diluent amount seems too high (max 10 mL)', concentrationPerML: 0, concentrationPerUnit: 0, unitsToDraw: 0, volumeToDrawML: 0 };
  if (targetDoseMcg > peptideMcg) return { isValid: false, error: 'Target dose cannot exceed total peptide amount', concentrationPerML: 0, concentrationPerUnit: 0, unitsToDraw: 0, volumeToDrawML: 0 };

  const concentrationPerML = peptideMcg / diluentML;
  const concentrationPerUnit = concentrationPerML / syringeSize;
  const volumeToDrawML = targetDoseMcg / concentrationPerML;
  const unitsToDraw = volumeToDrawML * syringeSize;

  return {
    isValid: true,
    concentrationPerML: round(concentrationPerML, 4),
    concentrationPerUnit: round(concentrationPerUnit, 4),
    unitsToDraw: round(unitsToDraw, 2),
    volumeToDrawML: round(volumeToDrawML, 4),
  };
}

// ─── Draw Amount Calculator ───────────────────────────────────────────────────
// Given: target dose (mcg) and concentration (mcg/mL)
// Outputs: volume to draw in mL and units

export function calcDrawVolume(
  targetDoseMcg: number,
  concentrationPerML: number,
  syringeSize: number = 100,
): DrawResult {
  const e1 = guardPositive(targetDoseMcg, 'Target dose');
  if (e1) return { isValid: false, error: e1, volumeML: 0, volumeUnits: 0 };

  const e2 = guardPositive(concentrationPerML, 'Concentration');
  if (e2) return { isValid: false, error: e2, volumeML: 0, volumeUnits: 0 };

  const volumeML = targetDoseMcg / concentrationPerML;
  const volumeUnits = volumeML * syringeSize;

  return {
    isValid: true,
    volumeML: round(volumeML, 4),
    volumeUnits: round(volumeUnits, 2),
  };
}

// ─── Syringe Unit Calculator ──────────────────────────────────────────────────
// Given: target dose (mcg) and concentration (mcg/mL)
// Outputs: syringe units to draw

export function calcSyringeUnits(
  targetDoseMcg: number,
  concentrationPerML: number,
  syringeSize: number = 100,
): SyringeResult {
  const e1 = guardPositive(targetDoseMcg, 'Target dose');
  if (e1) return { isValid: false, error: e1, syringeUnits: 0, volumeML: 0 };

  const e2 = guardPositive(concentrationPerML, 'Concentration');
  if (e2) return { isValid: false, error: e2, syringeUnits: 0, volumeML: 0 };

  const volumeML = targetDoseMcg / concentrationPerML;
  const syringeUnits = (targetDoseMcg / concentrationPerML) * syringeSize;

  return {
    isValid: true,
    syringeUnits: round(syringeUnits, 2),
    volumeML: round(volumeML, 4),
  };
}

// ─── Unit Converter ───────────────────────────────────────────────────────────
// Convert a value from one unit to all other units

export function convertUnit(value: number, fromUnit: UnitType): ConversionResult {
  const e1 = guardPositive(value, 'Value');
  if (e1) return { isValid: false, error: e1, mcg: 0, mg: 0, mL: 0, units: 0 };

  let mcg: number;

  switch (fromUnit) {
    case 'mcg':
      mcg = value;
      break;
    case 'mg':
      mcg = value * 1000;
      break;
    case 'mL':
      // 1 mL on a 100-unit insulin syringe = 100 units = treated as volume only
      mcg = value; // pass-through; not meaningful across mass/volume without concentration
      break;
    case 'units':
      // 100 units = 1 mL on standard insulin syringe
      mcg = value; // pass-through
      break;
    default:
      return { isValid: false, error: 'Unknown unit', mcg: 0, mg: 0, mL: 0, units: 0 };
  }

  const mg = mcg / 1000;
  const mL = fromUnit === 'mL' ? value : fromUnit === 'units' ? value / 100 : mcg / 1000;
  const units = fromUnit === 'units' ? value : fromUnit === 'mL' ? value * 100 : mg * 1000 / 10;

  // Simple mass-only conversions (mcg ↔ mg) and syringe volume conversions (mL ↔ units)
  if (fromUnit === 'mcg' || fromUnit === 'mg') {
    return {
      isValid: true,
      mcg: round(mcg, 4),
      mg: round(mg, 6),
      mL: 0,
      units: 0,
    };
  } else {
    return {
      isValid: true,
      mcg: 0,
      mg: 0,
      mL: round(fromUnit === 'mL' ? value : value / 100, 4),
      units: round(fromUnit === 'units' ? value : value * 100, 2),
    };
  }
}

// Convenience helpers
export const mcgToMg = (mcg: number): number => round(mcg / 1000, 6);
export const mgToMcg = (mg: number): number => round(mg * 1000, 4);
export const mlToUnits = (ml: number, syringeSize = 100): number => round(ml * syringeSize, 2);
export const unitsToMl = (units: number, syringeSize = 100): number => round(units / syringeSize, 4);
