/**
 * Intelligence Clearance Code Generator
 * Generates high-status, human-readable alphanumeric codes (e.g., VRTX-88)
 * Designed for elite, zero-friction recovery.
 */

const PREFIXES = ["VRTX", "OXGN", "PLSE", "CYPH", "NODE", "ZROX", "VOID", "FLUX"];

export function generateClearanceCode(): string {
  const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
  const suffix = Math.floor(10 + Math.random() * 89); // 2-digit number (10-98)
  return `${prefix}-${suffix}`;
}

export function isValidClearanceCode(code: string): boolean {
  // Regex to match PREFIX-NUM (e.g. VRTX-88)
  const regex = /^[A-Z]{4}-\d{2}$/;
  return regex.test(code);
}
