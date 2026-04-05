import { QUICK_SCAN_QUESTIONS, FULL_DECODE_QUESTIONS, Question } from "@/config/questions";

export interface PsypherScores {
  bfi: {
    Openness: number;
    Conscientiousness: number;
    Extraversion: number;
    Agreeableness: number;
    Neuroticism: number;
  };
  darkTriad: {
    Machiavellianism: number;
    Psychopathy: number;
    Narcissism: number;
  };
  attachment: {
    Closeness: number;
    Dependency: number;
    Anxiety: number;
    Style: "Secure" | "Anxious" | "Avoidant" | "Fearful";
  };
  frameworks: {
    shadowProfile: number;
    resilienceIndex: number;
    cognitiveWiring: number;
    socialInfluence: number;
    executiveFunction: number;
    emotionalMaturity: number;
  };
}

export function calculatePsypherScores(answers: Record<number, number>): PsypherScores {
  // Combine all questions for lookup
  const allQs = [...QUICK_SCAN_QUESTIONS, ...FULL_DECODE_QUESTIONS];
  const qMap = new Map(allQs.map(q => [q.id, q]));

  const scores: any = {
    bfi: { Openness: 0, Conscientiousness: 0, Extraversion: 0, Agreeableness: 0, Neuroticism: 0 },
    darkTriad: { Machiavellianism: 0, Psychopathy: 0, Narcissism: 0 },
    attachment: { Closeness: 0, Dependency: 0, Anxiety: 0 },
  };

  const counts: any = {
    bfi: { Openness: 0, Conscientiousness: 0, Extraversion: 0, Agreeableness: 0, Neuroticism: 0 },
    darkTriad: { Machiavellianism: 0, Psychopathy: 0, Narcissism: 0 },
    attachment: { Closeness: 0, Dependency: 0, Anxiety: 0 },
  };

  // 1. Calculate raw averages per facet
  Object.entries(answers).forEach(([id, val]) => {
    const q = qMap.get(Number(id));
    if (!q) return;

    let finalVal = val;
    if (q.reverse) {
      finalVal = (q.maxScore + 1) - val;
    }

    if (q.category === "BFI") {
      scores.bfi[q.facet] += finalVal;
      counts.bfi[q.facet]++;
    } else if (q.category === "DT") {
      scores.darkTriad[q.facet] += finalVal;
      counts.darkTriad[q.facet]++;
    } else if (q.category === "ATTACH") {
      scores.attachment[q.facet] += finalVal;
      counts.attachment[q.facet]++;
    }
  });

  // Normalize
  const normalize = (obj: any, countObj: any) => {
    for (const key in obj) {
      if (typeof obj[key] === 'object') {
        normalize(obj[key], countObj[key]);
      } else {
        obj[key] = countObj[key] > 0 ? (obj[key] / countObj[key]) : 3;
      }
    }
  };

  normalize(scores, counts);

  // 2. Determine Attachment Style
  // Logic: High Closeness/Low Anxiety = Secure; High Anxiety = Anxious; Low Closeness/Low Anxiety = Avoidant
  const { Closeness, Anxiety } = scores.attachment;
  if (Closeness >= 3.5 && Anxiety <= 2.5) scores.attachment.Style = "Secure";
  else if (Anxiety > 3.0 && Closeness >= 3.0) scores.attachment.Style = "Anxious";
  else if (Closeness < 3.0 && Anxiety < 3.0) scores.attachment.Style = "Avoidant";
  else scores.attachment.Style = "Fearful";

  // 3. Derived Frameworks (1-100 scale)
  scores.frameworks = {
    shadowProfile: Math.round(((scores.darkTriad.Machiavellianism + scores.darkTriad.Psychopathy + scores.darkTriad.Narcissism) / 3) * 20),
    resilienceIndex: Math.round(((scores.bfi.Conscientiousness + (6 - scores.bfi.Neuroticism)) / 2) * 20),
    cognitiveWiring: Math.round(((scores.bfi.Openness + scores.bfi.Conscientiousness) / 2) * 20),
    socialInfluence: Math.round(((scores.bfi.Extraversion + scores.darkTriad.Narcissism) / 2) * 20),
    executiveFunction: Math.round((scores.bfi.Conscientiousness) * 20),
    emotionalMaturity: Math.round(((scores.bfi.Agreeableness + (6 - scores.bfi.Neuroticism)) / 2) * 20),
  };

  return scores as PsypherScores;
}
