import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ApolloProvider, client } from './graphql/apolloClient';

/* Public pages */
import Header            from './components/Header';
import Hero              from './components/Hero';
import ProductCategories from './components/ProductCategories';
import Footer            from './components/Footer';
import ContactPage       from './components/ContactPage';
import ProductsPage      from './components/ProductsPage';

/* Admin */
import AdminApp from './admin/AdminApp';

import './index.css';

/* ── Public home page ─────────────────────────────────── */
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

/* ── App with routing ─────────────────────────────────── */
function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/"           element={<HomePage />} />
          <Route path="/products"   element={<ProductsPage />} />
          <Route path="/products/:slug" element={<ProductsPage />} />
          <Route path="/contact"    element={<ContactPage />} />
          <Route path="/admin"      element={<AdminApp />} />
          <Route path="/admin/*"    element={<AdminApp />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
