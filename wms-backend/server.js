const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

//===== Middleware =====
app.use(cors());
app.use(express.json()); //Untuk parsing JSON dari body request

//===== Import Routes =====
const authRoutes = require('./routes/auth');
const inventoryRoutes = require('./routes/inventory');
const userRoutes = require('./routes/user');
const locationRoutes = require('./routes/location');
const transactionRoutes = require('./routes/transaction');
const dashboardRoutes = require('./routes/dashboard');
const staffInventoryRoutes = require('./routes/staffInventory');
const staffTransactionRoutes = require('./routes/staffTransaction');

//===== Use Routes =====
app.use('/api/auth', authRoutes);
app.use('/api/inventory', inventoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/location', locationRoutes);
app.use('/api/transaction', transactionRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/staff/inventory', staffInventoryRoutes);
app.use('/api/staff/transaction', staffTransactionRoutes);

//===== Database Connection =====
mongoose.connect('mongodb://localhost:27017/wms-furniture', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

//===== Start Server =====
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
