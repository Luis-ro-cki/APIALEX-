const supabase = require('../utils/supabaseClient');

module.exports = async function apiKeyAuth(req, res, next) {
  const apikey = req.query.apikey || req.headers['x-api-key'];

  if (!apikey) {
    return res.status(401).json({ status: false, creator: 'Alex', error: 'Falta apikey' });
  }

  const { data: user } = await supabase.from('alex_users').select('*').eq('api_key', apikey).maybeSingle();

  if (!user) {
    return res.status(401).json({ status: false, creator: 'Alex', error: 'apikey inválida' });
  }

  if (!user.unlimited && user.requests_used >= user.requests_limit) {
    return res.status(429).json({ status: false, creator: 'Alex', error: 'Límite de solicitudes alcanzado' });
  }

  await supabase.from('alex_users').update({ requests_used: user.requests_used + 1 }).eq('id', user.id);

  req.apiUser = user;
  next();
};
