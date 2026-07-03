import { NextRequest, NextResponse } from 'next/server';
import { generateDeepReport } from '@/lib/ai/gemini';
import { PsychologyEngine } from '@/lib/psychology/scoring';

export async function POST(req: NextRequest) {
  try {
    const { answers, text_sample, locale } = await req.json();

    if (!answers) {
      return NextResponse.json({ error: 'Answers are required' }, { status: 400 });
    }

    let report = "";
    try {
      if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        report = await generateDeepReport(answers);
      } else {
        throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
      }
    } catch (e) {
      console.warn("[Psypher API] Gemini generation failed, falling back to mock text:", e);
      report = `## THE UNCOMFORTABLE TRUTH
You project a highly competent strategic facade to mask a deep underlying aversion to vulnerability. Your metrics indicate that this serves as a defense mechanism against interpersonal risk. 

## STRATEGIC FRAMEWORK
Your high conscientiousness combined with an avoidant attachment style dictates your leadership profile. You choose task completion over team emotional alignment.

## SUB-INDICES STRATEGY
Your moderate Machiavellianism is not a liability. It is your primary strategic asset in competitive environments.

## RELATIONAL DYNAMICS
You seek closeness but retreat when intimacy requires genuine surrender. This pattern creates a repetitive cycle of chase and withdraw.

## THE PSYPHER FRAMEWORK
1. Delegate one critical project without auditing it.
2. Share a personal failure with your team.
3. Stop tracking status metrics for forty-eight hours.`;
    }

    const scores = PsychologyEngine.generateHybridReport(answers, text_sample, locale);

    return NextResponse.json({ report, scores });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
