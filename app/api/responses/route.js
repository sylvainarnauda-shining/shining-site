import { NextResponse } from 'next/server';
import { getAdminClient } from '../../../lib/supabase';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const offerId = searchParams.get('offer_id');

  if (!offerId) {
    return NextResponse.json({ error: 'offer_id requis' }, { status: 400 });
  }

  const admin = getAdminClient();
  const { data, error } = await admin
    .from('responses')
    .select('*')
    .eq('offer_id', offerId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
