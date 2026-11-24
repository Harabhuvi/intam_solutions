const { gql } = require('graphql-tag');

const typeDefs = gql`
  # ─── Shared types ────────────────────────────────────────
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

  # ─── Admin types ──────────────────────────────────────────
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

  # ─── Queries ──────────────────────────────────────────────
  type Query {
    # Public
    products: [Product!]!
    product(id: ID!): Product
    productsByCategory(category: String!): [Product!]!
    categories: [Category!]!
    category(slug: String!): Category
    footerContent: FooterContent!

    # Admin-protected
    contactQueries(status: String, search: String): [ContactQuery!]!
    contactQuery(id: ID!): ContactQuery
    enquiryStats: EnquiryStats!
    adminProfile: Admin
  }

  # ─── Mutations ────────────────────────────────────────────
  type Mutation {
    # Public
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

    # Admin Auth
    adminLogin(email: String!, password: String!): AuthPayload!

    # Admin-protected enquiry management
    updateEnquiryStatus(id: ID!, status: String!): ContactQuery!
    deleteEnquiry(id: ID!): Boolean!
  }
`;

module.exports = typeDefs;
