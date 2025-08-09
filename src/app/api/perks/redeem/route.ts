import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
  const supabase = getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.redirect(new URL('/login', req.url));

  const form = await req.formData();
  const offerId = form.get('offerId') as string | null;
  if (!offerId) return NextResponse.json({ error: 'Missing offerId' }, { status: 400 });

  await supabase.from('events').insert({
    user_id: user.id,
    event_type: 'offer_redeemed',
    offer_id: offerId,
    metadata: {},
  });

  return NextResponse.redirect(new URL('/perks', req.url));
}


