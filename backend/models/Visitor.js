const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  visitorName: { type: String, required: true },
  phone: { type: String, required: true },
  personToMeet: { type: String, required: true },
  purpose: { type: String, required: true },
  checkInTime: { type: Date, default: Date.now },
  checkOutTime: { type: Date }
}, { timestamps: true });

module.exports = mongoose.model('Visitor', visitorSchema);
