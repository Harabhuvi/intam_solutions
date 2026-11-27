const mongoose = require('mongoose');

const productSchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    description: { type: String },
    category:    { type: String, required: true },
    image:       { type: String },
    brand:       { type: String },
    price:       { type: Number },
    inStock:     { type: Boolean, default: true },
  },
  { timestamps: true }
);

productSchema.index({ category: 1, createdAt: -1, _id: -1 });
productSchema.index({ createdAt: -1, _id: -1 });
productSchema.index({ inStock: 1, category: 1, createdAt: -1 });
productSchema.index({ name: 1 }, { collation: { locale: 'en', strength: 2 } });
productSchema.index({ brand: 1 }, { collation: { locale: 'en', strength: 2 } });
productSchema.index({ name: 'text', brand: 'text', description: 'text' }, { name: 'product_text' });

module.exports = mongoose.model('Product', productSchema);
