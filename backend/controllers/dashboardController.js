const Customer = require('../models/Customer');
const Visitor = require('../models/Visitor');

const getStats = async (req, res) => {
  const totalCustomers = await Customer.countDocuments();
  const activeCustomers = await Customer.countDocuments({ status: 'active' });
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const visitorsToday = await Visitor.countDocuments({ checkInTime: { $gte: today } });
  const checkedIn = await Visitor.countDocuments({ checkInTime: { $gte: today }, checkOutTime: null });
  
  res.json({ totalCustomers, activeCustomers, visitorsToday, checkedIn });
};

module.exports = { getStats };