'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const redirect = useMemo(() => search.get('redirect') || '/dashboard', [search]);

  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // If we already have a session, immediately continue to the redirect target.
  useEffect(() => {
    let active = true;
    (async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (active && user) {
        router.replace(redirect);
      }
    })();
    return () => { active = false; };
  }, [redirect, router]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    if (mode === 'login') {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setLoading(false);
      if (error) return setError(error.message);
      router.push(redirect);
      return;
    }
    // signup
    if (password !== password2) {
      setLoading(false);
      return setError('Passwords do not match');
    }
    const { data, error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    if (data.session) {
      router.push(redirect);
    } else {
      setMessage('Check your email to confirm your account.');
    }
  }

  async function onGoogle() {
    setLoading(true);
    setError(null);
    const origin = process.env.NEXT_PUBLIC_SITE_URL || window.location.origin;
    const callback = `${origin}/api/auth/callback?redirect=${encodeURIComponent(redirect)}`;
    const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: callback } });
    if (error) setError(error.message);
    setLoading(false);
  }

  return (
    <main className="mx-auto max-w-md px-4 py-16">
      <div className="mb-6 flex items-center gap-4">
        <h1 className="text-3xl font-semibold">{mode === 'login' ? 'Log in' : 'Create account'}</h1>
        <button
          className="text-sm underline"
          onClick={() => setMode((m) => (m === 'login' ? 'signup' : 'login'))}
        >
          {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in'}
        </button>
      </div>
      <Card>
        <form onSubmit={onSubmit} className="grid gap-4 p-6">
          <label className="grid gap-1">
            <span className="text-sm text-neutral-600">Email</span>
            <input
              type="email"
              required
              className="rounded-[10px] border px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>
          <label className="grid gap-1">
            <span className="text-sm text-neutral-600">Password</span>
            <input
              type="password"
              required
              className="rounded-[10px] border px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
            />
          </label>
          {mode === 'signup' && (
            <label className="grid gap-1">
              <span className="text-sm text-neutral-600">Confirm Password</span>
              <input
                type="password"
                required
                className="rounded-[10px] border px-3 py-2"
                value={password2}
                onChange={(e) => setPassword2(e.target.value)}
                minLength={6}
              />
            </label>
          )}
          {error && <p className="text-sm text-red-600">{error}</p>}
          {message && <p className="text-sm text-green-700">{message}</p>}
          <Button type="submit" disabled={loading}>
            {loading ? (mode === 'login' ? 'Signing in…' : 'Creating…') : mode === 'login' ? 'Sign In' : 'Sign Up'}
          </Button>
          <div className="relative my-2 text-center text-sm text-neutral-500">or</div>
          <Button type="button" variant="secondary" onClick={onGoogle}>
            Continue with Google
          </Button>
        </form>
      </Card>
    </main>
  );
}


