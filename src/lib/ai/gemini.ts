import { GoogleGenerativeAI } from '@google/generative-ai';
import { calculatePsypherScores } from "@/lib/scoring";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function generateDeepReport(answers: Record<number, number>) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const scores = calculatePsypherScores(answers);

  const prompt = `
You are an elite behavioral psychologist and master copywriter. Your name is PSYPHER. Use the provided psychological data to build an "Analytical Report" for the user.

VOICE: Brutal, direct, sophisticated but accessible. speak as a cold, objective machine that knows the user better than they know themselves. 

SYNTAX: Use the 1-3-1 Paragraph Structure for EVERY section:
1. One punchy, provocative opening sentence.
2. Three explanatory sentences providing the "Why."
3. One final definitive fragment.

BANNED WORDS: delve, leverage, foster, streamline, robust, comprehensive, tailored, bespoke, dynamic, landscape, journey, navigate, unlock, empower, potentially, could, might, ghost, protocol, operative, dossier. (Do NOT hedge. Be definitive.)

---
USER DATA (1-5 scale):
Big Five: O: ${scores.bfi.Openness.toFixed(1)}, C: ${scores.bfi.Conscientiousness.toFixed(1)}, E: ${scores.bfi.Extraversion.toFixed(1)}, A: ${scores.bfi.Agreeableness.toFixed(1)}, N: ${scores.bfi.Neuroticism.toFixed(1)}
Dark Triad: Mach: ${scores.darkTriad.Machiavellianism.toFixed(1)}, Psych: ${scores.darkTriad.Psychopathy.toFixed(1)}, Narc: ${scores.darkTriad.Narcissism.toFixed(1)}
Attachment Style: ${scores.attachment.Style} (Closeness: ${scores.attachment.Closeness.toFixed(1)}, Anxiety: ${scores.attachment.Anxiety.toFixed(1)})

Analytical Scores (1-100):
Latent Index: ${scores.frameworks.shadowProfile}
Resilience Index: ${scores.frameworks.resilienceIndex}
Cognitive Wiring: ${scores.frameworks.cognitiveWiring}
Social Influence: ${scores.frameworks.socialInfluence}
---

REPORT STRUCTURE:
1. THE UNCOMFORTABLE TRUTH: State their core contradiction (e.g., "High conscientiousness masking deep insecurity").
2. STRATEGIC FRAMEWORK: Explain their behavior in conflict and status situations based on their BFI + Attachment scores.
3. SUB-INDICES STRATEGY: Why their clinical sub-indices (Dark Triad) are their greatest strategic advantage. De-stigmatize it.
4. RELATIONAL DYNAMICS: Why their past relationships followed a specific pattern. State what they must fix.
5. THE PSYPHER FRAMEWORK: Give 3 specific, uncomfortable actions to take this week. (No fluff).

FORMAT: Markdown with H2 headings. No greeting. No intro. No outro. Just the brutal analysis.
`;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
