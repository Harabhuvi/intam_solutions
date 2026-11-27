const Product = require('../../models/Product');
const Category = require('../../models/Category');
const cache = require('../../config/redis');
const { buildProductFilter, paginateWithCursor } = require('../../utils/queryHelpers');
const { fail, requireAuthenticatedAdmin, wrapResolvers } = require('./resolverUtils');

module.exports = wrapResolvers({
  Product: {
    id: (product) => String(product._id || product.id),
  },
  Category: {
    id: (category) => String(category._id || category.id),
  },
  Query: {
    products: () => Product.find().sort({ createdAt: -1, _id: -1 }).limit(100).lean(),
    productsConnection: (_, { category, search, after, limit }) => {
      const filter = buildProductFilter({ category, search });
      return paginateWithCursor(Product, filter, { cursor: after, limit });
    },
    product: (_, { id }) => Product.findById(id).lean(),
    productsByCategory: (_, { category }) =>
      Product.find({ category }).sort({ createdAt: -1, _id: -1 }).limit(100).lean(),
    categories: async () => {
      const { data } = await cache.getOrSet('dashboard:categories', 300, () =>
        Category.find().sort({ name: 1 }).lean()
      );
      return data;
    },
    category: (_, { slug }) => Category.findOne({ slug }).lean(),
  },
  Mutation: {
    addProduct: async (_, args, { admin }) => {
      requireAuthenticatedAdmin(admin);
      const saved = await new Product(args).save();
      await cache.del('dashboard:summary');
      return saved;
    },

    updateProduct: async (_, { id, ...updates }, { admin }) => {
      requireAuthenticatedAdmin(admin);
      const product = await Product.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
      if (!product) fail('Product not found.', 'NOT_FOUND');
      await cache.del('dashboard:summary');
      return product;
    },

    deleteProduct: async (_, { id }, { admin }) => {
      requireAuthenticatedAdmin(admin);
      const product = await Product.findByIdAndDelete(id);
      if (!product) fail('Product not found.', 'NOT_FOUND');
      await cache.del('dashboard:summary');
      return true;
    },

    addCategory: async (_, args, { admin }) => {
      requireAuthenticatedAdmin(admin);
      const slug = (args.slug || args.name || '')
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
      const saved = await new Category({ ...args, slug }).save();
      await cache.del('dashboard:categories', 'dashboard:summary');
      return saved;
    },

    updateCategory: async (_, { id, ...updates }, { admin }) => {
      requireAuthenticatedAdmin(admin);
      if (updates.slug) {
        updates.slug = updates.slug
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '');
      }
      const category = await Category.findByIdAndUpdate(id, updates, {
        new: true,
        runValidators: true,
      });
      if (!category) fail('Category not found.', 'NOT_FOUND');
      await cache.del('dashboard:categories', 'dashboard:summary');
      return category;
    },

    deleteCategory: async (_, { id }, { admin }) => {
      requireAuthenticatedAdmin(admin);
      const category = await Category.findByIdAndDelete(id);
      if (!category) fail('Category not found.', 'NOT_FOUND');
      await cache.del('dashboard:categories', 'dashboard:summary');
      return true;
    },
  },
});
