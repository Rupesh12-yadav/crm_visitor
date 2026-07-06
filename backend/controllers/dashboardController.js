const Customer = require('../models/Customer');
const Visitor = require('../models/Visitor');

const getStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [totalCustomers, activeCustomers, visitorsToday, checkedIn] = await Promise.all([
      Customer.countDocuments(),
      Customer.countDocuments({ status: 'active' }),
      Visitor.countDocuments({ checkInTime: { $gte: today } }),
      Visitor.countDocuments({ checkInTime: { $gte: today }, checkOutTime: null })
    ]);

    res.json({
      totalCustomers,
      activeCustomers,
      visitorsToday,
      checkedIn
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching stats' });
  }
};

module.exports = { getStats };