import { Card } from '@/components/Card';
import { getServerSupabase } from '@/lib/supabaseServer';
import { Button } from '@/components/Button';

export default async function PerksPage() {
    const supabase = getServerSupabase();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) return (null);

    // Gate unpaid users from seeing perks metadata; invite to pay.
    const { data: profile } = await supabase.from('profiles').select('has_access').eq('id', user.id).maybeSingle();
    if (profile?.has_access === false) {
        return (
            <main className="mx-auto max-w-5xl px-4 py-8">
                <h1 className="mb-6 text-3xl font-semibold">Perks</h1>
                <Card>
                    <div className="p-6">
                        <p className="text-neutral-700">Perks unlock after purchase or milestones. Get access to start unlocking perks.</p>
                        <a href="/pay" className="mt-3 inline-block rounded-md bg-[#FF6A00] px-4 py-2 text-white">Go to Paywall</a>
                    </div>
                </Card>
            </main>
        );
    }

    const [{ data: percentRes }, { data: perksRes }, { data: metaRes }] = await Promise.all([
        supabase.from('user_completion').select('percent_complete').eq('user_id', user.id).maybeSingle(),
        supabase.from('perk_unlocks').select('offer_id, unlocked, reason').eq('user_id', user.id),
        supabase
            .from('offers')
            .select('id, title, description, sort_order')
            .eq('active', true)
            .order('sort_order', { ascending: true }),
    ]);

    const percent = percentRes?.percent_complete ?? 0;
    const map = new Map<string, { unlocked: boolean; reason: string }>();
    (perksRes || []).forEach((p: any) => map.set(p.offer_id, { unlocked: !!p.unlocked, reason: p.reason }));

    return (
        <main className="mx-auto max-w-5xl px-4 py-8">
            <h1 className="mb-6 text-3xl font-semibold">Perks</h1>
            <p className="mb-6 text-neutral-600">Unlock helpful extras as you progress. Completed lessons: {percent}%</p>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {(metaRes || []).map((o: any) => {
                    const state = map.get(o.id);
                    const unlocked = state?.unlocked ?? false;
                    const reason = state?.reason ?? '';
                    const muted = unlocked ? '' : 'opacity-50';
                    return (
                        <Card key={o.id} className={`p-4 ${muted}`}>
                            <h2 className="text-lg font-medium">{o.title}</h2>
                            {o.description && <p className="mt-1 text-sm text-neutral-600">{o.description}</p>}
                            <p className="mt-2 text-sm text-neutral-600">{unlocked ? 'Available now' : `Locked · ${reason}`}</p>
                            {unlocked && (
                                <form action="/api/perks/redeem" method="post" target="_blank" className="mt-3">
                                    <input type="hidden" name="offerId" value={o.id} />
                                    <Button type="submit">Redeem</Button>
                                </form>
                            )}
                        </Card>
                    );
                })}
            </div>
        </main>
    );
}


