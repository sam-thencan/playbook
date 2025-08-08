import { NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabaseServer';

export async function POST(request: Request) {
    try {
        const supabase = getServerSupabase();
        const {
            data: { user },
            error: userError,
        } = await supabase.auth.getUser();
        if (userError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Accept both JSON and form submissions
        let lessonSlug: string | undefined;
        const contentType = request.headers.get('content-type') || '';
        if (contentType.includes('application/json')) {
            const body = await request.json().catch(() => ({}));
            lessonSlug = body?.lessonSlug;
        } else {
            const form = await request.formData();
            lessonSlug = form.get('lessonSlug')?.toString();
        }
        if (!lessonSlug) {
            return NextResponse.json({ error: 'lessonSlug is required' }, { status: 400 });
        }

        const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .select('id')
            .eq('slug', lessonSlug)
            .maybeSingle();
        if (lessonError || !lesson) {
            return NextResponse.json({ error: 'Lesson not found' }, { status: 404 });
        }

        const now = new Date().toISOString();
        const { error: upsertError } = await supabase.from('progress').upsert(
            {
                user_id: user.id,
                lesson_id: lesson.id,
                percent_complete: 100,
                started_at: now,
                completed_at: now,
                last_viewed_at: now,
            },
            { onConflict: 'user_id,lesson_id' }
        );
        if (upsertError) {
            return NextResponse.json({ error: upsertError.message }, { status: 500 });
        }

        // Log completion event
        await supabase.from('events').insert({
            user_id: user.id,
            event_type: 'lesson_completed',
            lesson_id: lesson.id,
            metadata: { slug: lessonSlug },
        });

        return NextResponse.json({ ok: true });
    } catch (err) {
        const message = err instanceof Error ? err.message : 'Unknown error';
        return NextResponse.json({ error: message }, { status: 500 });
    }
}


