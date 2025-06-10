const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');

//GET all transactions
router.get('/', async (req, res) => {
  try {
    const transactions = await Transaction.find().populate('inventoryId');
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST create transaction
router.post('/', async (req, res) => {
  try {
    const newTransaction = new Transaction(req.body);
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//DELETE transaction
router.delete('/:id', async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: 'Transaction deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
