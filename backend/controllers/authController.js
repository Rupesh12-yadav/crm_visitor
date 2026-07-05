const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const login = async (req, res) => {
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }
  
  const user = await User.findOne({ email });
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });
  
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });
  
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
  res.json({ token, user: { id: user._id, email: user.email } });
};

const initAdmin = async () => {
  const exists = await User.findOne({ email: 'admin@gmail.com' });
  if (!exists) {
    const hashedPassword = await bcrypt.hash('123456', 10);
    await User.create({ email: 'admin@gmail.com', password: hashedPassword });
    console.log('Admin user created');
  }
};

module.exports = { login, initAdmin };
