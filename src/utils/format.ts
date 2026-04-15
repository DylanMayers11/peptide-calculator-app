export function formatDose(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  if (value >= 1000) {
    return `${(value / 1000).toFixed(2)} mg`;
  }
  return `${value.toFixed(2)} mcg`;
}

export function formatVolume(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  return `${value.toFixed(4)} mL`;
}

export function formatUnits(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  return `${value.toFixed(2)} units`;
}

export function formatConcentration(value: number): string {
  if (!isFinite(value) || isNaN(value)) return '—';
  return `${value.toFixed(2)} mcg/mL`;
}

export function sanitizeNumericInput(text: string): string {
  // Allow digits and a single decimal point only
  const cleaned = text.replace(/[^0-9.]/g, '');
  const parts = cleaned.split('.');
  if (parts.length > 2) return parts[0] + '.' + parts.slice(1).join('');
  return cleaned;
}

export function parseInput(text: string): number {
  const n = parseFloat(text);
  return isNaN(n) ? 0 : n;
}
