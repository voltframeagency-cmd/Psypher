import { NextRequest, NextResponse } from 'next/server';
import { generateDeepReport } from '@/lib/ai/gemini';
import { PsychologyEngine } from '@/lib/psychology/scoring';

export async function POST(req: NextRequest) {
  try {
    const { answers, text_sample } = await req.json();

    if (!answers) {
      return NextResponse.json({ error: 'Answers are required' }, { status: 400 });
    }

    const report = await generateDeepReport(answers);
    const scores = PsychologyEngine.generateHybridReport(answers, text_sample);

    return NextResponse.json({ report, scores });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
