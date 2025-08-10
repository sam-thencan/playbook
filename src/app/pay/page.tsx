import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function PayPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-6 text-3xl font-bold">Unlock the 30‑Day Local SEO Playbook</h1>
      <Card>
        <div className="p-6">
          <p className="text-neutral-700">One-time purchase. Lifetime access. No subscription.</p>
          <form action="/api/checkout" method="post" className="mt-6">
            <Button type="submit">Buy now</Button>
          </form>
          <p className="mt-3 text-sm text-neutral-600">You’ll be redirected to a secure Stripe Checkout page.</p>
        </div>
      </Card>
    </main>
  );
}


