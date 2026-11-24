const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema(
  {
    name:     { type: String, required: true },
    email:    { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role:     { type: String, default: 'admin', enum: ['admin', 'superadmin'] },
    isActive: { type: Boolean, default: true },
    lastLogin:{ type: Date },
  },
  { timestamps: true }
);

/* Hash password before save */
adminSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

/* Compare password helper */
adminSchema.methods.matchPassword = async function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
