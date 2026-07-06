require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initAdmin } = require('./controllers/authController');

const app = express();

// CORS configuration for Render
// Permitir peticiones desde el frontend en Vercel y desde el entorno local
app.use(cors({
  origin: [
    'https://crm-visitor-xkks.vercel.app', // Tu frontend en producción
    'http://localhost:3000' // Para desarrollo local
  ],
  credentials: true
}));

app.use(express.json());

connectDB().then(() => {
  initAdmin();
});

app.use('/api/auth', require('./routes/auth'));
app.use('/api/customers', require('./routes/customers'));
app.use('/api/visitors', require('./routes/visitors'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Health check endpoint for Render
app.get('/health', (req, res) => {
  res.json({ status: 'OK' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => console.log(`Server running on port ${PORT}`));
