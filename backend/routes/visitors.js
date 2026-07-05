const express = require('express');
const router = express.Router();
const { checkIn, checkOut, getHistory, getTodayStats } = require('../controllers/visitorController');
const auth = require('../middleware/auth');

router.post('/checkin', auth, checkIn);
router.put('/checkout/:id', auth, checkOut);
router.get('/history', auth, getHistory);
router.get('/today', auth, getTodayStats);

module.exports = router;
