import Link from 'next/link';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressRing } from '@/components/ProgressRing';
import { getServerSupabase } from '@/lib/supabaseServer';
import FavoriteToggle from '@/components/FavoriteToggle';
import ClientFavoritesRow from '@/components/ClientFavoritesRow';
import WeekAccordion, { WeekGroup as AccordionWeekGroup } from '@/components/WeekAccordion';
import { Card as _Card } from '@/components/Card';

type NextLesson = { slug: string; title: string } | null;
type OutlineItem = { slug: string; title: string; completed: boolean; id?: string; favorited?: boolean; day?: number | null };
type WeekGroup = AccordionWeekGroup & { items: (AccordionWeekGroup['items'][number] & OutlineItem)[] };

export default async function DashboardPage() {
    const supabase = getServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    let progressPercent = 0;
    let nextLesson: NextLesson = null;
    let currentStreakDays = 0;

    let outline: WeekGroup[] = [];
    let perksInfo: { unlocked: number; nextTitle: string | null; nextReason: string | null } = { unlocked: 0, nextTitle: null, nextReason: null };
    if (user) {
        const { data: completion } = await supabase
            .from('user_completion')
            .select('percent_complete')
            .eq('user_id', user.id)
            .maybeSingle();
        progressPercent = completion?.percent_complete ?? 0;

        // Compute streak from lesson_completed events (unique days ending today)
        const { data: streakEvents } = await supabase
            .from('events')
            .select('created_at')
            .eq('user_id', user.id)
            .eq('event_type', 'lesson_completed')
            .order('created_at', { ascending: false })
            .limit(365);
        if (streakEvents?.length) {
            const days = new Set<string>();
            for (const e of streakEvents as any[]) {
                const d = new Date(e.created_at);
                const isoDate = d.toISOString().slice(0, 10); // UTC day
                days.add(isoDate);
            }
            // Count consecutive days up to today (UTC)
            let streak = 0;
            let cursor = new Date();
            cursor.setUTCHours(0, 0, 0, 0);
            while (streak < 365) {
                const iso = cursor.toISOString().slice(0, 10);
                if (days.has(iso)) {
                    streak += 1;
                    cursor.setUTCDate(cursor.getUTCDate() - 1);
                } else {
                    break;
                }
            }
            currentStreakDays = streak;
        }

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
            const [{ data: progress }, { data: favs }] = await Promise.all([
                supabase
                    .from('progress')
                    .select('lesson_id, completed_at')
                    .eq('user_id', user.id),
                supabase
                    .from('favorites')
                    .select('lesson_id')
                    .eq('user_id', user.id)
            ]);
            const completedIds = new Set((progress ?? []).filter(p => p.completed_at).map(p => p.lesson_id));
            const favoredIds = new Set((favs ?? []).map((f: any) => f.lesson_id));
            const next = lessons.find(l => !completedIds.has(l.id));
            nextLesson = next ? { slug: next.slug, title: next.title } : null;

            // Category-based outline
            const order = ['Week 1 (Intro + Days 1–7)', 'Week 2 (Days 8–14)', 'Week 3 (Days 15–21)', 'Week 4 (Days 22–28)', 'Week 5 (Days 29–31 + Bonus)'];
            const groupsMap = new Map<string, WeekGroup>();
            function labelFor(l: any): string {
                const d = l.day ?? (l.is_intro ? 1 : null);
                if (l.is_bonus || (d != null && d >= 29)) return 'Week 5 (Days 29–31 + Bonus)';
                if (d != null) {
                    if (d <= 7) return 'Week 1 (Intro + Days 1–7)';
                    if (d <= 14) return 'Week 2 (Days 8–14)';
                    if (d <= 21) return 'Week 3 (Days 15–21)';
                    if (d <= 28) return 'Week 4 (Days 22–28)';
                }
                return 'Week 1 (Intro + Days 1–7)';
            }
            for (const l of lessons) {
                const lab = labelFor(l);
                const g = groupsMap.get(lab) ?? { label: lab, items: [], completedCount: 0, nextSlug: null };
                const completed = completedIds.has(l.id);
                g.items.push({ slug: l.slug, title: l.title, completed, id: l.id, favorited: favoredIds.has(l.id), day: l.day ?? null });
                if (completed) g.completedCount += 1;
                groupsMap.set(lab, g);
            }
            const groups: WeekGroup[] = [];
            for (const label of order) {
                const g = groupsMap.get(label);
                if (g) groups.push(g);
            }
            for (const g of groups) {
                const firstIncomplete = g.items.find((it) => !it.completed);
                g.nextSlug = (firstIncomplete || g.items[0])?.slug ?? null;
            }
            outline = groups;
        }

        // Perks preview
        const [{ data: perkRows }, { data: offersMeta }] = await Promise.all([
            supabase.from('perk_unlocks').select('offer_id, unlocked, reason').eq('user_id', user.id),
            supabase.from('offers').select('id, title, sort_order, active').eq('active', true).order('sort_order', { ascending: true }),
        ]);
        if (perkRows && offersMeta) {
            const unlockedCount = perkRows.filter((p: any) => p.unlocked).length;
            let nextTitle: string | null = null;
            let nextReason: string | null = null;
            for (const o of offersMeta as any[]) {
                const pr = (perkRows as any[]).find((p) => p.offer_id === o.id);
                if (!pr?.unlocked) { nextTitle = o.title; nextReason = pr?.reason ?? null; break; }
            }
            perksInfo = { unlocked: unlockedCount, nextTitle, nextReason };
        }
    }
    const nextLessonSlug = nextLesson?.slug ?? 'intro';

    return (
        <main className="mx-auto max-w-5xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold text-neutral-900 dark:text-neutral-100">Your SEO Playbook</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
                <Card className="md:col-span-2 md:col-span-2 md:col-start-1 md:col-end-3">
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

                <Card className="md:col-span-1">
                    <div className="p-6">
                        <p className="text-sm text-neutral-700">Current Streak</p>
                        <p className="text-2xl font-semibold text-neutral-900">{currentStreakDays} day{currentStreakDays === 1 ? '' : 's'}</p>
                        <p className="mt-1 text-sm text-neutral-700">Earn rewards as your streak grows.</p>
                    </div>
                </Card>

                <Link href="/perks" className="block focus:outline-none md:col-span-1">
                    <Card className="cursor-pointer">
                        <div className="p-6">
                            <p className="text-sm text-neutral-700">Perks</p>
                            <p className="text-2xl font-semibold text-neutral-900">{perksInfo.unlocked} available</p>
                            {perksInfo.nextTitle ? (
                                <p className="mt-1 text-sm text-neutral-700">Next: {perksInfo.nextTitle} — {perksInfo.nextReason}</p>
                            ) : (
                                <p className="mt-1 text-sm text-neutral-700">All current perks unlocked</p>
                            )}
                        </div>
                    </Card>
                </Link>
            </div>

            <section aria-labelledby="next-steps" className="mt-8">
                <h2 id="next-steps" className="mb-3 text-xl font-semibold text-neutral-100">Next up</h2>
                <Card>
                    <div className="flex items-center justify-between p-6">
                        <div>
                            <p className="text-sm text-neutral-500">Coming up</p>
                            <p className="text-lg font-medium">{nextLesson?.title ?? 'Intro'}</p>
                        </div>
                        <Link href={`/lesson/${nextLessonSlug}`} className="shrink-0">
                            <Button variant="secondary">View Lesson</Button>
                        </Link>
                    </div>
                </Card>
            </section>

            <section aria-labelledby="outline" className="mt-10">
                <h2 id="outline" className="mb-3 text-xl font-semibold text-neutral-100">Your Course</h2>
                <WeekAccordion groups={outline} nextFallback={nextLessonSlug} />
            </section>

            {/* Favorites row */}
            <section aria-labelledby="favorites" className="mt-10">
                <h2 id="favorites" className="mb-3 text-xl font-semibold text-neutral-100">Favorites</h2>
                <Card>
                    <ClientFavoritesRow
                        initial={outline
                            .flatMap((g) => g.items)
                            .filter((it) => it.favorited)
                            .map((it) => ({ id: it.id!, slug: it.slug, title: it.title, day: (it as any).day ?? undefined }))}
                    />
                </Card>
            </section>
        </main>
    );
}


