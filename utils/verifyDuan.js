const DUAN_URL = 'https://duan-detect.onrender.com/api/duan/siteverify';
const DUAN_SECRET_KEY = 'PONE_ACA_TU_DUAN_SECRET_KEY_DE_ALEX';

async function verifyDuan(token) {
  if (!token) return false;
  try {
    const res = await fetch(DUAN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, secret: DUAN_SECRET_KEY }),
    });
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
}

module.exports = verifyDuan;
