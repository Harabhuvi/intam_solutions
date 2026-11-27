const { gql } = require('graphql-tag');

const footerTypeDefs = gql`
  type FooterLink {
    label: String!
    href: String!
  }

  type FooterSocialLink {
    label: String!
    href: String!
    icon: String
  }

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

  input FooterLinkInput {
    label: String!
    href: String!
  }

  input FooterSocialLinkInput {
    label: String!
    href: String!
    icon: String
  }

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

  extend type Query {
    footerContent: FooterContent!
  }

  extend type Mutation {
    updateFooterContent(content: FooterContentInput!): FooterContent!
  }
`;

module.exports = footerTypeDefs;

