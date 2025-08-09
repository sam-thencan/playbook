import Link from 'next/link';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressRing } from '@/components/ProgressRing';
import { getServerSupabase } from '@/lib/supabaseServer';

type NextLesson = { slug: string; title: string } | null;
type OutlineItem = { slug: string; title: string; completed: boolean };
type WeekGroup = { label: string; items: OutlineItem[]; completedCount: number };

export default async function DashboardPage() {
    const supabase = getServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let progressPercent = 0;
    let nextLesson: NextLesson = null;
    const currentStreakDays = 0; // TODO: compute from events

    let outline: WeekGroup[] = [];
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
            .select('id, slug, title, day, is_intro, is_bonus, published, sort_order')
            .eq('published', true)
            .order('is_intro', { ascending: false })
            .order('day', { ascending: true, nullsFirst: true })
            .order('sort_order', { ascending: true })
            .limit(200);

        if (lessons?.length) {
            const { data: progress } = await supabase
                .from('progress')
                .select('lesson_id, completed_at')
                .eq('user_id', user.id);
            const completedIds = new Set((progress ?? []).filter(p => p.completed_at).map(p => p.lesson_id));
            const next = lessons.find(l => !completedIds.has(l.id));
            nextLesson = next ? { slug: next.slug, title: next.title } : null;

            // Build outline groups (Weeks 1–5 + Bonus in Week 5; Intro in Week 1)
            const groups: WeekGroup[] = [
                { label: 'Week 1 (Intro + Days 1–7)', items: [], completedCount: 0 },
                { label: 'Week 2 (Days 8–14)', items: [], completedCount: 0 },
                { label: 'Week 3 (Days 15–21)', items: [], completedCount: 0 },
                { label: 'Week 4 (Days 22–28)', items: [], completedCount: 0 },
                { label: 'Week 5 (Days 29–31 + Bonus)', items: [], completedCount: 0 },
            ];
            for (const l of lessons) {
                const completed = completedIds.has(l.id);
                const item: OutlineItem = { slug: l.slug, title: l.title, completed };
                const d = l.day ?? (l.is_intro ? 1 : null);
                let idx = 0;
                if (d == null) {
                    // bonus → week 5
                    idx = 4;
                } else if (d <= 7) idx = 0;
                else if (d <= 14) idx = 1;
                else if (d <= 21) idx = 2;
                else if (d <= 28) idx = 3;
                else idx = 4;
                groups[idx].items.push(item);
                if (completed) groups[idx].completedCount += 1;
            }
            outline = groups;
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
                                <p className="text-sm text-neutral-700">Overall Progress</p>
                                <p className="text-2xl font-semibold text-neutral-900">{progressPercent}%</p>
                                <p className="mt-1 text-sm text-neutral-700">Keep going—consistency wins.</p>
                            </div>
                        </div>
                        <Link href={`/lesson/${nextLessonSlug}`} className="shrink-0">
                            <Button>Resume</Button>
                        </Link>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <p className="text-sm text-neutral-700">Current Streak</p>
                        <p className="text-2xl font-semibold text-neutral-900">{currentStreakDays} day{currentStreakDays === 1 ? '' : 's'}</p>
                        <p className="mt-1 text-sm text-neutral-700">Earn rewards as your streak grows.</p>
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

            <section aria-labelledby="outline" className="mt-10">
                <h2 id="outline" className="mb-3 text-xl font-semibold text-neutral-100">Your Course</h2>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {outline.map((g, idx) => (
                        <Card key={g.label}>
                            <details open>
                                <summary className="flex cursor-pointer items-center justify-between p-4 font-medium">
                                    <span>{g.label}</span>
                                    <span className="text-sm text-neutral-600">{g.completedCount}/{g.items.length} complete</span>
                                </summary>
                                <ul className="divide-y divide-neutral-200">
                                    {g.items.map((it) => (
                                        <li key={it.slug} className="flex items-center justify-between p-3">
                                            <Link href={`/lesson/${it.slug}`} className="truncate underline-offset-2 hover:underline">
                                                {it.title}
                                            </Link>
                                            {it.completed && <span className="ml-2 text-[#FF6A00]">✓</span>}
                                        </li>
                                    ))}
                                </ul>
                                <div className="flex items-center justify-end gap-2 p-3">
                                    <Link href={`/lesson/${nextLessonSlug}`}>
                                        <Button variant="secondary">Resume Week</Button>
                                    </Link>
                                </div>
                            </details>
                        </Card>
                    ))}
                </div>
            </section>
        </main>
    );
}


