const Visitor = require('../models/Visitor');

const checkIn = async (req, res) => {
  const { visitorName, phone, personToMeet, purpose } = req.body;
  if (!visitorName || !phone || !personToMeet || !purpose) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  try {
    const visitor = await Visitor.create({ visitorName, phone, personToMeet, purpose });
    res.status(201).json(visitor);
  } catch (error) {
    res.status(500).json({ message: 'Server error during check-in' });
  }
};

const checkOut = async (req, res) => {
  try {
    const visitor = await Visitor.findByIdAndUpdate(
      req.params.id,
      { checkOutTime: new Date() },
      { new: true }
    );
    if (!visitor) return res.status(404).json({ message: 'Visitor not found' });
    res.json(visitor);
  } catch (error) {
    res.status(500).json({ message: 'Server error during check-out' });
  }
};

const getHistory = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const [visitors, count] = await Promise.all([
      Visitor.find()
        .sort({ checkInTime: -1 })
        .limit(limit * 1)
        .skip((page - 1) * limit),
      Visitor.countDocuments()
    ]);
    res.json({ visitors, totalPages: Math.ceil(count / limit), currentPage: Number(page) });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching history' });
  }
};

const getTodayStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [visitorsToday, checkedIn] = await Promise.all([
      Visitor.countDocuments({ checkInTime: { $gte: today } }),
      Visitor.countDocuments({ checkInTime: { $gte: today }, checkOutTime: null })
    ]);
    res.json({ visitorsToday, checkedIn });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching today stats' });
  }
};

module.exports = { checkIn, checkOut, getHistory, getTodayStats };
