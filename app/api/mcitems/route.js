import { NextResponse } from 'next/server';

let cache = null;
let cacheTime = 0;
const CACHE_TTL = 3600000; // 1 hour

function getCategory(name) {
  if (/_(ore|ingot)|^raw_|^coal$|^diamond$|^emerald$|^lapis|^redstone$|^quartz$|^amethyst_shard|^copper$|_nugget|^ancient_debris|^flint$|^charcoal$|^netherite_scrap/.test(name)) return 'Minerais';
  if (/_(sword|pickaxe|axe|shovel|hoe)|^bow$|^crossbow$|^trident$|^shield$|^fishing_rod$|^shears$|^flint_and_steel$|^brush$|^mace$|^spyglass$|^lead$|^compass$|^clock$|^recovery_compass/.test(name)) return 'Outils';
  if (/_(helmet|chestplate|leggings|boots)|^elytra$|_horse_armor|^turtle_helmet/.test(name)) return 'Armures';
  if (/enchanted_book|experience_bottle|ender_pearl|^blaze_|nether_star|^totem_|^beacon$|golden_apple|enchanting_table|brewing_stand|^anvil$|^lodestone$|respawn_anchor|end_crystal|^potion|^lingering_|^splash_|^ender_eye|^fire_charge|^dragon_breath/.test(name)) return 'Magie';
  if (/^cooked_|^bread$|^cake$|^cookie$|_pie$|_stew$|^apple$|^carrot$|^potato$|^baked_potato|^beetroot$|melon_slice|sweet_berries|glow_berries|dried_kelp|honey_bottle|chorus_fruit|golden_carrot|^rabbit$|^mutton$|^chicken$|^beef$|^porkchop$|^cod$|^salmon$|tropical_fish|pufferfish|mushroom_stew|suspicious_stew/.test(name)) return 'Nourriture';
  if (/_(seeds|sapling)|^wheat$|^sugar_cane$|^bamboo$|^cactus$|^kelp$|^pumpkin$|^cocoa|^nether_wart$|^vine|^lily_pad|^moss|^spore_blossom|^glow_lichen|^hanging_roots|^pitcher/.test(name)) return 'Agriculture';
  if (/chest|shulker|barrel|hopper|dropper|dispenser/.test(name)) return 'Rangement';
  if (/book|writable|written|paper|map$|^filled_map|name_tag|^saddle$/.test(name)) return 'Livres & Divers';
  if (/_block$|_bricks|_planks|_slab$|_stairs$|_wall$|_fence$|_door$|_trapdoor|_gate$|^stone$|^granite|^diorite|^andesite|^deepslate|^tuff|^calcite|^sandstone|^terracotta|^concrete|^wool|^glass|^prismarine|^obsidian|^end_stone|^purpur|quartz|^basalt|^blackstone|^copper_block|^amethyst_block|^mud|^mangrove|^cherry|^bamboo_mosaic|^packed_|^smooth_|^chiseled_|^polished_|^cut_|^stripped_|^waxed_|^exposed_|^weathered_|^oxidized_/.test(name)) return 'Blocs';
  if (/_dye$|^ink_sac$|^glow_ink_sac$|^bone_meal$|^cocoa_beans$/.test(name)) return 'Teintures';
  if (/^music_disc|^disc_fragment|^goat_horn/.test(name)) return 'Musique';
  if (/gunpowder|string|leather|feather|bone$|slime|phantom|ghast|blaze_powder|magma_cream|rabbit_hide|prismarine_shard|prismarine_crystals|nautilus|heart_of_the_sea|scute|honeycomb|wither_skeleton|dragon_breath|shulker_shell|arrow|spectral_arrow|tipped_arrow|firework/.test(name)) return 'Ressources';
  if (/^bucket|^water_bucket|^lava_bucket|^milk_bucket|^powder_snow_bucket|axolotl_bucket|tadpole_bucket|_bucket$/.test(name)) return 'Seaux';
  if (/_spawn_egg$|^bat$|^pig$|^cow$|^sheep$/.test(name)) return null; // skip
  return 'Autre';
}

function toIconName(displayName) {
  return displayName.replace(/ /g, '_');
}

export async function GET() {
  if (cache && Date.now() - cacheTime < CACHE_TTL) {
    return NextResponse.json(cache);
  }

  try {
    const res = await fetch('https://raw.githubusercontent.com/PrismarineJS/minecraft-data/master/data/pc/1.20/items.json');
    const items = await res.json();

    const processed = items
      .filter(i => {
        const n = i.name;
        return !n.endsWith('_spawn_egg') &&
          !n.endsWith('_banner_pattern') &&
          !n.startsWith('infested_') &&
          !n.startsWith('potted_') &&
          n !== 'air' && n !== 'barrier' && n !== 'command_block' &&
          n !== 'structure_block' && n !== 'structure_void' && n !== 'jigsaw' &&
          n !== 'debug_stick' && n !== 'knowledge_book' && n !== 'light' &&
          n !== 'petrified_oak_slab' && n !== 'bundle';
      })
      .map(i => {
        const cat = getCategory(i.name);
        if (!cat) return null;
        return {
          id: i.name,
          name: i.displayName,
          icon: `https://minecraft.wiki/images/Invicon_${toIconName(i.displayName)}.png`,
          cat,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a.cat.localeCompare(b.cat) || a.name.localeCompare(b.name));

    cache = processed;
    cacheTime = Date.now();

    return NextResponse.json(processed);
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
