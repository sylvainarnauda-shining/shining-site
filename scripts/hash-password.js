// Usage: node scripts/hash-password.js votre-mot-de-passe
const bcrypt = require('bcryptjs');

const password = process.argv[2];
if (!password) {
  console.log('Usage: node scripts/hash-password.js VOTRE_MOT_DE_PASSE');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\n✅ Votre hash (copiez cette ligne dans ADMIN_PASSWORD_HASH sur Vercel):\n');
console.log(hash);
console.log('');
