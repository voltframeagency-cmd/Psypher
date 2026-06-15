import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe/client";

export async function POST(req: Request) {
  try {
    const { assessmentId, tier, price } = await req.json();

    if (!assessmentId || !tier) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Map tier to Stripe Price ID or Amount
    // For MVP, we use hardcoded amounts if Prices aren't set up yet
    // Price points: Basic ($0), Deep ($29), Full ($39)
    const unitAmount = tier === "deep" ? 2900 : tier === "full_decode" ? 3900 : 0;

    if (unitAmount === 0 && tier !== "quick") {
      return NextResponse.json({ error: "Invalid tier for payment" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Psypher Intelligence Report - ${tier.toUpperCase()}`,
              description: "High-fidelity psychological dossier and operational playbook.",
            },
            unit_amount: unitAmount,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/unlock?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/assessment?id=${assessmentId}`,
      client_reference_id: assessmentId,
      metadata: {
        assessmentId,
        tier,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe Checkout Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
