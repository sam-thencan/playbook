'use client';

import { useSearchParams } from 'next/navigation';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function AdminOffersEditPage() {
  const search = useSearchParams();
  const id = search.get('id');

  return (
    <main className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-semibold">{id ? 'Edit Offer' : 'New Offer'}</h1>

      <Card>
        <form className="grid gap-4 p-6">
          <label className="grid gap-1">
            <span className="text-sm text-neutral-600">Title</span>
            <input className="rounded-[10px] border px-3 py-2" name="title" placeholder="Offer title" />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-neutral-600">Description</span>
            <textarea className="min-h-[120px] rounded-[10px] border px-3 py-2" name="description" placeholder="What is this offer?" />
          </label>

          <label className="grid gap-1">
            <span className="text-sm text-neutral-600">Type</span>
            <select name="type" className="rounded-[10px] border px-3 py-2">
              <option value="call">Call</option>
              <option value="download">Download</option>
              <option value="discount">Discount</option>
            </select>
          </label>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="text-sm text-neutral-600">Unlock Day</span>
              <input className="rounded-[10px] border px-3 py-2" name="unlock_day" type="number" min={0} max={30} />
            </label>

            <label className="grid gap-1">
              <span className="text-sm text-neutral-600">Unlock %</span>
              <input className="rounded-[10px] border px-3 py-2" name="unlock_percent" type="number" min={0} max={100} />
            </label>
          </div>

          <fieldset className="grid gap-2 rounded-[10px] border p-3">
            <legend className="px-1 text-sm text-neutral-600">CTA</legend>
            <label className="grid gap-1">
              <span className="text-sm text-neutral-600">Label</span>
              <input className="rounded-[10px] border px-3 py-2" name="cta_label" placeholder="Book now" />
            </label>
            <label className="grid gap-1">
              <span className="text-sm text-neutral-600">URL</span>
              <input className="rounded-[10px] border px-3 py-2" name="cta_url" placeholder="https://..." />
            </label>
          </fieldset>

          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input type="checkbox" name="active" defaultChecked />
              <span>Active</span>
            </label>
            <Button type="submit">{id ? 'Save Changes' : 'Create Offer'}</Button>
          </div>
        </form>
      </Card>
    </main>
  );
}


