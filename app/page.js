'use client';
import { useState, useEffect, useCallback, useRef } from 'react';

const MH = (p) => `https://mc-heads.net/avatar/${p}/32`;
const DIAMOND_ICON = 'https://minecraft.wiki/images/Invicon_Diamond.png';
const XP_ICON = 'https://minecraft.wiki/images/Bottle_o%27_Enchanting_JE2_BE2.png';
const MAP_ICON = 'https://minecraft.wiki/images/Invicon_Map.png';
const OBSIDIAN_ICON = 'https://minecraft.wiki/images/Invicon_Obsidian.png';

// ---- Dynamic items & enchants ----
let _items=[], _itemsLoading=false, _itemsL=[];
function loadItems(){if(_items.length||_itemsLoading)return;_itemsLoading=true;fetch('/api/mcitems').then(r=>r.json()).then(d=>{if(Array.isArray(d)){_items=d;_itemsL.forEach(fn=>fn(d))}}).finally(()=>{_itemsLoading=false})}
function useItems(){const[i,si]=useState(_items);useEffect(()=>{if(_items.length){si(_items);return}_itemsL.push(si);loadItems();return()=>{_itemsL=_itemsL.filter(f=>f!==si)}},[]);return i}

let _ench=[], _enchLoading=false, _enchL=[];
function loadEnch(){if(_ench.length||_enchLoading)return;_enchLoading=true;fetch('/api/enchants').then(r=>r.json()).then(d=>{if(Array.isArray(d)){_ench=d;_enchL.forEach(fn=>fn(d))}}).finally(()=>{_enchLoading=false})}
function useEnchants(){const[e,se]=useState(_ench);useEffect(()=>{if(_ench.length){se(_ench);return}_enchL.push(se);loadEnch();return()=>{_enchL=_enchL.filter(f=>f!==se)}},[]);return e}

const gi=(id)=>_items.find(i=>i.id===id);
const ENCHANTABLE=/sword|pickaxe|axe|shovel|hoe|bow|crossbow|trident|helmet|chestplate|leggings|boots|elytra|shield|fishing_rod|shears|mace|enchanted_book|book/;
function toRoman(n){return['','I','II','III','IV','V','VI','VII','VIII','IX','X'][n]||n}

// ---- ItemPicker ----
function ItemPicker({value,onChange,label}){
  const items=useItems();
  const[open,setOpen]=useState(false);const[s,setS]=useState('');const ref=useRef(null);
  const sel=value?items.find(i=>i.id===value):null;
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setOpen(false)};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h)},[]);
  const f=items.filter(i=>i.name.toLowerCase().includes(s.toLowerCase())||i.cat.toLowerCase().includes(s.toLowerCase()));
  const g={};f.slice(0,100).forEach(i=>{if(!g[i.cat])g[i.cat]=[];g[i.cat].push(i)});
  return(<div className="fld" ref={ref}>{label&&<label>{label}</label>}
    <div className="item-picker" onClick={()=>setOpen(!open)}>
      {sel?<div className="item-sel"><img src={sel.icon} alt="" onError={e=>e.target.style.opacity='0'}/><span>{sel.name}</span></div>:<span className="item-ph">Choisir un item...</span>}
      <span className="item-arr">{open?'▴':'▾'}</span>
    </div>
    {open&&<div className="item-dd"><input className="item-search" placeholder="Rechercher un item..." value={s} onChange={e=>setS(e.target.value)} onClick={e=>e.stopPropagation()} autoFocus/>
      <div className="item-list">{Object.entries(g).map(([c,its])=><div key={c}><div className="item-cat">{c}</div>
        {its.map(it=><div key={it.id} className={`item-opt ${value===it.id?'sel':''}`} onClick={e=>{e.stopPropagation();onChange(it.id);setOpen(false);setS('')}}>
          <img src={it.icon} alt="" onError={e=>e.target.style.opacity='0'}/><span>{it.name}</span></div>)}
      </div>)}{f.length===0&&<div className="item-nil">Aucun item trouvé</div>}{f.length>100&&<div className="item-nil">Tape pour affiner ({f.length} résultats)</div>}</div></div>}
  </div>);
}

// ---- EnchantPicker ----
function EnchantPicker({enchants,onChange}){
  const allE=useEnchants();const[show,setShow]=useState(false);const[s,setS]=useState('');const ref=useRef(null);
  useEffect(()=>{const h=e=>{if(ref.current&&!ref.current.contains(e.target))setShow(false)};document.addEventListener('mousedown',h);return()=>document.removeEventListener('mousedown',h)},[]);
  const fil=allE.filter(e=>!enchants.find(x=>x.id===e.id)&&(e.name.toLowerCase().includes(s.toLowerCase())||e.category.toLowerCase().includes(s.toLowerCase())));
  return(<div className="fld" ref={ref}><label>Enchantements (optionnel)</label>
    {enchants.length>0&&<div className="ench-list">{enchants.map(e=><div key={e.id} className="ench-tag">
      <span className="ench-name">{e.name}</span>
      <select className="ench-lvl" value={e.level} onChange={ev=>onChange(enchants.map(x=>x.id===e.id?{...x,level:parseInt(ev.target.value)}:x))}>
        {Array.from({length:e.maxLevel},(_,i)=><option key={i+1} value={i+1}>{toRoman(i+1)}</option>)}
      </select>
      <button className="ench-rm" onClick={()=>onChange(enchants.filter(x=>x.id!==e.id))} type="button">×</button>
    </div>)}</div>}
    <button className="ench-add-btn" onClick={()=>setShow(!show)} type="button">+ Ajouter un enchantement</button>
    {show&&<div className="ench-dropdown"><input className="item-search" placeholder="Rechercher..." value={s} onChange={e=>setS(e.target.value)} autoFocus/>
      <div className="item-list">{fil.map(e=><div key={e.id} className="item-opt" onClick={()=>{onChange([...enchants,{id:e.id,name:e.name,level:e.maxLevel,maxLevel:e.maxLevel}]);setShow(false);setS('')}}>
        <span>✨ {e.name} (max {toRoman(e.maxLevel)})</span><span className="ench-cat-tag">{e.category}</span>
      </div>)}{fil.length===0&&<div className="item-nil">Aucun enchantement</div>}</div></div>}
  </div>);
}

// ==========================================
// MAIN PAGE
// ==========================================
export default function Home(){
  const allItems=useItems(); // triggers re-render when items load
  const[offers,setOffers]=useState([]);const[loading,setLoading]=useState(true);const[tab,setTab]=useState('all');
  const[detailModal,setDetailModal]=useState(null);const[newOfferModal,setNewOfferModal]=useState(false);
  const[svcModal,setSvcModal]=useState(null);
  const[myPseudo,setMyPseudo]=useState('');const[showUserLogin,setShowUserLogin]=useState(false);const[pseudoInput,setPseudoInput]=useState('');
  const[pw,setPw]=useState('');const[isA,setIsA]=useState(false);const[aErr,setAErr]=useState('');
  const[showAdmin,setShowAdmin]=useState(false);const[showLogin,setShowLogin]=useState(false);
  const[settings,setSettings]=useState({farm_xp_open:'false',farm_xp_price:'15',visit_price:'2',visit_open:'true',shining_members:'[]'});

  const shiningMembers=(() => {try{return JSON.parse(settings.shining_members)}catch{return[]}})();
  const isShining=(pseudo)=>shiningMembers.map(m=>m.toLowerCase()).includes((pseudo||'').toLowerCase());

  const load=useCallback(async()=>{
    try{
      const[r1,r2]=await Promise.all([fetch('/api/offers'),fetch('/api/settings')]);
      const[d1,d2]=await Promise.all([r1.json(),r2.json()]);
      if(Array.isArray(d1))setOffers(d1);
      if(Array.isArray(d2)){const s={};d2.forEach(x=>{s[x.key]=x.value});setSettings(prev=>({...prev,...s}))}
    }catch(e){console.error(e)}finally{setLoading(false)}
  },[]);
  useEffect(()=>{load()},[load]);

  // Realtime
  useEffect(()=>{
    let sub;
    (async()=>{try{const{supabaseClient}=await import('../lib/supabase-client');if(!supabaseClient)return;
      sub=supabaseClient.channel('live').on('postgres_changes',{event:'*',schema:'public',table:'offers'},()=>load()).on('postgres_changes',{event:'*',schema:'public',table:'settings'},()=>load()).subscribe()}catch(e){console.error(e)}})();
    const iv=setInterval(load,10000);
    return()=>{if(sub)sub.unsubscribe();clearInterval(iv)};
  },[load]);

  // Sort: shining first, then by date
  const sorted=[...offers].sort((a,b)=>{
    const aS=isShining(a.author_pseudo)?1:0;const bS=isShining(b.author_pseudo)?1:0;
    if(aS!==bS)return bS-aS;return new Date(b.created_at)-new Date(a.created_at);
  });
  const filtered=tab==='all'?sorted:tab==='mine'?sorted.filter(o=>(o.author_pseudo||'').toLowerCase()===myPseudo.toLowerCase()):sorted.filter(o=>o.type===tab);

  const farmOpen=settings.farm_xp_open==='true';
  const farmPrice=settings.farm_xp_price||'15';
  const visitOpen=settings.visit_open==='true';
  const visitPrice=settings.visit_price||'2';

  const login=async()=>{setAErr('');try{const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})});if(r.ok){setIsA(true);setShowLogin(false);load()}else setAErr('Mot de passe incorrect')}catch{setAErr('Erreur')}};
  const toggleFarm=async()=>{const nv=!farmOpen;setSettings(p=>({...p,farm_xp_open:String(nv)}));await fetch('/api/settings',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${pw}`},body:JSON.stringify({key:'farm_xp_open',value:String(nv)})})};
  const toggleVisit=async()=>{const nv=!visitOpen;setSettings(p=>({...p,visit_open:String(nv)}));await fetch('/api/settings',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${pw}`},body:JSON.stringify({key:'visit_open',value:String(nv)})})};
  const saveSetting=async(key,value)=>{await fetch('/api/settings',{method:'PUT',headers:{'Content-Type':'application/json',Authorization:`Bearer ${pw}`},body:JSON.stringify({key,value})});load()};
  const delOffer=async(id)=>{if(!confirm('Supprimer cette offre ?'))return;try{const r=await fetch(`/api/offers?id=${id}`,{method:'DELETE',headers:{Authorization:`Bearer ${pw}`}});if(!r.ok){const d=await r.json();alert('Erreur: '+d.error)}else{load()}}catch(e){alert('Erreur réseau');console.error(e)}};

  const saveOffer=async(data)=>{
    const method=data.id?'PUT':'POST';
    const headers={'Content-Type':'application/json'};
    if(isA)headers.Authorization=`Bearer ${pw}`;
    try{const r=await fetch('/api/offers',{method,headers,body:JSON.stringify(data)});if(r.ok){setNewOfferModal(false);load()}}catch(e){console.error(e)}
  };

  return(<>
    {/* NAV */}
    <nav className="nav">
      <a href="#" className="nav-brand"><div className="nav-logo">S</div><span className="nav-name">SHINING</span></a>
      <div className="nav-right">
        {myPseudo?<>
          <div className="nav-user" onClick={()=>setTab('mine')} style={{display:'flex',alignItems:'center',gap:'.3rem',cursor:'pointer',padding:'.15rem .5rem',borderRadius:'6px',border:'1px solid var(--border)',background:'rgba(139,92,246,.04)'}}>
            <img src={MH(myPseudo)} alt="" style={{width:20,height:20,borderRadius:3,imageRendering:'pixelated'}} onError={e=>e.target.style.opacity='0'}/>
            <span style={{fontSize:'.75rem',fontWeight:600,color:'var(--t1)'}}>{myPseudo}</span>
            {isShining(myPseudo)&&<span className="shining-tag">SHINING</span>}
          </div>
          <button className="nav-btn" onClick={()=>{setMyPseudo('');setTab('all')}}>Déco</button>
        </>:
          <button className="nav-btn" onClick={()=>setShowUserLogin(true)}>👤 Se connecter</button>
        }
        <span className="nav-pill">Arkunir</span>
        {isA?<>
          <button className={`nav-btn ${showAdmin?'active':''}`} onClick={()=>setShowAdmin(!showAdmin)}>⚙ Admin</button>
          <button className="nav-btn" onClick={()=>{setIsA(false);setPw('');setShowAdmin(false)}}>Déco admin</button>
        </>:
          <button className="nav-btn" onClick={()=>setShowLogin(true)}>🔒 Admin</button>
        }
      </div>
    </nav>

    {/* HERO */}
    <section className="hero">
      <div className="hero-badge"><img src={DIAMOND_ICON} alt="" onError={e=>e.target.style.display='none'}/>Team Minecraft — Arkunir</div>
      <h1 className="hero-title">SHINING</h1>
      <p className="hero-sub">Marketplace de la Shining. Achat, vente, mission et services entre joueurs.</p>
      <div className="hero-cta">
        <a href="#market" className="btn-main">Explorer la marketplace</a>
        <a href="#services" className="btn-ghost">Nos services</a>
      </div>
    </section>

    {/* SERVICES */}
    <section className="section" id="services">
      <div className="section-label">Services</div>
      <h2 className="section-heading">Locations & services</h2>
      <div className="services-row">
        <div className="svc">
          <img className="svc-icon" src={XP_ICON} alt="" onError={e=>e.target.style.opacity='0'}/>
          <div className="svc-body"><h3>Ferme XP Silverfish</h3><p>Location — 1 utilisation</p></div>
          <div className="svc-right">
            <div className="svc-price"><img src={DIAMOND_ICON} alt="" onError={e=>e.target.style.opacity='0'}/>{farmPrice}</div>
            <span className={`status ${farmOpen?'status-open':'status-closed'}`}>{farmOpen?'Ouvert':'Fermé'}</span>
            {isA&&<button className={`btn-toggle ${farmOpen?'open':'close'}`} onClick={toggleFarm}>{farmOpen?'Fermer':'Ouvrir'}</button>}
            {farmOpen&&<button className="btn-book" onClick={()=>setSvcModal({name:'Ferme XP Silverfish',price:farmPrice+' diamants',icon:XP_ICON})}>Réserver</button>}
          </div>
        </div>
        <div className="svc">
          <img className="svc-icon" src={MAP_ICON} alt="" onError={e=>e.target.style.opacity='0'}/>
          <div className="svc-body"><h3>Visite de la team</h3><p>Visite guidée — par personne</p></div>
          <div className="svc-right">
            <div className="svc-price"><img src={DIAMOND_ICON} alt="" onError={e=>e.target.style.opacity='0'}/>{visitPrice}</div>
            <span className={`status ${visitOpen?'status-open':'status-closed'}`}>{visitOpen?'Ouvert':'Fermé'}</span>
            {isA&&<button className={`btn-toggle ${visitOpen?'open':'close'}`} onClick={toggleVisit}>{visitOpen?'Fermer':'Ouvrir'}</button>}
            {visitOpen&&<button className="btn-book" onClick={()=>setSvcModal({name:'Visite de la team',price:visitPrice+' diamants',icon:MAP_ICON})}>Réserver</button>}
          </div>
        </div>
      </div>
      <div className="coords-card">
        <img src={OBSIDIAN_ICON} alt="" className="coords-icon" onError={e=>e.target.style.opacity='0'}/>
        <div className="coords-body"><h3>Portail du Nether — Entrée de la base</h3><p>Point de rendez-vous pour échanges et visites</p></div>
        <div className="coords-values">
          <span className="coord"><span className="coord-label">X</span>338</span>
          <span className="coord"><span className="coord-label">Y</span>60</span>
          <span className="coord"><span className="coord-label">Z</span>-21</span>
        </div>
      </div>
    </section>

    {/* MARKETPLACE */}
    <section className="section" id="market">
      <div className="section-label">Marketplace</div>
      <h2 className="section-heading">Offres actives</h2>
      <div className="tabs-row">
        <div className="tabs">
          {[{k:'all',l:'Tout'},{k:'achat',l:'Achats'},{k:'vente',l:'Ventes'},{k:'mission',l:'Missions'},...(myPseudo?[{k:'mine',l:'Mes offres'}]:[])].map(t=>
            <button key={t.k} className={`tab ${tab===t.k?'active':''}`} onClick={()=>setTab(t.k)}>{t.l}</button>)}
        </div>
        <button className="btn-new-offer" onClick={()=>setNewOfferModal(true)}>+ Créer une offre</button>
      </div>
      {loading?<div className="spin-w"><div className="spin"/></div>:
      <div className="grid">
        {filtered.length===0?<div className="empty"><span>📭</span>Aucune offre active.</div>:
        filtered.map(o=>{
          const it=gi(o.title);let pi=null,pq='';try{const p=JSON.parse(o.price);pi=gi(p.item);pq=p.qty}catch{}
          let descText='',enchList=[];try{const d=JSON.parse(o.description);descText=d.text||'';enchList=d.enchants||[]}catch{descText=o.description||''}
          const isSh=isShining(o.author_pseudo);
          return(<div key={o.id} className={`card ${isSh?'shining':''}`} onClick={()=>setDetailModal(o)}>
            <div className="card-header">
              <div className={`badge badge-${o.type}`}>{o.type==='achat'?'Achat':o.type==='vente'?'Vente':'Mission'}</div>
              {o.author_pseudo&&<div className="card-author">
                <img src={MH(o.author_pseudo)} alt="" onError={e=>e.target.style.opacity='0'}/>
                <span>{o.author_pseudo}</span>
                {isSh&&<span className="shining-tag">SHINING</span>}
              </div>}
            </div>
            <div className="offer-row">
              {it&&<img src={it.icon} alt="" onError={e=>e.target.style.opacity='0'}/>}
              <div><h3>{it?it.name:o.title}</h3>{o.quantity&&<span className="offer-qty">×{o.quantity}</span>}</div>
            </div>
            {enchList.length>0&&<div className="ench-display">{enchList.map(e=><span key={e.id} className="ench-pill">✨ {e.name} {toRoman(e.level)}</span>)}</div>}
            {descText&&<p>{descText}</p>}
            {pi&&<div className="price-bar"><span className="price-label">{o.type==='achat'?'Budget':'Prix'}</span>
              <div className="price-val"><img src={pi.icon} alt="" onError={e=>e.target.style.opacity='0'}/><span>{pq}× {pi.name}</span></div></div>}
            {o.response_count>0&&<p style={{fontSize:'.72rem',color:'var(--p4)',marginTop:'.3rem'}}>📩 {o.response_count} candidature{o.response_count>1?'s':''}</p>}
          </div>)
        })}
      </div>}
    </section>

    {/* ADMIN PANEL */}
    {showAdmin&&isA&&<section className="admin-panel" id="admin">
      <h2>⚙ Panel Admin</h2>
      <div className="admin-grid">
        <div className="admin-setting">
          <label>Prix Ferme XP (diamants)</label>
          <input type="number" value={settings.farm_xp_price||''} onChange={e=>setSettings(p=>({...p,farm_xp_price:e.target.value}))}/>
          <button className="btn-save" onClick={()=>saveSetting('farm_xp_price',settings.farm_xp_price)}>Sauvegarder</button>
        </div>
        <div className="admin-setting">
          <label>Prix Visite (diamants)</label>
          <input type="number" value={settings.visit_price||''} onChange={e=>setSettings(p=>({...p,visit_price:e.target.value}))}/>
          <button className="btn-save" onClick={()=>saveSetting('visit_price',settings.visit_price)}>Sauvegarder</button>
        </div>
        <div className="admin-setting" style={{gridColumn:'1/-1'}}>
          <label>Membres Shining</label>
          <div style={{display:'flex',flexDirection:'column',gap:'.3rem'}}>
            {shiningMembers.map((m,i)=><div key={i} style={{display:'flex',gap:'.3rem'}}>
              <input value={m} onChange={e=>{const nw=[...shiningMembers];nw[i]=e.target.value;setSettings(p=>({...p,shining_members:JSON.stringify(nw)}))}}
                style={{flex:1}} placeholder="Pseudo MC"/>
              <button className="btn-s x" onClick={()=>{const nw=shiningMembers.filter((_,j)=>j!==i);setSettings(p=>({...p,shining_members:JSON.stringify(nw)}))}}
                style={{padding:'.3rem .6rem'}}>✕</button>
            </div>)}
            <button style={{padding:'.35rem .7rem',background:'rgba(139,92,246,.08)',border:'1px dashed rgba(139,92,246,.2)',borderRadius:'6px',color:'var(--p4)',fontFamily:'Outfit,sans-serif',fontSize:'.78rem',fontWeight:600,cursor:'pointer'}}
              onClick={()=>setSettings(p=>({...p,shining_members:JSON.stringify([...shiningMembers,''])}))}>+ Ajouter un membre</button>
          </div>
          <button className="btn-save" onClick={()=>saveSetting('shining_members',settings.shining_members)}>Sauvegarder</button>
        </div>
      </div>
      <h3 style={{fontSize:'.95rem',fontWeight:700,marginBottom:'.6rem'}}>Gérer les offres</h3>
      <div className="adm-offers">
        {offers.map(o=><div key={o.id} className="adm-item">
          <div className="adm-info"><h4>{gi(o.title)?.name||o.title} {o.author_pseudo&&<span style={{color:'var(--t3)',fontWeight:400}}>— {o.author_pseudo}</span>}</h4></div>
          <div className="adm-acts">
            <button className="btn-s x" onClick={()=>delOffer(o.id)}>Supprimer</button>
          </div>
        </div>)}
        {offers.length===0&&<p style={{color:'var(--t3)',fontSize:'.85rem'}}>Aucune offre.</p>}
      </div>
    </section>}

    <footer className="footer">Shining — shining-mc.fr — Serveur Arkunir<br/><span style={{fontSize:'.65rem',opacity:.5}}>Made with 💙 heart</span></footer>

    {/* MODALS */}
    {showLogin&&<LoginModal close={()=>setShowLogin(false)} pw={pw} setPw={setPw} login={login} err={aErr}/>}
    {showUserLogin&&<UserLoginModal close={()=>setShowUserLogin(false)} onLogin={(p)=>{setMyPseudo(p);setShowUserLogin(false)}} shiningMembers={shiningMembers}/>}
    {newOfferModal&&<OfferForm close={()=>{setNewOfferModal(false);load()}} save={saveOffer} isAdmin={isA} myPseudo={myPseudo} shiningMembers={shiningMembers}/>}
    {detailModal&&<DetailModal offer={detailModal} close={()=>{setDetailModal(null);load()}} isAdmin={isA} shiningMembers={shiningMembers} pw={pw} myPseudo={myPseudo}/>}
    {svcModal&&<SvcModal svc={svcModal} close={()=>setSvcModal(null)} myPseudo={myPseudo}/>}
  </>);
}

// ---- Login Modal ----
function LoginModal({close,pw,setPw,login,err}){
  return(<div className="overlay" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:340,textAlign:'center'}}>
    <button className="modal-x" onClick={close}>×</button>
    <h2>Connexion Admin</h2>
    <p className="modal-subtitle">Entrez le mot de passe admin</p>
    <div className="fld"><input type="password" placeholder="Mot de passe" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==='Enter'&&login()}/></div>
    <button className="btn-send" onClick={login}>Se connecter</button>
    {err&&<p style={{color:'var(--red)',fontSize:'.82rem',marginTop:'.5rem'}}>{err}</p>}
  </div></div>);
}

// ---- User Login Modal (pseudo MC only) ----
function UserLoginModal({close,onLogin,shiningMembers}){
  const[p,setP]=useState('');const[dp,setDp]=useState('');
  const[pw,setPw]=useState('');const[err,setErr]=useState('');const[checking,setChecking]=useState(false);
  useEffect(()=>{const t=setTimeout(()=>setDp(p.trim()),500);return()=>clearTimeout(t)},[p]);
  const isSh=p.trim()&&shiningMembers.map(m=>m.toLowerCase()).includes(p.trim().toLowerCase());

  const handleLogin=async()=>{
    if(!p.trim())return;
    if(isSh){
      // Shining pseudo → verify admin password
      setChecking(true);setErr('');
      try{
        const r=await fetch('/api/admin/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({password:pw})});
        if(r.ok){onLogin(p.trim())}else{setErr('Mot de passe incorrect')}
      }catch{setErr('Erreur réseau')}finally{setChecking(false)}
    }else{
      // Normal pseudo → direct login
      onLogin(p.trim());
    }
  };

  return(<div className="overlay" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:380,textAlign:'center'}}>
    <button className="modal-x" onClick={close}>×</button>
    <h2>👤 Connexion</h2>
    <p className="modal-subtitle">Entre ton pseudo Minecraft pour gérer tes offres</p>
    <div className="fld"><input value={p} onChange={e=>setP(e.target.value)} placeholder="Ton pseudo in-game" onKeyDown={e=>e.key==='Enter'&&!isSh&&handleLogin()}/>
      {dp&&<div className="skin-preview" style={{justifyContent:'center',marginTop:'.5rem'}}>
        <img src={MH(dp)} alt=""/>
        <span>{dp}</span>
        {isSh&&<span className="shining-tag">SHINING</span>}
      </div>}
    </div>
    {isSh&&<>
      <p style={{fontSize:'.75rem',color:'var(--p4)',marginBottom:'.5rem'}}>⭐ Pseudo Shining détecté — mot de passe admin requis</p>
      <div className="fld"><input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Mot de passe admin" onKeyDown={e=>e.key==='Enter'&&handleLogin()}/></div>
    </>}
    {err&&<p style={{color:'var(--red)',fontSize:'.78rem',marginBottom:'.4rem'}}>{err}</p>}
    <button className="btn-send" onClick={handleLogin} disabled={!p.trim()||(isSh&&!pw.trim())||checking}>{checking?'Vérification…':'Se connecter'}</button>
  </div></div>);
}

// ---- Offer Detail Modal ----
function DetailModal({offer,close,isAdmin,shiningMembers,pw,myPseudo}){
  const allItems=useItems();
  const[responses,setResponses]=useState([]);const[loadingR,setLoadingR]=useState(true);
  const[pseudo,setPseudo]=useState(myPseudo||'');const[discord,setDiscord]=useState('');const[msg,setMsg]=useState('');
  const[sending,setSending]=useState(false);const[sent,setSent]=useState(false);
  const[dp,setDp]=useState(myPseudo||'');
  const[deleting,setDeleting]=useState(false);
  const isMyOffer=myPseudo&&(offer.author_pseudo||'').toLowerCase()===myPseudo.toLowerCase();

  useEffect(()=>{const t=setTimeout(()=>setDp(pseudo.trim()),500);return()=>clearTimeout(t)},[pseudo]);

  useEffect(()=>{
    fetch(`/api/responses?offer_id=${offer.id}`).then(r=>r.json()).then(d=>{if(Array.isArray(d))setResponses(d)}).finally(()=>setLoadingR(false));
  },[offer.id]);

  const it=gi(offer.title);
  let pi=null,pq='';try{const p=JSON.parse(offer.price);pi=gi(p.item);pq=p.qty}catch{}
  let descText='',enchList=[];try{const d=JSON.parse(offer.description);descText=d.text||'';enchList=d.enchants||[]}catch{descText=offer.description||''}
  const isSh=shiningMembers.map(m=>m.toLowerCase()).includes((offer.author_pseudo||'').toLowerCase());

  const submit=async()=>{
    if(!pseudo.trim())return;setSending(true);
    try{await fetch('/api/respond',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({offer_id:offer.id,minecraft_pseudo:pseudo.trim(),discord_pseudo:discord.trim()||null,message:msg.trim()||null})});
      setSent(true);
      // Refresh responses
      const r=await fetch(`/api/responses?offer_id=${offer.id}`);const d=await r.json();if(Array.isArray(d))setResponses(d);
    }catch{alert('Erreur')}finally{setSending(false)}
  };

  return(<div className="overlay" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()} style={{maxWidth:480}}>
    <button className="modal-x" onClick={close}>×</button>

    {/* Offer info */}
    <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:'.3rem'}}>
      <div className={`badge badge-${offer.type}`}>{offer.type==='achat'?'Achat':offer.type==='vente'?'Vente':'Mission'}</div>
      {offer.author_pseudo&&<div className="card-author">
        <img src={MH(offer.author_pseudo)} alt="" onError={e=>e.target.style.opacity='0'}/>
        <span>{offer.author_pseudo}</span>
        {isSh&&<span className="shining-tag">SHINING</span>}
      </div>}
    </div>

    <div className="offer-row" style={{marginBottom:'.5rem'}}>
      {it&&<img src={it.icon} alt="" onError={e=>e.target.style.opacity='0'}/>}
      <div><h3 style={{fontSize:'1.05rem'}}>{it?it.name:offer.title}</h3>{offer.quantity&&<span className="offer-qty">×{offer.quantity}</span>}</div>
    </div>

    {enchList.length>0&&<div className="ench-display">{enchList.map(e=><span key={e.id} className="ench-pill">✨ {e.name} {toRoman(e.level)}</span>)}</div>}
    {descText&&<p style={{marginBottom:'.5rem'}}>{descText}</p>}
    {pi&&<div className="price-bar"><span className="price-label">{offer.type==='achat'?'Budget':'Prix'}</span>
      <div className="price-val"><img src={pi.icon} alt="" onError={e=>e.target.style.opacity='0'}/><span>{pq}× {pi.name}</span></div></div>}

    {/* Respond */}
    {sent?<div className="ok-msg"><span>✅</span><p>Envoyé !</p><small>Ta candidature a été transmise sur Discord.</small></div>:<>
      <div className="sep"><span>Candidater</span></div>
      <div className="fld"><label>Pseudo Minecraft *</label><input value={pseudo} onChange={e=>setPseudo(e.target.value)} placeholder="Ton pseudo in-game"/>
        {dp&&<div className="skin-preview"><img src={MH(dp)} alt=""/><span>{dp}</span></div>}</div>
      <div className="fld"><label>Pseudo Discord</label><input value={discord} onChange={e=>setDiscord(e.target.value)} placeholder="Optionnel"/></div>
      <div className="fld"><label>Message</label><textarea value={msg} onChange={e=>setMsg(e.target.value)} placeholder="Optionnel"/></div>
      <button className="btn-send" onClick={submit} disabled={!pseudo.trim()||sending}>{sending?'Envoi…':'Je suis intéressé'}</button>
      {/* Author can delete their own offer */}
      {(isMyOffer||(pseudo.trim()&&pseudo.trim().toLowerCase()===offer.author_pseudo?.toLowerCase()))&&(
        <button style={{width:'100%',padding:'.5rem',background:'transparent',border:'1px solid rgba(239,68,68,.3)',color:'var(--red)',borderRadius:'8px',fontFamily:'Outfit,sans-serif',fontWeight:600,fontSize:'.78rem',cursor:'pointer',marginTop:'.4rem'}}
          onClick={async()=>{if(!confirm('Supprimer ton offre ?'))return;setDeleting(true);
            await fetch(`/api/offers?id=${offer.id}&author_pseudo=${encodeURIComponent(myPseudo||pseudo.trim())}`,{method:'DELETE'});
            close()}} disabled={deleting}>{deleting?'Suppression…':'🗑 Supprimer mon offre'}</button>
      )}
    </>}

    {/* Responses list */}
    <div className="detail-responses">
      <h3>Candidatures ({responses.length})</h3>
      {loadingR?<div className="spin-w"><div className="spin"/></div>:
        responses.length===0?<p style={{color:'var(--t3)',fontSize:'.82rem'}}>Aucune candidature pour le moment.</p>:
        responses.map(r=><div key={r.id} className="resp-item">
          <img src={MH(r.minecraft_pseudo)} alt="" onError={e=>e.target.style.opacity='0'}/>
          <div className="resp-info">
            <strong>{r.minecraft_pseudo}</strong>
            {r.discord_pseudo&&<small>Discord: {r.discord_pseudo}</small>}
          </div>
          {r.message&&<span className="resp-msg">{r.message}</span>}
        </div>)
      }
    </div>
  </div></div>);
}

// ---- Create Offer Modal ----
function OfferForm({close,save,isAdmin,offer,myPseudo,shiningMembers}){
  const[pseudo,setPseudo]=useState(offer?.author_pseudo||myPseudo||'');
  const[type,setType]=useState(offer?.type||'vente');
  const[itemId,setItemId]=useState(offer?.title||'');
  const[qty,setQty]=useState(offer?.quantity||'');
  const[desc,setDesc]=useState('');const[enchants,setEnchants]=useState([]);
  const[pi,setPi]=useState('');const[pq,setPq]=useState('');
  const[saving,setSaving]=useState(false);
  const[dp,setDp]=useState('');

  useEffect(()=>{const t=setTimeout(()=>setDp(pseudo.trim()),500);return()=>clearTimeout(t)},[pseudo]);
  useEffect(()=>{if(offer?.description){try{const d=JSON.parse(offer.description);setDesc(d.text||'');setEnchants(d.enchants||[])}catch{setDesc(offer.description)}}
    if(offer?.price){try{const p=JSON.parse(offer.price);setPi(p.item||'');setPq(p.qty||'')}catch{}}},[offer]);

  const pseudoIsShining=pseudo.trim()&&(shiningMembers||[]).map(m=>m.toLowerCase()).includes(pseudo.trim().toLowerCase());
  const pseudoBlocked=pseudoIsShining&&(!myPseudo||myPseudo.toLowerCase()!==pseudo.trim().toLowerCase());

  const go=async()=>{
    if(!itemId||!pseudo.trim()||pseudoBlocked)return;setSaving(true);
    const descJson=JSON.stringify({text:desc.trim(),enchants});
    await save({...(offer?.id?{id:offer.id}:{}),type,title:itemId,description:descJson,quantity:qty,price:pi?JSON.stringify({item:pi,qty:pq}):'',author_pseudo:pseudo.trim()});
    setSaving(false);
  };

  const showEnch=itemId&&ENCHANTABLE.test(itemId);

  return(<div className="overlay" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}>
    <button className="modal-x" onClick={close}>×</button>
    <h2>{offer?'Modifier':'Créer une offre'}</h2>
    <p className="modal-subtitle">Visible par tout le serveur Arkunir</p>

    <div className="fld"><label>Ton pseudo Minecraft *</label><input value={pseudo} onChange={e=>setPseudo(e.target.value)} placeholder="Pseudo in-game"/>
      {dp&&<div className="skin-preview"><img src={MH(dp)} alt=""/><span>{dp}</span></div>}</div>

    <div className="fld"><label>Type</label><select value={type} onChange={e=>setType(e.target.value)}>
      <option value="vente">Vente</option><option value="achat">Achat</option><option value="mission">Mission</option></select></div>

    <ItemPicker value={itemId} onChange={v=>{setItemId(v);if(!ENCHANTABLE.test(v))setEnchants([])}} label={type==='achat'?'Item recherché':'Item proposé'}/>

    <div className="fld"><label>Quantité</label><input type="number" min="1" value={qty} onChange={e=>setQty(e.target.value.replace(/\D/g,''))} placeholder="64"/></div>

    {showEnch&&<EnchantPicker enchants={enchants} onChange={setEnchants}/>}

    <div className="fld"><label>Notes (optionnel)</label><textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder="Détails supplémentaires..."/></div>

    <div className="sep"><span>{type==='achat'?'En échange de':'Prix demandé'}</span></div>

    <ItemPicker value={pi} onChange={setPi} label="Item en paiement"/>
    <div className="fld"><label>Quantité demandée</label><input type="number" min="1" value={pq} onChange={e=>setPq(e.target.value.replace(/\D/g,''))} placeholder="32"/></div>

    {pseudoBlocked&&<p style={{fontSize:'.75rem',color:'var(--red)',textAlign:'center',margin:'.3rem 0'}}>🔒 Ce pseudo est un membre Shining. Connecte-toi d'abord via "Se connecter" avec ce pseudo.</p>}
    <p style={{fontSize:'.72rem',color:'var(--t3)',textAlign:'center',margin:'.5rem 0',lineHeight:1.4}}>⏰ Les offres sont automatiquement supprimées après 4 heures.</p>
    <button className="btn-send" onClick={go} disabled={!itemId||!pseudo.trim()||saving||pseudoBlocked}>{saving?'Publication…':'Publier l\'offre'}</button>
  </div></div>);
}

// ---- Service Booking Modal ----
function SvcModal({svc,close,myPseudo}){
  const[p,setP]=useState(myPseudo||'');const[d,setD]=useState('');const[sending,setSending]=useState(false);const[sent,setSent]=useState(false);const[dp,setDp]=useState(myPseudo||'');
  useEffect(()=>{const t=setTimeout(()=>setDp(p.trim()),500);return()=>clearTimeout(t)},[p]);
  const go=async()=>{if(!p.trim())return;setSending(true);
    try{await fetch('/api/respond',{method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({offer_id:'service',minecraft_pseudo:p.trim(),discord_pseudo:d.trim()||null,message:`🎫 Réservation: ${svc.name} (${svc.price})`})});
      setSent(true)}catch{alert('Erreur')}finally{setSending(false)}};
  return(<div className="overlay" onClick={close}><div className="modal" onClick={e=>e.stopPropagation()}>
    <button className="modal-x" onClick={close}>×</button>
    {sent?<div className="ok-msg"><span>✅</span><p>Réservation envoyée !</p><small>On te contactera sur Discord.</small></div>:<>
      <h2>Réserver</h2>
      <p className="modal-subtitle" style={{display:'flex',alignItems:'center',gap:'.3rem'}}>
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
