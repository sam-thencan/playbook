import Link from 'next/link';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressRing } from '@/components/ProgressRing';
import { getServerSupabase } from '@/lib/supabaseServer';

type NextLesson = { slug: string; title: string } | null;

export default async function DashboardPage() {
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let progressPercent = 0;
  let nextLesson: NextLesson = null;
  const currentStreakDays = 0; // TODO: compute from events

  if (user) {
    const { data: completion } = await supabase
      .from('user_completion')
      .select('percent_complete')
      .eq('user_id', user.id)
      .maybeSingle();
    progressPercent = completion?.percent_complete ?? 0;

    // Find next lesson: first published lesson not completed
    const { data: lessons } = await supabase
      .from('lessons')
      .select('id, slug, title')
      .eq('published', true)
      .order('is_intro', { ascending: false })
      .order('day', { ascending: true, nullsFirst: true })
      .order('sort_order', { ascending: true })
      .limit(100);

    if (lessons?.length) {
      const { data: progress } = await supabase
        .from('progress')
        .select('lesson_id, completed_at')
        .eq('user_id', user.id);
      const completedIds = new Set((progress ?? []).filter(p => p.completed_at).map(p => p.lesson_id));
      const next = lessons.find(l => !completedIds.has(l.id));
      nextLesson = next ? { slug: next.slug, title: next.title } : null;
    }
  }
  const nextLessonSlug = nextLesson?.slug ?? 'intro';

    return (
        <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-bold text-neutral-100">Your SEO Playbook</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <div className="flex flex-col items-center justify-between gap-6 p-6 sm:flex-row">
                        <div className="flex items-center gap-6">
                            <ProgressRing value={progressPercent} size={96} />
                            <div>
                <p className="text-sm text-neutral-300">Overall Progress</p>
                <p className="text-2xl font-semibold text-neutral-50">{progressPercent}%</p>
                <p className="mt-1 text-sm text-neutral-300">Keep going—consistency wins.</p>
                            </div>
                        </div>
                        <Link href={`/lesson/${nextLessonSlug}`} className="shrink-0">
                            <Button>Resume</Button>
                        </Link>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
            <p className="text-sm text-neutral-300">Current Streak</p>
            <p className="text-2xl font-semibold text-neutral-50">{currentStreakDays} day{currentStreakDays === 1 ? '' : 's'}</p>
            <p className="mt-1 text-sm text-neutral-300">Earn rewards as your streak grows.</p>
                    </div>
                </Card>
            </div>

            <section aria-labelledby="next-steps" className="mt-8">
        <h2 id="next-steps" className="mb-3 text-xl font-semibold text-neutral-100">Next up</h2>
                <Card>
                    <div className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm text-neutral-500">Coming up</p>
                            <p className="text-lg font-medium">Day 1 — Local SEO Foundations</p>
                        </div>
                        <Link href={`/lesson/${nextLessonSlug}`} className="shrink-0">
                            <Button variant="secondary">View Lesson</Button>
                        </Link>
                    </div>
                </Card>
            </section>
        </main>
    );
}


