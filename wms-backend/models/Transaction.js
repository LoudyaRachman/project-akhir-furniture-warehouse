const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  inventoryId: { type: mongoose.Schema.Types.ObjectId, ref: 'Inventory', required: true },
  type: { type: String, enum: ['in', 'out'], required: true }, // masuk atau keluar
  quantity: { type: Number, required: true },
  description: { type: String },
  staff: { type: String }, // nama atau ID staf (optional)
}, { timestamps: true });

module.exports = mongoose.model('Transaction', transactionSchema);
