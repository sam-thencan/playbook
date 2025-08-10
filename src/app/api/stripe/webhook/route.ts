import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const secret = process.env.STRIPE_SECRET_KEY as string;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET as string;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!secret || !webhookSecret || !supabaseUrl || !serviceRole) return NextResponse.json({ error: 'Missing env' }, { status: 500 });

  const stripe = new Stripe(secret, { apiVersion: '2025-07-30.basil' });
  const raw = await req.text();
  const sig = req.headers.get('stripe-signature') as string;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(raw, sig, webhookSecret);
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = (session.client_reference_id as string) || (session.metadata?.supabase_user_id as string);
    if (userId) {
      const supabase = createClient(supabaseUrl, serviceRole);
      await supabase.from('profiles').update({ has_access: true }).eq('id', userId);
      await supabase.from('events').insert({ user_id: userId, event_type: 'purchase_completed', metadata: { session_id: session.id } });
    }
  }

  return NextResponse.json({ received: true });
}

