const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

//GET all inventory
router.get('/', async (req, res) => {
  try {
    const inventories = await Inventory.find();
    res.json(inventories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//POST tambah inventory (Staf tidak bisa set status)
router.post('/', async (req, res) => {
  const { nama_produk, kategori, satuan, tanggal_expired, lokasi, stok } = req.body;

  const newInventory = new Inventory({
    nama_produk,
    kategori,
    satuan,
    tanggal_expired,
    lokasi,
    stok,
    status: 'active', //Paksa aktif
  });

  try {
    const saved = await newInventory.save();
    res.status(201).json(saved);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//PUT update inventory (Staf tidak bisa ubah status & tidak bisa hapus)
router.put('/:id', async (req, res) => {
  try {
    const inventory = await Inventory.findById(req.params.id);
    if (!inventory) return res.status(404).json({ message: 'Inventory tidak ditemukan' });

    //Update fields yang diizinkan
    inventory.nama_produk = req.body.nama_produk || inventory.nama_produk;
    inventory.kategori = req.body.kategori || inventory.kategori;
    inventory.satuan = req.body.satuan || inventory.satuan;
    inventory.tanggal_expired = req.body.tanggal_expired || inventory.tanggal_expired;
    inventory.lokasi = req.body.lokasi || inventory.lokasi;
    inventory.stok = req.body.stok !== undefined ? req.body.stok : inventory.stok;

    //Jangan update status dari staf

    const updated = await inventory.save();
    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
