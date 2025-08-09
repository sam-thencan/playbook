import Link from 'next/link';
import { Pill } from '@/components/Pill';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getServerSupabase } from '@/lib/supabaseServer';
import { Renderer } from '@/components/blocks/Renderer';
import LessonSidebar, { type SidebarLesson } from '@/components/LessonSidebar';
import LessonSidebarMobile from '@/components/LessonSidebarMobile';
import LessonStickyBar from '@/components/LessonStickyBar';

type LessonPageProps = {
    params: { slug: string };
};

export default async function LessonPage({ params }: LessonPageProps) {
    const { slug } = params;
    const supabase = getServerSupabase();
    const { data: lesson } = await supabase
        .from('lessons')
        .select('id, title, day, estimated_minutes, resources, body')
        .eq('slug', slug)
        .maybeSingle();

    const estimatedMinutes = lesson?.estimated_minutes ?? 20;
    const title = lesson?.title ?? 'Lesson Title';
    const resources: Array<{ label: string; url: string }> = Array.isArray(lesson?.resources)
        ? lesson?.resources
        : [];

    // Log view event if authenticated
    const {
        data: { user },
    } = await supabase.auth.getUser();
    if (user && lesson?.id) {
        await supabase.from('events').insert({
            user_id: user.id,
            event_type: 'lesson_viewed',
            lesson_id: lesson.id,
            metadata: { slug },
        });
    }

    // Compute prev/next and offer unlock
    let prevSlug: string | null = null;
    let nextSlug: string | null = null;
    let offerUnlocked = false;
    let sidebarLessons: SidebarLesson[] = [];
    let completedSlugs: string[] = [];
    if (user) {
        const { data: lessons } = await supabase
            .from('lessons')
            .select('id, slug, title, day, is_intro, is_bonus, published, sort_order')
            .eq('published', true)
            .order('is_intro', { ascending: false })
            .order('day', { ascending: true, nullsFirst: true })
            .order('sort_order', { ascending: true });
        const idx = lessons?.findIndex((l) => l.slug === slug) ?? -1;
        if (idx > 0) prevSlug = lessons![idx - 1].slug;
        if (idx >= 0 && lessons && idx < lessons.length - 1) nextSlug = lessons[idx + 1].slug;
        sidebarLessons = (lessons || []).map((l) => ({ slug: l.slug, title: l.title, day: l.day, is_intro: (l as any).is_intro, is_bonus: (l as any).is_bonus }));
        // offers
        const { data: completion } = await supabase
            .from('user_completion')
            .select('percent_complete')
            .eq('user_id', user.id)
            .maybeSingle();
        const percent = completion?.percent_complete ?? 0;
        const { data: offers } = await supabase
            .from('offers')
            .select('id, unlock_day, unlock_percent, active')
            .eq('active', true)
            .order('sort_order', { ascending: true })
            .limit(1);
        const unlockDayOk = offers && offers[0]?.unlock_day != null && lesson?.day != null ? lesson.day >= (offers[0]!.unlock_day as number) : false;
        const unlockPctOk = offers && offers[0]?.unlock_percent != null ? percent >= (offers[0]!.unlock_percent as number) : false;
        offerUnlocked = Boolean(offers && offers[0] && (unlockDayOk || unlockPctOk));
        const { data: prog } = await supabase
            .from('progress')
            .select('lesson_id, completed_at, lessons(slug)')
            .eq('user_id', user.id);
        completedSlugs = (prog || []).filter((p: any) => p.completed_at && p.lessons?.slug).map((p: any) => p.lessons.slug);
    }

    return (
        <>
        <main className="mx-auto flex max-w-5xl gap-6 px-4 py-8">
            <div className="lg:w-auto">
                <LessonSidebarMobile lessons={sidebarLessons} currentSlug={slug} completed={completedSlugs} />
                <LessonSidebar lessons={sidebarLessons} currentSlug={slug} completed={completedSlugs} />
            </div>
            <div className="mx-auto w-full max-w-3xl">
                <header className="mb-6">
                    <h1 className="text-3xl font-semibold">{title}</h1>
                    <div className="mt-3 flex items-center gap-3">
                        <Pill variant="soft">Estimated: {estimatedMinutes} min</Pill>
                    </div>
                </header>

                <article className="prose prose-neutral max-w-none">
                    <Card>
                        <div className="p-6">
                            <h2 className="mb-2 text-xl font-semibold">Lesson</h2>
                            <Renderer blocks={(lesson?.body as any) ?? []} />
                        </div>
                    </Card>

                    <section aria-labelledby="resources" className="mt-6">
                        <h2 id="resources" className="mb-2 text-xl font-semibold">Resources</h2>
                        <Card>
                            <ul className="divide-y divide-neutral-200">
                                {resources.map((r) => (
                                    <li key={r.url} className="flex items-center justify-between p-4">
                                        <a href={r.url} className="text-[#FF6A00] underline-offset-2 hover:underline focus:underline">
                                            {r.label}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </section>

                    <div className="mt-6 flex items-center justify-between gap-4">
                        {/* Client action via form to avoid mixing client hooks here */}
                        <form action="/api/progress/complete" method="post">
                            <input type="hidden" name="lessonSlug" value={slug} />
                            <Button type="submit">Mark Complete</Button>
                        </form>
                        <Button variant="secondary" type="button">Previous</Button>
                    </div>

                    {offerUnlocked && (
                        <section aria-labelledby="offer" className="mt-8">
                            <h2 id="offer" className="mb-2 text-xl font-semibold">Offer</h2>
                            <Card>
                                <div className="flex items-center justify-between p-6">
                                    <div>
                                        <p className="text-lg font-medium">Free SEO Strategy Video</p>
                                        <p className="text-sm text-neutral-500">Unlocked</p>
                                    </div>
                                    <Button>Claim</Button>
                                </div>
                            </Card>
                        </section>
                    )}

                    <div className="mt-8 flex items-center justify-between">
                        <div>
                            {prevSlug && (
                                <Link href={`/lesson/${prevSlug}`} className="text-sm underline">← Previous</Link>
                            )}
                        </div>
                        <div>
                            {nextSlug && (
                                <Link href={`/lesson/${nextSlug}`} className="text-sm underline">Next →</Link>
                            )}
                        </div>
                    </div>
                </article>
            </div>
        </main>
        <LessonStickyBar prevSlug={prevSlug} nextSlug={nextSlug} currentSlug={slug} />
        </>
    );
}


