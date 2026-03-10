-- ============================================
-- SHINING CLAN - Setup Supabase
-- Copiez-collez ce script dans l'editeur SQL de Supabase
-- ============================================

-- Table des offres (achat, vente, emploi)
CREATE TABLE offers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL CHECK (type IN ('achat', 'vente', 'emploi')),
  title TEXT NOT NULL,
  description TEXT,
  quantity TEXT,
  price TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'closed')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table des reponses aux offres
CREATE TABLE responses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  offer_id UUID REFERENCES offers(id) ON DELETE CASCADE,
  minecraft_pseudo TEXT NOT NULL,
  discord_pseudo TEXT,
  message TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Activer Row Level Security
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Tout le monde peut LIRE les offres actives
CREATE POLICY "Offres visibles par tous"
  ON offers FOR SELECT
  USING (status = 'active');

-- Tout le monde peut INSERER des reponses
CREATE POLICY "Reponses ouvertes a tous"
  ON responses FOR INSERT
  WITH CHECK (true);

-- Creer un index pour les recherches par type
CREATE INDEX idx_offers_type ON offers(type);
CREATE INDEX idx_offers_status ON offers(status);
CREATE INDEX idx_responses_offer ON responses(offer_id);
