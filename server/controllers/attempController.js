const User = require('../model/users');
const bcrypt = require('bcrypt');

// Middleware untuk menghitung jumlah percobaan login
const loginAttempts = {};
const MAX_LOGIN_ATTEMPTS = 5;
app.post('/login', (req, res, next) => {
  const { username } = req.body;
  if (loginAttempts[username] >= MAX_LOGIN_ATTEMPTS) {
    // Lock account jika jumlah percobaan login melebihi batas maksimal
    User.findOneAndUpdate({ username }, { status: 'locked' }, { new: true })
      .then(user => {
        if (!user) {
          return res.status(401).json({ message: 'Invalid username or password' });
        }
        return res.status(401).json({ message: 'Your account has been locked due to too many login attempts' });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      });
  } else {
    next();
  }
}, async (req, res) => {
  const { username, password } = req.body;
  // Verifikasi status akun user sebelum melakukan login
  const user = await User.findOne({ username });
  if (user && user.status === 'locked') {
    return res.status(401).json({ message: 'Your account has been locked. Please contact support.' });
  }
  // Lakukan autentikasi dan gunakan try-catch pada fungsi autentikasi
  try {
    const user = await User.authenticate(username, password);
    if (!user) {
      // Jika login gagal, tambahkan jumlah percobaan login
      loginAttempts[username] = loginAttempts[username] ? loginAttempts[username] + 1 : 1;
      return res.status(401).json({ message: 'Invalid username or password' });
    }
    // Jika login berhasil, reset jumlah percobaan login
    loginAttempts[username] = 0;
    // Kirimkan respons berhasil
    return res.json({ message: 'Login success' });
  } catch (err) {
    // Gunakan middleware untuk mengelola error
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
});

app.post('/unlock', async (req, res) => {
  const { username } = req.body;
  // Verifikasi status akun user sebelum melakukan unlock
  const user = await User.findOne({ username });
  if (!user || user.status !== 'locked') {
    return res.status(400).json({ message: 'Invalid request' });
  }
  // Update status akun user menjadi active
  user.status = 'active';
  await user.save();
  // Kirimkan respons berhasil
  return res.json({ message: 'Account unlocked' });
});
