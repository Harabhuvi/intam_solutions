const validate = (schema) => (req, res, next) => {
  const { error } = schema(req.body);
  if (error) return res.status(400).json({ success: false, error: error });
  next();
};

const productSchema = (body) => {
  const { name, category } = body;
  if (!name?.trim())     return { error: 'name is required.' };
  if (!category?.trim()) return { error: 'category is required.' };
  return {};
};

const categorySchema = (body) => {
  const { name, slug } = body;
  if (!name?.trim()) return { error: 'name is required.' };
  if (!slug?.trim()) return { error: 'slug is required.' };
  return {};
};

const orderSchema = (body) => {
  const { customerName, customerEmail, items } = body;
  if (!customerName?.trim())  return { error: 'customerName is required.' };
  if (!customerEmail?.trim()) return { error: 'customerEmail is required.' };
  if (!Array.isArray(items) || items.length === 0) return { error: 'items array is required.' };
  return {};
};

const userSchema = (body) => {
  const { name, email } = body;
  if (!name?.trim())  return { error: 'name is required.' };
  if (!email?.trim()) return { error: 'email is required.' };
  return {};
};

module.exports = { validate, productSchema, categorySchema, orderSchema, userSchema };
