import { NextResponse } from 'next/server';
import { getAdminClient } from '../../../lib/supabase';

export async function GET() {
  const admin = getAdminClient();

  // Get ALL offers (active + closed) for historical stats
  const { data: offers, error } = await admin
    .from('offers')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(500);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Get response counts per offer
  const { data: responses } = await admin
    .from('responses')
    .select('offer_id, minecraft_pseudo');

  const respMap = {};
  (responses || []).forEach(r => {
    respMap[r.offer_id] = (respMap[r.offer_id] || 0) + 1;
  });

  // Compute stats
  const itemCounts = {}; // {itemId: {sells: n, buys: n, totalQty: n, prices: [...]}}
  const traderCounts = {}; // {pseudo: {sells: n, buys: n, responses: n}}

  (offers || []).forEach(o => {
    const itemId = o.title;
    const author = o.author_pseudo || 'Anonyme';
    const qty = parseInt(o.quantity) || 1;

    if (!itemCounts[itemId]) itemCounts[itemId] = { sells: 0, buys: 0, totalQty: 0, prices: [] };
    if (!traderCounts[author]) traderCounts[author] = { sells: 0, buys: 0, responses: 0 };

    if (o.type === 'vente') {
      itemCounts[itemId].sells++;
      traderCounts[author].sells++;
    } else if (o.type === 'achat') {
      itemCounts[itemId].buys++;
      traderCounts[author].buys++;
    }
    itemCounts[itemId].totalQty += qty;

    // Parse price for average (handles old {item,qty} and new [{item,qty},...])
    try {
      const p = JSON.parse(o.price);
      const priceArr = Array.isArray(p) ? p : (p.item ? [p] : []);
      priceArr.forEach(pr => {
        if (pr.item === 'diamond' && pr.qty) {
          itemCounts[itemId].prices.push(parseFloat(pr.qty) / qty);
        }
      });
    } catch {}
  });

  // Count responses per trader
  (responses || []).forEach(r => {
    const p = r.minecraft_pseudo;
    if (!traderCounts[p]) traderCounts[p] = { sells: 0, buys: 0, responses: 0 };
    traderCounts[p].responses++;
  });

  // Most traded items (by total offers)
  const topItems = Object.entries(itemCounts)
    .map(([id, d]) => ({
      id,
      total: d.sells + d.buys,
      sells: d.sells,
      buys: d.buys,
      totalQty: d.totalQty,
      avgPriceDiamonds: d.prices.length > 0
        ? Math.round(d.prices.reduce((a, b) => a + b, 0) / d.prices.length * 100) / 100
        : null,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 10);

  // Top traders (filter offensive pseudos)
  const BLOCKED = /fuck|shit|ass|bitch|nazi|nigg/i;
  const topTraders = Object.entries(traderCounts)
    .filter(([pseudo]) => pseudo !== 'Anonyme' && !BLOCKED.test(pseudo))
    .map(([pseudo, d]) => ({
      pseudo,
      total: d.sells + d.buys + d.responses,
      sells: d.sells,
      buys: d.buys,
      responses: d.responses,
    }))
    .sort((a, b) => b.total - a.total)
    .slice(0, 8);

  // Current demands (active buy offers)
  const activeBuys = (offers || [])
    .filter(o => o.status === 'active' && o.type === 'achat')
    .slice(0, 5)
    .map(o => ({
      item: o.title,
      quantity: o.quantity,
      author: o.author_pseudo,
    }));

  return NextResponse.json({
    totalOffers: (offers || []).length,
    activeOffers: (offers || []).filter(o => o.status === 'active').length,
    totalResponses: (responses || []).length,
    topItems,
    topTraders,
    activeDemands: activeBuys,
  });
}
