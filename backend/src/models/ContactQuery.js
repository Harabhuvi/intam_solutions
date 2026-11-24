const mongoose = require('mongoose');

const contactQuerySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String },
    message: { type: String, required: true },
    status: { type: String, default: 'pending', enum: ['pending', 'resolved'] },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ContactQuery', contactQuerySchema);
