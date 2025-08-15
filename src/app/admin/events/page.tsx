import { Card } from '@/components/Card';
import { getServerSupabase } from '@/lib/supabaseServer';

export default async function AdminEventsPage() {
    const supabase = await getServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return <main className="mx-auto max-w-5xl px-4 py-8">Sign in</main>;

    // Basic admin check
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    if (profile?.role !== 'admin') return <main className="mx-auto max-w-5xl px-4 py-8">Not authorized</main>;

    const { data } = await supabase
        .from('events')
        .select('id, event_type, lesson_id, offer_id, metadata, created_at, profiles!inner(email)')
        .order('created_at', { ascending: false })
        .limit(200);

    return (
        <main className="mx-auto max-w-6xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-bold">Events (Admin)</h1>
            <Card>
                <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm">
                        <thead className="bg-neutral-50">
                            <tr>
                                <th className="px-3 py-2">Time</th>
                                <th className="px-3 py-2">User</th>
                                <th className="px-3 py-2">Type</th>
                                <th className="px-3 py-2">Lesson</th>
                                <th className="px-3 py-2">Offer</th>
                                <th className="px-3 py-2">Meta</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(data || []).map((e: any) => (
                                <tr key={e.id} className="border-t">
                                    <td className="px-3 py-2 whitespace-nowrap">{new Date(e.created_at).toLocaleString()}</td>
                                    <td className="px-3 py-2">{e.profiles?.email ?? '—'}</td>
                                    <td className="px-3 py-2">{e.event_type}</td>
                                    <td className="px-3 py-2">{e.lesson_id ?? '—'}</td>
                                    <td className="px-3 py-2">{e.offer_id ?? '—'}</td>
                                    <td className="px-3 py-2 text-xs text-neutral-600">{JSON.stringify(e.metadata ?? {})}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </main>
    );
}


