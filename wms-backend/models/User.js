const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Untuk saat ini plain text dulu
  role: { type: String, enum: ['manager', 'staf'], required: true },
});

module.exports = mongoose.model('User', UserSchema);
