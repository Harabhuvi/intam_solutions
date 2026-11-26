const Admin = require('../models/Admin');

const seedAdmin = async () => {
  const count = await Admin.countDocuments();
  if (count > 0) return;

  const admin = new Admin({
    name:     'Super Admin',
    email:    process.env.ADMIN_DEFAULT_EMAIL  || 'admin@intamsolutions.com',
    password: process.env.ADMIN_DEFAULT_PASSWORD || 'Admin@123',
    role:     'superadmin',
  });
  await admin.save();
  console.log('✅ Default admin seeded →', admin.email);
};

module.exports = seedAdmin;
