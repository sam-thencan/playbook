'use client';

import { Button } from '@/components/Button';
import { supabase } from '@/lib/supabaseClient';
import { useState } from 'react';

export function LogoutButton() {
    const [loading, setLoading] = useState(false);

    async function onLogout() {
        setLoading(true);
        await supabase.auth.signOut();
        setLoading(false);
        window.location.href = '/login';
    }

    return (
        <Button variant="secondary" onClick={onLogout} disabled={loading} aria-label="Log out">
            {loading ? 'Logging out…' : 'Log out'}
        </Button>
    );
}


