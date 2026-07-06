const Customer = require('../models/Customer');

const getCustomers = async (req, res) => {
  const { search, page = 1, limit = 10 } = req.query;
  const pageNum = Number(page);
  const limitNum = Number(limit);

  let query = {};
  if (search) {
    query = { $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } }
    ]};
  }

  try {
    const [customers, totalCustomers] = await Promise.all([
      Customer.find(query)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Customer.countDocuments(query)
    ]);
    const totalPages = Math.ceil(totalCustomers / limitNum);
    res.json({ customers, totalPages, currentPage: pageNum });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching customers' });
  }
};

const createCustomer = async (req, res) => {
  const { name, email, phone, company, status } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email and phone are required' });
  }
  try {
    const exists = await Customer.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already exists' });
    
    const customer = await Customer.create({ name, email, phone, company, status });
    res.status(201).json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error creating customer' });
  }
};

const updateCustomer = async (req, res) => {
  const { name, email, phone, company, status } = req.body;
  try {
    const customer = await Customer.findByIdAndUpdate(
      req.params.id,
      { name, email, phone, company, status },
      { new: true }
    );
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json(customer);
  } catch (error) {
    res.status(500).json({ message: 'Server error updating customer' });
  }
};

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findByIdAndDelete(req.params.id);
    if (!customer) return res.status(404).json({ message: 'Customer not found' });
    res.json({ message: 'Customer deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting customer' });
  }
};

const getStats = async (req, res) => {
  try {
    const total = await Customer.countDocuments();
    const active = await Customer.countDocuments({ status: 'active' });
    res.json({ total, active });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching customer stats' });
  }
};

module.exports = { getCustomers, createCustomer, updateCustomer, deleteCustomer, getStats };
