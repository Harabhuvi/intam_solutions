const authResolvers = require('./auth.resolvers');
const enquiryResolvers = require('./enquiry.resolvers');
const footerResolvers = require('./footer.resolvers');
const productResolvers = require('./product.resolvers');

const mergeResolvers = (...resolverMaps) =>
  resolverMaps.reduce((merged, resolverMap) => {
    for (const [typeName, fields] of Object.entries(resolverMap)) {
      merged[typeName] = { ...merged[typeName], ...fields };
    }
    return merged;
  }, {});

module.exports = mergeResolvers(
  authResolvers,
  enquiryResolvers,
  footerResolvers,
  productResolvers
);