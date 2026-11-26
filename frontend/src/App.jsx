import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider, client } from './graphql/apolloClient';

import Header            from './components/Header';
import Hero              from './components/Hero';
import ProductCategories from './components/ProductCategories';
import Footer            from './components/Footer';
import ContactPage       from './components/ContactPage';
import ProductsPage      from './components/ProductsPage';
import { BrandsPage, ProjectsPage, ServicesPage, SolutionsPage } from './components/InfoPages';

import AdminApp from './admin/AdminApp';

import './index.css';

const HomePage = () => (
  <>
    <Header />
    <main>
      <Hero />
      <ProductCategories />
    </main>
    <Footer />
  </>
);

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/"           element={<HomePage />} />
          <Route path="/products"   element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductsPage />} />
          <Route path="/solutions/*" element={<SolutionsPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/projects/*" element={<ProjectsPage />} />
          <Route path="/services/*" element={<ServicesPage />} />
          <Route path="/contact"    element={<ContactPage />} />
          <Route path="/admin"      element={<AdminApp />} />
          <Route path="/admin/*"    element={<AdminApp />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
