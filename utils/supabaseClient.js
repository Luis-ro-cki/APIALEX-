const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'PONE_ACA_TU_SUPABASE_URL';
const SUPABASE_KEY = 'PONE_ACA_TU_SUPABASE_SERVICE_ROLE_KEY';

module.exports = createClient(SUPABASE_URL, SUPABASE_KEY);
