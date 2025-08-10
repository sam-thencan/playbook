import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { getServerSupabase } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/login', req.url));

  const priceId = process.env.STRIPE_PRICE_ID;
  const secret = process.env.STRIPE_SECRET_KEY;
  if (!priceId || !secret) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });

  const stripe = new Stripe(secret, { apiVersion: '2024-06-20' });
  const origin = process.env.NEXT_PUBLIC_SITE_URL || new URL(req.url).origin;

  const customer = await stripe.customers.create({
    email: user.email || undefined,
    metadata: { supabase_user_id: user.id },
  });

  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    customer: customer.id,
    line_items: [{ price: priceId, quantity: 1 }],
    allow_promotion_codes: true,
    client_reference_id: user.id,
    metadata: { supabase_user_id: user.id },
    success_url: `${origin}/pay/return?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/pay`,
  });

  return NextResponse.redirect(session.url as string, { status: 303 });
}


