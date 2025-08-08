import { Pill } from '@/components/Pill';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getServerSupabase } from '@/lib/supabaseServer';

type LessonPageProps = {
    params: { slug: string };
};

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = params;
  const supabase = getServerSupabase();
  const { data: lesson } = await supabase
    .from('lessons')
    .select('id, title, estimated_minutes, resources, body')
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

    return (
        <main className="mx-auto max-w-3xl px-4 py-8">
            <header className="mb-6">
                <h1 className="text-3xl font-semibold">{title}</h1>
                <div className="mt-3 flex items-center gap-3">
                    <Pill>Estimated: {estimatedMinutes} min</Pill>
                    <Pill variant="soft">Slug: {slug}</Pill>
                </div>
            </header>

            <article className="prose prose-neutral max-w-none dark:prose-invert">
                <Card>
                    <div className="p-6">
                        <h2 className="mb-2 text-xl font-semibold">Lesson</h2>
            <p className="text-neutral-700">Lesson body will be populated from 30-day-local-seo-playbook.pdf.</p>
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
          <form action={`/api/progress/complete`} method="post">
            <input type="hidden" name="lessonSlug" value={slug} />
            <Button type="submit">Mark Complete</Button>
          </form>
          <Button variant="secondary" type="button">Previous</Button>
        </div>

                <section aria-labelledby="offer" className="mt-8">
                    <h2 id="offer" className="mb-2 text-xl font-semibold">Offer</h2>
                    <Card>
                        <div className="flex items-center justify-between p-6">
                            <div>
                                <p className="text-lg font-medium">Free SEO Strategy Video</p>
                                <p className="text-sm text-neutral-500">Unlocked after Day 7 or 25% completion.</p>
                            </div>
                            <Button>Claim</Button>
                        </div>
                    </Card>
                </section>
            </article>
        </main>
    );
}


