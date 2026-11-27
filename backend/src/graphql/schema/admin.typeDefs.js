const { gql } = require('graphql-tag');

const adminTypeDefs = gql`
  type ContactQuery {
    id: ID!
    name: String!
    email: String!
    phone: String
    message: String!
    status: String
    createdAt: String
    updatedAt: String
  }

  type Admin {
    id: ID!
    name: String!
    email: String!
    role: String!
    lastLogin: String
    createdAt: String
  }

  type AuthPayload {
    token: String!
    admin: Admin!
  }

  type EnquiryStats {
    total: Int!
    pending: Int!
    resolved: Int!
    todayCount: Int!
  }

  type ContactQueryConnection {
    items: [ContactQuery!]!
    pageInfo: PageInfo!
  }

  type QueryProfile {
    label: String!
    executionTimeMillis: Int!
    totalKeysExamined: Int!
    totalDocsExamined: Int!
    nReturned: Int!
    stages: [String!]!
    indexesUsed: [String!]!
    isCollectionScan: Boolean!
  }

  extend type Query {
    contactQueries(status: String, search: String): [ContactQuery!]!
    contactQueriesConnection(status: String, search: String, after: String, limit: Int): ContactQueryConnection!
    contactQuery(id: ID!): ContactQuery
    enquiryStats: EnquiryStats!
    adminProfile: Admin
    queryProfiles: [QueryProfile!]!
  }

  extend type Mutation {
    submitContactQuery(
      name: String!
      email: String!
      phone: String
      message: String!
    ): ContactQuery!

    adminLogin(email: String!, password: String!): AuthPayload!
    updateEnquiryStatus(id: ID!, status: String!): ContactQuery!
    deleteEnquiry(id: ID!): Boolean!
  }
`;

module.exports = adminTypeDefs;
