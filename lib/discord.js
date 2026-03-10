export async function sendDiscordNotification({ type, offerTitle, minecraftPseudo, discordPseudo, message }) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const typeEmojis = {
    achat: '🛒',
    vente: '💰',
    emploi: '⛏️',
  };

  const typeLabels = {
    achat: 'ACHAT',
    vente: 'VENTE',
    emploi: 'EMPLOI',
  };

  const embed = {
    title: `${typeEmojis[type] || '📌'} Nouvelle réponse — ${typeLabels[type] || type}`,
    color: 0x7c3aed, // violet
    fields: [
      { name: '📋 Offre', value: offerTitle, inline: true },
      { name: '🎮 Pseudo Minecraft', value: minecraftPseudo, inline: true },
    ],
    timestamp: new Date().toISOString(),
    footer: { text: 'Shining — shining-mc.fr' },
  };

  if (discordPseudo) {
    embed.fields.push({ name: '💬 Discord', value: discordPseudo, inline: true });
  }
  if (message) {
    embed.fields.push({ name: '✉️ Message', value: message, inline: false });
  }

  try {
    await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ embeds: [embed] }),
    });
  } catch (err) {
    console.error('Erreur webhook Discord:', err);
  }
}
