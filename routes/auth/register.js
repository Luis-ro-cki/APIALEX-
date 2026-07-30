const express = require('express');
const router = express.Router();

const supabase = require('../../utils/supabaseClient');
const { findUser, createUser } = require('../../utils/users');
const verifyCaptcha = require('../../utils/verifyDuan');
const generateApiKey = require('../../utils/apiKey');

const REQUESTS_LIMIT = 1000;
const RESET_DAYS = 30;

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

    const existing = await findUser(username);
    if (existing) {
      return res.status(409).json({ status: false, creator: 'Alex', error: 'Ese usuario ya existe' });
    }

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: username,
      password,
    });

    if (authError) {
      return res.status(400).json({ status: false, creator: 'Alex', error: authError.message });
    }

    const authUser = authData.user;
    if (!authUser) {
      return res.status(500).json({ status: false, creator: 'Alex', error: 'No se pudo crear la cuenta en Supabase Auth' });
    }

    const apiKey = await generateApiKey();

    const newUser = await createUser({
      id: authUser.id,
      username,
      api_key: apiKey,
      requests_used: 0,
      requests_limit: REQUESTS_LIMIT,
      reset_at: new Date(Date.now() + RESET_DAYS * 24 * 60 * 60 * 1000).toISOString(),
      unlimited: false,
      is_admin: false,
    });

    if (!authData.session) {
      return res.json({
        status: true,
        creator: 'Alex',
        message: 'Cuenta creada. Revisa tu correo para confirmarla antes de iniciar sesión.',
        apiKey: newUser.api_key,
      });
    }

    req.session.user = {
      username: newUser.username,
      apiKey: newUser.api_key,
      isAdmin: false,
    };

    res.json({
      status: true,
      creator: 'Alex',
      message: 'Usuario registrado correctamente',
      apiKey: newUser.api_key,
      requestsLimit: newUser.requests_limit,
    });
  } catch (err) {
    res.status(500).json({ status: false, creator: 'Alex', error: err.message });
  }
});

module.exports = router;
