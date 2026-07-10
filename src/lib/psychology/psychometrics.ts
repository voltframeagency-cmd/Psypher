/**
 * Psychometric Reliability & Standard Error of Measurement (SEM)
 * 
 * SEM = SD × √(1 − α)
 * 
 * Where:
 *   SD  = assumed population standard deviation (default: 15 for 0–100 scaled scores)
 *   α   = Cronbach's alpha (published reliability coefficient)
 * 
 * Sources:
 *   BFI-2-S: Soto & John (2017) — α ≈ 0.77 per domain
 *   DTDD:    Jones & Paulhus (2014) — α ≈ 0.82 per subscale
 *   AAS:     Collins & Read (1990) — α ≈ 0.75 for security factor
 *   Schwartz: Schwartz et al. (2012) PVQ-RR — α ≈ 0.70 per value
 *   Congruency: internal composite — estimated α ≈ 0.85
 */

/** Published reliability coefficients (Cronbach's α) */
export const RELIABILITY: Record<string, number> = {
  // BFI-2-S domains
  bfi_openness: 0.77,
  bfi_conscientiousness: 0.77,
  bfi_extraversion: 0.77,
  bfi_agreeableness: 0.77,
  bfi_neuroticism: 0.77,

  // Dark Triad (DTDD)
  dt_machiavellianism: 0.82,
  dt_narcissism: 0.82,
  dt_psychopathy: 0.82,

  // Attachment (AAS)
  attachment_security: 0.75,

  // Schwartz Values (PVQ-RR)
  schwartz_selfdirection: 0.70,
  schwartz_stimulation: 0.70,
  schwartz_hedonism: 0.70,
  schwartz_achievement: 0.70,
  schwartz_power: 0.70,
  schwartz_security: 0.70,
  schwartz_conformity: 0.70,
  schwartz_tradition: 0.70,
  schwartz_benevolence: 0.70,
  schwartz_universalism: 0.70,

  // Composite indices
  congruency_overall: 0.85,
};

/** Map BFI trait names (as used in UI) to reliability keys */
export const BFI_RELIABILITY_MAP: Record<string, string> = {
  Openness: "bfi_openness",
  Conscientiousness: "bfi_conscientiousness",
  Extraversion: "bfi_extraversion",
  Agreeableness: "bfi_agreeableness",
  Neuroticism: "bfi_neuroticism",
};

/** Map Dark Triad trait names to reliability keys */
export const DT_RELIABILITY_MAP: Record<string, string> = {
  Machiavellianism: "dt_machiavellianism",
  Narcissism: "dt_narcissism",
  Psychopathy: "dt_psychopathy",
  MACHIAVELLIANISM: "dt_machiavellianism",
  NARCISSISM: "dt_narcissism",
  PSYCHOPATHY: "dt_psychopathy",
};

/**
 * Calculate Standard Error of Measurement
 * @param alpha - Cronbach's alpha (reliability coefficient)
 * @param sd - Population standard deviation (default: 15)
 * @returns SEM value
 */
export function calculateSEM(alpha: number, sd: number = 15): number {
  return sd * Math.sqrt(1 - alpha);
}

/**
 * Calculate confidence interval around a score
 * @param score - Point estimate (0–100)
 * @param sem - Standard Error of Measurement
 * @param z - Z-score for desired confidence level (default: 1.96 for 95% CI)
 * @returns [lowerBound, upperBound] clamped to [0, 100]
 */
export function confidenceInterval(
  score: number,
  sem: number,
  z: number = 1.96
): [number, number] {
  const margin = sem * z;
  return [
    Math.max(0, Math.round(score - margin)),
    Math.min(100, Math.round(score + margin)),
  ];
}

/**
 * Get SEM for a specific scale by reliability key
 * @param key - Key from RELIABILITY map
 * @param sd - Population standard deviation (default: 15)
 * @returns SEM value, or 7 as fallback
 */
export function getSEM(key: string, sd: number = 15): number {
  const alpha = RELIABILITY[key];
  if (alpha === undefined) return 7; // Safe fallback
  return calculateSEM(alpha, sd);
}

/**
 * Precomputed SEM values for quick lookup (using SD=15)
 * Rounded to 1 decimal place for display
 */
export const PRECOMPUTED_SEM: Record<string, number> = Object.fromEntries(
  Object.entries(RELIABILITY).map(([key, alpha]) => [
    key,
    Math.round(calculateSEM(alpha) * 10) / 10,
  ])
);

/**
 * Get per-trait SEM data for the BFI radar chart
 * @returns Record mapping BFI trait names to their SEM values
 */
export function getBfiSemData(): Record<string, number> {
  return Object.fromEntries(
    Object.entries(BFI_RELIABILITY_MAP).map(([trait, key]) => [
      trait,
      PRECOMPUTED_SEM[key] || 7,
    ])
  );
}
