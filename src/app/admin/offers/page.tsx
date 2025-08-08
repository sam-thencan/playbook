import Link from 'next/link';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';

export default function AdminOffersListPage() {
    const rows = [
        { id: '1', title: 'Free Strategy Call', type: 'call', active: true, unlock_day: 7 as number | null, unlock_percent: null as number | null },
    ];

    return (
        <main className="mx-auto max-w-5xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Offers</h1>
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
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((r) => (
                                <tr key={r.id} className="border-b last:border-0">
                                    <td className="px-4 py-3">{r.title}</td>
                                    <td className="px-4 py-3">{r.type}</td>
                                    <td className="px-4 py-3">{r.unlock_day ?? '-'}</td>
                                    <td className="px-4 py-3">{r.unlock_percent ?? '-'}</td>
                                    <td className="px-4 py-3">{r.active ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Link href={`/admin/offers/edit?id=${r.id}`}>
                                            <Button variant="secondary">Edit</Button>
                                        </Link>
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


