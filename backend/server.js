require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initAdmin } = require('./controllers/authController');

const app = express();

// CORS configuration
app.use(cors({
  origin: '*',
  credentials: true
}));

app.use(express.json());

// Connect to MongoDB
connectDB().then(() => {
  initAdmin();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/visitors', require('./routes/visitors'));

// Dashboard stats
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

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({ message: 'Visitor CRM API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
