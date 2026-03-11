import { NextResponse } from 'next/server';
import { supabase } from '../../../lib/supabase';

export async function GET() {
  const checks = { page: true, db: false, icons: false, timestamp: new Date().toISOString() };

  try {
    const { data, error } = await supabase.from('settings').select('key').limit(1);
    checks.db = !error;
  } catch { checks.db = false; }

  try {
    const res = await fetch('https://minecraft.wiki/images/Invicon_Diamond.png', { method: 'HEAD' });
    checks.icons = res.ok;
  } catch { checks.icons = false; }

  const allOk = checks.page && checks.db && checks.icons;
  return NextResponse.json({ status: allOk ? 'healthy' : 'degraded', checks }, { status: allOk ? 200 : 503 });
}
