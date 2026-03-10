import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  const { password } = await request.json();

  if (!password) {
    return NextResponse.json({ error: 'Mot de passe requis' }, { status: 400 });
  }

  const hash = process.env.ADMIN_PASSWORD_HASH;
  if (!hash) {
    return NextResponse.json({ error: 'Configuration admin manquante' }, { status: 500 });
  }

  const valid = bcrypt.compareSync(password, hash);
  if (!valid) {
    return NextResponse.json({ error: 'Mot de passe incorrect' }, { status: 401 });
  }

  return NextResponse.json({ success: true });
}
