'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function AdminLessonsEditPage() {
  const router = useRouter();
  const search = useSearchParams();
  const id = search.get('id');
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState<Record<string, any>>({ published: true });

  useEffect(() => {
    if (!id) return;
    (async () => {
      const res = await fetch(`/api/lessons/by-id?id=${id}`);
      if (res.ok) {
        const data = await res.json();
        setForm({ ...data, resources: data.resources ?? [], body: data.body ?? [], published: data.published ?? true });
      }
    })();
  }, [id]);

  function update<K extends string>(key: K, value: any) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const payload = {
      title: form.title,
      slug: form.slug,
      day: form.day ? Number(form.day) : null,
      is_intro: !!form.is_intro,
      is_bonus: !!form.is_bonus,
      estimated_minutes: form.estimated_minutes ? Number(form.estimated_minutes) : null,
      resources: safeJsonArray(form.resources),
      body: safeJsonArray(form.body),
      published: !!form.published,
      sort_order: form.sort_order ? Number(form.sort_order) : 0,
    };
    const res = await fetch(id ? `/api/admin/lessons/${id}` : '/api/admin/lessons', {
      method: id ? 'PATCH' : 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(payload),
    });
    setLoading(false);
    if (!res.ok) {
      alert('Save failed');
      return;
    }
    router.push('/admin/lessons');
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-semibold">{id ? 'Edit Lesson' : 'New Lesson'}</h1>

      <Card>
        <form className="grid gap-4 p-6" onSubmit={onSubmit}>
                    <label className="grid gap-1">
                        <span className="text-sm text-neutral-600">Title</span>
            <input className="rounded-[10px] border px-3 py-2" name="title" placeholder="Lesson title" value={form.title ?? ''} onChange={(e) => update('title', e.target.value)} />
                    </label>

                    <label className="grid gap-1">
                        <span className="text-sm text-neutral-600">Slug</span>
            <input className="rounded-[10px] border px-3 py-2" name="slug" placeholder="day-1" value={form.slug ?? ''} onChange={(e) => update('slug', e.target.value)} />
                    </label>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <label className="grid gap-1">
                            <span className="text-sm text-neutral-600">Day (optional)</span>
              <input className="rounded-[10px] border px-3 py-2" name="day" type="number" min={0} max={30} value={form.day ?? ''} onChange={(e) => update('day', e.target.value)} />
                        </label>

                        <label className="flex items-center gap-2">
              <input type="checkbox" name="is_intro" checked={!!form.is_intro} onChange={(e) => update('is_intro', e.target.checked)} />
                            <span>Intro</span>
                        </label>

                        <label className="flex items-center gap-2">
              <input type="checkbox" name="is_bonus" checked={!!form.is_bonus} onChange={(e) => update('is_bonus', e.target.checked)} />
                            <span>Bonus</span>
                        </label>
                    </div>

                    <label className="grid gap-1">
                        <span className="text-sm text-neutral-600">Estimated minutes</span>
            <input className="rounded-[10px] border px-3 py-2" name="estimated_minutes" type="number" min={1} value={form.estimated_minutes ?? ''} onChange={(e) => update('estimated_minutes', e.target.value)} />
                    </label>

                    <label className="grid gap-1">
                        <span className="text-sm text-neutral-600">Body (JSON)</span>
            <textarea className="min-h-[160px] rounded-[10px] border px-3 py-2 font-mono text-sm" name="body" placeholder='[]' value={toJson(form.body)} onChange={(e) => update('body', e.target.value)} />
                    </label>

                    <label className="grid gap-1">
                        <span className="text-sm text-neutral-600">Resources (JSON)</span>
            <textarea className="min-h-[120px] rounded-[10px] border px-3 py-2 font-mono text-sm" name="resources" placeholder='[]' value={toJson(form.resources)} onChange={(e) => update('resources', e.target.value)} />
                    </label>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
              <input type="checkbox" name="published" checked={!!form.published} onChange={(e) => update('published', e.target.checked)} />
                            <span>Published</span>
                        </label>
            <Button type="submit" disabled={loading}>{loading ? 'Saving…' : id ? 'Save Changes' : 'Create Lesson'}</Button>
                    </div>
                </form>
            </Card>
        </main>
    );
}

function toJson(value: any) {
  try {
    return typeof value === 'string' ? value : JSON.stringify(value ?? [], null, 2);
  } catch {
    return '[]';
  }
}

function safeJsonArray(value: any) {
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value ?? '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}


