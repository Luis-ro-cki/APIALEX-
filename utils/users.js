const supabase = require('./supabaseClient');

async function findUser(username) {
  const { data } = await supabase.from('alex_users').select('*').eq('username', username).maybeSingle();
  return data;
}

async function findUserById(id) {
  const { data } = await supabase.from('alex_users').select('*').eq('id', id).maybeSingle();
  return data;
}

async function createUser(fields) {
  const { data } = await supabase.from('alex_users').insert(fields).select().single();
  return data;
}

module.exports = { findUser, findUserById, createUser };
