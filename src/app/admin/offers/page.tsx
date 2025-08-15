import Link from 'next/link';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getServerSupabase } from '@/lib/supabaseServer';
import { AdminDeleteButton } from '@/components/AdminDeleteButton';

type Row = { id: string; title: string; type: string; active: boolean; unlock_day: number | null; unlock_percent: number | null };

export default async function AdminOffersListPage() {
    const supabase = await getServerSupabase();
    const { data: rows } = await supabase
        .from('offers')
        .select('id, title, type, active, unlock_day, unlock_percent')
        .order('sort_order', { ascending: true });

    return (
        <main className="mx-auto max-w-5xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Perks (Admin)</h1>
                <Link href="/admin/offers/edit">
                    <Button>New Offer</Button>
                </Link>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Type</th>
                                <th className="px-4 py-3">Unlock Day</th>
                                <th className="px-4 py-3">Unlock %</th>
                                <th className="px-4 py-3">Active</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(rows as Row[] | null)?.map((r) => (
                                <tr key={r.id} className="border-b last:border-0">
                                    <td className="px-4 py-3">{r.title}</td>
                                    <td className="px-4 py-3">{r.type}</td>
                                    <td className="px-4 py-3">{r.unlock_day ?? '-'}</td>
                                    <td className="px-4 py-3">{r.unlock_percent ?? '-'}</td>
                                    <td className="px-4 py-3">{r.active ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-3 text-right space-x-2">
                                        <Link href={`/admin/offers/edit?id=${r.id}`}>
                                            <Button variant="secondary">Edit</Button>
                                        </Link>
                                        <AdminDeleteButton resource="offers" id={r.id} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </main>
    );
}


