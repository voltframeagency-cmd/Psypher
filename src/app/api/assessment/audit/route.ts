import { NextRequest, NextResponse } from "next/server";

/**
 * PSYPHER COMPLIANCE & INVARIANCE AUDITING ROUTE
 * 
 * Performs automated validation checks:
 * 1. Four-Fifths Rule Adverse Impact Check
 * 2. Criterion Validity & Cut-Score Utility Validation
 * 3. Differential Item Functioning (DIF) Auditing
 */
export async function POST(req: NextRequest) {
  try {
    const { 
      protectedSelectionRate, 
      referenceSelectionRate, 
      criterionValidity, 
      cutScorePercentile,
      difItems 
    } = await req.json();

    // 1. Four-Fifths Rule (Adverse Impact) Audit
    const adverseImpactRatio = referenceSelectionRate > 0 
      ? protectedSelectionRate / referenceSelectionRate 
      : 1.0;
    
    const adverseImpactComplies = adverseImpactRatio >= 0.80;
    const adverseImpactAlert = adverseImpactComplies
      ? "Selection rates meet the four-fifths ratio rule. No adverse impact detected."
      : `Adverse impact detected. Protected selection rate is only ${Math.round(adverseImpactRatio * 100)}% of reference group.`;

    // 2. Utility & Cut-Score Audit
    // Validity must be >= 0.30 and cut-score at or above 50th percentile
    const validityComplies = (criterionValidity ?? 0) >= 0.30;
    const cutScoreComplies = (cutScorePercentile ?? 0) >= 50;
    const utilityComplies = validityComplies && cutScoreComplies;

    let utilityAlert = "Utility parameters satisfy the 0.30/50th percentile threshold.";
    if (!validityComplies) {
      utilityAlert = "Criterion validity falls below 0.30. Assessment impact will be statistically marginal.";
    } else if (!cutScoreComplies) {
      utilityAlert = "Screening cut-score is set below the 50th percentile. Psychometric selection utility is diluted.";
    }

    // 3. Differential Item Functioning (DIF) Status
    const flaggedItems = Array.isArray(difItems) 
      ? difItems.filter((item: any) => item.pValueDifference > 0.10 && item.pValueLogitDifference > 0.25).map((item: any) => item.itemId)
      : [];
    
    const difComplies = flaggedItems.length === 0;

    const overallCompliance = adverseImpactComplies && utilityComplies && difComplies;

    return NextResponse.json({
      overallCompliance,
      adverseImpact: {
        complies: adverseImpactComplies,
        ratio: Number(adverseImpactRatio.toFixed(3)),
        alert: adverseImpactAlert
      },
      utilityValidation: {
        complies: utilityComplies,
        validityScore: criterionValidity,
        cutPercentile: cutScorePercentile,
        alert: utilityAlert
      },
      difStatus: {
        complies: difComplies,
        flaggedItems,
        alert: difComplies 
          ? "No item shows significant Differential Item Functioning." 
          : `${flaggedItems.length} items flagged for DIF and require pruning.`
      }
    });

  } catch (error) {
    console.error("Compliance Audit Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
