'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const ICON_BASE = 'https://minecraft-api.vercel.app/images/items';
const MC_HEAD = (p) => `https://mc-heads.net/avatar/${p}/32`;

const MC_ITEMS = [
  { id: 'diamond', name: 'Diamant', icon: `${ICON_BASE}/diamond.png`, cat: 'Minerais' },
  { id: 'emerald', name: 'Émeraude', icon: `${ICON_BASE}/emerald.png`, cat: 'Minerais' },
  { id: 'gold_ingot', name: 'Lingot d\'or', icon: `${ICON_BASE}/gold_ingot.png`, cat: 'Minerais' },
  { id: 'iron_ingot', name: 'Lingot de fer', icon: `${ICON_BASE}/iron_ingot.png`, cat: 'Minerais' },
  { id: 'netherite_ingot', name: 'Lingot de Netherite', icon: `${ICON_BASE}/netherite_ingot.png`, cat: 'Minerais' },
  { id: 'copper_ingot', name: 'Lingot de cuivre', icon: `${ICON_BASE}/copper_ingot.png`, cat: 'Minerais' },
  { id: 'lapis_lazuli', name: 'Lapis Lazuli', icon: `${ICON_BASE}/lapis_lazuli.png`, cat: 'Minerais' },
  { id: 'redstone', name: 'Redstone', icon: `${ICON_BASE}/redstone.png`, cat: 'Minerais' },
  { id: 'coal', name: 'Charbon', icon: `${ICON_BASE}/coal.png`, cat: 'Minerais' },
  { id: 'quartz', name: 'Quartz du Nether', icon: `${ICON_BASE}/quartz.png`, cat: 'Minerais' },
  { id: 'diamond_block', name: 'Bloc de diamant', icon: `${ICON_BASE}/diamond_block.png`, cat: 'Blocs' },
  { id: 'emerald_block', name: 'Bloc d\'émeraude', icon: `${ICON_BASE}/emerald_block.png`, cat: 'Blocs' },
  { id: 'gold_block', name: 'Bloc d\'or', icon: `${ICON_BASE}/gold_block.png`, cat: 'Blocs' },
  { id: 'iron_block', name: 'Bloc de fer', icon: `${ICON_BASE}/iron_block.png`, cat: 'Blocs' },
  { id: 'netherite_block', name: 'Bloc de Netherite', icon: `${ICON_BASE}/netherite_block.png`, cat: 'Blocs' },
  { id: 'obsidian', name: 'Obsidienne', icon: `${ICON_BASE}/obsidian.png`, cat: 'Blocs' },
  { id: 'diamond_sword', name: 'Épée en diamant', icon: `${ICON_BASE}/diamond_sword.png`, cat: 'Outils' },
  { id: 'diamond_pickaxe', name: 'Pioche en diamant', icon: `${ICON_BASE}/diamond_pickaxe.png`, cat: 'Outils' },
  { id: 'diamond_axe', name: 'Hache en diamant', icon: `${ICON_BASE}/diamond_axe.png`, cat: 'Outils' },
  { id: 'netherite_sword', name: 'Épée en Netherite', icon: `${ICON_BASE}/netherite_sword.png`, cat: 'Outils' },
  { id: 'netherite_pickaxe', name: 'Pioche en Netherite', icon: `${ICON_BASE}/netherite_pickaxe.png`, cat: 'Outils' },
  { id: 'bow', name: 'Arc', icon: `${ICON_BASE}/bow.png`, cat: 'Outils' },
  { id: 'trident', name: 'Trident', icon: `${ICON_BASE}/trident.png`, cat: 'Outils' },
  { id: 'shield', name: 'Bouclier', icon: `${ICON_BASE}/shield.png`, cat: 'Outils' },
  { id: 'diamond_helmet', name: 'Casque diamant', icon: `${ICON_BASE}/diamond_helmet.png`, cat: 'Armures' },
  { id: 'diamond_chestplate', name: 'Plastron diamant', icon: `${ICON_BASE}/diamond_chestplate.png`, cat: 'Armures' },
  { id: 'diamond_leggings', name: 'Jambières diamant', icon: `${ICON_BASE}/diamond_leggings.png`, cat: 'Armures' },
  { id: 'diamond_boots', name: 'Bottes diamant', icon: `${ICON_BASE}/diamond_boots.png`, cat: 'Armures' },
  { id: 'netherite_chestplate', name: 'Plastron Netherite', icon: `${ICON_BASE}/netherite_chestplate.png`, cat: 'Armures' },
  { id: 'elytra', name: 'Élytres', icon: `${ICON_BASE}/elytra.png`, cat: 'Armures' },
  { id: 'enchanted_book', name: 'Livre enchanté', icon: `${ICON_BASE}/enchanted_book.png`, cat: 'Magie' },
  { id: 'experience_bottle', name: 'Fiole d\'XP', icon: `${ICON_BASE}/experience_bottle.png`, cat: 'Magie' },
  { id: 'ender_pearl', name: 'Perle de l\'Ender', icon: `${ICON_BASE}/ender_pearl.png`, cat: 'Magie' },
  { id: 'blaze_rod', name: 'Bâton de Blaze', icon: `${ICON_BASE}/blaze_rod.png`, cat: 'Magie' },
  { id: 'totem_of_undying', name: 'Totem d\'immortalité', icon: `${ICON_BASE}/totem_of_undying.png`, cat: 'Magie' },
  { id: 'nether_star', name: 'Étoile du Nether', icon: `${ICON_BASE}/nether_star.png`, cat: 'Magie' },
  { id: 'golden_apple', name: 'Pomme dorée', icon: `${ICON_BASE}/golden_apple.png`, cat: 'Magie' },
  { id: 'enchanted_golden_apple', name: 'Notch Apple', icon: `${ICON_BASE}/enchanted_golden_apple.png`, cat: 'Magie' },
  { id: 'shulker_shell', name: 'Carapace Shulker', icon: `${ICON_BASE}/shulker_shell.png`, cat: 'Ressources' },
  { id: 'gunpowder', name: 'Poudre à canon', icon: `${ICON_BASE}/gunpowder.png`, cat: 'Ressources' },
  { id: 'slime_ball', name: 'Boule de Slime', icon: `${ICON_BASE}/slime_ball.png`, cat: 'Ressources' },
  { id: 'phantom_membrane', name: 'Membrane Phantom', icon: `${ICON_BASE}/phantom_membrane.png`, cat: 'Ressources' },
  { id: 'wither_skeleton_skull', name: 'Crâne Wither', icon: `${ICON_BASE}/wither_skeleton_skull.png`, cat: 'Ressources' },
  { id: 'dragon_breath', name: 'Souffle du dragon', icon: `${ICON_BASE}/dragon_breath.png`, cat: 'Ressources' },
  { id: 'name_tag', name: 'Étiquette', icon: `${ICON_BASE}/name_tag.png`, cat: 'Autre' },
  { id: 'saddle', name: 'Selle', icon: `${ICON_BASE}/saddle.png`, cat: 'Autre' },
  { id: 'beacon', name: 'Balise', icon: `${ICON_BASE}/beacon.png`, cat: 'Autre' },
  { id: 'tnt', name: 'TNT', icon: `${ICON_BASE}/tnt.png`, cat: 'Autre' },
  { id: 'bread', name: 'Pain', icon: `${ICON_BASE}/bread.png`, cat: 'Nourriture' },
  { id: 'cooked_beef', name: 'Steak', icon: `${ICON_BASE}/cooked_beef.png`, cat: 'Nourriture' },
];

const getItem = (id) => MC_ITEMS.find(i => i.id === id);

// ==========================================
// ITEM PICKER COMPONENT
// ==========================================
function ItemPicker({ value, onChange, label }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const ref = useRef(null);
  const selected = value ? getItem(value) : null;

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const filtered = MC_ITEMS.filter(i =>
    i.name.toLowerCase().includes(search.toLowerCase()) ||
    i.cat.toLowerCase().includes(search.toLowerCase())
  );

  const grouped = {};
  filtered.forEach(i => { if (!grouped[i.cat]) grouped[i.cat] = []; grouped[i.cat].push(i); });

  return (
    <div className="field" ref={ref}>
      {label && <label>{label}</label>}
      <div className="item-picker" onClick={() => setOpen(!open)}>
        {selected ? (
          <div className="item-selected">
            <img src={selected.icon} alt="" onError={e => e.target.style.display = 'none'} />
            <span>{selected.name}</span>
          </div>
        ) : (
          <span className="item-placeholder">Choisir un item...</span>
        )}
        <span className="item-arrow">{open ? '▴' : '▾'}</span>
      </div>
      {open && (
        <div className="item-dropdown">
          <input
            className="item-search"
            placeholder="Rechercher..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClick={e => e.stopPropagation()}
            autoFocus
          />
          <div className="item-list">
            {Object.entries(grouped).map(([cat, items]) => (
              <div key={cat}>
                <div className="item-cat">{cat}</div>
                {items.map(item => (
                  <div
                    key={item.id}
                    className={`item-option ${value === item.id ? 'selected' : ''}`}
                    onClick={(e) => { e.stopPropagation(); onChange(item.id); setOpen(false); setSearch(''); }}
                  >
                    <img src={item.icon} alt="" onError={e => e.target.style.display = 'none'} />
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
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      if (Array.isArray(data)) setOffers(data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchOffers(); }, [fetchOffers]);

  const filtered = tab === 'all' ? offers : offers.filter(o => o.type === tab);

  const handleAdminLogin = async () => {
    setAdminError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPw }),
      });
      if (res.ok) { setIsAdmin(true); fetchOffers(); }
      else setAdminError('Mot de passe incorrect');
    } catch { setAdminError('Erreur'); }
  };

  const handleSaveOffer = async (data) => {
    const method = editingOffer ? 'PUT' : 'POST';
    const body = editingOffer ? { ...data, id: editingOffer.id } : data;
    try {
      const res = await fetch('/api/offers', {
        method,
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminPw}` },
        body: JSON.stringify(body),
      });
      if (res.ok) { setAdminModal(false); setEditingOffer(null); fetchOffers(); }
    } catch (err) { console.error(err); }
  };

  const handleCloseOffer = async (offer) => {
    await fetch('/api/offers', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${adminPw}` },
      body: JSON.stringify({ ...offer, status: 'closed' }),
    });
    fetchOffers();
  };

  const handleDeleteOffer = async (id) => {
    if (!confirm('Supprimer ?')) return;
    await fetch(`/api/offers?id=${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${adminPw}` } });
    fetchOffers();
  };

  // Parse offer data for display
  const parseOffer = (offer) => {
    try {
      const item = offer.quantity ? getItem(offer.title) : null;
      const priceData = offer.price ? JSON.parse(offer.price) : null;
      return { item, priceData };
    } catch { return { item: null, priceData: null }; }
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
          <button className="admin-btn" onClick={() => setShowAdmin(!showAdmin)}>
            {isAdmin ? '⚙' : '🔒'}
          </button>
        </div>
      </header>

      <main className="main">
        {/* SERVICES */}
        <div className="section-title">Services</div>
        <div className="service-card">
          <img className="service-img" src={`${ICON_BASE}/experience_bottle.png`} alt="XP" onError={e => e.target.style.display = 'none'} />
          <div className="service-info">
            <h3>Ferme XP Silverfish</h3>
            <p>Location — 1 utilisation</p>
          </div>
          <div className="service-price">
            <img src={`${ICON_BASE}/diamond.png`} alt="" onError={e => e.target.style.display = 'none'} />
            15
          </div>
          <span className={`service-status ${farmOpen ? 'status-open' : 'status-closed'}`}>
            {farmOpen ? 'Ouvert' : 'Fermé'}
          </span>
          {isAdmin && (
            <button className={`btn-toggle ${farmOpen ? 'open' : 'close'}`} onClick={() => setFarmOpen(!farmOpen)}>
              {farmOpen ? 'Fermer' : 'Ouvrir'}
            </button>
          )}
        </div>

        {/* MARKETPLACE */}
        <div className="section-title" style={{ marginTop: '1.5rem' }}>Marketplace</div>
        <div className="tabs">
          {[
            { key: 'all', label: 'Tout' },
            { key: 'achat', label: 'Achats' },
            { key: 'vente', label: 'Ventes' },
            { key: 'emploi', label: 'Emplois' },
          ].map(t => (
            <button key={t.key} className={`tab ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <div className="grid">
            {filtered.length === 0 ? (
              <div className="empty"><span>📭</span>Aucune offre active.</div>
            ) : (
              filtered.map(offer => {
                const itemData = getItem(offer.title);
                let priceItem = null;
                let priceQty = '';
                try {
                  const p = JSON.parse(offer.price);
                  priceItem = getItem(p.item);
                  priceQty = p.qty;
                } catch {}

                return (
                  <div key={offer.id} className="card">
                    <div className="card-top">
                      <div className={`badge badge-${offer.type}`}>
                        {offer.type === 'achat' ? 'Achat' : offer.type === 'vente' ? 'Vente' : 'Emploi'}
                      </div>
                    </div>

                    {/* Item display */}
                    <div className="offer-item-display">
                      {itemData && <img src={itemData.icon} alt="" className="offer-item-icon" onError={e => e.target.style.display = 'none'} />}
                      <div>
                        <h3>{itemData ? itemData.name : offer.title}</h3>
                        {offer.quantity && <span className="offer-qty">×{offer.quantity}</span>}
                      </div>
                    </div>

                    {offer.description && <p>{offer.description}</p>}

                    {/* Price display */}
                    {priceItem && (
                      <div className="offer-price-row">
                        <span className="offer-price-label">{offer.type === 'achat' ? 'Budget' : 'Prix'}</span>
                        <div className="offer-price-value">
                          <img src={priceItem.icon} alt="" onError={e => e.target.style.display = 'none'} />
                          <span>{priceQty}× {priceItem.name}</span>
                        </div>
                      </div>
                    )}
                    {!priceItem && offer.price && (
                      <div className="offer-price-row">
                        <span className="offer-price-label">Prix</span>
                        <span>{offer.price}</span>
                      </div>
                    )}

                    <button className="btn-respond" onClick={() => setRespondModal(offer)}>
                      Je suis intéressé
                    </button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* ADMIN */}
        {showAdmin && (
          <section className="admin-section">
            {!isAdmin ? (
              <div className="admin-login">
                <h2>Admin</h2>
                <div className="admin-row">
                  <input type="password" placeholder="Mot de passe" value={adminPw}
                    onChange={e => setAdminPw(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdminLogin()} />
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

  useEffect(() => {
    const t = setTimeout(() => setDebouncedPseudo(pseudo.trim()), 500);
    return () => clearTimeout(t);
  }, [pseudo]);

  const submit = async () => {
    if (!pseudo.trim()) return;
    setSending(true);
    try {
      await fetch('/api/respond', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ offer_id: offer.id, minecraft_pseudo: pseudo.trim(), discord_pseudo: discord.trim() || null, message: message.trim() || null }),
      });
      setSent(true);
    } catch { alert('Erreur'); }
    finally { setSending(false); }
  };

  const itemData = getItem(offer.title);

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {sent ? (
          <div className="success-msg">
            <span>✅</span>
            <p>Envoyé !</p>
            <small>Ta réponse a été transmise sur Discord.</small>
          </div>
        ) : (
          <>
            <h2>Répondre</h2>
            <p style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              {itemData && <img src={itemData.icon} alt="" style={{ width: 20, height: 20, imageRendering: 'pixelated' }} onError={e => e.target.style.display = 'none'} />}
              {itemData ? itemData.name : offer.title}
              {offer.quantity && ` ×${offer.quantity}`}
            </p>
            <div className="field">
              <label>Pseudo Minecraft *</label>
              <input value={pseudo} onChange={e => setPseudo(e.target.value)} placeholder="Ton pseudo in-game" />
              {debouncedPseudo && (
                <div className="skin-preview">
                  <img src={MC_HEAD(debouncedPseudo)} alt="" />
                  <span>{debouncedPseudo}</span>
                </div>
              )}
            </div>
            <div className="field">
              <label>Pseudo Discord</label>
              <input value={discord} onChange={e => setDiscord(e.target.value)} placeholder="Optionnel" />
            </div>
            <div className="field">
              <label>Message</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Optionnel" />
            </div>
            <button className="btn-submit" onClick={submit} disabled={!pseudo.trim() || sending}>
              {sending ? 'Envoi…' : 'Envoyer'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}


// ==========================================
// OFFER FORM (ADMIN) - with item pickers
// ==========================================
function OfferForm({ offer, onClose, onSave }) {
  const [type, setType] = useState(offer?.type || 'vente');
  const [itemId, setItemId] = useState(offer?.title || '');
  const [quantity, setQuantity] = useState(offer?.quantity || '');
  const [description, setDescription] = useState(offer?.description || '');
  const [priceItemId, setPriceItemId] = useState('');
  const [priceQty, setPriceQty] = useState('');
  const [saving, setSaving] = useState(false);

  // Parse existing price if editing
  useEffect(() => {
    if (offer?.price) {
      try {
        const p = JSON.parse(offer.price);
        setPriceItemId(p.item || '');
        setPriceQty(p.qty || '');
      } catch {
        // Legacy text price
      }
    }
  }, [offer]);

  const submit = async () => {
    if (!itemId) return;
    setSaving(true);
    const priceJson = priceItemId ? JSON.stringify({ item: priceItemId, qty: priceQty }) : '';
    await onSave({
      type,
      title: itemId, // We store the item ID as title
      description: description.trim(),
      quantity: quantity,
      price: priceJson,
    });
    setSaving(false);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{offer ? 'Modifier' : 'Nouvelle offre'}</h2>

        <div className="field">
          <label>Type</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="vente">Vente</option>
            <option value="achat">Achat</option>
            <option value="emploi">Emploi</option>
          </select>
        </div>

        <ItemPicker value={itemId} onChange={setItemId} label={type === 'achat' ? 'Item recherché' : 'Item à vendre'} />

        <div className="field">
          <label>Quantité</label>
          <input type="number" min="1" value={quantity} onChange={e => setQuantity(e.target.value.replace(/\D/g, ''))} placeholder="64" />
        </div>

        <div className="field">
          <label>Description (optionnel)</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Enchanté Efficiency V..." />
        </div>

        <div className="separator">
          <span>{type === 'achat' ? 'En échange de' : 'Prix demandé'}</span>
        </div>

        <ItemPicker value={priceItemId} onChange={setPriceItemId} label="Item en paiement" />

        <div className="field">
          <label>Quantité demandée</label>
          <input type="number" min="1" value={priceQty} onChange={e => setPriceQty(e.target.value.replace(/\D/g, ''))} placeholder="32" />
        </div>

        <button className="btn-submit" onClick={submit} disabled={!itemId || saving}>
          {saving ? 'Sauvegarde…' : offer ? 'Mettre à jour' : 'Publier'}
        </button>
      </div>
    </div>
  );
}
