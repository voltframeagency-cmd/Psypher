/**
 * PSYPHER SCORING VALIDATION
 * 
 * Tests 3 distinct profiles through the full scoring pipeline:
 *   Profile A: "ENTJ Commander" — high E, low A, high C, high O, low N
 *   Profile B: "INFP Mediator"  — low E, high A, low C, high O, high N
 *   Profile C: "All neutral"    — everything at 3 (midpoint)
 * 
 * Run: npx tsx src/tests/scoring-validation.ts
 */

import { PsychologyEngine, HybridReport } from "../lib/psychology/scoring";
import { ReportEngine } from "../lib/psychology/engine";

// ============================================================
// TEST PROFILES
// ============================================================

// Profile A: Extreme ENTJ
// BFI keys: EXTRAVERSION plus=[6,11,16] minus=[1,21,26]
//           AGREEABLENESS plus=[2,12,22] minus=[7,17,27]
//           CONSCIENTIOUSNESS plus=[13,18,23] minus=[3,8,28]
//           NEGATIVE_EMOTIONALITY plus=[4,9,29] minus=[14,19,24]
//           OPEN_MINDEDNESS plus=[5,15,25] minus=[10,20,30]
const ENTJ_ANSWERS: Record<number, number> = {
  // EXTRAVERSION: plus items=5, minus items=1 → score = (5+5+5 + (6-1)+(6-1)+(6-1)) / 6 = (15+15)/6 = 5.0
  1: 1, 6: 5, 11: 5, 16: 5, 21: 1, 26: 1,
  // AGREEABLENESS: plus items=1, minus items=5 → score = (1+1+1 + (6-5)+(6-5)+(6-5)) / 6 = (3+3)/6 = 1.0
  2: 1, 7: 5, 12: 1, 17: 5, 22: 1, 27: 5,
  // CONSCIENTIOUSNESS: plus items=5, minus items=1 → score = 5.0
  3: 1, 8: 1, 13: 5, 18: 5, 23: 5, 28: 1,
  // NEGATIVE_EMOTIONALITY: plus items=1, minus items=5 → score = 1.0
  4: 1, 9: 1, 14: 5, 19: 5, 24: 5, 29: 1,
  // OPEN_MINDEDNESS: plus items=5, minus items=1 → score = 5.0
  5: 5, 10: 1, 15: 5, 20: 1, 25: 5, 30: 1,
  // DTDD: High Mach, Moderate Psych, Moderate Narc
  31: 4, 32: 4, 33: 4, 34: 4,   // MACH avg = 4.0
  35: 3, 36: 3, 37: 3, 38: 3,   // PSYCH avg = 3.0
  39: 3, 40: 3, 41: 3, 42: 3,   // NARC avg = 3.0
  // AAS-12: Secure (high closeness, low anxiety)
  43: 5, 44: 1, 45: 1, 46: 5, 47: 1, 48: 1,
  49: 1, 50: 1, 51: 5, 52: 5, 53: 1, 54: 1,
};

// Profile B: Extreme INFP
const INFP_ANSWERS: Record<number, number> = {
  // EXTRAVERSION: plus items=1, minus items=5 → score = 1.0
  1: 5, 6: 1, 11: 1, 16: 1, 21: 5, 26: 5,
  // AGREEABLENESS: plus items=5, minus items=1 → score = 5.0
  2: 5, 7: 1, 12: 5, 17: 1, 22: 5, 27: 1,
  // CONSCIENTIOUSNESS: plus items=1, minus items=5 → score = 1.0
  3: 5, 8: 5, 13: 1, 18: 1, 23: 1, 28: 5,
  // NEGATIVE_EMOTIONALITY: plus items=5, minus items=1 → score = 5.0
  4: 5, 9: 5, 14: 1, 19: 1, 24: 1, 29: 5,
  // OPEN_MINDEDNESS: plus items=5, minus items=1 → score = 5.0
  5: 5, 10: 1, 15: 5, 20: 1, 25: 5, 30: 1,
  // DTDD: Low across the board
  31: 1, 32: 1, 33: 1, 34: 1,   // MACH avg = 1.0
  35: 1, 36: 1, 37: 1, 38: 1,   // PSYCH avg = 1.0
  39: 2, 40: 2, 41: 2, 42: 2,   // NARC avg = 2.0
  // AAS-12: Anxious-Preoccupied (moderate closeness, high anxiety)
  43: 4, 44: 3, 45: 5, 46: 4, 47: 2, 48: 5,
  49: 5, 50: 4, 51: 3, 52: 1, 53: 5, 54: 2,
};

// Profile C: All neutral (every answer = 3)
const NEUTRAL_ANSWERS: Record<number, number> = {};
for (let i = 1; i <= 54; i++) NEUTRAL_ANSWERS[i] = 3;

// ============================================================
// VALIDATION HELPERS
// ============================================================

let passed = 0;
let failed = 0;

function assert(condition: boolean, label: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ ${label}`);
    passed++;
  } else {
    console.error(`  ❌ ${label}${detail ? ` — ${detail}` : ""}`);
    failed++;
  }
}

function assertRange(value: number, min: number, max: number, label: string) {
  assert(
    value >= min && value <= max,
    `${label}: ${value.toFixed(2)} in [${min}, ${max}]`,
    `got ${value}`
  );
}

function assertApprox(value: number, expected: number, tolerance: number, label: string) {
  assert(
    Math.abs(value - expected) <= tolerance,
    `${label}: ${value.toFixed(2)} ≈ ${expected} (±${tolerance})`,
    `got ${value.toFixed(2)}, expected ${expected}`
  );
}

// ============================================================
// TEST SUITE
// ============================================================

async function runTests() {
  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log("║     PSYPHER SCORING VALIDATION SUITE             ║");
  console.log("╚══════════════════════════════════════════════════╝\n");

  // -----------------------------------------------------------
  // PROFILE A: ENTJ Commander
  // -----------------------------------------------------------
  console.log("━━━ PROFILE A: ENTJ Commander ━━━");
  
  const entjReport = PsychologyEngine.generateHybridReport(ENTJ_ANSWERS, undefined, "en");
  const bfiA = entjReport.selfReport.bfi;
  
  console.log("\n  [BFI-2-S Scores]");
  console.log(`    EXTRAVERSION: ${bfiA.EXTRAVERSION?.toFixed(2)}`);
  console.log(`    AGREEABLENESS: ${bfiA.AGREEABLENESS?.toFixed(2)}`);
  console.log(`    CONSCIENTIOUSNESS: ${bfiA.CONSCIENTIOUSNESS?.toFixed(2)}`);
  console.log(`    NEGATIVE_EMOTIONALITY: ${bfiA.NEGATIVE_EMOTIONALITY?.toFixed(2)}`);
  console.log(`    OPEN_MINDEDNESS: ${bfiA.OPEN_MINDEDNESS?.toFixed(2)}`);
  
  assertApprox(bfiA.EXTRAVERSION, 5.0, 0.01, "ENTJ Extraversion should be 5.0");
  assertApprox(bfiA.AGREEABLENESS, 1.0, 0.01, "ENTJ Agreeableness should be 1.0");
  assertApprox(bfiA.CONSCIENTIOUSNESS, 5.0, 0.01, "ENTJ Conscientiousness should be 5.0");
  assertApprox(bfiA.NEGATIVE_EMOTIONALITY, 1.0, 0.01, "ENTJ Neg Emotionality should be 1.0");
  assertApprox(bfiA.OPEN_MINDEDNESS, 5.0, 0.01, "ENTJ Openness should be 5.0");
  
  console.log("\n  [Dark Triad DTDD]");
  const dtA = entjReport.selfReport.darkTriad;
  console.log(`    MACHIAVELLIANISM: ${dtA.MACHIAVELLIANISM?.toFixed(2)}`);
  console.log(`    PSYCHOPATHY: ${dtA.PSYCHOPATHY?.toFixed(2)}`);
  console.log(`    NARCISSISM: ${dtA.NARCISSISM?.toFixed(2)}`);
  
  assertApprox(dtA.MACHIAVELLIANISM, 4.0, 0.01, "ENTJ Mach should be 4.0");
  assertApprox(dtA.PSYCHOPATHY, 3.0, 0.01, "ENTJ Psych should be 3.0");
  assertApprox(dtA.NARCISSISM, 3.0, 0.01, "ENTJ Narc should be 3.0");
  
  console.log("\n  [Cognitive Wiring]");
  console.log(`    Type: ${entjReport.selfReport.cognitiveWiring}`);
  // E>50 → E, O>50 → N, A<50 → T, C>50 → J  
  assert(entjReport.selfReport.cognitiveWiring === "ENTJ", `Cognitive wiring should be ENTJ, got ${entjReport.selfReport.cognitiveWiring}`);
  
  console.log("\n  [Attachment]");
  const attA = entjReport.selfReport.attachment;
  console.log(`    Style: ${attA.Style}`);
  console.log(`    CLOSENESS: ${(attA.CLOSENESS as number)?.toFixed(2)}`);
  console.log(`    ANXIETY: ${(attA.ANXIETY as number)?.toFixed(2)}`);
  assert(attA.Style === "Secure", `ENTJ attachment should be Secure, got ${attA.Style}`);
  
  console.log("\n  [Schwartz Values]");
  const schA = entjReport.schwartz;
  if (schA) {
    Object.entries(schA).forEach(([k, v]) => console.log(`    ${k}: ${v}`));
    assertRange(schA.Power, 0, 100, "ENTJ Schwartz Power");
    assertRange(schA.Achievement, 0, 100, "ENTJ Schwartz Achievement");
  } else {
    assert(false, "Schwartz values should exist");
  }
  
  console.log("\n  [Resilience]");
  const resA = entjReport.resilience;
  if (resA) {
    Object.entries(resA).forEach(([k, v]) => console.log(`    ${k}: ${v}`));
    assert(resA.Overall > 60, `ENTJ Resilience overall should be high, got ${resA.Overall}`);
  } else {
    assert(false, "Resilience should exist");
  }
  
  console.log("\n  [Modifying Indices]");
  const modA = entjReport.modifyingIndices;
  if (modA) {
    console.log(`    Disclosure: ${modA.disclosure}%`);
    console.log(`    Desirability: ${modA.desirability}%`);
    console.log(`    Debasement: ${modA.debasement}%`);
    console.log(`    Is Invalid: ${modA.isInvalid}`);
    assert(modA.disclosure > 80, `ENTJ disclosure should be high (extreme answers), got ${modA.disclosure}%`);
  }

  console.log("\n  [Cognitive Functions]");
  const cogA = entjReport.cognitive;
  if (cogA) {
    console.log(`    Type: ${cogA.Type}`);
    Object.entries(cogA.Functions).forEach(([k, v]) => console.log(`    ${k}: ${v}`));
    assert(cogA.Type.includes("ENTJ"), `Cognitive type should contain ENTJ, got ${cogA.Type}`);
    assert(cogA.Functions["External Engagement"] > 70, `ENTJ external engagement should be high, got ${cogA.Functions["External Engagement"]}`);
  }

  // -----------------------------------------------------------
  // PROFILE B: INFP Mediator
  // -----------------------------------------------------------
  console.log("\n━━━ PROFILE B: INFP Mediator ━━━");
  
  const infpReport = PsychologyEngine.generateHybridReport(INFP_ANSWERS, undefined, "en");
  const bfiB = infpReport.selfReport.bfi;
  
  console.log("\n  [BFI-2-S Scores]");
  Object.entries(bfiB).forEach(([k, v]) => console.log(`    ${k}: ${v.toFixed(2)}`));
  
  assertApprox(bfiB.EXTRAVERSION, 1.0, 0.01, "INFP Extraversion should be 1.0");
  assertApprox(bfiB.AGREEABLENESS, 5.0, 0.01, "INFP Agreeableness should be 5.0");
  assertApprox(bfiB.CONSCIENTIOUSNESS, 1.0, 0.01, "INFP Conscientiousness should be 1.0");
  assertApprox(bfiB.NEGATIVE_EMOTIONALITY, 5.0, 0.01, "INFP Neg Emotionality should be 5.0");
  assertApprox(bfiB.OPEN_MINDEDNESS, 5.0, 0.01, "INFP Openness should be 5.0");
  
  console.log("\n  [Cognitive Wiring]");
  console.log(`    Type: ${infpReport.selfReport.cognitiveWiring}`);
  // E<50 → I, O>50 → N, A>50 → F, C<50 → P
  assert(infpReport.selfReport.cognitiveWiring === "INFP", `Should be INFP, got ${infpReport.selfReport.cognitiveWiring}`);
  
  console.log("\n  [Attachment]");
  const attB = infpReport.selfReport.attachment;
  console.log(`    Style: ${attB.Style}`);
  assert(attB.Style === "Anxious-Preoccupied" || attB.Style === "Fearful-Avoidant", 
    `INFP attachment should be Anxious or Fearful, got ${attB.Style}`);
  
  console.log("\n  [Dark Triad]");
  const dtB = infpReport.selfReport.darkTriad;
  Object.entries(dtB).forEach(([k, v]) => console.log(`    ${k}: ${v.toFixed(2)}`));
  assert(dtB.MACHIAVELLIANISM < 2, `INFP Mach should be low, got ${dtB.MACHIAVELLIANISM}`);

  console.log("\n  [Resilience]");
  const resB = infpReport.resilience;
  if (resB) {
    Object.entries(resB).forEach(([k, v]) => console.log(`    ${k}: ${v}`));
    assert(resB.Overall < 40, `INFP resilience should be low (low C, high N), got ${resB.Overall}`);
  }

  // -----------------------------------------------------------
  // PROFILE C: All Neutral (3s)
  // -----------------------------------------------------------
  console.log("\n━━━ PROFILE C: All Neutral ━━━");
  
  const neutralReport = PsychologyEngine.generateHybridReport(NEUTRAL_ANSWERS, undefined, "en");
  const bfiC = neutralReport.selfReport.bfi;
  
  console.log("\n  [BFI-2-S Scores]");
  Object.entries(bfiC).forEach(([k, v]) => console.log(`    ${k}: ${v.toFixed(2)}`));
  
  // All items = 3: plus gives 3, minus gives 6-3=3, so sum=18, avg=3.0
  for (const [trait, score] of Object.entries(bfiC)) {
    assertApprox(score, 3.0, 0.01, `Neutral ${trait} should be 3.0`);
  }
  
  console.log("\n  [Cognitive Wiring]");
  console.log(`    Type: ${neutralReport.selfReport.cognitiveWiring}`);
  // BFI all 3.0 → normalized = ((3-1)/4)*100 = 50
  // E=50 → "I" (not > 50), O=50 → "S" (not > 50), A=50 → "F" (not < 50), C=50 → "P" (not > 50)
  assert(neutralReport.selfReport.cognitiveWiring === "ISFP", `Neutral should be ISFP (boundary), got ${neutralReport.selfReport.cognitiveWiring}`);

  // -----------------------------------------------------------
  // REPORT ENGINE: Narrative Assembly
  // -----------------------------------------------------------
  console.log("\n━━━ REPORT ENGINE: Narrative Text ━━━");
  
  const entjNarrative = await ReportEngine.assembleHybridReport(entjReport, "en");
  
  console.log("\n  [Generated Sections]");
  const expectedSections = ["personality_architecture", "shadow_profile", "connection_blueprint", "cognitive_wiring", "core_drivers", "validity_audit", "vocational_vectors"];
  for (const section of expectedSections) {
    const content = entjNarrative[section];
    assert(!!content && content.length > 10, `Section "${section}" should have content`, content ? `length=${content.length}` : "MISSING");
    if (content) console.log(`    ${section}: "${content.substring(0, 60)}..."`);
  }

  // Verify cognitive wiring text mentions ENTJ
  assert(
    entjNarrative.cognitive_wiring?.includes("ENTJ"),
    `Cognitive wiring text should mention ENTJ`,
    `Got: ${entjNarrative.cognitive_wiring?.substring(0, 80)}`
  );

  // Verify validity audit shows validation pass (ENTJ has extreme but valid answers)
  assert(
    entjNarrative.validity_audit?.includes("Disclosure") || entjNarrative.validity_audit?.includes("Desirability"),
    `Validity audit should mention Disclosure/Desirability`,
    `Got: ${entjNarrative.validity_audit?.substring(0, 80)}`
  );

  // -----------------------------------------------------------
  // HYBRID WITH TEXT SAMPLE (FCE proxy)
  // -----------------------------------------------------------
  console.log("\n━━━ HYBRID: Text Sample Congruency ━━━");
  
  const fceOptions = { "opt_1": 40, "opt_2": 35, "opt_3": 25 };
  const hybridReport = PsychologyEngine.generateHybridReport(ENTJ_ANSWERS, fceOptions, "en");
  
  assert(hybridReport.hasTextSample === true, "Should detect text sample presence");
  assert(hybridReport.linguistic !== null, "Should have linguistic markers");
  assert(hybridReport.congruency !== null, "Should have congruency results");
  
  if (hybridReport.congruency) {
    console.log(`    Congruency dimensions: ${hybridReport.congruency.length}`);
    for (const c of hybridReport.congruency) {
      console.log(`    ${c.dimension}: self=${c.selfReportScore} ling=${c.linguisticScore} disc=${c.discrepancy} → ${c.direction}`);
      assertRange(c.selfReportScore, 0, 100, `${c.dimension} self score`);
      assertRange(c.linguisticScore, 0, 100, `${c.dimension} linguistic score`);
      assert(["aligned", "inflated", "suppressed"].includes(c.direction), `${c.dimension} direction valid`);
    }
  }
  
  assert(hybridReport.overallCongruencyScore !== null, "Overall congruency score should exist");
  if (hybridReport.overallCongruencyScore !== null) {
    assertRange(hybridReport.overallCongruencyScore, 0, 100, "Overall congruency score");
    console.log(`    Overall Congruency: ${hybridReport.overallCongruencyScore}%`);
  }

  // -----------------------------------------------------------
  // FINAL SUMMARY
  // -----------------------------------------------------------
  console.log("\n╔══════════════════════════════════════════════════╗");
  console.log(`║  RESULTS: ${passed} passed, ${failed} failed                    `);
  console.log("╚══════════════════════════════════════════════════╝\n");
  
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error("Test suite crashed:", err);
  process.exit(1);
});
