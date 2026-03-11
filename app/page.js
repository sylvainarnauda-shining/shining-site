'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

const W = (n) => `https://minecraft.wiki/images/Invicon_${n}.png`;
const MH = (p) => `https://mc-heads.net/avatar/${p}/32`;

const ITEMS = [
  // === MINERAIS ===
  { id:'diamond',name:'Diamant',icon:W('Diamond'),cat:'Minerais'},
  { id:'emerald',name:'Émeraude',icon:W('Emerald'),cat:'Minerais'},
  { id:'gold_ingot',name:'Lingot d\'or',icon:W('Gold_Ingot'),cat:'Minerais'},
  { id:'iron_ingot',name:'Lingot de fer',icon:W('Iron_Ingot'),cat:'Minerais'},
  { id:'netherite_ingot',name:'Lingot Netherite',icon:W('Netherite_Ingot'),cat:'Minerais'},
  { id:'copper_ingot',name:'Lingot cuivre',icon:W('Copper_Ingot'),cat:'Minerais'},
  { id:'lapis_lazuli',name:'Lapis Lazuli',icon:W('Lapis_Lazuli'),cat:'Minerais'},
  { id:'redstone',name:'Redstone',icon:W('Redstone'),cat:'Minerais'},
  { id:'coal',name:'Charbon',icon:W('Coal'),cat:'Minerais'},
  { id:'quartz',name:'Quartz Nether',icon:W('Nether_Quartz'),cat:'Minerais'},
  { id:'amethyst_shard',name:'Éclat améthyste',icon:W('Amethyst_Shard'),cat:'Minerais'},
  { id:'raw_gold',name:'Or brut',icon:W('Raw_Gold'),cat:'Minerais'},
  { id:'raw_iron',name:'Fer brut',icon:W('Raw_Iron'),cat:'Minerais'},
  { id:'raw_copper',name:'Cuivre brut',icon:W('Raw_Copper'),cat:'Minerais'},
  { id:'ancient_debris',name:'Débris antiques',icon:W('Ancient_Debris'),cat:'Minerais'},
  { id:'flint',name:'Silex',icon:W('Flint'),cat:'Minerais'},
  // === BLOCS ===
  { id:'diamond_block',name:'Bloc diamant',icon:W('Block_of_Diamond'),cat:'Blocs'},
  { id:'emerald_block',name:'Bloc émeraude',icon:W('Block_of_Emerald'),cat:'Blocs'},
  { id:'gold_block',name:'Bloc or',icon:W('Block_of_Gold'),cat:'Blocs'},
  { id:'iron_block',name:'Bloc fer',icon:W('Block_of_Iron'),cat:'Blocs'},
  { id:'netherite_block',name:'Bloc Netherite',icon:W('Block_of_Netherite'),cat:'Blocs'},
  { id:'quartz_block',name:'Bloc de quartz',icon:W('Block_of_Quartz'),cat:'Blocs'},
  { id:'smooth_quartz',name:'Quartz lisse',icon:W('Smooth_Quartz'),cat:'Blocs'},
  { id:'quartz_pillar',name:'Pilier de quartz',icon:W('Quartz_Pillar'),cat:'Blocs'},
  { id:'chiseled_quartz',name:'Quartz ciselé',icon:W('Chiseled_Quartz_Block'),cat:'Blocs'},
  { id:'obsidian',name:'Obsidienne',icon:W('Obsidian'),cat:'Blocs'},
  { id:'crying_obsidian',name:'Obsidienne pleureuse',icon:W('Crying_Obsidian'),cat:'Blocs'},
  { id:'glowstone',name:'Pierre lumineuse',icon:W('Glowstone'),cat:'Blocs'},
  { id:'end_stone',name:'Pierre de l\'End',icon:W('End_Stone'),cat:'Blocs'},
  { id:'deepslate',name:'Ardoise des abîmes',icon:W('Deepslate'),cat:'Blocs'},
  { id:'tuff',name:'Tuf',icon:W('Tuff'),cat:'Blocs'},
  { id:'calcite',name:'Calcite',icon:W('Calcite'),cat:'Blocs'},
  { id:'stone_bricks',name:'Briques de pierre',icon:W('Stone_Bricks'),cat:'Blocs'},
  { id:'deepslate_bricks',name:'Briques d\'ardoise',icon:W('Deepslate_Bricks'),cat:'Blocs'},
  { id:'dark_prismarine',name:'Prismarine sombre',icon:W('Dark_Prismarine'),cat:'Blocs'},
  { id:'brick',name:'Brique',icon:W('Brick'),cat:'Blocs'},
  { id:'nether_brick',name:'Brique du Nether',icon:W('Nether_Brick'),cat:'Blocs'},
  { id:'glass',name:'Verre',icon:W('Glass'),cat:'Blocs'},
  { id:'glass_pane',name:'Vitre',icon:W('Glass_Pane'),cat:'Blocs'},
  { id:'white_wool',name:'Laine blanche',icon:W('White_Wool'),cat:'Blocs'},
  { id:'white_concrete',name:'Béton blanc',icon:W('White_Concrete'),cat:'Blocs'},
  { id:'bone_block',name:'Bloc d\'os',icon:W('Bone_Block'),cat:'Blocs'},
  { id:'honey_block',name:'Bloc de miel',icon:W('Honey_Block'),cat:'Blocs'},
  { id:'slime_block',name:'Bloc de slime',icon:W('Slime_Block'),cat:'Blocs'},
  { id:'tnt',name:'TNT',icon:W('TNT'),cat:'Blocs'},
  { id:'bookshelf',name:'Bibliothèque',icon:W('Bookshelf'),cat:'Blocs'},
  // === OUTILS ===
  { id:'diamond_sword',name:'Épée diamant',icon:W('Diamond_Sword'),cat:'Outils'},
  { id:'diamond_pickaxe',name:'Pioche diamant',icon:W('Diamond_Pickaxe'),cat:'Outils'},
  { id:'diamond_axe',name:'Hache diamant',icon:W('Diamond_Axe'),cat:'Outils'},
  { id:'diamond_shovel',name:'Pelle diamant',icon:W('Diamond_Shovel'),cat:'Outils'},
  { id:'netherite_sword',name:'Épée Netherite',icon:W('Netherite_Sword'),cat:'Outils'},
  { id:'netherite_pickaxe',name:'Pioche Netherite',icon:W('Netherite_Pickaxe'),cat:'Outils'},
  { id:'bow',name:'Arc',icon:W('Bow'),cat:'Outils'},
  { id:'crossbow',name:'Arbalète',icon:W('Crossbow'),cat:'Outils'},
  { id:'trident',name:'Trident',icon:W('Trident'),cat:'Outils'},
  { id:'mace',name:'Masse',icon:W('Mace'),cat:'Outils'},
  { id:'shield',name:'Bouclier',icon:W('Shield'),cat:'Outils'},
  { id:'fishing_rod',name:'Canne à pêche',icon:W('Fishing_Rod'),cat:'Outils'},
  { id:'brush',name:'Pinceau',icon:W('Brush'),cat:'Outils'},
  { id:'spyglass',name:'Longue-vue',icon:W('Spyglass'),cat:'Outils'},
  // === ARMURES ===
  { id:'diamond_helmet',name:'Casque diamant',icon:W('Diamond_Helmet'),cat:'Armures'},
  { id:'diamond_chestplate',name:'Plastron diamant',icon:W('Diamond_Chestplate'),cat:'Armures'},
  { id:'diamond_leggings',name:'Jambières diamant',icon:W('Diamond_Leggings'),cat:'Armures'},
  { id:'diamond_boots',name:'Bottes diamant',icon:W('Diamond_Boots'),cat:'Armures'},
  { id:'netherite_helmet',name:'Casque Netherite',icon:W('Netherite_Helmet'),cat:'Armures'},
  { id:'netherite_chestplate',name:'Plastron Netherite',icon:W('Netherite_Chestplate'),cat:'Armures'},
  { id:'netherite_leggings',name:'Jambières Netherite',icon:W('Netherite_Leggings'),cat:'Armures'},
  { id:'netherite_boots',name:'Bottes Netherite',icon:W('Netherite_Boots'),cat:'Armures'},
  { id:'elytra',name:'Élytres',icon:W('Elytra'),cat:'Armures'},
  { id:'iron_horse_armor',name:'Armure cheval fer',icon:W('Iron_Horse_Armor'),cat:'Armures'},
  { id:'diamond_horse_armor',name:'Armure cheval diamant',icon:W('Diamond_Horse_Armor'),cat:'Armures'},
  // === MAGIE & RARE ===
  { id:'ender_pearl',name:'Perle Ender',icon:W('Ender_Pearl'),cat:'Magie'},
  { id:'blaze_rod',name:'Bâton Blaze',icon:W('Blaze_Rod'),cat:'Magie'},
  { id:'totem_of_undying',name:'Totem immortalité',icon:W('Totem_of_Undying'),cat:'Magie'},
  { id:'golden_apple',name:'Pomme dorée',icon:W('Golden_Apple'),cat:'Magie'},
  { id:'experience_bottle',name:'Fiole XP',icon:'https://minecraft.wiki/images/Bottle_o%27_Enchanting_JE2_BE2.png',cat:'Magie'},
  { id:'beacon',name:'Balise',icon:W('Beacon'),cat:'Magie'},
  { id:'enchanting_table',name:'Table enchantement',icon:W('Enchanting_Table'),cat:'Magie'},
  { id:'brewing_stand',name:'Alambic',icon:W('Brewing_Stand'),cat:'Magie'},
  { id:'anvil',name:'Enclume',icon:W('Anvil'),cat:'Magie'},
  { id:'lodestone',name:'Magnétite',icon:W('Lodestone'),cat:'Magie'},
  { id:'respawn_anchor',name:'Ancre de réapparition',icon:W('Respawn_Anchor'),cat:'Magie'},
  // === COFFRES & RANGEMENT ===
  { id:'chest',name:'Coffre',icon:W('Chest'),cat:'Rangement'},
  { id:'ender_chest',name:'Coffre de l\'Ender',icon:W('Ender_Chest'),cat:'Rangement'},
  { id:'shulker_box',name:'Boîte Shulker',icon:W('Shulker_Box'),cat:'Rangement'},
  // === RESSOURCES ===
  { id:'shulker_shell',name:'Carapace Shulker',icon:W('Shulker_Shell'),cat:'Ressources'},
  { id:'gunpowder',name:'Poudre canon',icon:W('Gunpowder'),cat:'Ressources'},
  { id:'slime_ball',name:'Slime',icon:W('Slimeball'),cat:'Ressources'},
  { id:'phantom_membrane',name:'Membrane Phantom',icon:W('Phantom_Membrane'),cat:'Ressources'},
  { id:'wither_skeleton_skull',name:'Crâne Wither',icon:W('Wither_Skeleton_Skull'),cat:'Ressources'},
  { id:'honeycomb',name:'Rayon de miel',icon:W('Honeycomb'),cat:'Ressources'},
  { id:'string',name:'Ficelle',icon:W('String'),cat:'Ressources'},
  { id:'leather',name:'Cuir',icon:W('Leather'),cat:'Ressources'},
  { id:'feather',name:'Plume',icon:W('Feather'),cat:'Ressources'},
  { id:'bone_meal',name:'Poudre d\'os',icon:W('Bone_Meal'),cat:'Ressources'},
  { id:'ink_sac',name:'Poche d\'encre',icon:W('Ink_Sac'),cat:'Ressources'},
  { id:'glow_ink_sac',name:'Poche luisante',icon:W('Glow_Ink_Sac'),cat:'Ressources'},
  { id:'arrow',name:'Flèche',icon:W('Arrow'),cat:'Ressources'},
  { id:'spectral_arrow',name:'Flèche spectrale',icon:W('Spectral_Arrow'),cat:'Ressources'},
  { id:'firework_rocket',name:'Fusée de feu',icon:W('Firework_Rocket'),cat:'Ressources'},
  { id:'lead',name:'Laisse',icon:W('Lead'),cat:'Ressources'},
  { id:'name_tag',name:'Étiquette',icon:W('Name_Tag'),cat:'Ressources'},
  { id:'saddle',name:'Selle',icon:W('Saddle'),cat:'Ressources'},
  { id:'bucket',name:'Seau',icon:W('Bucket'),cat:'Ressources'},
  { id:'water_bucket',name:'Seau d\'eau',icon:W('Water_Bucket'),cat:'Ressources'},
  { id:'lava_bucket',name:'Seau de lave',icon:W('Lava_Bucket'),cat:'Ressources'},
  { id:'lantern',name:'Lanterne',icon:W('Lantern'),cat:'Ressources'},
  { id:'soul_lantern',name:'Lanterne des âmes',icon:W('Soul_Lantern'),cat:'Ressources'},
  { id:'music_disc',name:'Disque de musique',icon:W('Music_Disc_Cat'),cat:'Ressources'},
  // === NOURRITURE ===
  { id:'bread',name:'Pain',icon:W('Bread'),cat:'Nourriture'},
  { id:'cooked_beef',name:'Steak',icon:W('Cooked_Beef'),cat:'Nourriture'},
  { id:'cooked_porkchop',name:'Côtelette cuite',icon:W('Cooked_Porkchop'),cat:'Nourriture'},
  { id:'cooked_salmon',name:'Saumon cuit',icon:W('Cooked_Salmon'),cat:'Nourriture'},
  { id:'cooked_cod',name:'Morue cuite',icon:W('Cooked_Cod'),cat:'Nourriture'},
  { id:'cake',name:'Gâteau',icon:W('Cake'),cat:'Nourriture'},
  { id:'cookie',name:'Cookie',icon:W('Cookie'),cat:'Nourriture'},
  { id:'pumpkin_pie',name:'Tarte à la citrouille',icon:W('Pumpkin_Pie'),cat:'Nourriture'},
  { id:'melon_slice',name:'Tranche pastèque',icon:W('Melon_Slice'),cat:'Nourriture'},
  { id:'sweet_berries',name:'Baies sucrées',icon:W('Sweet_Berries'),cat:'Nourriture'},
  { id:'glow_berries',name:'Baies lumineuses',icon:W('Glow_Berries'),cat:'Nourriture'},
  // === AGRICULTURE ===
  { id:'sugar_cane',name:'Canne à sucre',icon:W('Sugar_Cane'),cat:'Agriculture'},
  { id:'bamboo',name:'Bambou',icon:W('Bamboo'),cat:'Agriculture'},
  { id:'cactus',name:'Cactus',icon:W('Cactus'),cat:'Agriculture'},
  { id:'kelp',name:'Kelp',icon:W('Kelp'),cat:'Agriculture'},
  { id:'pumpkin',name:'Citrouille',icon:W('Pumpkin'),cat:'Agriculture'},
];

const gi = (id) => ITEMS.find(i => i.id === id);

function ItemPicker({value,onChange,label}){
  const[open,setOpen]=useState(false);const[s,setS]=useState('');const ref=useRef(null);const sel=value?gi(value):null;
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h)},[]);
  const f=ITEMS.filter(i=>i.name.toLowerCase().includes(s.toLowerCase())||i.cat.toLowerCase().includes(s.toLowerCase()));
  const g={};f.forEach(i=>{if(!g[i.cat])g[i.cat]=[];g[i.cat].push(i)});
  return(<div className="fld" ref={ref}>{label&&<label>{label}</label>}
    <div className="item-picker" onClick={()=>setOpen(!open)}>
      {sel?<div className="item-sel"><img src={sel.icon} alt="" onError={e=>e.target.style.opacity='0'}/><span>{sel.name}</span></div>:<span className="item-ph">Choisir un item...</span>}
      <span className="item-arr">{open?'▴':'▾'}</span>
    </div>
    {open&&<div className="item-dd"><input className="item-search" placeholder="Rechercher..." value={s} onChange={e=>setS(e.target.value)} onClick={e=>e.stopPropagation()} autoFocus/>
      <div className="item-list">{Object.entries(g).map(([c,its])=><div key={c}><div className="item-cat">{c}</div>
        {its.map(it=><div key={it.id} className={`item-opt ${value===it.id?'sel':''}`} onClick={e=>{e.stopPropagation();onChange(it.id);setOpen(false);setS('')}}>
          <img src={it.icon} alt="" onError={e=>e.target.style.opacity='0'}/><span>{it.name}</span></div>)}
      </div>)}{f.length===0&&<div className="item-nil">Aucun item</div>}</div></div>}
  </div>);
}

export default function Home(){
  const[offers,setOffers]=useState([]);const[loading,setLoading]=useState(true);const[tab,setTab]=useState('all');
  const[rModal,setRModal]=useState(null);const[aModal,setAModal]=useState(false);const[edit,setEdit]=useState(null);
  const[pw,setPw]=useState('');const[isA,setIsA]=useState(false);const[aErr,setAErr]=useState('');const[showA,setShowA]=useState(false);
  const[farmOpen,setFarmOpen]=useState(false);
  const[svcModal,setSvcModal]=useState(null);

  const load=useCallback(async()=>{
    try{const r=await fetch('/api/offers');const d=await r.json();if(Array.isArray(d))setOffers(d)}catch(e){console.error(e)}finally{setLoading(false)}
    try{const r2=await fetch('/api/settings?key=farm_xp_open');const d2=await r2.json();setFarmOpen(d2.value==='true')}catch(e){console.error(e)}
  },[]);

  useEffect(()=>{load()},[load]);

  // Realtime: listen for DB changes via Supabase Realtime
  useEffect(()=>{
    let sub;
    (async()=>{
      try{
        const{supabaseClient}=await import('../lib/supabase-client');
        if(!supabaseClient)return;
        sub=supabaseClient.channel('site-realtime')
          .on('postgres_changes',{event:'*',schema:'public',table:'offers'},()=>{
            fetch('/api/offers').then(r=>r.json()).then(d=>{if(Array.isArray(d))setOffers(d)}).catch(()=>{});
          })
          .on('postgres_changes',{event:'*',schema:'public',table:'settings'},()=>{
            fetch('/api/settings?key=farm_xp_open').then(r=>r.json()).then(d=>{if(d.value)setFarmOpen(d.value==='true')}).catch(()=>{});
          })
          .subscribe();
      }catch(e){console.error('Realtime error:',e)}
    })();
    // Fallback: poll every 10s in case realtime disconnects
    const interval=setInterval(()=>{
      fetch('/api/offers').then(r=>r.json()).then(d=>{if(Array.isArray(d))setOffers(d)}).catch(()=>{});
      fetch('/api/settings?key=farm_xp_open').then(r=>r.json()).then(d=>{if(d.value)setFarmOpen(d.value==='true')}).catch(()=>{});
    },10000);
    return()=>{if(sub)sub.unsubscribe();clearInterval(interval)};
  },[]);
  const fil=tab==='all'?offers:offers.filter(o=>o.type===tab);

  const toggleFarm=async()=>{
    const newVal=!farmOpen;
    setFarmOpen(newVal);
    try{await fetch('/api/settings',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${pw}`},body:JSON.stringify({key:'farm_xp_open',value:String(newVal)})})}catch(e){console.error(e);setFarmOpen(!newVal)}
  };

  const login=async()=>{setAErr('');try{const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})});if(r.ok){setIsA(true);load()}else setAErr('Mot de passe incorrect')}catch{setAErr('Erreur')}};
  const save=async(d)=>{const m=edit?'PUT':'POST';const b=edit?{...d,id:edit.id}:d;try{const r=await fetch('/api/offers',{method:m,headers:{'Content-Type':'application/json',Authorization:`Bearer ${pw}`},body:JSON.stringify(b)});if(r.ok){setAModal(false);setEdit(null);load()}}catch(e){console.error(e)}};
  const close=async(o)=>{await fetch('/api/offers',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${pw}`},body:JSON.stringify({...o,status:'closed'})});load()};
  const del=async(id)=>{if(!confirm('Supprimer ?'))return;await fetch(`/api/offers?id=${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${pw}`}});load()};

  return(<>
    {/* NAV */}
    <nav className="nav">
      <a href="#" className="nav-brand"><div className="nav-logo">S</div><span className="nav-name">SHINING</span></a>
      <div className="nav-right">
        <span className="nav-pill">Serveur Arkunir</span>
        <button className="nav-admin" onClick={()=>setShowA(!showA)}>{isA?'⚙':'🔒'}</button>
      </div>
    </nav>

    {/* HERO */}
    <section className="hero">
      <div className="hero-badge"><img src={W('Diamond')} alt="" onError={e=>e.target.style.display='none'}/>Clan Minecraft — Arkunir</div>
      <h1 className="hero-title">SHINING</h1>
      <p className="hero-sub">La marketplace du clan. Achat, vente, emploi et services entre joueurs.</p>
      <div className="hero-cta">
        <a href="#market" className="btn-main">Explorer la marketplace</a>
        <a href="#services" className="btn-ghost">Nos services</a>
      </div>
      <div className="hero-scroll"/>
    </section>

    {/* SERVICES */}
    <section className="section" id="services">
      <div className="section-label">Services</div>
      <h2 className="section-heading">Locations & services</h2>
      <div className="services-row">
        <div className="svc">
          <img className="svc-icon" src={ITEMS.find(i=>i.id==='experience_bottle')?.icon} alt="" onError={e=>e.target.style.opacity='0'}/>
          <div className="svc-body"><h3>Ferme XP Silverfish</h3><p>Location — 1 utilisation</p></div>
          <div className="svc-right">
            <div className="svc-price"><img src={W('Diamond')} alt="" onError={e=>e.target.style.opacity='0'}/>15</div>
            <span className={`status ${farmOpen?'status-open':'status-closed'}`}>{farmOpen?'Ouvert':'Fermé'}</span>
            {isA&&<button className={`btn-toggle ${farmOpen?'open':'close'}`} onClick={toggleFarm}>{farmOpen?'Fermer':'Ouvrir'}</button>}
            {farmOpen&&<button className="btn-book" onClick={()=>setSvcModal({name:'Ferme XP Silverfish',price:'15 diamants',icon:ITEMS.find(i=>i.id==='experience_bottle')?.icon})}>Réserver</button>}
          </div>
        </div>
        <div className="svc">
          <img className="svc-icon" src={W('Map')} alt="" onError={e=>e.target.style.opacity='0'}/>
          <div className="svc-body"><h3>Visite du clan</h3><p>Visite guidée de notre base — par personne</p></div>
          <div className="svc-right">
            <div className="svc-price"><img src={W('Diamond')} alt="" onError={e=>e.target.style.opacity='0'}/>2</div>
            <button className="btn-book" onClick={()=>setSvcModal({name:'Visite du clan',price:'2 diamants',icon:W('Map')})}>Réserver</button>
          </div>
        </div>
      </div>
      <div className="coords-card">
        <img src={W('Obsidian')} alt="" className="coords-icon" onError={e=>e.target.style.opacity='0'}/>
        <div className="coords-body">
          <h3>Portail du Nether — Entrée de la base</h3>
          <p>Pour les échanges et visites, rendez-vous à notre portail</p>
        </div>
        <div className="coords-values">
          <span className="coord"><span className="coord-label">X</span>338</span>
          <span className="coord"><span className="coord-label">Y</span>60</span>
          <span className="coord"><span className="coord-label">Z</span>-21</span>
        </div>
      </div>
    </section>
    <section className="section" id="market">
      <div className="section-label">Marketplace</div>
      <h2 className="section-heading">Offres actives</h2>
      <div className="tabs">
        {[{k:'all',l:'Tout'},{k:'achat',l:'Achats'},{k:'vente',l:'Ventes'},{k:'emploi',l:'Emplois'}].map(t=>
          <button key={t.k} className={`tab ${tab===t.k?'active':''}`} onClick={()=>setTab(t.k)}>{t.l}</button>)}
      </div>
      {loading?<div className="spin-w"><div className="spin"/></div>:
      <div className="grid">
        {fil.length===0?<div className="empty"><span>📭</span>Aucune offre active.</div>:
        fil.map(o=>{const it=gi(o.title);let pi=null,pq='';try{const p=JSON.parse(o.price);pi=gi(p.item);pq=p.qty}catch{}
          return(<div key={o.id} className="card">
            <div className={`badge badge-${o.type}`}>{o.type==='achat'?'Achat':o.type==='vente'?'Vente':'Emploi'}</div>
            <div className="offer-row">
              {it&&<img src={it.icon} alt="" onError={e=>e.target.style.opacity='0'}/>}
              <div><h3>{it?it.name:o.title}</h3>{o.quantity&&<span className="offer-qty">×{o.quantity}</span>}</div>
            </div>
            {o.description&&<p>{o.description}</p>}
            {pi&&<div className="price-bar"><span className="price-label">{o.type==='achat'?'Budget':'Prix'}</span>
              <div className="price-val"><img src={pi.icon} alt="" onError={e=>e.target.style.opacity='0'}/><span>{pq}× {pi.name}</span></div></div>}
            <button className="btn-interest" onClick={()=>setRModal(o)}>Je suis intéressé</button>
          </div>)})}
      </div>}
    </section>

    {/* ADMIN */}
    {showA&&<section className="admin-s">
      {!isA?<div className="admin-login"><h2>Admin</h2>
        <div className="admin-r"><input type="password" placeholder="Mot de passe" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}/><button onClick={login}>OK</button></div>
        {aErr&&<div className="admin-err">{aErr}</div>}</div>:
      <div className="admin-panel">
        <div className="admin-bar"><h2>Gestion</h2><div className="admin-btns"><button className="btn-a" onClick={()=>{setEdit(null);setAModal(true)}}>+ Offre</button><button className="btn-d" onClick={()=>{setIsA(false);setPw('');setShowA(false)}}>Déco</button></div></div>
        <div className="adm-list">{offers.map(o=><div key={o.id} className="adm-item">
          <div className="adm-info"><h4><span className={`badge badge-${o.type}`}>{o.type}</span> {gi(o.title)?.name||o.title}</h4></div>
          <div className="adm-acts"><button className="btn-s e" onClick={()=>{setEdit(o);setAModal(true)}}>Modifier</button><button className="btn-s c" onClick={()=>close(o)}>Fermer</button><button className="btn-s x" onClick={()=>del(o.id)}>Suppr</button></div>
        </div>)}</div>
      </div>}
    </section>}

    <footer className="footer">Shining — shining-mc.fr — Serveur Arkunir</footer>

    {rModal&&<RModal o={rModal} close={()=>setRModal(null)}/>}
    {aModal&&<OForm o={edit} close={()=>{setAModal(false);setEdit(null)}} save={save}/>}
    {svcModal&&<SvcModal svc={svcModal} close={()=>setSvcModal(null)}/>}
  </>);
}

function RModal({o,close}){
  const[p,setP]=useState('');const[d,setD]=useState('');const[m,setM]=useState('');const[sending,setSending]=useState(false);const[sent,setSent]=useState(false);const[dp,setDp]=useState('');
  useEffect(()=>{const t=setTimeout(()=>setDp(p.trim()),500);return()=>clearTimeout(t)},[p]);
  const go=async()=>{if(!p.trim())return;setSending(true);try{await fetch('/api/respond',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({offer_id:o.id,minecraft_pseudo:p.trim(),discord_pseudo:d.trim()||null,message:m.trim()||null})});setSent(true)}catch{alert('Erreur')}finally{setSending(false)}};
  const it=gi(o.title);
  return(<div className="overlay" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}>
    <button className="modal-x" onClick={close}>×</button>
    {sent?<div className="ok-msg"><span>✅</span><p>Envoyé !</p><small>Transmis sur notre Discord.</small></div>:<>
      <h2>Répondre</h2>
      <p style={{display:'flex',alignItems:'center',gap:'.35rem'}}>{it&&<img src={it.icon} alt="" style={{width:18,height:18,imageRendering:'pixelated'}} onError={e=>e.target.style.opacity='0'}/>}{it?it.name:o.title}{o.quantity&&` ×${o.quantity}`}</p>
      <div className="fld"><label>Pseudo Minecraft *</label><input value={p} onChange={e=>setP(e.target.value)} placeholder="Ton pseudo in-game"/>
        {dp&&<div className="skin-preview"><img src={MH(dp)} alt=""/><span>{dp}</span></div>}</div>
      <div className="fld"><label>Pseudo Discord</label><input value={d} onChange={e=>setD(e.target.value)} placeholder="Optionnel"/></div>
      <div className="fld"><label>Message</label><textarea value={m} onChange={e=>setM(e.target.value)} placeholder="Optionnel"/></div>
      <button className="btn-send" onClick={go} disabled={!p.trim()||sending}>{sending?'Envoi…':'Envoyer'}</button>
    </>}
  </div></div>);
}

function OForm({o,close,save}){
  const[type,setType]=useState(o?.type||'vente');const[itemId,setItemId]=useState(o?.title||'');const[qty,setQty]=useState(o?.quantity||'');
  const[desc,setDesc]=useState(o?.description||'');const[pi,setPi]=useState('');const[pq,setPq]=useState('');const[saving,setSaving]=useState(false);
  useEffect(()=>{if(o?.price){try{const p=JSON.parse(o.price);setPi(p.item||'');setPq(p.qty||'')}catch{}}},[o]);
  const go=async()=>{if(!itemId)return;setSaving(true);await save({type,title:itemId,description:desc.trim(),quantity:qty,price:pi?JSON.stringify({item:pi,qty:pq}):''});setSaving(false)};
  return(<div className="overlay" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}>
    <button className="modal-x" onClick={close}>×</button><h2>{o?'Modifier':'Nouvelle offre'}</h2>
    <div className="fld"><label>Type</label><select value={type} onChange={e=>setType(e.target.value)}><option value="vente">Vente</option><option value="achat">Achat</option><option value="emploi">Emploi</option></select></div>
    <ItemPicker value={itemId} onChange={setItemId} label={type==='achat'?'Item recherché':'Item à vendre'}/>
    <div className="fld"><label>Quantité</label><input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value.replace(/\D/g,''))} placeholder="64"/></div>
    <div className="fld"><label>Description (optionnel)</label><textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Enchanté Efficiency V..."/></div>
    <div className="sep"><span>{type==='achat'?'En échange de':'Prix demandé'}</span></div>
    <ItemPicker value={pi} onChange={setPi} label="Item en paiement"/>
    <div className="fld"><label>Quantité demandée</label><input type="number" min="1" value={pq} onChange={e=>setPq(e.target.value.replace(/\D/g,''))} placeholder="32"/></div>
    <button className="btn-send" onClick={go} disabled={!itemId||saving}>{saving?'Sauvegarde…':o?'Mettre à jour':'Publier'}</button>
  </div></div>);
}

// ==========================================
// SERVICE BOOKING MODAL
// ==========================================
function SvcModal({svc,close}){
  const[p,setP]=useState('');const[d,setD]=useState('');const[sending,setSending]=useState(false);const[sent,setSent]=useState(false);const[dp,setDp]=useState('');
  useEffect(()=>{const t=setTimeout(()=>setDp(p.trim()),500);return()=>clearTimeout(t)},[p]);
  const go=async()=>{if(!p.trim())return;setSending(true);
    try{await fetch('/api/respond',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({offer_id:'service',minecraft_pseudo:p.trim(),discord_pseudo:d.trim()||null,message:`🎫 Réservation: ${svc.name} (${svc.price})`})});
      setSent(true)}catch{alert('Erreur')}finally{setSending(false)}};
  return(<div className="overlay" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}>
    <button className="modal-x" onClick={close}>×</button>
    {sent?<div className="ok-msg"><span>✅</span><p>Réservation envoyée !</p><small>On te contactera sur Discord pour organiser ça.</small></div>:<>
      <h2>Réserver</h2>
      <p style={{display:'flex',alignItems:'center',gap:'.35rem'}}>
        {svc.icon&&<img src={svc.icon} alt="" style={{width:20,height:20,imageRendering:'pixelated'}} onError={e=>e.target.style.opacity='0'}/>}
        {svc.name} — {svc.price}
      </p>
      <div className="fld"><label>Pseudo Minecraft *</label><input value={p} onChange={e=>setP(e.target.value)} placeholder="Ton pseudo in-game"/>
        {dp&&<div className="skin-preview"><img src={MH(dp)} alt=""/><span>{dp}</span></div>}</div>
      <div className="fld"><label>Pseudo Discord</label><input value={d} onChange={e=>setD(e.target.value)} placeholder="Pour qu'on te contacte"/></div>
      <button className="btn-send" onClick={go} disabled={!p.trim()||sending}>{sending?'Envoi…':'Réserver'}</button>
    </>}
  </div></div>);
}
