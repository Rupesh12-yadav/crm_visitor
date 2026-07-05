require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initAdmin } = require('./controllers/authController');

const app = express();
app.use(cors());
app.use(express.json());

connectDB().then(() => {
  initAdmin();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/visitors', require('./routes/visitors'));

app.get('/api/dashboard/stats', require('./middleware/auth'), async (req, res) => {
  const Customer = require('./models/Customer');
  const Visitor = require('./models/Visitor');
  
  const totalCustomers = await Customer.countDocuments();
  const activeCustomers = await Customer.countDocuments({ status: 'active' });
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const visitorsToday = await Visitor.countDocuments({ checkInTime: { $gte: today } });
  const checkedIn = await Visitor.countDocuments({ checkInTime: { $gte: today }, checkOutTime: null });
  
  res.json({ totalCustomers, activeCustomers, visitorsToday, checkedIn });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
