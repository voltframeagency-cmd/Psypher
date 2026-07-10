import { LINGUISTIC_PROXY_SCENARIOS } from "@/config/scenarios";
import { SPANISH_LIWC_DICT } from "@/config/locales/es/liwc";

/**
 * Psypher Analytical Engine: Core Scoring Logic
 * 
 * HYBRID ARCHITECTURE (Congruency Matrix):
 * Vector A: Questionnaire (Self-Report) — BFI-2-S, DTDD, AAS-12
 * Vector B: Text Analysis (Behavioral) — LIWC-derived linguistic markers
 * Vector C: Congruency Index — Divergence between A and B
 * 
 * Implements the 7 proprietary frameworks:
 * 1. Personality Architecture (Big Five - BFI-2-S)
 * 2. Sub-Indices Analysis (Dark Triad - DTDD)
 * 3. Connection Blueprint (Attachment Theory - AAS)
 * 4. Cognitive Wiring (Jungian mapping from BFI)
 * 5. Core Drivers (Schwartz Values from linguistic markers)
 * 6. Language Fingerprint (LIWC-based text analysis)
 * 7. Congruency Index (Self-Report vs Behavioral divergence)
 */

export interface RawAssessmentData {
  items: Record<number, number>; // questionIndex: score (1-5 or 1-7)
}

export interface LinguisticMarkers {
  // LIWC-derived categories (0-100 scale)
  cognitiveComplexity: number;    // Multi-clause sentences, tentative language
  emotionalTone: number;          // Positive vs negative affect words
  socialOrientation: number;      // We/they vs I/me ratios
  certaintlyLanguage: number;     // Absolute terms ("always", "never", "must")
  tentativeLanguage: number;      // Hedging ("maybe", "perhaps", "kind of")
  powerLanguage: number;          // Dominance markers ("demand", "require", "control")
  affiliationLanguage: number;    // Connection markers ("together", "share", "care")
  analyticalThinking: number;     // Causal reasoning ("because", "therefore", "thus")
  authenticityScore: number;      // First-person singular, exclusion words
  cloakingScore: number;          // Formal distancing, passive voice, abstraction
  // Raw text stats
  wordCount: number;
  avgSentenceLength: number;
  vocabularyRichness: number;     // Type-token ratio
}

export interface CongruencyResult {
  dimension: string;
  selfReportScore: number;       // From questionnaire (0-100)
  linguisticScore: number;       // From text analysis (0-100)
  discrepancy: number;           // Absolute difference
  direction: "aligned" | "inflated" | "suppressed";  
  interpretation: string;
  evidenceSnippets: string[];    // Phrases from text that drove the score
}

export interface HybridReport {
  // Vector A: Self-Report
  selfReport: {
    bfi: Record<string, number>;
    darkTriad: Record<string, number>;
    attachment: { Style: string; Security: number; [key: string]: string | number };
    cognitiveWiring: string;
  };
  // Vector B: Linguistic Analysis
  linguistic: LinguisticMarkers | null;
  // Vector C: Congruency
  congruency: CongruencyResult[] | null;
  // Frameworks
  cognitive: {
    Type: string;
    Functions: Record<string, number>;
  } | null;
  schwartz: Record<string, number> | null;
  resilience: Record<string, number> | null;
  // Meta
  hasTextSample: boolean;
  overallCongruencyScore: number | null; // 0-100 (100 = perfect alignment)
  // v2 Upgrades
  modifyingIndices?: {
    disclosure: number;
    desirability: number;
    debasement: number;
    isInvalid: boolean;
  };
  sd3?: Record<string, number>;
}

export const PSYPHER_DIMENSIONS = [
  "Personality Architecture",
  "Sub-Indices Analysis",
  "Connection Blueprint",
  "Cognitive Wiring",
  "Core Drivers",
  "Language Fingerprint",
  "Congruency Index"
] as const;

// --- LIWC Word Dictionaries (Compressed) ---
const LIWC_DICT = {
  certainty: ["always", "never", "absolutely", "definitely", "certainly", "must", "undoubtedly", "without a doubt", "clearly", "obviously", "every", "none", "completely", "totally", "entirely", "guaranteed", "impossible", "inevitable", "permanent", "forever"],
  tentative: ["maybe", "perhaps", "possibly", "probably", "might", "could", "sometimes", "somewhat", "sort of", "kind of", "almost", "guess", "suppose", "seem", "appear", "depending", "uncertain", "unclear", "roughly", "approximately"],
  power: ["demand", "require", "control", "dominate", "command", "force", "order", "authority", "superior", "lead", "manage", "decide", "rule", "enforce", "insist", "dictate", "override", "subordinate", "power", "influence"],
  affiliation: ["together", "share", "care", "help", "support", "connect", "belong", "team", "we", "us", "our", "friend", "family", "community", "bond", "trust", "cooperate", "collaborate", "nurture", "comfort"],
  negative: ["hate", "angry", "sad", "frustrated", "annoyed", "terrible", "awful", "horrible", "disgusting", "furious", "devastated", "miserable", "pathetic", "worthless", "stupid", "ugly", "boring", "painful", "exhausting", "unbearable"],
  positive: ["love", "happy", "great", "wonderful", "amazing", "excellent", "beautiful", "fantastic", "brilliant", "incredible", "grateful", "blessed", "excited", "thrilled", "delighted", "perfect", "awesome", "superb", "magnificent", "outstanding"],
  analytical: ["because", "therefore", "thus", "hence", "consequently", "since", "implies", "suggests", "indicates", "demonstrates", "evidence", "reason", "cause", "effect", "result", "analysis", "conclude", "determine", "whereas", "although"],
  firstPerson: ["i", "me", "my", "mine", "myself"],
  thirdPerson: ["he", "she", "they", "them", "his", "her", "their"],
  socialWords: ["we", "us", "our", "together", "people", "everyone", "group", "society", "community", "team"],
  cloak: ["one must", "it is", "there is", "it was", "one should", "the situation", "the matter", "the issue", "it appears", "it seems"],
};

export class PsychologyEngine {
  /**
   * BFI-2-S (30 items) Scoring Key
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
   */
  private static readonly DTDD_MAP = {
    MACHIAVELLIANISM: [31, 32, 33, 34],
    PSYCHOPATHY: [35, 36, 37, 38],
    NARCISSISM: [39, 40, 41, 42],
  };

  /**
   * Attachment (AAS-12) Scoring Key
   */
  private static readonly ATTACH_MAP = {
    CLOSENESS: { plus: [43, 46], minus: [47, 54] },
    DEPENDENCY: { plus: [51], minus: [44] },
    ANXIETY: { plus: [45, 48, 49, 50, 53], minus: [52] },
  };

  /**
   * Short Dark Triad (SD3) Scoring Key
   */
  private static readonly SD3_MAP = {
    MACHIAVELLIANISM: { plus: [151, 152, 153, 154, 155, 156, 157, 158, 159], minus: [] },
    NARCISSISM: { plus: [160, 162, 163, 164, 166, 168], minus: [161, 165, 167] },
    PSYCHOPATHY: { plus: [169, 171, 172, 173, 174, 176, 177], minus: [170, 175] }
  };

  // =============================================
  // VECTOR A: SELF-REPORT SCORING
  // =============================================

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
      indices.forEach(idx => sum += (data[idx] || 3));
      scores[trait] = sum / 4;
    }
    
    return scores;
  }

  static calculateAttachment(data: Record<number, number>) {
    const scores: Record<string, number> = {};
    
    for (const [dim, mapping] of Object.entries(this.ATTACH_MAP)) {
      let sum = 0;
      let count = 0;
      mapping.plus.forEach(idx => { sum += (data[idx] || 3); count++; });
      mapping.minus.forEach(idx => { sum += (6 - (data[idx] || 3)); count++; });
      scores[dim] = sum / count;
    }

    return scores;
  }

  /**
   * Classify attachment style from dimension scores
   */
  static calculateAttachmentStyle(attachment: Record<string, number>): string {
    const anxiety = attachment.ANXIETY || 3;
    const closeness = attachment.CLOSENESS || 3;
    
    if (anxiety <= 2.8 && closeness >= 3.2) return "Secure";
    if (anxiety > 3.2 && closeness >= 3.0) return "Anxious-Preoccupied";
    if (anxiety <= 2.8 && closeness < 3.0) return "Dismissive-Avoidant";
    return "Fearful-Avoidant";
  }

  static calculateSD3(data: Record<number, number>) {
    const scores: Record<string, number> = {};
    for (const [trait, mapping] of Object.entries(this.SD3_MAP)) {
      let sum = 0;
      mapping.plus.forEach(idx => sum += (data[idx] || 3));
      mapping.minus.forEach(idx => sum += (6 - (data[idx] || 3)));
      scores[trait] = sum / 9;
    }
    return scores;
  }

  static applyQuasiIpsativeCorrection(sd3Scores: Record<string, number>): Record<string, number> {
    const mach = sd3Scores.MACHIAVELLIANISM || 3.1;
    const narc = sd3Scores.NARCISSISM || 2.8;
    const psych = sd3Scores.PSYCHOPATHY || 2.4;

    const individualMean = (mach + narc + psych) / 3;

    // Population norms from research blueprint
    const normMach = 3.1;
    const normNarc = 2.8;
    const normPsych = 2.4;

    return {
      MACHIAVELLIANISM: Math.max(1, Math.min(5, mach - individualMean + normMach)),
      NARCISSISM: Math.max(1, Math.min(5, narc - individualMean + normNarc)),
      PSYCHOPATHY: Math.max(1, Math.min(5, psych - individualMean + normPsych))
    };
  }

  static calculateModifyingIndices(data: Record<number, number>): {
    disclosure: number;
    desirability: number;
    debasement: number;
    isInvalid: boolean;
  } {
    const keys = Object.keys(data).map(Number);
    const totalItems = keys.length || 1;
    
    // 1. Disclosure: percentage of non-neutral responses
    let nonNeutral = 0;
    keys.forEach(k => {
      if (data[k] !== 3) nonNeutral++;
    });
    const disclosure = Math.round((nonNeutral / totalItems) * 100);

    // 2. Desirability: socially desirable items (e.g. 12, 13, 22, 23)
    const desirableIndices = [12, 13, 22, 23];
    let desirableSum = 0;
    desirableIndices.forEach(idx => desirableSum += (data[idx] || 3));
    const desirability = Math.round((desirableSum / desirableIndices.length) * 20);

    // 3. Debasement: self-deprecation items (e.g. 9, 27, 28)
    const debasementIndices = [9, 27, 28];
    let debasementSum = 0;
    debasementIndices.forEach(idx => debasementSum += (data[idx] || 3));
    const debasement = Math.round((debasementSum / debasementIndices.length) * 20);

    // Artificially high Desirability paired with zero/low Debasement
    const isInvalid = (desirability > 90 && debasement < 20) || (disclosure < 20);

    return { disclosure, desirability, debasement, isInvalid };
  }

  /**
   * Cognitive Wiring: Jungian Archetype Mapping from Big Five
   */
  static getCognitiveWiring(bfi: Record<string, number>): string {
    const E = bfi.EXTRAVERSION !== undefined ? this.normalizeBFI(bfi.EXTRAVERSION) : 50;
    const O = bfi.OPEN_MINDEDNESS !== undefined ? this.normalizeBFI(bfi.OPEN_MINDEDNESS) : 50;
    const A = bfi.AGREEABLENESS !== undefined ? this.normalizeBFI(bfi.AGREEABLENESS) : 50;
    const C = bfi.CONSCIENTIOUSNESS !== undefined ? this.normalizeBFI(bfi.CONSCIENTIOUSNESS) : 50;

    const energy = E > 50 ? "E" : "I";
    const info = O > 50 ? "N" : "S";
    const decision = A < 50 ? "T" : "F";
    const lifestyle = C > 50 ? "J" : "P";

    return `${energy}${info}${decision}${lifestyle}`;
  }

  static calculateCognitiveFunctions(bfi: Record<string, number>, type: string): Record<string, number> {
    const O = bfi.OPEN_MINDEDNESS !== undefined ? this.normalizeBFI(bfi.OPEN_MINDEDNESS) : 50;
    const C = bfi.CONSCIENTIOUSNESS !== undefined ? this.normalizeBFI(bfi.CONSCIENTIOUSNESS) : 50;
    const E = bfi.EXTRAVERSION !== undefined ? this.normalizeBFI(bfi.EXTRAVERSION) : 50;
    const A = bfi.AGREEABLENESS !== undefined ? this.normalizeBFI(bfi.AGREEABLENESS) : 50;
    const N = bfi.NEGATIVE_EMOTIONALITY !== undefined ? this.normalizeBFI(bfi.NEGATIVE_EMOTIONALITY) : 50;

    return {
      "Adaptive Observation": Math.round((O * 0.7 + C * 0.3)),
      "Objective Analysis": Math.round(((100 - A) * 0.6 + C * 0.4)),
      "External Engagement": Math.round(E),
      "Internal Reflector": Math.round((N * 0.5 + O * 0.5))
    };
  }

  // =============================================
  // VECTOR B: LINGUISTIC ANALYSIS (LIWC-derived)
  // =============================================

  /**
   * Analyze raw text for linguistic markers.
   * Returns LIWC-inspired scores on a 0-100 scale.
   */
  static analyzeLinguistic(text: string, locale?: string): LinguisticMarkers {
    const activeDict = locale === "es" ? SPANISH_LIWC_DICT : LIWC_DICT;
    const words = text.toLowerCase().split(/\s+/).filter(Boolean);
    const wordCount = words.length;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const uniqueWords = new Set(words);
    
    // Count matches for each category
    const count = (dict: string[]) => {
      let matches = 0;
      for (const word of words) {
        if (dict.includes(word)) matches++;
      }
      // Also check multi-word phrases
      const textLower = text.toLowerCase();
      for (const phrase of dict) {
        if (phrase.includes(" ") && textLower.includes(phrase)) {
          matches++;
        }
      }
      return matches;
    };

    // Normalize to 0-100 scale (per 1000 words baseline)
    const norm = (raw: number, baseline: number = 20) => {
      const per1k = (raw / Math.max(wordCount, 1)) * 1000;
      return Math.min(Math.round((per1k / baseline) * 100), 100);
    };

    const certCount = count(activeDict.certainty);
    const tentCount = count(activeDict.tentative);
    const powerCount = count(activeDict.power);
    const affiliCount = count(activeDict.affiliation);
    const negCount = count(activeDict.negative);
    const posCount = count(LIWC_DICT.positive);
    const analCount = count(LIWC_DICT.analytical);
    const fpCount = count(LIWC_DICT.firstPerson);
    const socialCount = count(LIWC_DICT.socialWords);
    const cloakCount = count(LIWC_DICT.cloak);

    // Emotional tone: positive vs negative ratio mapped to 0-100
    const totalEmo = posCount + negCount;
    const emotionalTone = totalEmo > 0 ? Math.round((posCount / totalEmo) * 100) : 50;

    // Social orientation: social words / personal words ratio
    const socialOrientation = norm(socialCount, 15);

    // Authenticity: high first-person singular = more authentic
    const authenticityScore = norm(fpCount, 40);

    // Cloaking: formal distancing, passive constructs
    const cloakingScore = norm(cloakCount, 10);

    // Cognitive complexity: average sentence length + analytical words
    const avgSentenceLength = sentences.length > 0 
      ? Math.round(wordCount / sentences.length) 
      : wordCount;
    const cognitiveComplexity = Math.min(
      Math.round((avgSentenceLength / 25) * 50 + (analCount / Math.max(wordCount, 1)) * 5000),
      100
    );

    return {
      cognitiveComplexity,
      emotionalTone,
      socialOrientation,
      certaintlyLanguage: norm(certCount, 15),
      tentativeLanguage: norm(tentCount, 15),
      powerLanguage: norm(powerCount, 12),
      affiliationLanguage: norm(affiliCount, 15),
      analyticalThinking: norm(analCount, 12),
      authenticityScore,
      cloakingScore,
      wordCount,
      avgSentenceLength,
      vocabularyRichness: Math.round((uniqueWords.size / Math.max(wordCount, 1)) * 100),
    };
  }

  /**
   * Extract evidence snippets — sentences containing specific marker words.
   */
  static extractEvidence(text: string, category: keyof typeof LIWC_DICT, maxSnippets: number = 3): string[] {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 10);
    const dict = LIWC_DICT[category];
    const matches: string[] = [];

    for (const sentence of sentences) {
      const lower = sentence.toLowerCase();
      for (const term of dict) {
        if (lower.includes(term) && !matches.includes(sentence.trim())) {
          matches.push(sentence.trim());
          break;
        }
      }
      if (matches.length >= maxSnippets) break;
    }

    return matches;
  }

  // =============================================
  // VECTOR C: CONGRUENCY INDEX
  // =============================================

  /**
   * Map questionnaire scores to 0-100 scale for comparison
   */
  private static normalizeBFI(score: number): number {
    return Math.round(((score - 1) / 4) * 100); // BFI is 1-5 scale
  }

  private static normalizeDT(score: number): number {
    return Math.round(((score - 1) / 4) * 100); // DTDD is 1-5 scale  
  }

  /**
   * Calculate congruency between Self-Report (questionnaire) 
   * and Behavioral (linguistic) vectors.
   * 
   * High discrepancy = the person's self-image diverges from their behavior.
   */
  static calculateCongruency(
    bfi: Record<string, number>,
    darkTriad: Record<string, number>,
    linguistic: LinguisticMarkers,
    rawText: string
  ): CongruencyResult[] {
    const results: CongruencyResult[] = [];

    // 1. Extraversion vs Social Orientation
    const extSelf = this.normalizeBFI(bfi.EXTRAVERSION);
    const extLing = linguistic.socialOrientation;
    results.push(this.buildCongruency(
      "Extraversion",
      extSelf,
      extLing,
      rawText,
      "socialWords",
      {
        aligned: "Your self-reported sociability matches your natural communication patterns.",
        inflated: "You see yourself as more social than your language patterns suggest — your writing shows more inward focus.",
        suppressed: "Your actual communication is more socially engaged than you give yourself credit for."
      }
    ));

    // 2. Agreeableness vs Affiliation Language
    const agrSelf = this.normalizeBFI(bfi.AGREEABLENESS);
    const agrLing = linguistic.affiliationLanguage;
    results.push(this.buildCongruency(
      "Agreeableness",
      agrSelf,
      agrLing,
      rawText,
      "affiliation",
      {
        aligned: "Your reported empathy aligns with genuine warmth in your language.",
        inflated: "You report high empathy, but your language carries fewer connection markers than expected. Possible social performance.",
        suppressed: "Your language reveals more care and connection than you self-report. You may undervalue your warmth."
      }
    ));

    // 3. Conscientiousness vs Analytical Thinking
    const conSelf = this.normalizeBFI(bfi.CONSCIENTIOUSNESS);
    const conLing = linguistic.analyticalThinking;
    results.push(this.buildCongruency(
      "Conscientiousness",
      conSelf,
      conLing,
      rawText,
      "analytical",
      {
        aligned: "Your reported discipline matches the structured, analytical quality of your writing.",
        inflated: "You report high structure, but your language is more spontaneous and less analytically organized than expected.",
        suppressed: "Your language shows more systematic thinking than you claim — hidden orderliness."
      }
    ));

    // 4. Neuroticism vs Emotional Tone (inverted — high neuroticism = low emotional tone)
    const neuSelf = this.normalizeBFI(bfi.NEGATIVE_EMOTIONALITY);
    const neuLing = 100 - linguistic.emotionalTone; // Invert: low tone = high neg emotionality
    results.push(this.buildCongruency(
      "Emotional Stability",
      100 - neuSelf, // Flip to "stability" framing
      linguistic.emotionalTone,
      rawText,
      "negative",
      {
        aligned: "Your reported emotional profile matches the affect in your language.",
        inflated: "You present as more emotionally stable than your language suggests — hidden tension detected.",
        suppressed: "Your language is more emotionally positive than your self-report — possible learned negativity bias."
      }
    ));

    // 5. Openness vs Cognitive Complexity
    const opnSelf = this.normalizeBFI(bfi.OPEN_MINDEDNESS);
    const opnLing = linguistic.cognitiveComplexity;
    results.push(this.buildCongruency(
      "Openness",
      opnSelf,
      opnLing,
      rawText,
      "analytical",
      {
        aligned: "Your intellectual curiosity is reflected in the complexity of your language.",
        inflated: "You report high openness, but your language is more direct and less abstractly complex than expected.",
        suppressed: "Your language reveals deeper cognitive complexity than you acknowledge."
      }
    ));

    // 6. Machiavellianism vs Power Language
    const machSelf = this.normalizeDT(darkTriad.MACHIAVELLIANISM);
    const machLing = linguistic.powerLanguage;
    results.push(this.buildCongruency(
      "Strategic Manipulation",
      machSelf,
      machLing,
      rawText,
      "power",
      {
        aligned: "Your reported strategic orientation matches power markers in your language.",
        inflated: "You report manipulative tendencies, but your language lacks power assertion — possible edginess performance.",
        suppressed: "Your language contains more control and dominance markers than you self-report. Unconscious power drive detected."
      }
    ));

    // 7. Authenticity vs Cloaking
    const authSelf = 100 - this.normalizeDT(darkTriad.MACHIAVELLIANISM); // Low Mach = high authenticity
    const authLing = 100 - linguistic.cloakingScore; // Low cloaking = high authenticity
    results.push(this.buildCongruency(
      "Authenticity",
      authSelf,
      authLing,
      rawText,
      "cloak",
      {
        aligned: "Your transparency matches across both vectors — consistent self-presentation.",
        inflated: "You present as authentic, but your language uses formal distancing and abstraction — possible cloaking behavior.",
        suppressed: "Your language is more direct and raw than your self-report suggests — hidden authenticity."
      }
    ));

    return results;
  }

  /**
   * Build a single congruency result
   */
  private static buildCongruency(
    dimension: string,
    selfScore: number,
    lingScore: number,
    rawText: string,
    evidenceCategory: keyof typeof LIWC_DICT,
    interpretations: { aligned: string; inflated: string; suppressed: string }
  ): CongruencyResult {
    const discrepancy = Math.abs(selfScore - lingScore);
    
    let direction: "aligned" | "inflated" | "suppressed";
    let interpretation: string;
    
    if (discrepancy <= 15) {
      direction = "aligned";
      interpretation = interpretations.aligned;
    } else if (selfScore > lingScore) {
      direction = "inflated";
      interpretation = interpretations.inflated;
    } else {
      direction = "suppressed";
      interpretation = interpretations.suppressed;
    }

    return {
      dimension,
      selfReportScore: selfScore,
      linguisticScore: lingScore,
      discrepancy,
      direction,
      interpretation,
      evidenceSnippets: this.extractEvidence(rawText, evidenceCategory, 2),
    };
  }

  /**
   * Calculate overall congruency score (0-100, 100 = perfect alignment)
   */
  static getOverallCongruency(results: CongruencyResult[]): number {
    if (results.length === 0) return 100;
    const avgDiscrepancy = results.reduce((sum, r) => sum + r.discrepancy, 0) / results.length;
    return Math.max(0, Math.round(100 - avgDiscrepancy));
  }

  /**
   * Derive Core Drivers (Schwartz Values) from linguistic and self-report data.
   */
  static calculateSchwartz(bfi: Record<string, number>, linguistic: LinguisticMarkers | null): Record<string, number> {
    const scores: Record<string, number> = {};
    
    // Using Title Case as expected by many UI labels, or staying consistent
    const powerBase = linguistic ? linguistic.powerLanguage : 50;
    scores.Power = Math.round((powerBase * 0.7) + (bfi.EXTRAVERSION * 6));

    const achBase = linguistic ? linguistic.analyticalThinking : 50;
    scores.Achievement = Math.round((achBase * 0.5) + (bfi.CONSCIENTIOUSNESS * 10));

    const hedBase = linguistic ? linguistic.emotionalTone : 50;
    scores.Hedonism = Math.round((hedBase * 0.4) + (bfi.EXTRAVERSION * 12));

    const uniBase = linguistic ? linguistic.socialOrientation : 50;
    scores.Universalism = Math.round((uniBase * 0.6) + (bfi.AGREEABLENESS * 8));

    const secBase = linguistic ? linguistic.certaintlyLanguage : 50;
    const stability = 6 - (bfi.NEGATIVE_EMOTIONALITY || bfi.Neuroticism || 3);
    scores.Security = Math.round((secBase * 0.4) + (stability * 12));

    const benBase = linguistic ? linguistic.affiliationLanguage : 50;
    scores.Benevolence = Math.round((benBase * 0.6) + (bfi.AGREEABLENESS * 8));

    const tradBase = linguistic ? (100 - linguistic.tentativeLanguage) : 50;
    scores.Tradition = Math.round((tradBase * 0.4) + (bfi.CONSCIENTIOUSNESS * 6) + ((6 - bfi.OPEN_MINDEDNESS) * 6));

    const confBase = linguistic ? (100 - linguistic.powerLanguage) : 50;
    scores.Conformity = Math.round((confBase * 0.4) + (bfi.CONSCIENTIOUSNESS * 6) + (bfi.AGREEABLENESS * 6));

    const stimBase = linguistic ? (100 - linguistic.certaintlyLanguage) : 50;
    scores.Stimulation = Math.round((stimBase * 0.4) + (bfi.EXTRAVERSION * 6) + (bfi.OPEN_MINDEDNESS * 6));

    const sdBase = linguistic ? linguistic.cognitiveComplexity : 50;
    scores.SelfDirection = Math.round((sdBase * 0.6) + (bfi.OPEN_MINDEDNESS * 8));

    Object.keys(scores).forEach(k => scores[k] = Math.min(Math.max(scores[k], 0), 100));
    
    return scores;
  }

  /**
   * Calculate Resilience Index and sub-factors.
   * Keys aligned with UI: Durability, Agility, Focus.
   */
  static calculateResilience(bfi: Record<string, number>): Record<string, number> {
    const stability = 6 - (bfi.NEGATIVE_EMOTIONALITY || bfi.Neuroticism || 3);
    const conscientiousness = bfi.CONSCIENTIOUSNESS || 3;
    
    const overall = Math.round(((conscientiousness + stability) / 2) * 20);
    
    return {
      Overall: overall,
      Durability: Math.round(stability * 20),
      Agility: Math.round(conscientiousness * 20),
      Focus: Math.round(((stability * 1.5) + (conscientiousness * 0.5)) * 10)
    };
  }

  // =============================================
  // FULL HYBRID REPORT GENERATION
  // =============================================

  static calculateProxyLinguistic(selectedOptionIds: string[] | Record<string, number>): LinguisticMarkers {
    let totalComplexity = 0;
    let totalCertainty = 0;
    let totalPower = 0;
    let totalCloaking = 0;
    let totalWeight = 0;

    if (Array.isArray(selectedOptionIds)) {
      selectedOptionIds.forEach(optionId => {
        for (const scenario of LINGUISTIC_PROXY_SCENARIOS) {
          const option = scenario.options.find(opt => opt.id === optionId);
          if (option) {
            totalComplexity += option.linguisticWeights.cognitiveComplexity;
            totalCertainty += option.linguisticWeights.certaintyLanguage;
            totalPower += option.linguisticWeights.powerLanguage;
            totalCloaking += option.linguisticWeights.cloakingScore;
            totalWeight += 1;
            break;
          }
        }
      });
    } else if (typeof selectedOptionIds === "object" && selectedOptionIds !== null) {
      // FCE Weighted average calculation
      for (const scenario of LINGUISTIC_PROXY_SCENARIOS) {
        let scenarioComplexity = 0;
        let scenarioCertainty = 0;
        let scenarioPower = 0;
        let scenarioCloaking = 0;
        let scenarioAllocated = 0;

        scenario.options.forEach((option, index) => {
          const genericKey = `opt_${index + 1}`;
          const altGenericKey = `${index + 1}`;
          const letterKey = `opt_${String.fromCharCode(65 + index)}`;

          const pct = selectedOptionIds[option.id] !== undefined
            ? selectedOptionIds[option.id]
            : (selectedOptionIds[genericKey] !== undefined
                ? selectedOptionIds[genericKey]
                : (selectedOptionIds[altGenericKey] !== undefined
                    ? selectedOptionIds[altGenericKey]
                    : (selectedOptionIds[letterKey] !== undefined ? selectedOptionIds[letterKey] : 0)));

          scenarioComplexity += option.linguisticWeights.cognitiveComplexity * pct;
          scenarioCertainty += option.linguisticWeights.certaintyLanguage * pct;
          scenarioPower += option.linguisticWeights.powerLanguage * pct;
          scenarioCloaking += option.linguisticWeights.cloakingScore * pct;
          scenarioAllocated += pct;
        });

        if (scenarioAllocated > 0 && !isNaN(scenarioAllocated)) {
          totalComplexity += scenarioComplexity / scenarioAllocated;
          totalCertainty += scenarioCertainty / scenarioAllocated;
          totalPower += scenarioPower / scenarioAllocated;
          totalCloaking += scenarioCloaking / scenarioAllocated;
          totalWeight += 1;
        }
      }
    }

    const count = totalWeight || 1;

    const avgComplexity = Math.round(totalComplexity / count);
    const avgCertainty = Math.round(totalCertainty / count);
    const avgPower = Math.round(totalPower / count);
    const avgCloaking = Math.round(totalCloaking / count);

    return {
      cognitiveComplexity: avgComplexity,
      emotionalTone: 50,
      socialOrientation: 50,
      certaintlyLanguage: avgCertainty,
      tentativeLanguage: 100 - avgCertainty,
      powerLanguage: avgPower,
      affiliationLanguage: 50,
      analyticalThinking: avgComplexity,
      authenticityScore: 100 - avgCloaking,
      cloakingScore: avgCloaking,
      wordCount: 300,
      avgSentenceLength: 22,
      vocabularyRichness: 75
    };
  }

  /**
   * Generate the complete hybrid report from both vectors.
   */
  static generateHybridReport(
    questionnaireData: Record<number, number>,
    textOrOptionIds?: string | string[] | Record<string, number>,
    locale?: string
  ): HybridReport {
    // Vector A: Self-Report
    const bfi = this.calculateBFI2S(questionnaireData);
    let darkTriad = this.calculateDTDD(questionnaireData);

    const hasSD3 = Object.keys(questionnaireData).some(k => Number(k) >= 151);
    const sd3Raw = hasSD3 ? this.calculateSD3(questionnaireData) : null;
    const sd3 = sd3Raw ? this.applyQuasiIpsativeCorrection(sd3Raw) : undefined;

    if (sd3) {
      darkTriad = sd3;
    }

    const attachmentScores = this.calculateAttachment(questionnaireData);
    const attachment = {
      ...attachmentScores,
      Style: this.calculateAttachmentStyle(attachmentScores),
      Security: Math.round((attachmentScores.CLOSENESS || 3) * 20)
    };
    const cognitiveWiring = this.getCognitiveWiring(bfi);

    // Vector B: Linguistic (if text or proxy IDs provided)
    let linguistic: LinguisticMarkers | null = null;
    let hasTextSample = false;
    let isProxy = false;

    if (textOrOptionIds) {
      if (Array.isArray(textOrOptionIds) || (typeof textOrOptionIds === "object" && textOrOptionIds !== null)) {
        hasTextSample = Array.isArray(textOrOptionIds) ? textOrOptionIds.length > 0 : Object.keys(textOrOptionIds).length > 0;
        isProxy = true;
        linguistic = hasTextSample ? this.calculateProxyLinguistic(textOrOptionIds as any) : null;
      } else if (typeof textOrOptionIds === "string") {
        hasTextSample = !!(textOrOptionIds.trim().split(/\s+/).length >= 100);
        linguistic = hasTextSample ? this.analyzeLinguistic(textOrOptionIds, locale) : null;
      }
    }

    // Vector C: Congruency (only if both vectors exist)
    const congruency = (hasTextSample && linguistic)
      ? this.calculateCongruency(bfi, darkTriad, linguistic, isProxy ? "" : (textOrOptionIds as string))
      : null;

    const overallCongruencyScore = congruency 
      ? this.getOverallCongruency(congruency) 
      : null;

    // Schwartz and Resilience
    const schwartz = this.calculateSchwartz(bfi, linguistic);
    const resilience = this.calculateResilience(bfi);
    const cognitive = {
      Type: `${cognitiveWiring} ${this.getTypeLabel(cognitiveWiring)}`,
      Functions: this.calculateCognitiveFunctions(bfi, cognitiveWiring)
    };

    const modifyingIndices = this.calculateModifyingIndices(questionnaireData);

    return {
      selfReport: { bfi, darkTriad, attachment, cognitiveWiring },
      linguistic,
      congruency,
      cognitive,
      schwartz,
      resilience,
      hasTextSample,
      overallCongruencyScore,
      modifyingIndices,
      sd3: sd3 || undefined
    };
  }

  private static getTypeLabel(type: string): string {
    const labels: Record<string, string> = {
      "INTJ": "Mastermind", "ENTJ": "Commander", "INFJ": "Advocate", "ENFJ": "Protagonist",
      "INTP": "Architect", "ENTP": "Debater", "INFP": "Mediator", "ENFP": "Campaigner",
      "ISTJ": "Logistician", "ESTJ": "Executive", "ISFJ": "Defender", "ESFJ": "Consul",
      "ISTP": "Virtuoso", "ESTP": "Entrepreneur", "ISFP": "Adventurer", "ESFP": "Entertainer"
    };
    return labels[type] || "Architect";
  }

  static normalizeReport(report: HybridReport): HybridReport {
    // Check if it's already normalized to avoid double-normalizing
    const bfi = report.selfReport?.bfi;
    if (!bfi) return report;
    
    const isRaw = Object.keys(bfi).some(k => k === "EXTRAVERSION" || k === "OPEN_MINDEDNESS");
    if (!isRaw) return report; // Already normalized/Title Cased
    
    const traitKeyMapping: Record<string, string> = {
      "OPEN_MINDEDNESS": "Openness",
      "CONSCIENTIOUSNESS": "Conscientiousness",
      "EXTRAVERSION": "Extraversion",
      "AGREEABLENESS": "Agreeableness",
      "NEGATIVE_EMOTIONALITY": "Neuroticism"
    };

    const dtKeyMapping: Record<string, string> = {
      "MACHIAVELLIANISM": "Machiavellianism",
      "NARCISSISM": "Narcissism",
      "PSYCHOPATHY": "Psychopathy"
    };

    const normalizedBfi: Record<string, number> = {};
    for (const [key, val] of Object.entries(bfi)) {
      const mappedKey = traitKeyMapping[key] || key;
      normalizedBfi[mappedKey] = Math.round(((val - 1) / 4) * 100);
    }

    const normalizedDt: Record<string, number> = {};
    const dt = report.selfReport?.darkTriad;
    if (dt) {
      for (const [key, val] of Object.entries(dt)) {
        const mappedKey = dtKeyMapping[key] || key;
        normalizedDt[mappedKey] = Math.round(((val - 1) / 4) * 100);
      }
    }

    return {
      ...report,
      selfReport: {
        ...report.selfReport,
        bfi: normalizedBfi,
        darkTriad: normalizedDt
      }
    };
  }
}
