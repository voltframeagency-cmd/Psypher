/**
 * Psypher Intelligence Engine: Core Scoring Logic
 * 
 * Implements the 7 proprietary frameworks derived from:
 * 1. Personality Architecture (Big Five - BFI-2-S)
 * 2. Shadow Profile (Dark Triad - DTDD)
 * 3. Connection Blueprint (Attachment Theory - ECR)
 * 4. Cognitive Wiring (Jungian mapping)
 * 5. Core Drivers (Schwartz Values mapping)
 * 6. Language Fingerprint (Placeholder for LIWC parsing)
 * 7. Resilience Index (DSM-5 reconfiguration)
 */

export interface RawAssessmentData {
  items: Record<number, number>; // questionIndex: score (1-5 or 1-7)
}

export const PSYPHER_DIMENSIONS = [
  "Personality Architecture",
  "Shadow Profile",
  "Connection Blueprint",
  "Cognitive Wiring",
  "Core Drivers",
  "Language Fingerprint",
  "Resilience Index"
] as const;

export class PsychologyEngine {
  /**
   * BFI-2-S (30 items) Scoring Key
   * Indices (1-based from research)
   */
  private static readonly BFI_MAP = {
    EXTRAVERSION: { plus: [6, 11, 16], minus: [1, 21, 26] },
    AGREEABLENESS: { plus: [2, 12, 22], minus: [7, 17, 27] },
    CONSCIENTIOUSNESS: { plus: [13, 18, 23], minus: [3, 8, 28] },
    NEGATIVE_EMOTIONALITY: { plus: [4, 9, 29], minus: [14, 19, 24] },
    OPEN_MINDEDNESS: { plus: [5, 15, 25], minus: [10, 20, 30] },
  };

  /**
   * Dark Triad Dirty Dozen (DTDD) Scoring Key
   * Indices (1-based - added to path A)
   */
  private static readonly DTDD_MAP = {
    MACHIAVELLIANISM: [31, 32, 33, 34],
    PSYCHOPATHY: [35, 36, 37, 38],
    NARCISSISM: [39, 40, 41, 42],
  };

  static calculateBFI2S(data: Record<number, number>) {
    const scores: Record<string, number> = {};
    
    for (const [trait, mapping] of Object.entries(this.BFI_MAP)) {
      let sum = 0;
      mapping.plus.forEach(idx => sum += (data[idx] || 3));
      mapping.minus.forEach(idx => sum += (6 - (data[idx] || 3))); // 5 point scale reverse
      scores[trait] = sum / 6;
    }
    
    return scores;
  }

  static calculateDTDD(data: Record<number, number>) {
    const scores: Record<string, number> = {};
    
    for (const [trait, indices] of Object.entries(this.DTDD_MAP)) {
      let sum = 0;
      indices.forEach(idx => sum += (data[idx] || 4)); // 7 point scale mid
      scores[trait] = sum / 4;
    }
    
    return scores;
  }

  /**
   * Cognitive Wiring: Jungian Archetype Mapping
   * Derived from Big Five configurations
   */
  static getCognitiveWiring(bfi: Record<string, number>) {
    const E = bfi.EXTRAVERSION > 3.5 ? "E" : "I";
    const S = bfi.OPEN_MINDEDNESS < 2.5 ? "S" : "N";
    const T = bfi.AGREEABLENESS < 2.8 ? "T" : "F";
    const J = bfi.CONSCIENTIOUSNESS > 3.8 ? "J" : "P";
    
    return `${E}${S}${T}${J}`;
  }
}
