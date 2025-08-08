import fs from 'node:fs/promises';
import path from 'node:path';
import { createClient } from '@supabase/supabase-js';

type LessonSeed = {
  slug: string;
  title: string;
  day: number | null;
  is_intro: boolean;
  is_bonus: boolean;
  estimated_minutes: number | null;
  resources: Array<{ label: string; url: string }>;
  body: Array<{ type: string; content: string }>;
  sort_order: number;
  published: boolean;
};

async function main() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
  if (!supabaseUrl || !serviceKey) {
    throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
  }
  const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });
  const root = path.resolve(__dirname, '..');
  const seedPath = path.join(root, 'supabase', 'seed-lessons.json');
  const raw = await fs.readFile(seedPath, 'utf8');
  const { lessons } = JSON.parse(raw) as { lessons: LessonSeed[] };

  for (const l of lessons) {
    const { error } = await supabase.from('lessons').upsert(
      {
        slug: l.slug,
        title: l.title,
        day: l.day,
        is_intro: l.is_intro,
        is_bonus: l.is_bonus,
        estimated_minutes: l.estimated_minutes,
        resources: l.resources,
        body: l.body,
        sort_order: l.sort_order,
        published: l.published,
      },
      { onConflict: 'slug' }
    );
    if (error) throw error;
    console.log('Upserted lesson', l.slug);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


