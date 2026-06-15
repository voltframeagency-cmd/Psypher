import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";

/**
 * API: /api/assessment/save
 * Purpose: Pre-saves the assessment data to get a unique ID before payment.
 * Stockholm Minimalist (Lean/High-Efficiency).
 */
export async function POST(req: Request) {
  try {
    const { answers, tier } = await req.json();

    if (!answers || !tier) {
      return NextResponse.json({ error: "Missing answers or tier." }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("assessments")
      .insert({
        tier,
        raw_answers: answers,
        status: "pending",
      })
      .select("id")
      .single();

    if (error) {
      console.error("Save Assessment Error:", error);
      return NextResponse.json({ error: "Failed to initialize assessment." }, { status: 500 });
    }

    return NextResponse.json({ id: data.id });

  } catch (err) {
    console.error("Save Assessment Exception:", err);
    return NextResponse.json({ error: "Internal Server Error." }, { status: 500 });
  }
}
