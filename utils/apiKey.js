const supabase = require('./supabaseClient');

const PREFIXES = ['DU', 'AL', 'SA'];
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function randomLetters(n) {
  let out = '';
  for (let i = 0; i < n; i++) {
    out += LETTERS[Math.floor(Math.random() * LETTERS.length)];
  }
  return out;
}

async function generateApiKey() {
  while (true) {
    const prefix = PREFIXES[Math.floor(Math.random() * PREFIXES.length)];
    const key = prefix + randomLetters(6);
    const { data } = await supabase.from('alex_users').select('id').eq('api_key', key).maybeSingle();
    if (!data) return key;
  }
}

module.exports = generateApiKey;
