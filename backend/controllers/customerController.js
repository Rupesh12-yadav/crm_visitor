const Customer = require('../models/Customer');

const getCustomers = async (req, res) => {
  const { search } = req.query;
  let query = {};
  if (search) {
    query = { $or: [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { company: { $regex: search, $options: 'i' } }
    ]};
  }
  const customers = await Customer.find(query).sort({ createdAt: -1 });
  res.json(customers);
};

const createCustomer = async (req, res) => {
  const { name, email, phone, company, status } = req.body;
  if (!name || !email || !phone) {
    return res.status(400).json({ message: 'Name, email and phone are required' });
  }
  const exists = await Customer.findOne({ email });
  if (exists) return res.status(400).json({ message: 'Email already exists' });
  
  const customer = await Customer.create({ name, email, phone, company, status });
  res.status(201).json(customer);
};

const updateCustomer = async (req, res) => {
  const { name, email, phone, company, status } = req.body;
  const customer = await Customer.findByIdAndUpdate(
    req.params.id,
    { name, email, phone, company, status },
    { new: true }
  );
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json(customer);
};

const deleteCustomer = async (req, res) => {
  const customer = await Customer.findByIdAndDelete(req.params.id);
  if (!customer) return res.status(404).json({ message: 'Customer not found' });
  res.json({ message: 'Customer deleted' });
};

const getStats = async (req, res) => {
  const total = await Customer.countDocuments();
  const active = await Customer.countDocuments({ status: 'active' });
  res.json({ total, active });
};

module.exports = { getCustomers, createCustomer, updateCustomer, deleteCustomer, getStats };
