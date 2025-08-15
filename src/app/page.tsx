import { redirect } from 'next/navigation';
import { getServerSupabase } from '@/lib/supabaseServer';

export default async function Home() {
  const supabase = await getServerSupabase();
  const { data: { user } } = await supabase.auth.getUser();
  redirect(user ? '/dashboard' : '/login');
}
