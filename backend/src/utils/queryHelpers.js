const mongoose = require('mongoose');

const escapeRegExp = (value) => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const encodeCursor = (doc) => {
  if (!doc || !doc._id || !doc.createdAt) return null;
  const payload = {
    t: new Date(doc.createdAt).toISOString(),
    id: String(doc._id),
  };
  return Buffer.from(JSON.stringify(payload)).toString('base64url');
};

const decodeCursor = (cursor) => {
  if (!cursor || typeof cursor !== 'string') return null;
  try {
    const parsed = JSON.parse(Buffer.from(cursor, 'base64url').toString('utf8'));
    if (!parsed.t || !parsed.id || !mongoose.Types.ObjectId.isValid(parsed.id)) {
      return null;
    }
    const date = new Date(parsed.t);
    if (Number.isNaN(date.getTime())) return null;
    return {
      createdAt: date,
      id: new mongoose.Types.ObjectId(parsed.id),
    };
  } catch {
    return null;
  }
};

const buildCursorCondition = (cursor) => {
  const decoded = decodeCursor(cursor);
  if (!decoded) return null;
  return {
    $or: [
      { createdAt: { $lt: decoded.createdAt } },
      { createdAt: decoded.createdAt, _id: { $lt: decoded.id } },
    ],
  };
};

const mergeConditions = (...conditions) => {
  const valid = conditions.filter((c) => c && Object.keys(c).length > 0);
  if (valid.length === 0) return {};
  if (valid.length === 1) return valid[0];
  return { $and: valid };
};

const CASE_INSENSITIVE_COLLATION = { locale: 'en', strength: 2 };

const buildPrefixRange = (term) => ({ $gte: term, $lt: `${term}\uffff` });

const buildProductFilter = ({ category, search, inStock } = {}) => {
  const filter = {};
  if (category && category !== 'all') filter.category = category;
  if (typeof inStock === 'boolean') filter.inStock = inStock;

  const term = search?.trim();
  if (term) {
    if (term.length < 3) {
      // Uses case-insensitive B-tree collation indexes on name/brand: O(log n)
      const range = buildPrefixRange(term);
      filter.$or = [{ name: range }, { brand: range }];
    } else {
      filter.$text = { $search: term };
    }
  }
  return filter;
};

const buildEnquiryFilter = ({ status, search } = {}) => {
  const filter = {};
  if (status && status !== 'all') filter.status = status;

  const term = search?.trim();
  if (term) {
    const isPhoneOrShort = term.length < 4 || /^\+?\d[\d\s-]*$/.test(term);
    if (isPhoneOrShort) {
      // Uses case-insensitive B-tree collation indexes on name/email/phone: O(log n)
      const range = buildPrefixRange(term);
      filter.$or = [{ name: range }, { email: range }, { phone: range }];
    } else {
      filter.$text = { $search: term };
    }
  }
  return filter;
};

const paginateWithCursor = async (Model, baseFilter, { cursor, limit = 20, select } = {}) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const cursorCond = buildCursorCondition(cursor);
  const queryFilter = mergeConditions(baseFilter, cursorCond);

  let query = Model.find(queryFilter);
  if (baseFilter?.$or) query = query.collation(CASE_INSENSITIVE_COLLATION);
  if (select) query = query.select(select);

  const docs = await query
    .sort({ createdAt: -1, _id: -1 })
    .limit(safeLimit + 1)
    .lean();

  const hasNextPage = docs.length > safeLimit;
  if (hasNextPage) docs.pop();

  const nextCursor = hasNextPage && docs.length > 0
    ? encodeCursor(docs[docs.length - 1])
    : null;

  return {
    items: docs,
    pageInfo: {
      hasNextPage,
      nextCursor,
      limit: safeLimit,
    },
  };
};

module.exports = {
  escapeRegExp,
  encodeCursor,
  decodeCursor,
  buildCursorCondition,
  mergeConditions,
  buildProductFilter,
  buildEnquiryFilter,
  paginateWithCursor,
};
