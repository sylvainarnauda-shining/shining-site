import { NextResponse } from 'next/server';

let cache = null;

const CAT_FR = {
  armor: 'Armure',
  armor_head: 'Casque',
  armor_chest: 'Plastron',
  armor_legs: 'Jambières',
  armor_feet: 'Bottes',
  weapon: 'Arme',
  digger: 'Outil mineur',
  fishing_rod: 'Canne à pêche',
  trident: 'Trident',
  bow: 'Arc',
  crossbow: 'Arbalète',
  breakable: 'Tout item',
  vanishable: 'Tout item',
  wearable: 'Portable',
};

export async function GET() {
  if (cache) return NextResponse.json(cache);

  try {
    const res = await fetch('https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.20/enchantments.json');
    const data = await res.json();

    const enchants = data.map(e => ({
      id: e.name,
      name: e.displayName,
      maxLevel: e.maxLevel,
      category: CAT_FR[e.category] || e.category,
      curse: e.curse || false,
    })).sort((a, b) => a.name.localeCompare(b.name));

    cache = enchants;
    return NextResponse.json(enchants);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
