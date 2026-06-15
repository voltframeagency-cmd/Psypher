import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { stripe } from "@/lib/stripe/client";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { generateClearanceCode } from "@/lib/security/keys";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature") as string;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`Webhook Error: ${err.message}`);
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle the event
  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const assessmentId = session.client_reference_id;
    const stripeEmail = session.customer_details?.email;
    const paymentIntentId = session.payment_intent as string;

    if (assessmentId) {
      // 1. Mint a unique Clearance Code
      const clearanceCode = generateClearanceCode();

      // 2. Set the 30-Day Expiry (Ghost Protocol)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // 3. Update the Assessment Record
      const { error } = await supabaseAdmin
        .from("assessments")
        .update({
          status: "completed",
          stripe_email: stripeEmail,
          stripe_payment_intent_id: paymentIntentId,
          clearance_code: clearanceCode,
          expires_at: expiresAt.toISOString(),
          completed_at: new Date().toISOString(),
        })
        .eq("id", assessmentId);

      if (error) {
        console.error("Supabase Update Error (Webhook):", error);
        return new Response("Database Update Failed", { status: 500 });
      }

      console.log(`[CLEARANCE MINTED] ID: ${assessmentId} | CODE: ${clearanceCode}`);
    }
  }

  return NextResponse.json({ received: true });
}
