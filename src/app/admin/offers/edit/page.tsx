'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { useToast } from '@/components/Toast';

export default function AdminOffersEditPage() {
    const router = useRouter();
    const search = useSearchParams();
    const id = search.get('id');
    const { notify } = useToast();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState<Record<string, any>>({ active: true, type: 'call' });

    useEffect(() => {
        if (!id) return;
        (async () => {
            const res = await fetch(`/api/offers/by-id?id=${id}`);
            if (res.ok) {
                const data = await res.json();
                setForm({ ...data });
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
            description: form.description ?? null,
            type: form.type,
            unlock_day: form.unlock_day ? Number(form.unlock_day) : null,
            unlock_percent: form.unlock_percent ? Number(form.unlock_percent) : null,
            sort_order: form.sort_order ? Number(form.sort_order) : 0,
            cta: form.cta_label || form.cta_url ? { label: form.cta_label, url: form.cta_url } : null,
            active: !!form.active,
        };
        const res = await fetch(id ? `/api/admin/offers/${id}` : '/api/admin/offers', {
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
        router.push('/admin/offers');
    }

    return (
        <main className="mx-auto max-w-3xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold">{id ? 'Edit Offer' : 'New Offer'}</h1>
                <a href="/admin/offers" className="text-sm underline">Back to Offers</a>
            </div>

            <Card>
                <form className="grid gap-4 p-6" onSubmit={onSubmit}>
                    <label className="grid gap-1">
                        <span className="text-sm text-neutral-600">Title</span>
                        <input className="rounded-[10px] border px-3 py-2" name="title" placeholder="Offer title" value={form.title ?? ''} onChange={(e) => update('title', e.target.value)} />
                    </label>

                    <label className="grid gap-1">
                        <span className="text-sm text-neutral-600">Description</span>
                        <textarea className="min-h-[120px] rounded-[10px] border px-3 py-2" name="description" placeholder="What is this offer?" value={form.description ?? ''} onChange={(e) => update('description', e.target.value)} />
                    </label>

                    <label className="grid gap-1">
                        <span className="text-sm text-neutral-600">Type</span>
                        <select name="type" className="rounded-[10px] border px-3 py-2" value={form.type} onChange={(e) => update('type', e.target.value)}>
                            <option value="call">Call</option>
                            <option value="download">Download</option>
                            <option value="discount">Discount</option>
                        </select>
                    </label>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <label className="grid gap-1">
                            <span className="text-sm text-neutral-600">Unlock Day</span>
                            <input className="rounded-[10px] border px-3 py-2" name="unlock_day" type="number" min={0} max={30} value={form.unlock_day ?? ''} onChange={(e) => update('unlock_day', e.target.value)} />
                        </label>

                        <label className="grid gap-1">
                            <span className="text-sm text-neutral-600">Unlock %</span>
                            <input className="rounded-[10px] border px-3 py-2" name="unlock_percent" type="number" min={0} max={100} value={form.unlock_percent ?? ''} onChange={(e) => update('unlock_percent', e.target.value)} />
                        </label>
                    </div>

                    <fieldset className="grid gap-2 rounded-[10px] border p-3">
                        <legend className="px-1 text-sm text-neutral-600">CTA</legend>
                        <label className="grid gap-1">
                            <span className="text-sm text-neutral-600">Label</span>
                            <input className="rounded-[10px] border px-3 py-2" name="cta_label" placeholder="Book now" value={form.cta_label ?? ''} onChange={(e) => update('cta_label', e.target.value)} />
                        </label>
                        <label className="grid gap-1">
                            <span className="text-sm text-neutral-600">URL</span>
                            <input className="rounded-[10px] border px-3 py-2" name="cta_url" placeholder="https://..." value={form.cta_url ?? ''} onChange={(e) => update('cta_url', e.target.value)} />
                        </label>
                    </fieldset>

                    <div className="flex items-center justify-between">
                        <label className="flex items-center gap-2">
                            <input type="checkbox" name="active" checked={!!form.active} onChange={(e) => update('active', e.target.checked)} />
                            <span>Active</span>
                        </label>
                        <Button type="submit" disabled={loading}>{loading ? 'Saving…' : id ? 'Save Changes' : 'Create Offer'}</Button>
                    </div>
                </form>
            </Card>
        </main>
    );
}


