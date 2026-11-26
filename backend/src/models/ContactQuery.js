const mongoose = require('mongoose');

const contactQuerySchema = new mongoose.Schema(
  {
    name:    { type: String, required: true },
    email:   { type: String, required: true },
    phone:   { type: String },
    message: { type: String, required: true },
    status:  {
      type: String,
      default: 'pending',
      enum: ['pending', 'resolved', 'in-progress'],
    },
  },
  { timestamps: true }
);

contactQuerySchema.index({ status: 1, createdAt: -1, _id: -1 });
contactQuerySchema.index({ createdAt: -1, _id: -1 });
contactQuerySchema.index(
  { name: 'text', email: 'text', phone: 'text', message: 'text' },
  { name: 'contactquery_text' }
);

module.exports = mongoose.model('ContactQuery', contactQuerySchema);
