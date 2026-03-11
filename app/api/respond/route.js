import { NextResponse } from 'next/server';
import { getAdminClient } from '../../../lib/supabase';
import { sendDiscordNotification } from '../../../lib/discord';
import { rateLimit } from '../../../lib/rate-limit';

// 5 réponses max par minute par IP
const checkLimit = rateLimit({ maxRequests: 5, windowMs: 60000 });

export async function POST(request) {
  // Rate limiting
  const limit = checkLimit(request);
  if (!limit.ok) {
    return NextResponse.json(
      { error: `Trop de requêtes. Réessaie dans ${limit.retryAfter}s.` },
      { status: 429, headers: { 'Retry-After': String(limit.retryAfter) } }
    );
  }

  const body = await request.json();

  if (!body.offer_id || !body.minecraft_pseudo) {
    return NextResponse.json(
      { error: 'Pseudo Minecraft requis' },
      { status: 400 }
    );
  }

  // Service booking (not a DB offer)
  if (body.offer_id === 'service') {
    await sendDiscordNotification({
      type: 'emploi',
      offerTitle: body.message || 'Service',
      minecraftPseudo: body.minecraft_pseudo,
      discordPseudo: body.discord_pseudo,
      message: body.message,
    });
    return NextResponse.json({ success: true }, { status: 201 });
  }

  const admin = getAdminClient();

  // Recuperer l'offre pour le webhook Discord
  const { data: offer } = await admin
    .from('offers')
    .select('*')
    .eq('id', body.offer_id)
    .single();

  if (!offer) {
    return NextResponse.json({ error: 'Offre introuvable' }, { status: 404 });
  }

  // Sauvegarder la reponse
  const { data, error } = await admin
    .from('responses')
    .insert({
      offer_id: body.offer_id,
      minecraft_pseudo: body.minecraft_pseudo,
      discord_pseudo: body.discord_pseudo || null,
      message: body.message || null,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Envoyer la notification Discord
  await sendDiscordNotification({
    type: offer.type,
    offerTitle: offer.title,
    minecraftPseudo: body.minecraft_pseudo,
    discordPseudo: body.discord_pseudo,
    message: body.message,
  });

  return NextResponse.json({ success: true, data }, { status: 201 });
}
