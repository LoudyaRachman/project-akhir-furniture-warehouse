const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const Transaction = require('../models/Transaction');

//Top 5 Produk Aktif (nama produk + total jumlah)
router.get('/top-products', async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      {
        $group: {
          _id: '$produk',  // diasumsikan ini ObjectId ke Inventory
          total: { $sum: '$jumlah' }
        }
      },
      { $sort: { total: -1 } },
      { $limit: 5 },
      {
        $lookup: {
          from: 'inventories',          // nama koleksi Inventory di MongoDB
          localField: '_id',
          foreignField: '_id',
          as: 'produkInfo'
        }
      },
      { $unwind: '$produkInfo' },
      {
        $project: {
          _id: 0,
          produk: '$produkInfo.nama',   // ambil nama produk
          total: 1
        }
      }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Grafik Barang Masuk/Keluar per Bulan dan Tahun
router.get('/monthly-stats', async (req, res) => {
  try {
    const data = await Transaction.aggregate([
      {
        $group: {
          _id: {
            tahun: { $year: '$tanggal' },
            bulan: { $month: '$tanggal' },
            tipe: '$tipe'  // misal 'masuk' atau 'keluar'
          },
          total: { $sum: '$jumlah' }
        }
      },
      { $sort: { '_id.tahun': 1, '_id.bulan': 1 } }
    ]);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Stok Menipis (stok < 10)
router.get('/low-stock', async (req, res) => {
  try {
    const data = await Inventory.find({ stok: { $lt: 10 } });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Utilisasi Gudang (persentase produk dengan status active)
router.get('/utilisasi', async (req, res) => {
  try {
    const total = await Inventory.countDocuments();
    const aktif = await Inventory.countDocuments({ status: 'active' });
    const persen = total > 0 ? Math.round((aktif / total) * 100) : 0;
    res.json({ total, aktif, persen });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
