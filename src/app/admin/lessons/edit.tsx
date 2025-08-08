'use client';

import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function AdminLessonsEditPage() {
    const search = useSearchParams();
    const id = search.get('id');

    return (
        <main className="mx-auto max-w-3xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-semibold">{id ? 'Edit Lesson' : 'New Lesson'}</h1>

            <Card>
                <form className="grid gap-4 p-6">
                    <label className="grid gap-1">
                        <span className="text-sm text-neutral-600">Title</span>
                        <input className="rounded-[10px] border px-3 py-2" name="title" placeholder="Lesson title" />
                    </label>

                    <label className="grid gap-1">
                        <span className="text-sm text-neutral-600">Slug</span>
                        <input className="rounded-[10px] border px-3 py-2" name="slug" placeholder="day-1" />
                    </label>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <label className="grid gap-1">
                            <span className="text-sm text-neutral-600">Day (optional)</span>
                            <input className="rounded-[10px] border px-3 py-2" name="day" type="number" min={0} max={30} />
                        </label>

                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="is_intro" />
                            <span>Intro</span>
                        </label>

                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="is_bonus" />
                            <span>Bonus</span>
                        </label>
                    </div>

                    <label className="grid gap-1">
                        <span className="text-sm text-neutral-600">Estimated minutes</span>
                        <input className="rounded-[10px] border px-3 py-2" name="estimated_minutes" type="number" min={1} />
                    </label>

                    <label className="grid gap-1">
                        <span className="text-sm text-neutral-600">Body (JSON)</span>
                        <textarea className="min-h-[160px] rounded-[10px] border px-3 py-2 font-mono text-sm" name="body" placeholder='[]' />
                    </label>

                    <label className="grid gap-1">
                        <span className="text-sm text-neutral-600">Resources (JSON)</span>
                        <textarea className="min-h-[120px] rounded-[10px] border px-3 py-2 font-mono text-sm" name="resources" placeholder='[]' />
                    </label>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="published" defaultChecked />
                            <span>Published</span>
                        </label>
                        <Button type="submit">{id ? 'Save Changes' : 'Create Lesson'}</Button>
                    </div>
                </form>
            </Card>
        </main>
    );
}


