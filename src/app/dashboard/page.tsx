import Link from 'next/link';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { ProgressRing } from '@/components/ProgressRing';

export default function DashboardPage() {
    const progressPercent = 0;
    const currentStreakDays = 0;
    const nextLessonSlug = 'day-1';

    return (
        <main className="mx-auto max-w-5xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-semibold">Your SEO Playbook</h1>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <Card className="md:col-span-2">
                    <div className="flex flex-col items-center justify-between gap-6 p-6 sm:flex-row">
                        <div className="flex items-center gap-6">
                            <ProgressRing value={progressPercent} size={96} />
                            <div>
                                <p className="text-sm text-neutral-500">Overall Progress</p>
                                <p className="text-2xl font-semibold">{progressPercent}%</p>
                                <p className="mt-1 text-sm text-neutral-500">Keep going—consistency wins.</p>
                            </div>
                        </div>
                        <Link href={`/lesson/${nextLessonSlug}`} className="shrink-0">
                            <Button>Resume</Button>
                        </Link>
                    </div>
                </Card>

                <Card>
                    <div className="p-6">
                        <p className="text-sm text-neutral-500">Current Streak</p>
                        <p className="text-2xl font-semibold">{currentStreakDays} day{currentStreakDays === 1 ? '' : 's'}</p>
                        <p className="mt-1 text-sm text-neutral-500">Earn rewards as your streak grows.</p>
                    </div>
                </Card>
            </div>

            <section aria-labelledby="next-steps" className="mt-8">
                <h2 id="next-steps" className="mb-3 text-xl font-semibold">Next up</h2>
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


