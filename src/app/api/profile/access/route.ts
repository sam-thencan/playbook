import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export async function GET() {
    const supabase = getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ hasAccess: false });
    const { data: profile } = await supabase.from('profiles').select('has_access').eq('id', user.id).maybeSingle();
    return NextResponse.json({ hasAccess: !!profile?.has_access });
}


