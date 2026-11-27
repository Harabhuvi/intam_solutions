const { gql } = require('graphql-tag');

const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    description: String
    category: String!
    image: String
    brand: String
    price: Float
    inStock: Boolean
    createdAt: String
  }

  type Category {
    id: ID!
    name: String!
    slug: String!
    description: String
    image: String
    icon: String
  }

  type FooterLink { label: String!, href: String! }
  type FooterSocialLink { label: String!, href: String!, icon: String }
  type FooterContent {
    ctaTitle: String
    ctaDescription: String
    ctaContactLabel: String
    ctaContactHref: String
    whatsappLabel: String
    whatsappHref: String
    brandName: String
    tagline: String
    brandDescription: String
    quickLinksTitle: String
    quickLinks: [FooterLink!]!
    servicesTitle: String
    serviceLinks: [FooterLink!]!
    contactTitle: String
    phone: String
    phoneHref: String
    email: String
    emailHref: String
    address: String
    socialLinks: [FooterSocialLink!]!
    copyrightText: String
  }

  input FooterLinkInput { label: String!, href: String! }
  input FooterSocialLinkInput { label: String!, href: String!, icon: String }
  input FooterContentInput {
    ctaTitle: String
    ctaDescription: String
    ctaContactLabel: String
    ctaContactHref: String
    whatsappLabel: String
    whatsappHref: String
    brandName: String
    tagline: String
    brandDescription: String
    quickLinksTitle: String
    quickLinks: [FooterLinkInput!]
    servicesTitle: String
    serviceLinks: [FooterLinkInput!]
    contactTitle: String
    phone: String
    phoneHref: String
    email: String
    emailHref: String
    address: String
    socialLinks: [FooterSocialLinkInput!]
    copyrightText: String
  }

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

  type PageInfo {
    hasNextPage: Boolean!
    nextCursor: String
    limit: Int!
  }

  type ProductConnection {
    items: [Product!]!
    pageInfo: PageInfo!
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

  type Query {
    products: [Product!]!
    productsConnection(category: String, search: String, after: String, limit: Int): ProductConnection!
    product(id: ID!): Product
    productsByCategory(category: String!): [Product!]!
    categories: [Category!]!
    category(slug: String!): Category
    footerContent: FooterContent!

    contactQueries(status: String, search: String): [ContactQuery!]!
    contactQueriesConnection(status: String, search: String, after: String, limit: Int): ContactQueryConnection!
    contactQuery(id: ID!): ContactQuery
    enquiryStats: EnquiryStats!
    adminProfile: Admin
    queryProfiles: [QueryProfile!]!
  }

  type Mutation {
    addProduct(
      name: String!
      description: String
      category: String!
      image: String
      brand: String
      price: Float
      inStock: Boolean
    ): Product!

    updateProduct(
      id: ID!
      name: String!
      description: String
      category: String!
      image: String
      brand: String
      price: Float
      inStock: Boolean
    ): Product!

    deleteProduct(id: ID!): Boolean!

    addCategory(
      name: String!
      slug: String!
      description: String
      image: String
      icon: String
    ): Category!

    updateFooterContent(content: FooterContentInput!): FooterContent!

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

module.exports = typeDefs;
