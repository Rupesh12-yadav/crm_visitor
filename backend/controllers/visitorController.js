const Visitor = require('../models/Visitor');

const checkIn = async (req, res) => {
  const { visitorName, phone, personToMeet, purpose } = req.body;
  if (!visitorName || !phone || !personToMeet || !purpose) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  const visitor = await Visitor.create({ visitorName, phone, personToMeet, purpose });
  res.status(201).json(visitor);
};

const checkOut = async (req, res) => {
  const visitor = await Visitor.findByIdAndUpdate(
    req.params.id,
    { checkOutTime: new Date() },
    { new: true }
  );
  if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
  res.json(visitor);
};

const getHistory = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const visitors = await Visitor.find()
    .sort({ checkInTime: -1 })
    .limit(limit * 1)
    .skip((page - 1) * limit);
  
  const count = await Visitor.countDocuments();
  res.json({ visitors, totalPages: Math.ceil(count / limit), currentPage: page });
};

const getTodayStats = async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const visitorsToday = await Visitor.countDocuments({ checkInTime: { $gte: today } });
  const checkedIn = await Visitor.countDocuments({ checkInTime: { $gte: today }, checkOutTime: null });
  res.json({ visitorsToday, checkedIn });
};

module.exports = { checkIn, checkOut, getHistory, getTodayStats };
