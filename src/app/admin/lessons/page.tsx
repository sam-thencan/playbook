import Link from 'next/link';
import { Card } from '@/components/Card';
import { Button } from '@/components/Button';
import { getServerSupabase } from '@/lib/supabaseServer';

type Row = { id: string; title: string; slug: string; day: number | null; published: boolean };

export default async function AdminLessonsListPage() {
    const supabase = getServerSupabase();
    const { data: rows } = await supabase
        .from('lessons')
        .select('id, title, slug, day, published')
        .order('is_intro', { ascending: false })
        .order('day', { ascending: true, nullsFirst: true })
        .order('sort_order', { ascending: true });

    return (
        <main className="mx-auto max-w-5xl px-4 py-8">
            <div className="mb-6 flex items-center justify-between">
                <h1 className="text-3xl font-semibold">Lessons</h1>
                <Link href="/admin/lessons/edit">
                    <Button>New Lesson</Button>
                </Link>
            </div>

            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left">
                        <thead>
                            <tr className="border-b">
                                <th className="px-4 py-3">Title</th>
                                <th className="px-4 py-3">Slug</th>
                                <th className="px-4 py-3">Day</th>
                                <th className="px-4 py-3">Published</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody>
                            {(rows as Row[] | null)?.map((r) => (
                                <tr key={r.id} className="border-b last:border-0">
                                    <td className="px-4 py-3">{r.title}</td>
                                    <td className="px-4 py-3">{r.slug}</td>
                                    <td className="px-4 py-3">{r.day ?? '-'}</td>
                                    <td className="px-4 py-3">{r.published ? 'Yes' : 'No'}</td>
                                    <td className="px-4 py-3 text-right">
                                        <Link href={`/admin/lessons/edit?id=${r.id}`}>
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


