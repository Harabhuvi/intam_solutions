const { gql } = require('graphql-tag');

const baseTypeDefs = gql`
  type PageInfo {
    hasNextPage: Boolean!
    nextCursor: String
    limit: Int!
  }

  type Query {
    _empty: String
  }

  type Mutation {
    _empty: String
  }
`;

module.exports = baseTypeDefs;

