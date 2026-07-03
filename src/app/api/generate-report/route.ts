import { NextRequest, NextResponse } from 'next/server';
import { generateDeepReport } from '@/lib/ai/gemini';
import { PsychologyEngine } from '@/lib/psychology/scoring';

export async function POST(req: NextRequest) {
  try {
    const { answers, text_sample, locale } = await req.json();

    if (!answers) {
      return NextResponse.json({ error: 'Answers are required' }, { status: 400 });
    }

    const scores = PsychologyEngine.generateHybridReport(answers, text_sample, locale);

    let report = "";
    try {
      if (process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
        report = await generateDeepReport(answers);
      } else {
        throw new Error("Missing GOOGLE_GENERATIVE_AI_API_KEY");
      }
    } catch (e) {
      console.warn("[Psypher API] Gemini generation failed, falling back to dynamic mock text:", e);
      
      const wiring = scores.selfReport.cognitiveWiring || "INTJ";
      const attachmentStyle = scores.selfReport.attachment.Style || "Secure";
      const mach = scores.selfReport.darkTriad.MACHIAVELLIANISM || 3.0;
      const psych = scores.selfReport.darkTriad.PSYCHOPATHY || 3.0;
      const narc = scores.selfReport.darkTriad.NARCISSISM || 3.0;
      const shadowAvg = Math.round(((mach + psych + narc) / 3) * 20);

      let uncomfortableTruth = "";
      if (shadowAvg > 66) {
        uncomfortableTruth = `Your profile shows a highly developed strategic shadow shield. You use analytical detachment to bypass traditional consensus, prioritizing outcomes over interpersonal harmony.`;
      } else if (shadowAvg < 33) {
        uncomfortableTruth = `You project high interpersonal trust and empathy, but may struggle with conflict avoidance. Your metrics indicate a strong desire for consensus that can sometimes slow operational velocity.`;
      } else {
        uncomfortableTruth = `You balance strategic assertiveness with group collaboration. You project a highly competent strategic facade to mask a deep underlying aversion to vulnerability, adapting your style based on situational trust.`;
      }

      let strategicFramework = `Your dominant **${wiring}** cognitive configuration combined with a **${attachmentStyle}** attachment protocol dictates your leadership profile. `;
      if (wiring.startsWith("I")) {
        strategicFramework += `You process operations through quiet internal deliberation, reserving energy to protect the integrity of your analytical models.`;
      } else {
        strategicFramework += `You process operations as an active social catalyst, driving real-time team alignments and verbal exchanges.`;
      }

      let subIndicesStrategy = "";
      if (mach > 3.5) {
        subIndicesStrategy = `Your Machiavellian score of ${Math.round(mach * 20)}% is not a liability. It is your primary strategic asset in competitive, low-trust environments.`;
      } else {
        subIndicesStrategy = `Your moderate Dark Triad profile suggests low manipulative latency. You rely on direct authority and transparent alignment rather than indirect social management.`;
      }

      let relationalDynamics = "";
      if (attachmentStyle.includes("Avoidant")) {
        relationalDynamics = `With a ${attachmentStyle} style, you seek closeness but retreat when intimacy requires genuine surrender. This pattern creates a repetitive cycle of chase and withdraw in high-stakes relationships.`;
      } else if (attachmentStyle.includes("Anxious")) {
        relationalDynamics = `With a ${attachmentStyle} style, you have heightened sensitivity to interpersonal shifts. You seek constant alignment, which can occasionally introduce operational noise.`;
      } else {
        relationalDynamics = `With a Secure attachment base, you establish stable, low-friction professional alliances, permitting healthy trust boundaries without defensive retreat.`;
      }

      report = `## THE UNCOMFORTABLE TRUTH
${uncomfortableTruth}

## STRATEGIC FRAMEWORK
${strategicFramework}

## SUB-INDICES STRATEGY
${subIndicesStrategy}

## RELATIONAL DYNAMICS
${relationalDynamics}

## THE PSYPHER FRAMEWORK
1. ${wiring.includes("I") ? "Initiate one direct verbal conflict check-in" : "Spend forty-eight hours in deep internal strategic planning without consulting teams"}.
2. Share a specific operational bottleneck or failure with your team.
3. ${attachmentStyle.includes("Avoidant") ? "Delegate one critical milestone check-in without audit metrics" : "Define explicit transparency rules to stabilize communication alignment"}.`;
    }

    return NextResponse.json({ report, scores });
  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
