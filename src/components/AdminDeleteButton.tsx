'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { useState } from 'react';

type Props = {
    resource: 'lessons' | 'offers';
    id: string;
    label?: string;
};

export function AdminDeleteButton({ resource, id, label = 'Delete' }: Props) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function onDelete() {
        if (!confirm('Are you sure you want to delete this item?')) return;
        setLoading(true);
        const res = await fetch(`/api/admin/${resource}/${id}`, { method: 'DELETE' });
        setLoading(false);
        if (!res.ok) {
            alert('Delete failed');
            return;
        }
    router.refresh();
    // Fallback: reload if Next cache didn’t reflect
    setTimeout(() => {
      if (typeof window !== 'undefined') window.location.reload();
    }, 250);
    }

    return (
        <Button variant="secondary" onClick={onDelete} disabled={loading} aria-label={label}>
            {loading ? 'Deleting…' : label}
        </Button>
    );
}


