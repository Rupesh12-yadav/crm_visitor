const express = require('express');
const router = express.Router();
const { getCustomers, createCustomer, updateCustomer, deleteCustomer, getStats } = require('../controllers/customerController');
const auth = require('../middleware/auth');

router.get('/', auth, getCustomers);
router.get('/stats', auth, getStats);
router.post('/', auth, createCustomer);
router.put('/:id', auth, updateCustomer);
router.delete('/:id', auth, deleteCustomer);

module.exports = router;
