import { gql } from '@apollo/client';

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories { id name slug description image icon }
  }
`;
export const ADD_CATEGORY = gql`
  mutation AddCategory($name: String!, $slug: String!, $description: String, $image: String, $icon: String) {
    addCategory(name: $name, slug: $slug, description: $description, image: $image, icon: $icon) {
      id name slug description image icon
    }
  }
`;
export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $name: String!, $slug: String!, $description: String, $image: String, $icon: String) {
    updateCategory(id: $id, name: $name, slug: $slug, description: $description, image: $image, icon: $icon) {
      id name slug description image icon
    }
  }
`;
export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) { deleteCategory(id: $id) }
`;
export const GET_FOOTER_CONTENT = gql`
  query GetFooterContent {
    footerContent {
      ctaTitle ctaDescription ctaContactLabel ctaContactHref whatsappLabel whatsappHref
      brandName tagline brandDescription quickLinksTitle quickLinks { label href }
      servicesTitle serviceLinks { label href } contactTitle phone phoneHref email emailHref
      address socialLinks { label href icon } copyrightText
    }
  }
`;
export const UPDATE_FOOTER_CONTENT = gql`
  mutation UpdateFooterContent($content: FooterContentInput!) {
    updateFooterContent(content: $content) {
      ctaTitle ctaDescription ctaContactLabel ctaContactHref whatsappLabel whatsappHref
      brandName tagline brandDescription quickLinksTitle quickLinks { label href }
      servicesTitle serviceLinks { label href } contactTitle phone phoneHref email emailHref
      address socialLinks { label href icon } copyrightText
    }
  }
`;
export const GET_PRODUCTS = gql`
  query GetProducts {
    products { id name description category image brand price inStock }
  }
`;
export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($category: String!) {
    productsByCategory(category: $category) { id name description category image price brand inStock }
  }
`;
export const ADD_PRODUCT = gql`
  mutation AddProduct($name: String!, $description: String, $category: String!, $image: String, $brand: String, $price: Float, $inStock: Boolean) {
    addProduct(name: $name, description: $description, category: $category, image: $image, brand: $brand, price: $price, inStock: $inStock) { id }
  }
`;
export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $name: String!, $description: String, $category: String!, $image: String, $brand: String, $price: Float, $inStock: Boolean) {
    updateProduct(id: $id, name: $name, description: $description, category: $category, image: $image, brand: $brand, price: $price, inStock: $inStock) { id }
  }
`;
export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: ID!) { deleteProduct(id: $id) }
`;
export const SUBMIT_CONTACT = gql`
  mutation SubmitContact($name: String!, $email: String!, $phone: String, $message: String!) {
    submitContactQuery(name: $name, email: $email, phone: $phone, message: $message) { id status }
  }
`;

export const ADMIN_LOGIN = gql`
  mutation AdminLogin($email: String!, $password: String!) {
    adminLogin(email: $email, password: $password) {
      token
      admin { id name email role lastLogin }
    }
  }
`;

export const GET_ENQUIRIES = gql`
  query GetEnquiries($status: String, $search: String) {
    contactQueries(status: $status, search: $search) {
      id name email phone message status createdAt updatedAt
    }
  }
`;
export const GET_ENQUIRY_STATS = gql`
  query GetEnquiryStats {
    enquiryStats { total pending resolved todayCount }
  }
`;
export const GET_ADMIN_PROFILE = gql`
  query AdminProfile {
    adminProfile { id name email role lastLogin }
  }
`;
export const UPDATE_ENQUIRY_STATUS = gql`
  mutation UpdateEnquiryStatus($id: ID!, $status: String!) {
    updateEnquiryStatus(id: $id, status: $status) { id status updatedAt }
  }
`;
export const DELETE_ENQUIRY = gql`
  mutation DeleteEnquiry($id: ID!) {
    deleteEnquiry(id: $id)
  }
`;
