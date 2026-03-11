import { NextResponse } from 'next/server';
import { supabase, getAdminClient } from '../../../lib/supabase';
import bcrypt from 'bcryptjs';

export async function GET() {
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('offers')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  return bcrypt.compareSync(token, hash);
}

export async function POST(request) {
  const body = await request.json();
  if (!body.title || !body.author_pseudo) {
    return NextResponse.json({ error: 'Item et pseudo requis' }, { status: 400 });
  }
  const isAdmin = verifyAdmin(request);
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('offers')
    .insert({
      type: body.type || 'vente',
      title: body.title,
      description: body.description || null,
      quantity: body.quantity || null,
      price: body.price || null,
      author_pseudo: body.author_pseudo,
      status: 'active',
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ...data, is_shining: isAdmin }, { status: 201 });
}

export async function PUT(request) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const body = await request.json();
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('offers')
    .update({ type: body.type, title: body.title, description: body.description, quantity: body.quantity, price: body.price, status: body.status })
    .eq('id', body.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function DELETE(request) {
  if (!verifyAdmin(request)) return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const admin = getAdminClient();
  const { error } = await admin.from('offers').delete().eq('id', searchParams.get('id'));
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
