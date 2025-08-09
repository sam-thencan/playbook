import { Card } from '@/components/Card';
import { getServerSupabase } from '@/lib/supabaseServer';

export default async function LevelUpsPage() {
  const supabase = getServerSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let percent = 0;
  if (user) {
    const { data } = await supabase.from('user_completion').select('percent_complete').eq('user_id', user.id).maybeSingle();
    percent = data?.percent_complete ?? 0;
  }

  const { data: offers } = await supabase
    .from('offers')
    .select('id, title, description, unlock_day, unlock_percent, active')
    .eq('active', true)
    .order('sort_order', { ascending: true });

  return (
    <main className="mx-auto max-w-5xl px-4 py-8">
      <h1 className="mb-6 text-3xl font-semibold">Level‑Ups</h1>
      <p className="mb-6 text-neutral-600">Unlock helpful extras as you progress. Completed lessons: {percent}%</p>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {(offers || []).map((o) => {
          const unlockByDay = o.unlock_day != null ? `After Day ${o.unlock_day}` : null;
          const unlockByPct = o.unlock_percent != null ? `${o.unlock_percent}% complete` : null;
          const rule = [unlockByDay, unlockByPct].filter(Boolean).join(' or ');
          const unlocked = (o.unlock_day == null || false) ? (o.unlock_percent == null ? true : percent >= (o.unlock_percent as number)) : false;
          const unlockedByDay = o.unlock_day != null && (o.unlock_percent == null) && false; // placeholder; we usually unlock on view/completion
          const isUnlocked = unlocked || unlockedByDay || (o.unlock_day != null && false);
          const muted = !isUnlocked ? 'opacity-50' : '';
          return (
            <Card key={o.id} className={`p-4 ${muted}`}>
              <h2 className="text-lg font-medium">{o.title}</h2>
              {o.description && <p className="mt-1 text-sm text-neutral-600">{o.description}</p>}
              <p className="mt-2 text-sm text-neutral-600">{isUnlocked ? 'Available now' : `Locked · ${rule}`}</p>
            </Card>
          );
        })}
      </div>
    </main>
  );
}


