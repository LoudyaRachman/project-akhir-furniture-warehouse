const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

//GET semua transaksi (bisa disesuaikan berdasarkan user nanti)
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find();
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//POST tambah transaksi (status default pending)
router.post('/', async (req, res) => {
  const { produk, jumlah, tipe, tanggal, user_input } = req.body;

  const newTransaction = new Transaction({
    produk,
    jumlah,
    tipe,
    tanggal,
    status: 'pending',
    user_input,
  });

  try {
    const saved = await newTransaction.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Note: Staf tidak bisa update transaksi yang sudah approved, dan tidak bisa hapus.
//Jadi tidak buat route PUT dan DELETE untuk staf di sini.

module.exports = router;
