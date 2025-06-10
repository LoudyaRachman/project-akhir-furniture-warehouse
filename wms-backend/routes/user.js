const express = require('express');
const router = express.Router();
const User = require('../models/User');

//Get all users (Manager only) - nanti tambahkan middleware auth dan cek role manager
router.get('/', async (req, res) => {
  try {
    //Exclude password field saat mengirim data user
    const users = await User.find({}, '-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//Buat user baru
router.post('/', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    //TODO: Validasi input lebih lengkap dan hash password sebelum simpan

    const newUser = new User({ username, password, role });
    await newUser.save();

    res.status(201).json({ message: 'User berhasil dibuat' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Update user
router.put('/:id', async (req, res) => {
  try {
    const { username, password, role } = req.body;

    //TODO: Hash password kalau diupdate dan validasi input

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      { username, password, role },
      { new: true }
    );

    res.json({ message: 'User berhasil diupdate', user: updatedUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

//Hapus user
router.delete('/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: 'User berhasil dihapus' });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
