'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/Card';

export default function PayReturnPage() {
    const router = useRouter();
    const [status, setStatus] = useState<'checking' | 'ready' | 'no-access'>('checking');

    useEffect(() => {
        let active = true;
        async function poll() {
            for (let i = 0; i < 20; i++) {
                const res = await fetch('/api/profile/access', { cache: 'no-store' });
                if (!active) return;
                if (res.ok) {
                    const { hasAccess } = await res.json();
                    if (hasAccess) {
                        setStatus('ready');
                        router.replace('/dashboard');
                        return;
                    }
                }
                await new Promise(r => setTimeout(r, 1500));
            }
            setStatus('no-access');
        }
        poll();
        return () => { active = false; };
    }, [router]);

    return (
        <main className="mx-auto max-w-md px-4 py-16">
            <Card>
                <div className="p-6 text-center">
                    {status === 'checking' && <p>Processing your purchase…</p>}
                    {status === 'no-access' && (
                        <div>
                            <p>We’re still confirming your payment. This can take a moment.</p>
                            <p className="mt-2 text-sm text-neutral-600">If you completed checkout, you can refresh or go to the dashboard.</p>
                        </div>
                    )}
                </div>
            </Card>
        </main>
    );
}


