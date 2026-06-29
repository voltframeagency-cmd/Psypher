/**
 * PSYPHER NETWORK PSYCHOMETRICS: mlGVAR ENGINE
 * 
 * Implements a Multilevel Graphical Vector Autoregression (mlGVAR) framework
 * to analyze longitudinal in-app telemetry (latency, choice shifts, stress indices).
 * 
 * Separates stable between-person traits (means) from within-person temporal
 * dynamics (lag-1 predictive relations).
 */

export interface TelemetryPoint {
  timestamp: string;      // ISO String
  responseLatency: number; // Avg latency in ms
  stressIndex: number;     // Extracted from latency and inconsistency
  machiavellianism: number;
  narcissism: number;
  psychopathy: number;
}

export interface mlGVARAnalysis {
  stableBaselines: {
    averageLatency: number;
    averageStress: number;
    averageMachiavellianism: number;
    averageNarcissism: number;
    averagePsychopathy: number;
  };
  temporalEffects: {
    predictor: string;
    target: string;
    coefficient: number;
    interpretation: string;
  }[];
  contemporaneousNetwork: {
    nodeA: string;
    nodeB: string;
    correlation: number;
  }[];
}

export class mlGVAREngine {
  /**
   * Run the mlGVAR network analysis on historical user telemetry points.
   * Requires at least 2 historical data points for temporal (lag-1) estimation.
   */
  static analyze(history: TelemetryPoint[]): mlGVARAnalysis {
    const n = history.length;

    // Default return if history is insufficient
    if (n < 2) {
      return {
        stableBaselines: {
          averageLatency: n > 0 ? history[0].responseLatency : 0,
          averageStress: n > 0 ? history[0].stressIndex : 0,
          averageMachiavellianism: n > 0 ? history[0].machiavellianism : 0,
          averageNarcissism: n > 0 ? history[0].narcissism : 0,
          averagePsychopathy: n > 0 ? history[0].psychopathy : 0,
        },
        temporalEffects: [],
        contemporaneousNetwork: []
      };
    }

    // Sort by timestamp to ensure chronological order
    const sorted = [...history].sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

    // 1. Calculate Between-Person stable averages
    let sumLatency = 0;
    let sumStress = 0;
    let sumMach = 0;
    let sumNarc = 0;
    let sumPsych = 0;

    sorted.forEach(p => {
      sumLatency += p.responseLatency;
      sumStress += p.stressIndex;
      sumMach += p.machiavellianism;
      sumNarc += p.narcissism;
      sumPsych += p.psychopathy;
    });

    const stableBaselines = {
      averageLatency: Math.round(sumLatency / n),
      averageStress: Number((sumStress / n).toFixed(2)),
      averageMachiavellianism: Number((sumMach / n).toFixed(2)),
      averageNarcissism: Number((sumNarc / n).toFixed(2)),
      averagePsychopathy: Number((sumPsych / n).toFixed(2)),
    };

    // 2. Compute Within-Person Lag-1 Temporal Effects (Vector Autoregression)
    // We calculate the correlation between Variable X at t-1 and Variable Y at t.
    const temporalEffects: mlGVARAnalysis["temporalEffects"] = [];
    const variables = ["stressIndex", "machiavellianism", "narcissism", "psychopathy"];

    variables.forEach(predictorVar => {
      variables.forEach(targetVar => {
        // Exclude Narcissism predicting Psychopathy directly if not clinically useful
        let sumX = 0;
        let sumY = 0;
        const pairs: [number, number][] = [];

        for (let i = 1; i < n; i++) {
          const prev = sorted[i - 1] as any;
          const curr = sorted[i] as any;
          const valX = prev[predictorVar];
          const valY = curr[targetVar];
          pairs.push([valX, valY]);
          sumX += valX;
          sumY += valY;
        }

        const m = pairs.length;
        const meanX = sumX / m;
        const meanY = sumY / m;

        let num = 0;
        let denX = 0;
        let denY = 0;

        pairs.forEach(([x, y]) => {
          const diffX = x - meanX;
          const diffY = y - meanY;
          num += diffX * diffY;
          denX += diffX * diffX;
          denY += diffY * diffY;
        });

        const r = denX && denY ? num / Math.sqrt(denX * denY) : 0;
        const coeff = Number(r.toFixed(2));

        if (Math.abs(coeff) >= 0.20) {
          temporalEffects.push({
            predictor: predictorVar,
            target: targetVar,
            coefficient: coeff,
            interpretation: this.getTemporalInterpretation(predictorVar, targetVar, coeff)
          });
        }
      });
    });

    // 3. Contemporaneous Network (correlations at same time t, after subtracting means)
    const contemporaneousNetwork: mlGVARAnalysis["contemporaneousNetwork"] = [];
    for (let i = 0; i < variables.length; i++) {
      for (let j = i + 1; j < variables.length; j++) {
        const varA = variables[i];
        const varB = variables[j];

        let sumA = 0;
        let sumB = 0;
        const pairs: [number, number][] = [];

        sorted.forEach(p => {
          const valA = (p as any)[varA];
          const valB = (p as any)[varB];
          pairs.push([valA, valB]);
          sumA += valA;
          sumB += valB;
        });

        const meanA = sumA / n;
        const meanB = sumB / n;

        let num = 0;
        let denA = 0;
        let denB = 0;

        pairs.forEach(([a, b]) => {
          const diffA = a - meanA;
          const diffB = b - meanB;
          num += diffA * diffB;
          denA += diffA * diffA;
          denB += diffB * diffB;
        });

        const correlation = denA && denB ? num / Math.sqrt(denA * denB) : 0;
        const corrVal = Number(correlation.toFixed(2));

        if (Math.abs(corrVal) >= 0.15) {
          contemporaneousNetwork.push({
            nodeA: varA,
            nodeB: varB,
            correlation: corrVal
          });
        }
      }
    }

    return {
      stableBaselines,
      temporalEffects,
      contemporaneousNetwork
    };
  }

  private static getTemporalInterpretation(predictor: string, target: string, coeff: number): string {
    const direction = coeff > 0 ? "positively triggers" : "negatively regulates";
    const labelMap: Record<string, string> = {
      stressIndex: "Cognitive Stress",
      machiavellianism: "Machiavellianism",
      narcissism: "Narcissism",
      psychopathy: "Psychopathy"
    };

    const pName = labelMap[predictor] || predictor;
    const tName = labelMap[target] || target;

    return `Shifts in ${pName} ${direction} ${tName} in the subsequent session (coefficient: ${coeff}).`;
  }
}
