import { NextResponse } from 'next/server';
import { supabase, getAdminClient } from '../../../lib/supabase';
import bcrypt from 'bcryptjs';

export async function GET() {
  const admin = getAdminClient();

  // Auto-cleanup: close offers older than 4 hours
  const fourHoursAgo = new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString();
  await admin
    .from('offers')
    .update({ status: 'closed' })
    .eq('status', 'active')
    .lt('created_at', fourHoursAgo);

  const { data, error } = await admin
    .from('offers')
    .select('*, responses(count)')
    .eq('status', 'active')
    .order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Flatten response count
  const enriched = (data || []).map(o => ({
    ...o,
    response_count: o.responses?.[0]?.count || 0,
    responses: undefined,
  }));
  return NextResponse.json(enriched);
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
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const authorPseudo = searchParams.get('author_pseudo');
  const admin = getAdminClient();

  // Admin can delete any offer
  if (verifyAdmin(request)) {
    const { error } = await admin.from('offers').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  // Author can delete their own offer by matching pseudo
  if (authorPseudo) {
    const { data: offer } = await admin.from('offers').select('author_pseudo').eq('id', id).single();
    if (!offer) return NextResponse.json({ error: 'Offre introuvable' }, { status: 404 });
    if (offer.author_pseudo.toLowerCase() !== authorPseudo.toLowerCase()) {
      return NextResponse.json({ error: 'Ce n\'est pas ton offre' }, { status: 403 });
    }
    const { error } = await admin.from('offers').delete().eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
}
