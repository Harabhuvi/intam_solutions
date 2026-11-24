const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String },
    category: { type: String, required: true },
    image: { type: String },
    brand: { type: String },
    price: { type: Number },
    inStock: { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
