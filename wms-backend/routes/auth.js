const express = require('express');
const router = express.Router();

const User = require('../models/User'); // Pastikan path dan model sudah benar

//Middleware khusus untuk handle OPTIONS preflight di route ini
router.options('*', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*'); // Atau ganti sesuai domain frontend
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.sendStatus(200);
});

router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ username, password });
  if (!user) return res.status(401).json({ message: 'Username atau password salah' });

  res.json({
    username: user.username,
    role: user.role,
  });
});

module.exports = router;
