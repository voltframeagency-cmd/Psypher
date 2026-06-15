import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { isValidClearanceCode } from "@/lib/security/keys";

/**
 * Access Portal: /api/unlock
 * Purpose: Validates Clearance Codes or Stripe Payment Intent IDs.
 * Stockholm Minimalist (Clinical/High-Status Logic).
 */
export async function POST(req: Request) {
  try {
    const { key } = await req.json();

    if (!key) {
      return NextResponse.json({ error: "Access key required." }, { status: 400 });
    }

    let query = supabaseAdmin.from("assessments").select("id, status, clearance_code");

    // 1. Dual-Mode Detection
    if (isValidClearanceCode(key)) {
      // Direct Clearance Code Match
      query = query.eq("clearance_code", key.toUpperCase());
    } else if (key.startsWith("pi_")) {
      // Stripe Receipt ID Match
      query = query.eq("stripe_payment_intent_id", key);
    } else {
      // Invalid Format
      return NextResponse.json({ error: "Invalid key format. Access denied." }, { status: 400 });
    }

    const { data: assessment, error } = await query.single();

    if (error || !assessment) {
      console.error("Unlock Error:", error);
      return NextResponse.json({ error: "Invalid credentials. Clearance denied." }, { status: 404 });
    }

    if (assessment.status !== "completed") {
      return NextResponse.json({ error: "Intelligence processing in progress." }, { status: 403 });
    }

    // Return the report URL
    return NextResponse.json({
      url: `/report?id=${assessment.id}`,
      clearanceCode: assessment.clearance_code
    });

  } catch (err) {
    console.error("Unlock Portal Exception:", err);
    return NextResponse.json({ error: "Internal System Failure." }, { status: 500 });
  }
}
