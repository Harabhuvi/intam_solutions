const { GraphQLError } = require('graphql');
const { requireAdmin } = require('../../services/auth.service');

const fail = (message, code = 'BAD_USER_INPUT') => {
  throw new GraphQLError(message, { extensions: { code } });
};

const requireAuthenticatedAdmin = (admin) => {
  try {
    requireAdmin(admin);
  } catch {
    fail('Admin login required.', 'UNAUTHENTICATED');
  }
  if (!['admin', 'superadmin'].includes(admin.role)) {
    fail('You do not have permission to perform this action.', 'FORBIDDEN');
  }
};

const normalizeDatabaseError = (error) => {
  if (error instanceof GraphQLError) return error;
  if (error?.name === 'ValidationError' || error?.name === 'CastError' || error?.code === 11000) {
    return new GraphQLError('The supplied data is invalid.', {
      extensions: { code: 'BAD_USER_INPUT' },
    });
  }
  return error;
};

const wrapResolvers = (resolverMap) =>
  Object.fromEntries(
    Object.entries(resolverMap).map(([typeName, fields]) => [
      typeName,
      Object.fromEntries(
        Object.entries(fields).map(([fieldName, resolver]) => [
          fieldName,
          async (...args) => {
            try {
              return await resolver(...args);
            } catch (error) {
              throw normalizeDatabaseError(error);
            }
          },
        ])
      ),
    ])
  );

module.exports = { fail, requireAuthenticatedAdmin, wrapResolvers };
