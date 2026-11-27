const { gql } = require('graphql-tag');

const productTypeDefs = gql`
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

  type ProductConnection {
    items: [Product!]!
    pageInfo: PageInfo!
  }

  extend type Query {
    products: [Product!]!
    productsConnection(category: String, search: String, after: String, limit: Int): ProductConnection!
    product(id: ID!): Product
    productsByCategory(category: String!): [Product!]!
    categories: [Category!]!
    category(slug: String!): Category
  }

  extend type Mutation {
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
  }
`;

module.exports = productTypeDefs;

