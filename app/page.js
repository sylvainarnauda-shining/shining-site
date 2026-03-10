'use client';

import { useState, useEffect, useCallback } from 'react';

// Minecraft item icons via mc.wiki / crafatar for skins
const MC_ITEM = (item) => `https://mc.nerothe.com/img/1.21.1/${item}.png`;
const MC_HEAD = (pseudo) => `https://mc-heads.net/avatar/${pseudo}/32`;
const DIAMOND_ICON = MC_ITEM('diamond');

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

  // XP Farm state
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

  return (
    <>
      {/* HEADER */}
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

        {/* XP FARM SERVICE */}
        <div className="section-title">Services</div>
        <div className="service-card">
          <img className="service-img" src={MC_ITEM('experience_bottle')} alt="XP" onError={(e) => { e.target.style.display = 'none'; }} />
          <div className="service-info">
            <h3>Ferme XP Silverfish</h3>
            <p>Location de notre ferme à XP. Réserve ton créneau.</p>
          </div>
          <div className="service-price">
            <img src={DIAMOND_ICON} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
            15
          </div>
          <span className={`service-status ${farmOpen ? 'status-open' : 'status-closed'}`}>
            {farmOpen ? 'Ouvert' : 'Fermé'}
          </span>
          {isAdmin && (
            <button
              className={`btn-toggle ${farmOpen ? 'open' : 'close'}`}
              onClick={() => setFarmOpen(!farmOpen)}
            >
              {farmOpen ? 'Fermer' : 'Ouvrir'}
            </button>
          )}
        </div>

        {/* TABS */}
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

        {/* OFFERS */}
        {loading ? (
          <div className="spinner-wrap"><div className="spinner" /></div>
        ) : (
          <div className="grid">
            {filtered.length === 0 ? (
              <div className="empty">
                <span>📭</span>
                Aucune offre active.
              </div>
            ) : (
              filtered.map(offer => (
                <div key={offer.id} className="card">
                  <div className="card-top">
                    <div className={`badge badge-${offer.type}`}>
                      {offer.type === 'achat' ? 'Achat' : offer.type === 'vente' ? 'Vente' : 'Emploi'}
                    </div>
                  </div>
                  <h3>{offer.title}</h3>
                  {offer.description && <p>{offer.description}</p>}
                  <div className="card-meta">
                    {offer.quantity && <span>📦 {offer.quantity}</span>}
                    {offer.price && (
                      <span>
                        <img src={DIAMOND_ICON} alt="" onError={(e) => { e.target.style.display = 'none'; }} />
                        {offer.price}
                      </span>
                    )}
                  </div>
                  <button className="btn-respond" onClick={() => setRespondModal(offer)}>
                    Je suis intéressé
                  </button>
                </div>
              ))
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
                  <input
                    type="password"
                    placeholder="Mot de passe"
                    value={adminPw}
                    onChange={e => setAdminPw(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                  />
                  <button onClick={handleAdminLogin}>OK</button>
                </div>
                {adminError && <div className="admin-error">{adminError}</div>}
              </div>
            ) : (
              <div className="admin-panel">
                <div className="admin-toolbar">
                  <h2>Gestion</h2>
                  <div className="admin-btns">
                    <button className="btn-add" onClick={() => { setEditingOffer(null); setAdminModal(true); }}>
                      + Offre
                    </button>
                    <button className="btn-logout" onClick={() => { setIsAdmin(false); setAdminPw(''); setShowAdmin(false); }}>
                      Déco
                    </button>
                  </div>
                </div>
                <div className="admin-list">
                  {offers.length === 0 ? (
                    <div className="empty"><span>📋</span>Aucune offre.</div>
                  ) : (
                    offers.map(offer => (
                      <div key={offer.id} className="admin-item">
                        <div className="admin-item-info">
                          <h4>
                            <span className={`badge badge-${offer.type}`} style={{ marginRight: '0.3rem' }}>{offer.type}</span>
                            {offer.title}
                          </h4>
                          <span>{offer.description?.slice(0, 60)}{offer.description?.length > 60 ? '…' : ''}</span>
                        </div>
                        <div className="admin-actions">
                          <button className="btn-sm edit" onClick={() => { setEditingOffer(offer); setAdminModal(true); }}>Modifier</button>
                          <button className="btn-sm close-offer" onClick={() => handleCloseOffer(offer)}>Fermer</button>
                          <button className="btn-sm delete" onClick={() => handleDeleteOffer(offer.id)}>Suppr</button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </section>
        )}
      </main>

      <footer className="footer">
        Shining — Marketplace du serveur Arkunir
      </footer>

      {respondModal && <RespondModal offer={respondModal} onClose={() => setRespondModal(null)} />}
      {adminModal && <OfferForm offer={editingOffer} onClose={() => { setAdminModal(false); setEditingOffer(null); }} onSave={handleSaveOffer} />}
    </>
  );
}


function RespondModal({ offer, onClose }) {
  const [pseudo, setPseudo] = useState('');
  const [discord, setDiscord] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [debouncedPseudo, setDebouncedPseudo] = useState('');

  // Debounce pseudo for skin preview
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
        body: JSON.stringify({
          offer_id: offer.id,
          minecraft_pseudo: pseudo.trim(),
          discord_pseudo: discord.trim() || null,
          message: message.trim() || null,
        }),
      });
      setSent(true);
    } catch { alert('Erreur'); }
    finally { setSending(false); }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        {sent ? (
          <div className="success-msg">
            <span>✅</span>
            <p>Envoyé !</p>
            <small>Ta réponse a été transmise sur notre Discord.</small>
          </div>
        ) : (
          <>
            <h2>Répondre</h2>
            <p>{offer.title}</p>
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


function OfferForm({ offer, onClose, onSave }) {
  const [type, setType] = useState(offer?.type || 'vente');
  const [title, setTitle] = useState(offer?.title || '');
  const [description, setDescription] = useState(offer?.description || '');
  const [quantity, setQuantity] = useState(offer?.quantity || '');
  const [price, setPrice] = useState(offer?.price || '');
  const [saving, setSaving] = useState(false);

  const submit = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await onSave({ type, title: title.trim(), description: description.trim(), quantity, price });
    setSaving(false);
  };

  return (
    <div className="overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{offer ? 'Modifier' : 'Nouvelle offre'}</h2>
        <p>Remplis les champs.</p>
        <div className="field">
          <label>Type</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="vente">Vente</option>
            <option value="achat">Achat</option>
            <option value="emploi">Emploi</option>
          </select>
        </div>
        <div className="field">
          <label>Titre *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: 3 stacks de diamants" />
        </div>
        <div className="field">
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Détails…" />
        </div>
        <div className="field">
          <label>Quantité</label>
          <input value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Ex: 3 stacks" />
        </div>
        <div className="field">
          <label>Prix</label>
          <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Ex: 12 diamants" />
        </div>
        <button className="btn-submit" onClick={submit} disabled={!title.trim() || saving}>
          {saving ? 'Sauvegarde…' : offer ? 'Mettre à jour' : 'Publier'}
        </button>
      </div>
    </div>
  );
}
