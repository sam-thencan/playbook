'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export function LogoutButton() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    async function onLogout() {
        setLoading(true);
        await supabase.auth.signOut();
        setLoading(false);
        router.push('/login');
    }

    return (
        <Button variant="secondary" onClick={onLogout} disabled={loading} aria-label="Log out">
            {loading ? 'Logging out…' : 'Log out'}
        </Button>
    );
}


