// Minecraft items list with icons
// Using https://mc-heads.net/img/ for item renders
// Fallback: pixel art from crafatar or static assets

const ICON_BASE = 'https://minecraft-api.vercel.app/images/items';

export const MC_ITEMS = [
  // Minerais & Gems
  { id: 'diamond', name: 'Diamant', icon: `${ICON_BASE}/diamond.png`, category: 'Minerais' },
  { id: 'emerald', name: 'Émeraude', icon: `${ICON_BASE}/emerald.png`, category: 'Minerais' },
  { id: 'gold_ingot', name: 'Lingot d\'or', icon: `${ICON_BASE}/gold_ingot.png`, category: 'Minerais' },
  { id: 'iron_ingot', name: 'Lingot de fer', icon: `${ICON_BASE}/iron_ingot.png`, category: 'Minerais' },
  { id: 'netherite_ingot', name: 'Lingot de Netherite', icon: `${ICON_BASE}/netherite_ingot.png`, category: 'Minerais' },
  { id: 'copper_ingot', name: 'Lingot de cuivre', icon: `${ICON_BASE}/copper_ingot.png`, category: 'Minerais' },
  { id: 'lapis_lazuli', name: 'Lapis Lazuli', icon: `${ICON_BASE}/lapis_lazuli.png`, category: 'Minerais' },
  { id: 'redstone', name: 'Redstone', icon: `${ICON_BASE}/redstone.png`, category: 'Minerais' },
  { id: 'coal', name: 'Charbon', icon: `${ICON_BASE}/coal.png`, category: 'Minerais' },
  { id: 'amethyst_shard', name: 'Éclat d\'améthyste', icon: `${ICON_BASE}/amethyst_shard.png`, category: 'Minerais' },
  { id: 'quartz', name: 'Quartz du Nether', icon: `${ICON_BASE}/quartz.png`, category: 'Minerais' },

  // Blocs
  { id: 'diamond_block', name: 'Bloc de diamant', icon: `${ICON_BASE}/diamond_block.png`, category: 'Blocs' },
  { id: 'emerald_block', name: 'Bloc d\'émeraude', icon: `${ICON_BASE}/emerald_block.png`, category: 'Blocs' },
  { id: 'gold_block', name: 'Bloc d\'or', icon: `${ICON_BASE}/gold_block.png`, category: 'Blocs' },
  { id: 'iron_block', name: 'Bloc de fer', icon: `${ICON_BASE}/iron_block.png`, category: 'Blocs' },
  { id: 'netherite_block', name: 'Bloc de Netherite', icon: `${ICON_BASE}/netherite_block.png`, category: 'Blocs' },
  { id: 'obsidian', name: 'Obsidienne', icon: `${ICON_BASE}/obsidian.png`, category: 'Blocs' },

  // Outils & Armes
  { id: 'diamond_sword', name: 'Épée en diamant', icon: `${ICON_BASE}/diamond_sword.png`, category: 'Outils' },
  { id: 'diamond_pickaxe', name: 'Pioche en diamant', icon: `${ICON_BASE}/diamond_pickaxe.png`, category: 'Outils' },
  { id: 'diamond_axe', name: 'Hache en diamant', icon: `${ICON_BASE}/diamond_axe.png`, category: 'Outils' },
  { id: 'diamond_shovel', name: 'Pelle en diamant', icon: `${ICON_BASE}/diamond_shovel.png`, category: 'Outils' },
  { id: 'netherite_sword', name: 'Épée en Netherite', icon: `${ICON_BASE}/netherite_sword.png`, category: 'Outils' },
  { id: 'netherite_pickaxe', name: 'Pioche en Netherite', icon: `${ICON_BASE}/netherite_pickaxe.png`, category: 'Outils' },
  { id: 'bow', name: 'Arc', icon: `${ICON_BASE}/bow.png`, category: 'Outils' },
  { id: 'crossbow', name: 'Arbalète', icon: `${ICON_BASE}/crossbow.png`, category: 'Outils' },
  { id: 'trident', name: 'Trident', icon: `${ICON_BASE}/trident.png`, category: 'Outils' },
  { id: 'shield', name: 'Bouclier', icon: `${ICON_BASE}/shield.png`, category: 'Outils' },
  { id: 'fishing_rod', name: 'Canne à pêche', icon: `${ICON_BASE}/fishing_rod.png`, category: 'Outils' },

  // Armures
  { id: 'diamond_helmet', name: 'Casque en diamant', icon: `${ICON_BASE}/diamond_helmet.png`, category: 'Armures' },
  { id: 'diamond_chestplate', name: 'Plastron en diamant', icon: `${ICON_BASE}/diamond_chestplate.png`, category: 'Armures' },
  { id: 'diamond_leggings', name: 'Jambières en diamant', icon: `${ICON_BASE}/diamond_leggings.png`, category: 'Armures' },
  { id: 'diamond_boots', name: 'Bottes en diamant', icon: `${ICON_BASE}/diamond_boots.png`, category: 'Armures' },
  { id: 'netherite_helmet', name: 'Casque en Netherite', icon: `${ICON_BASE}/netherite_helmet.png`, category: 'Armures' },
  { id: 'netherite_chestplate', name: 'Plastron en Netherite', icon: `${ICON_BASE}/netherite_chestplate.png`, category: 'Armures' },
  { id: 'netherite_leggings', name: 'Jambières en Netherite', icon: `${ICON_BASE}/netherite_leggings.png`, category: 'Armures' },
  { id: 'netherite_boots', name: 'Bottes en Netherite', icon: `${ICON_BASE}/netherite_boots.png`, category: 'Armures' },
  { id: 'elytra', name: 'Élytres', icon: `${ICON_BASE}/elytra.png`, category: 'Armures' },

  // Enchantements & Potions
  { id: 'enchanted_book', name: 'Livre enchanté', icon: `${ICON_BASE}/enchanted_book.png`, category: 'Magie' },
  { id: 'experience_bottle', name: 'Fiole d\'XP', icon: `${ICON_BASE}/experience_bottle.png`, category: 'Magie' },
  { id: 'ender_pearl', name: 'Perle de l\'Ender', icon: `${ICON_BASE}/ender_pearl.png`, category: 'Magie' },
  { id: 'blaze_rod', name: 'Bâton de Blaze', icon: `${ICON_BASE}/blaze_rod.png`, category: 'Magie' },
  { id: 'ghast_tear', name: 'Larme de Ghast', icon: `${ICON_BASE}/ghast_tear.png`, category: 'Magie' },
  { id: 'totem_of_undying', name: 'Totem d\'immortalité', icon: `${ICON_BASE}/totem_of_undying.png`, category: 'Magie' },
  { id: 'nether_star', name: 'Étoile du Nether', icon: `${ICON_BASE}/nether_star.png`, category: 'Magie' },
  { id: 'golden_apple', name: 'Pomme dorée', icon: `${ICON_BASE}/golden_apple.png`, category: 'Magie' },
  { id: 'enchanted_golden_apple', name: 'Pomme dorée enchantée', icon: `${ICON_BASE}/enchanted_golden_apple.png`, category: 'Magie' },

  // Ressources
  { id: 'slime_ball', name: 'Boule de Slime', icon: `${ICON_BASE}/slime_ball.png`, category: 'Ressources' },
  { id: 'string', name: 'Ficelle', icon: `${ICON_BASE}/string.png`, category: 'Ressources' },
  { id: 'leather', name: 'Cuir', icon: `${ICON_BASE}/leather.png`, category: 'Ressources' },
  { id: 'bone', name: 'Os', icon: `${ICON_BASE}/bone.png`, category: 'Ressources' },
  { id: 'gunpowder', name: 'Poudre à canon', icon: `${ICON_BASE}/gunpowder.png`, category: 'Ressources' },
  { id: 'phantom_membrane', name: 'Membrane de Phantom', icon: `${ICON_BASE}/phantom_membrane.png`, category: 'Ressources' },
  { id: 'shulker_shell', name: 'Carapace de Shulker', icon: `${ICON_BASE}/shulker_shell.png`, category: 'Ressources' },
  { id: 'nautilus_shell', name: 'Coquille de Nautile', icon: `${ICON_BASE}/nautilus_shell.png`, category: 'Ressources' },
  { id: 'wither_skeleton_skull', name: 'Crâne de Wither Squelette', icon: `${ICON_BASE}/wither_skeleton_skull.png`, category: 'Ressources' },
  { id: 'dragon_breath', name: 'Souffle du dragon', icon: `${ICON_BASE}/dragon_breath.png`, category: 'Ressources' },

  // Nourriture
  { id: 'bread', name: 'Pain', icon: `${ICON_BASE}/bread.png`, category: 'Nourriture' },
  { id: 'cooked_beef', name: 'Steak', icon: `${ICON_BASE}/cooked_beef.png`, category: 'Nourriture' },
  { id: 'cooked_porkchop', name: 'Côtelette cuite', icon: `${ICON_BASE}/cooked_porkchop.png`, category: 'Nourriture' },

  // Autre
  { id: 'name_tag', name: 'Étiquette', icon: `${ICON_BASE}/name_tag.png`, category: 'Autre' },
  { id: 'saddle', name: 'Selle', icon: `${ICON_BASE}/saddle.png`, category: 'Autre' },
  { id: 'beacon', name: 'Balise', icon: `${ICON_BASE}/beacon.png`, category: 'Autre' },
  { id: 'conduit', name: 'Conduit', icon: `${ICON_BASE}/conduit.png`, category: 'Autre' },
  { id: 'tnt', name: 'TNT', icon: `${ICON_BASE}/tnt.png`, category: 'Autre' },
];

export const MC_HEAD = (pseudo) => `https://mc-heads.net/avatar/${pseudo}/32`;

export function getItemById(id) {
  return MC_ITEMS.find(i => i.id === id);
}
