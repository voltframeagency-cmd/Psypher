import Stripe from "stripe";

const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_for_build_purposes";

if (!process.env.STRIPE_SECRET_KEY) {
  console.warn("⚠️ [Psypher] Missing STRIPE_SECRET_KEY in environment. Using placeholder key.");
}

export const stripe = new Stripe(stripeKey, {
  // @ts-ignore - Ignore exact version string check for Turbopack builds
  apiVersion: "2026-03-25.dahlia", 
  typescript: true,
});

