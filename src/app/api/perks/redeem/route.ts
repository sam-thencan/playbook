import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export async function POST(req: NextRequest) {
    const supabase = getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.redirect(new URL('/login', req.url));

    let offerId: string | null = null;
    const contentType = req.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
        const body = await req.json().catch(() => ({}));
        offerId = (body.offerId as string) ?? null;
    } else {
        const form = await req.formData();
        offerId = form.get('offerId') as string | null;
    }
    if (!offerId) return NextResponse.json({ error: 'Missing offerId' }, { status: 400 });

  // Try to load CTA for redirect
  const { data: offer } = await supabase
    .from('offers')
    .select('id, cta')
    .eq('id', offerId)
    .maybeSingle();

  await supabase.from('events').insert({
        user_id: user.id,
        event_type: 'offer_redeemed',
        offer_id: offerId,
    metadata: { cta: offer?.cta ?? null },
    });

  const target = typeof offer?.cta === 'object' && offer?.cta && (offer as any).cta.url ? (offer as any).cta.url as string : null;
  if (target) {
    // Absolute external URLs allowed; fallback to relative
    try {
      const url = target.startsWith('http') ? target : new URL(target, req.url).toString();
      return NextResponse.redirect(url);
    } catch {
      // ignore and fall through to /perks
    }
  }

  if (contentType.includes('application/json')) return NextResponse.json({ ok: true });
  return NextResponse.redirect(new URL('/perks', req.url));
}


