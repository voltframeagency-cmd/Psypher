import Stripe from "stripe";

// Use a placeholder key during Next.js static build to prevent compile-time crashes
const stripeKey = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder_key_for_build";

export const stripe = new Stripe(stripeKey, {
  apiVersion: "2026-03-25.dahlia" as any, // Matching latest types
  typescript: true,
});
