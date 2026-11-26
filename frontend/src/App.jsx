import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider, client } from './graphql/apolloClient';

import Header            from './components/pages/Header';
import Hero              from './components/pages/Hero';
import ProductCategories from './components/pages/ProductCategories';
import Footer            from './components/pages/Footer';
import ContactPage       from './components/pages/ContactPage';
import ProductsPage      from './components/pages/ProductsPage';
import { AboutPage, BrandsPage, ProjectsPage, ServicesPage, SolutionsPage } from './components/pages/InfoPages';
import WhatsAppFAB       from './components/pages/WhatsAppFAB';

import AdminApp from './admin/AdminApp';

import './index.css';

const HomePage = () => (
  <div className="home-page">
    <Header overlay />
    <main>
      <Hero />
      <ProductCategories />
    </main>
    <Footer />
  </div>
);

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/"           element={<HomePage />} />
          <Route path="/products"   element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductsPage />} />
          <Route path="/solutions/*" element={<SolutionsPage />} />
          <Route path="/brands" element={<BrandsPage />} />
          <Route path="/projects/*" element={<ProjectsPage />} />
          <Route path="/services/*" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact"    element={<ContactPage />} />
          <Route path="/admin"      element={<AdminApp />} />
          <Route path="/admin/*"    element={<AdminApp />} />
        </Routes>
        <WhatsAppFAB />
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
