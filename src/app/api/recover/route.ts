import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * API: /api/recover
 * Purpose: Allows users to recover their dossier by entering their Stripe receipt email.
 * This eliminates the need for an account while maintaining security.
 */

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required' }, { status: 400 });
    }

    // 1. Search for assessments with this stripe_email
    const { data: assessments, error } = await supabaseAdmin
      .from('assessments')
      .select('id, recovery_token, reports(id)')
      .eq('stripe_email', email)
      .order('created_at', { ascending: false });

    if (error || !assessments || assessments.length === 0) {
      // Security: Always return "Check your email" to avoid account enumeration
      return NextResponse.json({ message: 'If a match was found, a recovery link has been sent.' });
    }

    // 2. Extract recovery link (Assume first one for now)
    const assessment = assessments[0];
    const recoveryToken = assessment.recovery_token;
    const recoveryUrl = `${new URL(req.url).origin}/report?token=${recoveryToken}`;

    // 3. MOCK EMAIL SEND
    // In production, integrate Resend/Postmark here.
    console.log(`[RECOVERY] Sending link to ${email}: ${recoveryUrl}`);

    // If using Resend:
    // await resend.emails.send({
    //   from: 'Psypher Intelligence <security@psypher.ai>',
    //   to: email,
    //   subject: 'Dossier Recovery Link',
    //   html: `<p>Your Psypher Dossier has been restored: <a href="${recoveryUrl}">View Report</a></p>`
    // });

    return NextResponse.json({ 
      message: 'If a match was found, a recovery link has been sent.',
      // For development/mock purposes, we'll return the URL in the response if debug is on
      debugUrl: process.env.NODE_ENV === 'development' ? recoveryUrl : undefined
    });

  } catch (error) {
    console.error('Recovery error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
