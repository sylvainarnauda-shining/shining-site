'use client';

import { useState, useEffect, useCallback } from 'react';

// ==========================================
// SHINING CLAN — Main One-Page Site
// ==========================================

export default function Home() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [scrolled, setScrolled] = useState(false);

  // Modal state
  const [respondModal, setRespondModal] = useState(null); // offer object or null
  const [adminModal, setAdminModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  // Admin state
  const [adminPassword, setAdminPassword] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminError, setAdminError] = useState('');
  const [showAdmin, setShowAdmin] = useState(false);

  // Fetch offers
  const fetchOffers = useCallback(async () => {
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      if (Array.isArray(data)) setOffers(data);
    } catch (err) {
      console.error('Erreur chargement offres:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOffers();
  }, [fetchOffers]);

  // Scroll detection for navbar
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter offers by tab
  const filtered = activeTab === 'all' ? offers : offers.filter(o => o.type === activeTab);

  // Admin login
  const handleAdminLogin = async () => {
    setAdminError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: adminPassword }),
      });
      if (res.ok) {
        setIsAdmin(true);
        fetchOffers();
      } else {
        setAdminError('Mot de passe incorrect');
      }
    } catch {
      setAdminError('Erreur de connexion');
    }
  };

  // Admin: create/update offer
  const handleSaveOffer = async (formData) => {
    const method = editingOffer ? 'PUT' : 'POST';
    const body = editingOffer ? { ...formData, id: editingOffer.id } : formData;

    try {
      const res = await fetch('/api/offers', {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPassword}`,
        },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        setAdminModal(false);
        setEditingOffer(null);
        fetchOffers();
      }
    } catch (err) {
      console.error('Erreur sauvegarde:', err);
    }
  };

  // Admin: close offer
  const handleCloseOffer = async (offer) => {
    try {
      await fetch('/api/offers', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${adminPassword}`,
        },
        body: JSON.stringify({ ...offer, status: 'closed' }),
      });
      fetchOffers();
    } catch (err) {
      console.error('Erreur fermeture:', err);
    }
  };

  // Admin: delete offer
  const handleDeleteOffer = async (id) => {
    if (!confirm('Supprimer cette offre ?')) return;
    try {
      await fetch(`/api/offers?id=${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${adminPassword}` },
      });
      fetchOffers();
    } catch (err) {
      console.error('Erreur suppression:', err);
    }
  };

  return (
    <>
      {/* ---- NAVBAR ---- */}
      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <a href="#" className="nav-brand">SHINING</a>
        <ul className="nav-links">
          <li><a href="#about">Le Clan</a></li>
          <li><a href="#offers">Commerce</a></li>
          <li>
            <button className="admin-toggle" onClick={() => setShowAdmin(!showAdmin)}>
              {isAdmin ? '⚙ Admin' : '🔒'}
            </button>
          </li>
        </ul>
      </nav>

      {/* ---- HERO ---- */}
      <section className="hero" id="top">
        <div className="hero-particles">
          {Array.from({ length: 30 }).map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${6 + Math.random() * 6}s`,
              }}
            />
          ))}
        </div>

        <div className="hero-content">
          <div className="hero-badge">Serveur Arkunir — Survie Vanilla</div>
          <h1 className="hero-title">
            S<span>HI</span>NING
          </h1>
          <p className="hero-subtitle">
            Commerce. Puissance. Domination.
            Le clan le plus influent du serveur.
          </p>
          <div className="hero-cta">
            <a href="#offers" className="btn-primary">Voir nos offres</a>
            <a href="#about" className="btn-secondary">Découvrir le clan</a>
          </div>
        </div>

        <div className="hero-scroll"><span /></div>
      </section>

      {/* ---- ABOUT ---- */}
      <section className="section" id="about">
        <div className="section-header">
          <div className="section-label">Qui sommes-nous</div>
          <h2 className="section-title">L&apos;Empire Shining</h2>
          <div className="section-divider" />
        </div>

        <div className="about-grid">
          <div className="about-card">
            <div className="about-icon">⚔️</div>
            <h3>Tryharders</h3>
            <p>On ne fait pas les choses à moitié. Chaque projet est mené jusqu&apos;au bout, chaque base est une forteresse, chaque objectif est atteint.</p>
          </div>
          <div className="about-card">
            <div className="about-icon">💎</div>
            <h3>Commerce</h3>
            <p>Achat, vente, emploi — notre économie tourne. On recrute des mineurs, on vend des ressources rares, on domine le marché du serveur.</p>
          </div>
          <div className="about-card">
            <div className="about-icon">👑</div>
            <h3>Recrutement</h3>
            <p>Tu bosses bien pour nous ? On te remarque. Les meilleurs employés rejoignent nos rangs. Prouve ta valeur et intègre le clan.</p>
          </div>
        </div>
      </section>

      {/* ---- OFFERS ---- */}
      <section className="section" id="offers">
        <div className="section-header">
          <div className="section-label">Tableau de bord</div>
          <h2 className="section-title">Offres actives</h2>
          <div className="section-divider" />
        </div>

        <div className="offers-tabs">
          {[
            { key: 'all', label: 'Tout' },
            { key: 'achat', label: '🛒 Achats' },
            { key: 'vente', label: '💰 Ventes' },
            { key: 'emploi', label: '⛏️ Emplois' },
          ].map(tab => (
            <button
              key={tab.key}
              className={`tab-btn ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="loading-spinner"><div className="spinner" /></div>
        ) : (
          <div className="offers-grid">
            {filtered.length === 0 ? (
              <div className="empty-state">
                <span>📭</span>
                Aucune offre active pour le moment.
              </div>
            ) : (
              filtered.map(offer => (
                <div key={offer.id} className="offer-card">
                  <div className={`offer-type-badge badge-${offer.type}`}>
                    {offer.type === 'achat' ? '🛒 Achat' : offer.type === 'vente' ? '💰 Vente' : '⛏️ Emploi'}
                  </div>
                  <h3>{offer.title}</h3>
                  {offer.description && <p>{offer.description}</p>}
                  <div className="offer-meta">
                    {offer.quantity && <span>📦 {offer.quantity}</span>}
                    {offer.price && <span>💰 {offer.price}</span>}
                  </div>
                  <button className="btn-respond" onClick={() => setRespondModal(offer)}>
                    Je suis intéressé
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </section>

      {/* ---- ADMIN SECTION ---- */}
      {showAdmin && (
        <section className="admin-section" id="admin">
          {!isAdmin ? (
            <div className="admin-login">
              <h2>🔒 Accès Admin</h2>
              <div className="admin-login-row">
                <input
                  type="password"
                  placeholder="Mot de passe"
                  value={adminPassword}
                  onChange={e => setAdminPassword(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAdminLogin()}
                />
                <button onClick={handleAdminLogin}>Entrer</button>
              </div>
              {adminError && <div className="admin-error">{adminError}</div>}
            </div>
          ) : (
            <div className="admin-panel">
              <div className="admin-toolbar">
                <h2>⚙ Gestion des offres</h2>
                <div className="admin-btns">
                  <button className="btn-add" onClick={() => { setEditingOffer(null); setAdminModal(true); }}>
                    + Nouvelle offre
                  </button>
                  <button className="btn-logout" onClick={() => { setIsAdmin(false); setAdminPassword(''); setShowAdmin(false); }}>
                    Déconnexion
                  </button>
                </div>
              </div>

              <div className="admin-offers-list">
                {offers.length === 0 ? (
                  <div className="empty-state"><span>📋</span>Aucune offre créée.</div>
                ) : (
                  offers.map(offer => (
                    <div key={offer.id} className="admin-offer-item">
                      <div className="admin-offer-info">
                        <h4>
                          <span className={`offer-type-badge badge-${offer.type}`} style={{ marginRight: '0.5rem' }}>
                            {offer.type}
                          </span>
                          {offer.title}
                        </h4>
                        <span>{offer.description?.slice(0, 80)}{offer.description?.length > 80 ? '…' : ''}</span>
                      </div>
                      <div className="admin-offer-actions">
                        <button className="btn-edit" onClick={() => { setEditingOffer(offer); setAdminModal(true); }}>
                          Modifier
                        </button>
                        <button className="btn-close-offer" onClick={() => handleCloseOffer(offer)}>
                          Fermer
                        </button>
                        <button className="btn-delete" onClick={() => handleDeleteOffer(offer.id)}>
                          Supprimer
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </section>
      )}

      {/* ---- FOOTER ---- */}
      <footer className="footer">
        <a href="#top" className="nav-brand">SHINING</a>
        <p>Clan Minecraft — Serveur Arkunir Survie Vanilla</p>
        <p style={{ marginTop: '0.3rem', fontSize: '0.7rem' }}>eliolia.com</p>
      </footer>

      {/* ---- RESPOND MODAL ---- */}
      {respondModal && (
        <RespondModal
          offer={respondModal}
          onClose={() => setRespondModal(null)}
        />
      )}

      {/* ---- ADMIN CREATE/EDIT MODAL ---- */}
      {adminModal && (
        <OfferFormModal
          offer={editingOffer}
          onClose={() => { setAdminModal(false); setEditingOffer(null); }}
          onSave={handleSaveOffer}
        />
      )}
    </>
  );
}


// ==========================================
// RESPOND MODAL (visitor submits interest)
// ==========================================
function RespondModal({ offer, onClose }) {
  const [pseudo, setPseudo] = useState('');
  const [discord, setDiscord] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async () => {
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
    } catch {
      alert('Erreur lors de l\'envoi');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        {sent ? (
          <div className="success-msg">
            <span>✅</span>
            <h2>Envoyé !</h2>
            <p>Ta candidature a été transmise au clan Shining via Discord.</p>
          </div>
        ) : (
          <>
            <h2>Répondre à l&apos;offre</h2>
            <p>{offer.title}</p>

            <div className="form-group">
              <label>Pseudo Minecraft *</label>
              <input
                value={pseudo}
                onChange={e => setPseudo(e.target.value)}
                placeholder="Ton pseudo in-game"
              />
            </div>

            <div className="form-group">
              <label>Pseudo Discord</label>
              <input
                value={discord}
                onChange={e => setDiscord(e.target.value)}
                placeholder="Optionnel"
              />
            </div>

            <div className="form-group">
              <label>Message</label>
              <textarea
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Un mot pour le clan ? (optionnel)"
              />
            </div>

            <button
              className="btn-submit"
              onClick={handleSubmit}
              disabled={!pseudo.trim() || sending}
            >
              {sending ? 'Envoi...' : 'Envoyer'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}


// ==========================================
// OFFER FORM MODAL (admin creates/edits)
// ==========================================
function OfferFormModal({ offer, onClose, onSave }) {
  const [type, setType] = useState(offer?.type || 'vente');
  const [title, setTitle] = useState(offer?.title || '');
  const [description, setDescription] = useState(offer?.description || '');
  const [quantity, setQuantity] = useState(offer?.quantity || '');
  const [price, setPrice] = useState(offer?.price || '');
  const [saving, setSaving] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) return;
    setSaving(true);
    await onSave({ type, title: title.trim(), description: description.trim(), quantity, price });
    setSaving(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2>{offer ? 'Modifier l\'offre' : 'Nouvelle offre'}</h2>
        <p>Remplis les champs ci-dessous.</p>

        <div className="form-group">
          <label>Type</label>
          <select value={type} onChange={e => setType(e.target.value)}>
            <option value="vente">💰 Vente</option>
            <option value="achat">🛒 Achat</option>
            <option value="emploi">⛏️ Emploi</option>
          </select>
        </div>

        <div className="form-group">
          <label>Titre *</label>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Vente de 3 stacks de diamants" />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Détails de l'offre..." />
        </div>

        <div className="form-group">
          <label>Quantité</label>
          <input value={quantity} onChange={e => setQuantity(e.target.value)} placeholder="Ex: 3 stacks" />
        </div>

        <div className="form-group">
          <label>Prix</label>
          <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Ex: 12 blocs d'émeraude" />
        </div>

        <button className="btn-submit" onClick={handleSubmit} disabled={!title.trim() || saving}>
          {saving ? 'Sauvegarde...' : offer ? 'Mettre à jour' : 'Publier l\'offre'}
        </button>
      </div>
    </div>
  );
}
