import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!supabaseUrl || !serviceRole) return NextResponse.json({ error: 'Missing Supabase env' }, { status: 500 });

  const supabase = createClient(supabaseUrl, serviceRole);

  const data = await req.formData();
  const file = data.get('file') as File | null;
  if (!file) return NextResponse.json({ error: 'file required' }, { status: 400 });

  // Generate a path
  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const path = `lessons/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const bytes = await file.arrayBuffer();
  const { error } = await supabase.storage.from('lessons').upload(path, new Uint8Array(bytes), {
    cacheControl: '3600', upsert: false, contentType: file.type || 'image/jpeg'
  });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data: pub } = supabase.storage.from('lessons').getPublicUrl(path);
  // Return the optimized URL via Next.js Image (same as public URL; Next/Image will optimize)
  return NextResponse.json({ url: pub.publicUrl });
}


