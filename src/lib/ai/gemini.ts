import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);

export async function generateDeepReport(answers: any) {
  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });

  // In a real app, calculate actual scores from answers here
  // For now, we'll use a summary based on the answers or mocked as in the ref
  const prompt = `
You are an elite behavioral psychologist and master copywriter. Synthesize the user's psychological scores into a "Deep Report." 

You must write directly to the user (second-person "You"). Write at a 6th-grade reading level. Brutal simplicity equals high trust. 

BANNED WORDS: delve, leverage, foster, streamline, robust, comprehensive, tailored, bespoke, dynamic, landscape, journey.

Use the 1-3-1 paragraph structure: Start with a punchy sentence. Explain in three sentences. End with a definitive fragment. Do not hedge. Be bold, direct, and slightly provocative.

Structure:
1. THE UNCOMFORTABLE TRUTH: Combine their highest Big Five trait with highest Dark Triad trait. State their superpower and fatal flaw.
2. HOW YOU OPERATE: Explain how their Big Five combination dictates daily behavior (career/conflict).
3. YOUR SHADOW: De-stigmatize their Dark Triad scores. Explain how to use them as a strategic advantage.
4. HOW YOU CONNECT: Explain their attachment style brutally but empathetically. Why past relationships failed, what they need to succeed.
5. THE ACTION PLAN: 3 specific, uncomfortable actions to take this week.

Here is a summary of their assessment scores (mocked/interpreted from answers):
- High Conscientiousness, High Openness
- Moderate Machiavellianism
- Avoidant Attachment leaning

Format the output in Markdown with clear headings (H2 for sections).
  `;

  const result = await model.generateContent(prompt);
  const response = await result.response;
  return response.text();
}
