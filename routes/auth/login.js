const express = require('express');
const router = express.Router();

const supabase = require('../../utils/supabaseClient');
const { findUserById } = require('../../utils/users');
const verifyCaptcha = require('../../utils/verifyDuan');

router.post('/', async (req, res) => {
  try {
    const { username, password, duanToken } = req.body;

    if (!username || !password) {
      return res.status(400).json({ status: false, creator: 'Alex', error: 'Faltan username o password' });
    }

    const captchaOk = await verifyCaptcha(duanToken);
    if (!captchaOk) {
      return res.status(400).json({ status: false, creator: 'Alex', error: 'Captcha inválido' });
    }

    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email: username,
      password,
    });

    if (authError || !authData.user) {
      return res.status(401).json({
        status: false,
        creator: 'Alex',
        error: authError ? authError.message : 'Usuario o contraseña incorrectos',
      });
    }

    const user = await findUserById(authData.user.id);

    if (!user) {
      return res.status(404).json({ status: false, creator: 'Alex', error: 'Cuenta sin fila en alex_users' });
    }

    req.session.user = {
      username: user.username,
      apiKey: user.api_key,
      isAdmin: !!user.is_admin,
    };

    res.json({
      status: true,
      creator: 'Alex',
      apiKey: user.api_key,
      requestsUsed: user.requests_used || 0,
      requestsLimit: user.unlimited ? null : user.requests_limit,
      unlimited: !!user.unlimited,
      isAdmin: !!user.is_admin,
    });
  } catch (err) {
    res.status(500).json({ status: false, creator: 'Alex', error: err.message });
  }
});

module.exports = router;
