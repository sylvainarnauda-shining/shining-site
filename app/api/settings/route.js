import { NextResponse } from 'next/server';
import { supabase, getAdminClient } from '../../../lib/supabase';
import bcrypt from 'bcryptjs';

// GET - Read settings (public)
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');

  if (key) {
    const { data, error } = await supabase.from('settings').select('*').eq('key', key).single();
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  const { data, error } = await supabase.from('settings').select('*');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PUT - Update a setting (admin only)
export async function PUT(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });

  const token = authHeader.replace('Bearer ', '');
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash || !bcrypt.compareSync(token, hash)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const admin = getAdminClient();

  const { data, error } = await admin
    .from('settings')
    .upsert({ key: body.key, value: body.value, updated_at: new Date().toISOString() })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
