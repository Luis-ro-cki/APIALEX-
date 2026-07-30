const express = require('express');
const cors = require('cors');
const cookieSession = require('cookie-session');
const path = require('path');

const requireLogin = require('./middleware/requireLogin');
const loginRoute = require('./routes/auth/login');
const registerRoute = require('./routes/auth/register');
const ytsearchRoute = require('./routes/search/ytsearch');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(cookieSession({
  name: 'alexapi.sid',
  keys: ['DUANOFICIAL123456789OFCXD'],
  maxAge: 30 * 24 * 60 * 60 * 1000,
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/auth/login', loginRoute);
app.use('/auth/register', registerRoute);
app.use('/search/ytsearch', ytsearchRoute);

app.get('/', (req, res) => {
  res.redirect(req.session.user ? '/dashboard' : '/login');
});

app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'register.html'));
});

app.get('/dashboard', requireLogin, (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

app.get('/api/session', (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ status: false, creator: 'Alex', error: 'Sin sesión' });
  }
  res.json({ status: true, creator: 'Alex', user: req.session.user });
});

app.post('/api/logout', (req, res) => {
  req.session = null;
  res.json({ status: true, creator: 'Alex' });
});

app.use((req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(PORT, () => console.log(`Alex Api corriendo en el puerto ${PORT}`));
