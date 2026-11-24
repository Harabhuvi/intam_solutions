import { gql } from '@apollo/client';

/* ── Public queries ──────────────────────────────────── */
export const GET_CATEGORIES = gql`
  query GetCategories {
    categories { id name slug description image icon }
  }
`;
export const GET_PRODUCTS = gql`
  query GetProducts {
    products { id name description category image brand price inStock }
  }
`;
export const GET_PRODUCTS_BY_CATEGORY = gql`
  query GetProductsByCategory($category: String!) {
    productsByCategory(category: $category) { id name description image price brand }
  }
`;
export const SUBMIT_CONTACT = gql`
  mutation SubmitContact($name: String!, $email: String!, $phone: String, $message: String!) {
    submitContactQuery(name: $name, email: $email, phone: $phone, message: $message) { id status }
  }
`;

/* ── Admin Auth ───────────────────────────────────────── */
export const ADMIN_LOGIN = gql`
  mutation AdminLogin($email: String!, $password: String!) {
    adminLogin(email: $email, password: $password) {
      token
      admin { id name email role lastLogin }
    }
  }
`;

/* ── Admin Enquiries ──────────────────────────────────── */
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
