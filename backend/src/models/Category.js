const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name:        { type: String, required: true, trim: true },
    slug:        { type: String, required: true, unique: true },
    description: { type: String },
    image:       { type: String },
    icon:        { type: String },
  },
  { timestamps: true }
);

categorySchema.index({ name: 1 });

module.exports = mongoose.model('Category', categorySchema);
