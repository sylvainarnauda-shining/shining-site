'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const W = (name) => `https://minecraft.wiki/images/Invicon_${name}.png`;
const MC_HEAD = (p) => `https://mc-heads.net/avatar/${p}/32`;

const MC_ITEMS = [
  // Minerais
  { id: 'diamond', name: 'Diamant', icon: W('Diamond'), cat: 'Minerais' },
  { id: 'emerald', name: 'Émeraude', icon: W('Emerald'), cat: 'Minerais' },
  { id: 'gold_ingot', name: 'Lingot d\'or', icon: W('Gold_Ingot'), cat: 'Minerais' },
  { id: 'iron_ingot', name: 'Lingot de fer', icon: W('Iron_Ingot'), cat: 'Minerais' },
  { id: 'netherite_ingot', name: 'Lingot de Netherite', icon: W('Netherite_Ingot'), cat: 'Minerais' },
  { id: 'copper_ingot', name: 'Lingot de cuivre', icon: W('Copper_Ingot'), cat: 'Minerais' },
  { id: 'lapis_lazuli', name: 'Lapis Lazuli', icon: W('Lapis_Lazuli'), cat: 'Minerais' },
  { id: 'redstone', name: 'Redstone', icon: W('Redstone'), cat: 'Minerais' },
  { id: 'coal', name: 'Charbon', icon: W('Coal'), cat: 'Minerais' },
  { id: 'quartz', name: 'Quartz du Nether', icon: W('Nether_Quartz'), cat: 'Minerais' },
  // Blocs
  { id: 'diamond_block', name: 'Bloc de diamant', icon: W('Block_of_Diamond'), cat: 'Blocs' },
  { id: 'emerald_block', name: 'Bloc d\'émeraude', icon: W('Block_of_Emerald'), cat: 'Blocs' },
  { id: 'gold_block', name: 'Bloc d\'or', icon: W('Block_of_Gold'), cat: 'Blocs' },
  { id: 'iron_block', name: 'Bloc de fer', icon: W('Block_of_Iron'), cat: 'Blocs' },
  { id: 'netherite_block', name: 'Bloc de Netherite', icon: W('Block_of_Netherite'), cat: 'Blocs' },
  { id: 'obsidian', name: 'Obsidienne', icon: W('Obsidian'), cat: 'Blocs' },
  { id: 'tnt', name: 'TNT', icon: W('TNT'), cat: 'Blocs' },
  // Outils
  { id: 'diamond_sword', name: 'Épée diamant', icon: W('Diamond_Sword'), cat: 'Outils' },
  { id: 'diamond_pickaxe', name: 'Pioche diamant', icon: W('Diamond_Pickaxe'), cat: 'Outils' },
  { id: 'diamond_axe', name: 'Hache diamant', icon: W('Diamond_Axe'), cat: 'Outils' },
  { id: 'diamond_shovel', name: 'Pelle diamant', icon: W('Diamond_Shovel'), cat: 'Outils' },
  { id: 'netherite_sword', name: 'Épée Netherite', icon: W('Netherite_Sword'), cat: 'Outils' },
  { id: 'netherite_pickaxe', name: 'Pioche Netherite', icon: W('Netherite_Pickaxe'), cat: 'Outils' },
  { id: 'bow', name: 'Arc', icon: W('Bow'), cat: 'Outils' },
  { id: 'crossbow', name: 'Arbalète', icon: W('Crossbow'), cat: 'Outils' },
  { id: 'trident', name: 'Trident', icon: W('Trident'), cat: 'Outils' },
  { id: 'shield', name: 'Bouclier', icon: W('Shield'), cat: 'Outils' },
  { id: 'fishing_rod', name: 'Canne à pêche', icon: W('Fishing_Rod'), cat: 'Outils' },
  // Armures
  { id: 'diamond_helmet', name: 'Casque diamant', icon: W('Diamond_Helmet'), cat: 'Armures' },
  { id: 'diamond_chestplate', name: 'Plastron diamant', icon: W('Diamond_Chestplate'), cat: 'Armures' },
  { id: 'diamond_leggings', name: 'Jambières diamant', icon: W('Diamond_Leggings'), cat: 'Armures' },
  { id: 'diamond_boots', name: 'Bottes diamant', icon: W('Diamond_Boots'), cat: 'Armures' },
  { id: 'netherite_helmet', name: 'Casque Netherite', icon: W('Netherite_Helmet'), cat: 'Armures' },
  { id: 'netherite_chestplate', name: 'Plastron Netherite', icon: W('Netherite_Chestplate'), cat: 'Armures' },
  { id: 'netherite_leggings', name: 'Jambières Netherite', icon: W('Netherite_Leggings'), cat: 'Armures' },
  { id: 'netherite_boots', name: 'Bottes Netherite', icon: W('Netherite_Boots'), cat: 'Armures' },
  { id: 'elytra', name: 'Élytres', icon: W('Elytra'), cat: 'Armures' },
  // Magie & Rare
  { id: 'ender_pearl', name: 'Perle de l\'Ender', icon: W('Ender_Pearl'), cat: 'Magie' },
  { id: 'blaze_rod', name: 'Bâton de Blaze', icon: W('Blaze_Rod'), cat: 'Magie' },
  { id: 'totem_of_undying', name: 'Totem d\'immortalité', icon: W('Totem_of_Undying'), cat: 'Magie' },
  { id: 'golden_apple', name: 'Pomme dorée', icon: W('Golden_Apple'), cat: 'Magie' },
  { id: 'experience_bottle', name: 'Fiole d\'XP', icon: 'https://minecraft.wiki/images/Bottle_o%27_Enchanting_JE2_BE2.png', cat: 'Magie' },
  { id: 'beacon', name: 'Balise', icon: W('Beacon'), cat: 'Magie' },
  // Ressources
  { id: 'shulker_shell', name: 'Carapace Shulker', icon: W('Shulker_Shell'), cat: 'Ressources' },
  { id: 'gunpowder', name: 'Poudre à canon', icon: W('Gunpowder'), cat: 'Ressources' },
  { id: 'slime_ball', name: 'Boule de Slime', icon: W('Slimeball'), cat: 'Ressources' },
  { id: 'phantom_membrane', name: 'Membrane Phantom', icon: W('Phantom_Membrane'), cat: 'Ressources' },
  { id: 'wither_skeleton_skull', name: 'Crâne Wither', icon: W('Wither_Skeleton_Skull'), cat: 'Ressources' },
  { id: 'dragon_breath', name: 'Souffle du dragon', icon: 'https://minecraft.wiki/images/Invicon_Dragon%27s_Breath.png', cat: 'Ressources' },
  { id: 'name_tag', name: 'Étiquette', icon: W('Name_Tag'), cat: 'Ressources' },
  { id: 'saddle', name: 'Selle', icon: W('Saddle'), cat: 'Ressources' },
  // Nourriture
  { id: 'bread', name: 'Pain', icon: W('Bread'), cat: 'Nourriture' },
  { id: 'cooked_beef', name: 'Steak', icon: W('Cooked_Beef'), cat: 'Nourriture' },
  { id: 'cooked_porkchop', name: 'Côtelette cuite', icon: W('Cooked_Porkchop'), cat: 'Nourriture' },
];

const getItem = (id) => MC_ITEMS.find(i => i.id === id);

// ==========================================
// ITEM PICKER
// ==========================================
function ItemPicker({ value, onChange, label }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const selected = value ? getItem(value) : null;

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  const filtered = MC_ITEMS.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) || i.cat.toLowerCase().includes(search.toLowerCase())
  );
  const grouped = {};
  filtered.forEach(i => { if (!grouped[i.cat]) grouped[i.cat] = []; grouped[i.cat].push(i); });

  return (
    <div className="field" ref={ref}>
      {label && <label>{label}</label>}
      <div className="item-picker" onClick={() => setOpen(!open)}>
        {selected ? (
          <div className="item-selected">
            <img src={selected.icon} alt="" onError={e => e.target.style.opacity = '0'} />
            <span>{selected.name}</span>
          </div>
        ) : (
          <span className="item-placeholder">Choisir un item...</span>
        )}
        <span className="item-arrow">{open ? '▴' : '▾'}</span>
      </div>
      {open && (
        <div className="item-dropdown">
          <input className="item-search" placeholder="Rechercher..." value={search}
            onChange={e => setSearch(e.target.value)} onClick={e => e.stopPropagation()} autoFocus />
          <div className="item-list">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <div className="item-cat">{cat}</div>
                {items.map(item => (
                  <div key={item.id} className={`item-option ${value === item.id ? 'selected' : ''}`}
                    onClick={e => { e.stopPropagation(); onChange(item.id); setOpen(false); setSearch(''); }}>
                    <img src={item.icon} alt="" onError={e => e.target.style.opacity = '0'} />
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            ))}
            {filtered.length === 0 && <div className="item-empty">Aucun item trouvé</div>}
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// MAIN PAGE
// ==========================================
export default function Home() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all');
  const [respondModal, setRespondModal] = useState(null);
  const [adminModal, setAdminModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);
  const [adminPw, setAdminPw] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);
  const [farmOpen, setFarmOpen] = useState(false);

  const fetchOffers = useCallback(async () => {
    try { const res = await fetch('/api/offers'); const data = await res.json(); if (Array.isArray(data)) setOffers(data); }
    catch (err) { console.error(err); } finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  const filtered = tab === 'all' ? offers : offers.filter(o => o.type === tab);

  const handleAdminLogin = async () => {
    setAdminError('');
    try {
      const res = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ password: adminPw }) });
      if (res.ok) { setIsAdmin(true); fetchOffers(); } else setAdminError('Mot de passe incorrect');
    } catch { setAdminError('Erreur'); }
  };

  const handleSaveOffer = async (data) => {
    const method = editingOffer ? 'PUT' : 'POST';
    const body = editingOffer ? { ...data, id: editingOffer.id } : data;
    try {
      const res = await fetch('/api/offers', { method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminPw}` }, body: JSON.stringify(body) });
      if (res.ok) { setAdminModal(false); setEditingOffer(null); fetchOffers(); }
    } catch (err) { console.error(err); }
  };

  const handleCloseOffer = async (offer) => {
    await fetch('/api/offers', { method: 'PUT', headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminPw}` }, body: JSON.stringify({ ...offer, status: 'closed' }) });
    fetchOffers();
  };

  const handleDeleteOffer = async (id) => {
    if (!confirm('Supprimer ?')) return;
    await fetch(`/api/offers?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${adminPw}` } });
    fetchOffers();
  };

  return (
    <>
      <header className="header">
        <div className="brand">
          <div className="brand-icon">S</div>
          <span className="brand-text">SHINING</span>
          <span className="brand-dot">shining-mc.fr</span>
        </div>
        <div className="header-right">
          <span className="pill">Serveur Arkunir</span>
          <button className="admin-btn" onClick={() => setShowAdmin(!showAdmin)}>{isAdmin ? '⚙' : '🔒'}</button>
        </div>
      </header>

      <main className="main">
        <div className="section-title">Services</div>
        <div className="service-card">
          <img className="service-img" src={MC_ITEMS.find(i => i.id === 'experience_bottle')?.icon} alt="XP" onError={e => e.target.style.opacity = '0'} />
          <div className="service-info">
            <h3>Ferme XP Silverfish</h3>
            <p>Location — 1 utilisation</p>
          </div>
          <div className="service-price">
            <img src={MC_ITEMS.find(i => i.id === 'diamond')?.icon} alt="" onError={e => e.target.style.opacity = '0'} />
            15
          </div>
          <span className={`service-status ${farmOpen ? 'status-open' : 'status-closed'}`}>{farmOpen ? 'Ouvert' : 'Fermé'}</span>
          {isAdmin && <button className={`btn-toggle ${farmOpen ? 'open' : 'close'}`} onClick={() => setFarmOpen(!farmOpen)}>{farmOpen ? 'Fermer' : 'Ouvrir'}</button>}
        </div>

        <div className="section-title" style={{ marginTop: '1.5rem' }}>Marketplace</div>
        <div className="tabs">
          {[{ key: 'all', label: 'Tout' }, { key: 'achat', label: 'Achats' }, { key: 'vente', label: 'Ventes' }, { key: 'emploi', label: 'Emplois' }].map(t => (
            <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>{t.label}</button>
          ))}
        </div>

        {loading ? <div className="spinner-wrap"><div className="spinner" /></div> : (
          <div className="grid">
            {filtered.length === 0 ? <div className="empty"><span>📭</span>Aucune offre active.</div> : filtered.map(offer => {
              const itemData = getItem(offer.title);
              let priceItem = null, priceQty = '';
              try { const p = JSON.parse(offer.price); priceItem = getItem(p.item); priceQty = p.qty; } catch {}

              return (
                <div key={offer.id} className="card">
                  <div className="card-top">
                    <div className={`badge badge-${offer.type}`}>{offer.type === 'achat' ? 'Achat' : offer.type === 'vente' ? 'Vente' : 'Emploi'}</div>
                  </div>
                  <div className="offer-item-display">
                    {itemData && <img src={itemData.icon} alt="" className="offer-item-icon" onError={e => e.target.style.opacity = '0'} />}
                    <div>
                      <h3>{itemData ? itemData.name : offer.title}</h3>
                      {offer.quantity && <span className="offer-qty">×{offer.quantity}</span>}
                    </div>
                  </div>
                  {offer.description && <p>{offer.description}</p>}
                  {priceItem && (
                    <div className="offer-price-row">
                      <span className="offer-price-label">{offer.type === 'achat' ? 'Budget' : 'Prix'}</span>
                      <div className="offer-price-value">
                        <img src={priceItem.icon} alt="" onError={e => e.target.style.opacity = '0'} />
                        <span>{priceQty}× {priceItem.name}</span>
                      </div>
                    </div>
                  )}
                  <button className="btn-respond" onClick={() => setRespondModal(offer)}>Je suis intéressé</button>
                </div>
              );
            })}
          </div>
        )}

        {showAdmin && (
          <section className="admin-section">
            {!isAdmin ? (
              <div className="admin-login">
                <h2>Admin</h2>
                <div className="admin-row">
                  <input type="password" placeholder="Mot de passe" value={adminPw} onChange={e => setAdminPw(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdminLogin()} />
                  <button onClick={handleAdminLogin}>OK</button>
                </div>
                {adminError && <div className="admin-error">{adminError}</div>}
              </div>
            ) : (
              <div className="admin-panel">
                <div className="admin-toolbar">
                  <h2>Gestion</h2>
                  <div className="admin-btns">
                    <button className="btn-add" onClick={() => { setEditingOffer(null); setAdminModal(true); }}>+ Offre</button>
                    <button className="btn-logout" onClick={() => { setIsAdmin(false); setAdminPw(''); setShowAdmin(false); }}>Déco</button>
                  </div>
                </div>
                <div className="admin-list">
                  {offers.map(offer => (
                    <div key={offer.id} className="admin-item">
                      <div className="admin-item-info">
                        <h4><span className={`badge badge-${offer.type}`}>{offer.type}</span> {getItem(offer.title)?.name || offer.title}</h4>
                      </div>
                      <div className="admin-actions">
                        <button className="btn-sm edit" onClick={() => { setEditingOffer(offer); setAdminModal(true); }}>Modifier</button>
                        <button className="btn-sm close-offer" onClick={() => handleCloseOffer(offer)}>Fermer</button>
                        <button className="btn-sm delete" onClick={() => handleDeleteOffer(offer.id)}>Suppr</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer">Shining — shining-mc.fr — Serveur Arkunir</footer>

      {respondModal && <RespondModal offer={respondModal} onClose={() => setRespondModal(null)} />}
      {adminModal && <OfferForm offer={editingOffer} onClose={() => { setAdminModal(false); setEditingOffer(null); }} onSave={handleSaveOffer} />}
    </>
  );
}

// ==========================================
// RESPOND MODAL
// ==========================================
function RespondModal({ offer, onClose }) {
  const [pseudo, setPseudo] = useState('');
  const [discord, setDiscord] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [debouncedPseudo, setDebouncedPseudo] = useState('');

  useEffect(() => { const t = setTimeout(() => setDebouncedPseudo(pseudo.trim()), 500); return () => clearTimeout(t); }, [pseudo]);

  const submit = async () => {
    if (!pseudo.trim()) return;
    setSending(true);
    try {
      await fetch('/api/respond', { method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer_id: offer.id, minecraft_pseudo: pseudo.trim(), discord_pseudo: discord.trim() || null, message: message.trim() || null }) });
      setSent(true);
    } catch { alert('Erreur'); } finally { setSending(false); }
  };

  const itemData = getItem(offer.title);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {sent ? (
          <div className="success-msg"><span>✅</span><p>Envoyé !</p><small>Ta réponse a été transmise sur Discord.</small></div>
        ) : (
          <>
            <h2>Répondre</h2>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {itemData && <img src={itemData.icon} alt="" style={{ width: 20, height: 20, imageRendering: 'pixelated' }} onError={e => e.target.style.opacity = '0'} />}
              {itemData ? itemData.name : offer.title}{offer.quantity && ` ×${offer.quantity}`}
            </p>
            <div className="field">
              <label>Pseudo Minecraft *</label>
              <input value={pseudo} onChange={e => setPseudo(e.target.value)} placeholder="Ton pseudo in-game" />
              {debouncedPseudo && <div className="skin-preview"><img src={MC_HEAD(debouncedPseudo)} alt="" /><span>{debouncedPseudo}</span></div>}
            </div>
            <div className="field"><label>Pseudo Discord</label><input value={discord} onChange={e => setDiscord(e.target.value)} placeholder="Optionnel" /></div>
            <div className="field"><label>Message</label><textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Optionnel" /></div>
            <button className="btn-submit" onClick={submit} disabled={!pseudo.trim() || sending}>{sending ? 'Envoi…' : 'Envoyer'}</button>
          </>
        )}
      </div>
    </div>
  );
}

// ==========================================
// OFFER FORM (ADMIN)
// ==========================================
function OfferForm({ offer, onClose, onSave }) {
  const [type, setType] = useState(offer?.type || 'vente');
  const [itemId, setItemId] = useState(offer?.title || '');
  const [quantity, setQuantity] = useState(offer?.quantity || '');
  const [description, setDescription] = useState(offer?.description || '');
  const [priceItemId, setPriceItemId] = useState('');
  const [priceQty, setPriceQty] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (offer?.price) { try { const p = JSON.parse(offer.price); setPriceItemId(p.item || ''); setPriceQty(p.qty || ''); } catch {} }
  }, [offer]);

  const submit = async () => {
    if (!itemId) return;
    setSaving(true);
    await onSave({ type, title: itemId, description: description.trim(), quantity, price: priceItemId ? JSON.stringify({ item: priceItemId, qty: priceQty }) : '' });
    setSaving(false);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{offer ? 'Modifier' : 'Nouvelle offre'}</h2>
        <div className="field"><label>Type</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="vente">Vente</option><option value="achat">Achat</option><option value="emploi">Emploi</option>
          </select>
        </div>
        <ItemPicker value={itemId} onChange={setItemId} label={type === 'achat' ? 'Item recherché' : 'Item à vendre'} />
        <div className="field"><label>Quantité</label><input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value.replace(/\D/g, ''))} placeholder="64" /></div>
        <div className="field"><label>Description (optionnel)</label><textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Enchanté Efficiency V..." /></div>
        <div className="separator"><span>{type === 'achat' ? 'En échange de' : 'Prix demandé'}</span></div>
        <ItemPicker value={priceItemId} onChange={setPriceItemId} label="Item en paiement" />
        <div className="field"><label>Quantité demandée</label><input type="number" min="1" value={priceQty} onChange={e => setPriceQty(e.target.value.replace(/\D/g, ''))} placeholder="32" /></div>
        <button className="btn-submit" onClick={submit} disabled={!itemId || saving}>{saving ? 'Sauvegarde…' : offer ? 'Mettre à jour' : 'Publier'}</button>
      </div>
    </div>
  );
}
