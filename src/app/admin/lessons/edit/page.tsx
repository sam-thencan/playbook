'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { Renderer, type LessonBlock } from '@/components/blocks/Renderer';
import { useToast } from '@/components/Toast';

export default function AdminLessonsEditPage() {
    const router = useRouter();
    const search = useSearchParams();
    const id = search.get('id');
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<Record<string, any>>({ published: true, body: [] });
    const [blocks, setBlocks] = useState<LessonBlock[]>([]);
    const { addBlock, removeBlock, moveBlock, updateBlock } = useBlockOps(blocks, setBlocks);
    const { notify } = useToast();

    useEffect(() => {
        if (!id) return;
        (async () => {
            const res = await fetch(`/api/lessons/by-id?id=${id}`);
            if (res.ok) {
                const data = await res.json();
                setForm({ ...data, resources: data.resources ?? [], body: data.body ?? [], published: data.published ?? true });
                setBlocks((data.body as LessonBlock[]) ?? []);
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
            body: blocks,
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
            notify('Save failed');
            return;
        }
        notify('Saved');
        router.push('/admin/lessons');
    }

    return (
        <main className="mx-auto max-w-3xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold">{id ? 'Edit Lesson' : 'New Lesson'}</h1>
                <a href="/admin/lessons" className="text-sm underline">Back to Lessons</a>
            </div>

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

                    <fieldset className="grid gap-2 rounded-[10px] border p-3">
                        <legend className="px-1 text-sm text-neutral-600">Body Blocks</legend>
                        <div className="flex flex-wrap gap-2">
                            <BlockAddButton label="Paragraph" onClick={() => addBlock({ type: 'paragraph', content: 'New paragraph' })} />
                            <BlockAddButton label="Heading" onClick={() => addBlock({ type: 'heading', level: 2, content: 'Section title' })} />
                            <BlockAddButton label="List" onClick={() => addBlock({ type: 'list', items: ['Item'] })} />
                            <BlockAddButton label="Image" onClick={() => addBlock({ type: 'image', url: 'https://picsum.photos/800/400', caption: 'Image' })} />
                            <BlockAddButton label="Video" onClick={() => addBlock({ type: 'video', provider: 'youtube', url: 'https://www.youtube.com/embed/dQw4w9WgXcQ' })} />
                            <BlockAddButton label="Code" onClick={() => addBlock({ type: 'code', language: 'ts', content: 'console.log("hello")' })} />
                        </div>
                        <div className="mt-2 flex items-center gap-2">
                            <input
                                type="file"
                                accept=".md,.markdown,text/markdown,text/plain"
                                onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    const text = await file.text();
                                    const parsed = markdownToBlocks(text);
                                    setBlocks(parsed);
                                }}
                            />
                            <span className="text-sm text-neutral-600">Import Markdown</span>
                        </div>
                        <div className="space-y-3">
                            {blocks.map((b, i) => (
                                <div key={i} className="rounded-md border p-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-xs uppercase text-neutral-500">{b.type}</span>
                                        <div className="space-x-2">
                                            <Button type="button" variant="secondary" onClick={() => moveBlock(i, -1)}>Up</Button>
                                            <Button type="button" variant="secondary" onClick={() => moveBlock(i, 1)}>Down</Button>
                                            <Button type="button" variant="secondary" onClick={() => removeBlock(i)}>Remove</Button>
                                        </div>
                                    </div>
                                    <BlockEditor block={b} onChange={(nb) => updateBlock(i, nb)} />
                                </div>
                            ))}
                        </div>
                        <div className="rounded-md border p-3">
                            <h4 className="mb-2 text-sm font-medium">Preview</h4>
                            <Renderer blocks={blocks} />
                        </div>
                    </fieldset>

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

function BlockAddButton({ label, onClick }: { label: string; onClick: () => void }) {
    return (
        <button type="button" onClick={onClick} className="rounded-md border px-2 py-1 text-sm hover:bg-neutral-50">
            {label}
        </button>
    );
}

function BlockEditor({ block, onChange }: { block: LessonBlock; onChange: (b: LessonBlock) => void }) {
    switch (block.type) {
        case 'paragraph':
            return (
                <textarea
                    className="mt-2 w-full rounded-md border p-2"
                    value={block.content}
                    onChange={(e) => onChange({ ...block, content: e.target.value })}
                />
            );
        case 'heading':
            return (
                <div className="mt-2 grid gap-2 sm:grid-cols-4">
                    <select
                        className="rounded-md border p-2"
                        value={block.level ?? 2}
                        onChange={(e) => onChange({ ...block, level: Number(e.target.value) as 2 | 3 | 4 })}
                    >
                        <option value={2}>H2</option>
                        <option value={3}>H3</option>
                        <option value={4}>H4</option>
                    </select>
                    <input
                        className="sm:col-span-3 rounded-md border p-2"
                        value={block.content}
                        onChange={(e) => onChange({ ...block, content: e.target.value })}
                    />
                </div>
            );
        case 'list':
            return (
                <textarea
                    className="mt-2 w-full rounded-md border p-2"
                    value={(block.items || []).join('\n')}
                    onChange={(e) => onChange({ ...block, items: e.target.value.split('\n').filter(Boolean) })}
                />
            );
        case 'image':
            return (
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <input
                        className="rounded-md border p-2"
                        placeholder="Image URL"
                        value={block.url}
                        onChange={(e) => onChange({ ...block, url: e.target.value })}
                    />
                    <input
                        className="rounded-md border p-2"
                        placeholder="Caption"
                        value={block.caption || ''}
                        onChange={(e) => onChange({ ...block, caption: e.target.value })}
                    />
                </div>
            );
        case 'video':
            return (
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                    <select
                        className="rounded-md border p-2"
                        value={block.provider}
                        onChange={(e) => onChange({ ...block, provider: e.target.value as any })}
                    >
                        <option value="youtube">YouTube</option>
                        <option value="vimeo">Vimeo</option>
                        <option value="file">File</option>
                    </select>
                    <input
                        className="rounded-md border p-2"
                        placeholder="Embed URL"
                        value={block.url}
                        onChange={(e) => onChange({ ...block, url: e.target.value })}
                    />
                </div>
            );
        case 'code':
            return (
                <div className="mt-2 grid gap-2 sm:grid-cols-4">
                    <input
                        className="rounded-md border p-2"
                        placeholder="Language"
                        value={block.language || ''}
                        onChange={(e) => onChange({ ...block, language: e.target.value })}
                    />
                    <textarea
                        className="sm:col-span-3 min-h-[120px] rounded-md border p-2 font-mono"
                        placeholder="Code"
                        value={block.content}
                        onChange={(e) => onChange({ ...block, content: e.target.value })}
                    />
                </div>
            );
        default:
            return null;
    }
}

function add<T>(arr: T[], item: T): T[] { return [...arr, item]; }
function swap<T>(arr: T[], i: number, j: number): T[] { const a = [...arr]; const t = a[i]; a[i] = a[j]; a[j] = t; return a; }

function useBlockOps(blocks: LessonBlock[], setBlocks: (b: LessonBlock[]) => void) {
    function addBlock(b: LessonBlock) { setBlocks(add(blocks, b)); }
    function removeBlock(i: number) { setBlocks(blocks.filter((_, idx) => idx !== i)); }
    function moveBlock(i: number, delta: number) {
        const j = i + delta;
        if (j < 0 || j >= blocks.length) return;
        setBlocks(swap(blocks, i, j));
    }
    function updateBlock(i: number, b: LessonBlock) {
        const next = [...blocks];
        next[i] = b;
        setBlocks(next);
    }
    return { addBlock, removeBlock, moveBlock, updateBlock };
}

// Very small MD → blocks converter (headings ##/###, lists -, paragraphs)
function markdownToBlocks(md: string): LessonBlock[] {
    const lines = md.replace(/\r\n?/g, '\n').split('\n');
    const out: LessonBlock[] = [];
    let list: string[] | null = null;
    function flushList() {
        if (list && list.length) out.push({ type: 'list', items: list });
        list = null;
    }
    for (const raw of lines) {
        const line = raw.trim();
        if (!line) { flushList(); continue; }
        const h2 = line.match(/^##\s+(.*)$/);
        if (h2) { flushList(); out.push({ type: 'heading', level: 2, content: h2[1] }); continue; }
        const h3 = line.match(/^###\s+(.*)$/);
        if (h3) { flushList(); out.push({ type: 'heading', level: 3, content: h3[1] }); continue; }
        const li = line.match(/^[-*]\s+(.*)$/);
        if (li) { if (!list) list = []; list.push(li[1]); continue; }
        flushList();
        out.push({ type: 'paragraph', content: line });
    }
    flushList();
    return out;
}


