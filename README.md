# 🟣 SHINING CLAN — Guide de déploiement

## Ce que tu vas faire (environ 30 minutes)

1. Créer un compte GitHub (gratuit) → héberger le code
2. Créer un compte Supabase (gratuit) → la base de données
3. Créer un webhook Discord → recevoir les candidatures
4. Créer un compte Vercel (gratuit) → mettre le site en ligne
5. Relier eliolia.com → ton nom de domaine

---

## ÉTAPE 1 — GitHub

1. Va sur https://github.com et crée un compte (ou connecte-toi)
2. Clique sur le **+** en haut à droite → **New repository**
3. Nom : `shining-site`
4. Laisse **Public** coché
5. Clique **Create repository**
6. Sur la page du repo, clique **uploading an existing file**
7. **Glisse-dépose TOUS les fichiers** de ce dossier (app/, lib/, public/, scripts/, package.json, next.config.js, .gitignore, supabase-setup.sql)
   - ⚠️ NE mets PAS les fichiers .env ou .env.example sur GitHub
8. Clique **Commit changes**

> 💡 **Astuce** : Si tu as du mal avec l'upload de dossiers, installe [GitHub Desktop](https://desktop.github.com/) — c'est plus facile pour glisser-déposer des dossiers entiers.

---

## ÉTAPE 2 — Supabase (base de données)

1. Va sur https://supabase.com et crée un compte gratuit
2. Clique **New Project**
   - Organisation : celle par défaut
   - Nom du projet : `shining`
   - Mot de passe base de données : choisis quelque chose (note-le mais tu n'en auras pas besoin souvent)
   - Région : **West EU (Paris)** 🇫🇷
3. Attends que le projet se crée (~2 min)
4. Dans le menu à gauche, clique sur **SQL Editor**
5. **Copie-colle** tout le contenu du fichier `supabase-setup.sql` dans l'éditeur
6. Clique **Run** (le bouton vert)
7. Tu devrais voir "Success. No rows returned" — c'est normal et correct !

### Récupérer tes clés Supabase

1. Va dans **Settings** (icône engrenage en bas à gauche)
2. Clique **API** dans le sous-menu
3. Note ces 3 valeurs (tu en auras besoin pour Vercel) :
   - **Project URL** → c'est ton `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** (sous Project API keys) → c'est ton `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** (clique "Reveal" pour voir) → c'est ton `SUPABASE_SERVICE_ROLE_KEY`

> ⚠️ La **service_role key** est secrète. Ne la partage JAMAIS publiquement.

---

## ÉTAPE 3 — Webhook Discord

1. Va dans ton serveur Discord
2. Va dans **Paramètres du serveur** → **Intégrations** → **Webhooks**
3. Clique **Nouveau webhook**
4. Renomme-le "Shining Site"
5. Choisis le **channel** où tu veux recevoir les notifications (ex: #candidatures ou #commerce)
6. Clique **Copier l'URL du webhook**
7. Garde cette URL — c'est ton `DISCORD_WEBHOOK_URL`

---

## ÉTAPE 4 — Hasher ton mot de passe admin

Tu as besoin de Node.js sur ton Mac. Si tu ne l'as pas :

1. Va sur https://nodejs.org → télécharge la version LTS → installe
2. Ouvre le **Terminal** (cherche "Terminal" dans Spotlight)
3. Tape ces commandes :

```bash
cd ~/Downloads
# (ou le dossier où tu as mis les fichiers du site)
npm install bcryptjs
node scripts/hash-password.js TON_MOT_DE_PASSE_ICI
```

4. Copie le hash qui s'affiche (ça ressemble à `$2a$10$xxxxxxxxxxx...`)
5. C'est ton `ADMIN_PASSWORD_HASH`

---

## ÉTAPE 5 — Vercel (mise en ligne)

1. Va sur https://vercel.com et connecte-toi **avec ton compte GitHub**
2. Clique **Add New** → **Project**
3. Tu verras ton repo `shining-site` — clique **Import**
4. **Framework Preset** : ça devrait détecter "Next.js" automatiquement
5. Ouvre la section **Environment Variables** et ajoute ces 5 variables :

| Nom | Valeur |
|-----|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | L'URL de ton projet Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Ta clé anon Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Ta clé service_role Supabase |
| `DISCORD_WEBHOOK_URL` | L'URL de ton webhook Discord |
| `ADMIN_PASSWORD_HASH` | Le hash de ton mot de passe |

6. Clique **Deploy**
7. Attends 1-2 minutes... 🎉 Ton site est en ligne !

---

## ÉTAPE 6 — Relier eliolia.com

1. Sur Vercel, va dans ton projet → **Settings** → **Domains**
2. Tape `eliolia.com` et clique **Add**
3. Vercel va te donner des **enregistrements DNS** à configurer
4. Va sur le site où tu as acheté eliolia.com (OVH, Cloudflare, Namecheap, etc.)
5. Dans les paramètres DNS de eliolia.com, ajoute les enregistrements que Vercel t'a donnés :
   - En général c'est un enregistrement **A** qui pointe vers `76.76.21.21`
   - Et un **CNAME** pour `www` qui pointe vers `cname.vercel-dns.com`
6. Attends la propagation DNS (~5 à 30 min)
7. Vercel ajoutera automatiquement le certificat HTTPS ✅

---

## Utilisation du site

### En tant que visiteur
- Tu arrives sur le site → tu vois les offres actives
- Tu cliques "Je suis intéressé" → tu entres ton pseudo MC (et optionnellement Discord + message)
- Le clan reçoit une notification dans Discord avec tes infos

### En tant qu'admin
- Clique sur le 🔒 en haut à droite de la navbar
- Entre ton mot de passe admin
- Tu peux :
  - **Créer** des offres (achat, vente, emploi)
  - **Modifier** des offres existantes
  - **Fermer** des offres (les retire de l'affichage public)
  - **Supprimer** des offres définitivement

---

## En cas de problème

- **Le site ne se déploie pas** : vérifie que tous les fichiers sont bien sur GitHub (surtout le dossier `app/`)
- **Les offres ne s'affichent pas** : vérifie tes clés Supabase dans les variables Vercel, et que tu as bien exécuté le SQL
- **Discord ne reçoit rien** : vérifie l'URL du webhook dans les variables Vercel
- **"Non autorisé" en admin** : re-génère ton hash avec `node scripts/hash-password.js`

Pour toute question, demande à Claude ! 🟣
