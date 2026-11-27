const { paginateWithCursor } = require('./queryHelpers');

const paginateModel = async (Model, filter, { cursor, limit = 20, select } = {}) => {
  const { items, pageInfo } = await paginateWithCursor(Model, filter, { cursor, limit, select });
  return { data: items, pageInfo };
};

module.exports = { paginateModel };
