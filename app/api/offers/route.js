import { NextResponse } from 'next/server';
import { supabase, getAdminClient } from '../../../lib/supabase';
import bcrypt from 'bcryptjs';

// GET - Liste des offres actives (public)
export async function GET() {
  const { data, error } = await supabase
    .from('offers')
    .select('*')
    .eq('status', 'active')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// Verification admin
function verifyAdmin(request) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader) return false;
  const token = authHeader.replace('Bearer ', '');
  // Le token est le mot de passe en clair, on le compare au hash
  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) return false;
  return bcrypt.compareSync(token, hash);
}

// POST - Creer une offre (admin)
export async function POST(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('offers')
    .insert({
      type: body.type,
      title: body.title,
      description: body.description,
      quantity: body.quantity || null,
      price: body.price || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

// PUT - Modifier une offre (admin)
export async function PUT(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const body = await request.json();
  const admin = getAdminClient();
  const { data, error } = await admin
    .from('offers')
    .update({
      type: body.type,
      title: body.title,
      description: body.description,
      quantity: body.quantity,
      price: body.price,
      status: body.status,
    })
    .eq('id', body.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE - Supprimer une offre (admin)
export async function DELETE(request) {
  if (!verifyAdmin(request)) {
    return NextResponse.json({ error: 'Non autorisé' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const admin = getAdminClient();
  const { error } = await admin
    .from('offers')
    .delete()
    .eq('id', id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
