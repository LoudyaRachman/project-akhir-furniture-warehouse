const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');

//GET all inventories
router.get('/', async (req, res) => {
  try {
    const inventories = await Inventory.find().populate('locationId');
    res.json(inventories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//POST create new inventory
router.post('/', async (req, res) => {
  try {
    const newItem = new Inventory(req.body);
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//PUT update inventory
router.put('/:id', async (req, res) => {
  try {
    const updated = await Inventory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

//DELETE inventory
router.delete('/:id', async (req, res) => {
  try {
    await Inventory.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
