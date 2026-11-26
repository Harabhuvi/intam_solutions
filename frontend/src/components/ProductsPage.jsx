import React, { useState, useEffect, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { GET_CATEGORIES, GET_PRODUCTS_BY_CATEGORY, GET_PRODUCTS } from '../graphql/queries';
import { useProductSearch } from '../graphql/useProductSearch';
import Header from './Header';
import Footer from './Footer';
import './ProductsPage.css';

const ProductCard = ({ product, onSelect }) => (
  <div className="pc-card" onClick={() => onSelect(product)}>
    <div className="pc-card__img-wrap">
      <img
        src={product.image || `https://picsum.photos/seed/${product.name}/400/300`}
        alt={product.name}
        className="pc-card__img"
        loading="lazy"
      />
    </div>
    <div className="pc-card__body">
      <span className="pc-card__brand">{product.brand}</span>
      <h3 className="pc-card__name">{product.name}</h3>
      <p className="pc-card__desc">{product.description?.slice(0, 90)}…</p>
      <div className="pc-card__footer">
        <button className="pc-card__btn">View Details →</button>
      </div>
    </div>
  </div>
);

const ProductModal = ({ product, onClose }) => {
  if (!product) return null;
  return (
    <div className="pm-overlay" onClick={onClose}>
      <div className="pm" onClick={e => e.stopPropagation()}>
        <button className="pm__close" onClick={onClose}>✕</button>
        <div className="pm__grid">
          <div className="pm__img-wrap">
            <img
              src={product.image || `https://picsum.photos/seed/${product.name}/600/450`}
              alt={product.name}
              className="pm__img"
            />
            {!product.inStock && <div className="pm__oos-banner">Currently Out of Stock</div>}
          </div>
          <div className="pm__info">
            <span className="pm__brand">{product.brand}</span>
            <h2 className="pm__name">{product.name}</h2>
            <p className="pm__desc">{product.description}</p>
            <div className="pm__tags">
              <span className="pm__tag">📦 {product.category}</span>
            </div>
            <div className="pm__actions">
              <a href="/contact" className="btn btn--primary">Get Quote →</a>
              <a href="https://wa.me/919845012345" target="_blank" rel="noreferrer"
                 className="btn btn--wa">💬 WhatsApp</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const urlQ = new URLSearchParams(location.search).get('q') || '';

  const [activeSlug, setActiveSlug] = useState(slug || 'all');
  const [search, setSearch]         = useState(urlQ);
  const [selected, setSelected]     = useState(null);


  const { search: searchFn, ready: searchReady } = useProductSearch();


  useEffect(() => {
    const q = new URLSearchParams(location.search).get('q') || '';
    setSearch(q);
  }, [location.search]);


  useEffect(() => {
    setActiveSlug(slug || 'all');
  }, [slug]);

  const selectCategory = (categorySlug) => {
    setActiveSlug(categorySlug);
    navigate(categorySlug === 'all' ? '/products' : `/products/${categorySlug}`);
  };

  const { data: catData } = useQuery(GET_CATEGORIES);
  const categories = catData?.categories || [];


  const { data: byCatData, loading: catLoading } = useQuery(
    GET_PRODUCTS_BY_CATEGORY,
    { variables: { category: activeSlug }, skip: activeSlug === 'all' }
  );
  const { data: allData, loading: allLoading } = useQuery(
    GET_PRODUCTS, { skip: activeSlug !== 'all' }
  );

  const loading  = catLoading || allLoading;
  const rawProds = activeSlug === 'all'
    ? (allData?.products || [])
    : (byCatData?.productsByCategory || []);


  const products = useMemo(() => {
    const q = search.trim();
    if (!q) return rawProds;
    // searchFn queries the global inverted index → no linear scan
    const hits = searchFn(q, rawProds.length); // returns up to rawProds.length results
    // Intersect with rawProds so category filter + search compose correctly
    const hitSet = new Set(hits.map(p => p.id));
    return rawProds.filter(p => hitSet.has(p.id)); // O(n) render-time, not search-time
  }, [search, rawProds, searchFn]);


  const activeCat = categories.find(c => c.slug === activeSlug);

  return (
    <>
      <Header />
      <main className="products-page">
        {}
        <div className="pp__banner">
          <div className="container">
            <h1 className="pp__banner-title">
              {activeCat ? activeCat.name : 'All Products'}
            </h1>
            <p className="pp__banner-sub">
              {activeCat?.description || 'Browse our complete range of electronic security and automation products.'}
            </p>
          </div>
        </div>

        <div className="container pp__layout">
          {}
          <aside className="pp__sidebar">
            <h3 className="pp__sidebar-title">Categories</h3>
            <ul className="pp__cat-list">
              <li>
                <button
                  className={`pp__cat-btn ${activeSlug === 'all' ? 'pp__cat-btn--active' : ''}`}
                  onClick={() => selectCategory('all')}
                >
                  🗂 All Products
                </button>
              </li>
              {categories.map(cat => (
                <li key={cat.id}>
                  <button
                    className={`pp__cat-btn ${activeSlug === cat.slug ? 'pp__cat-btn--active' : ''}`}
                    onClick={() => selectCategory(cat.slug)}
                  >
                    {cat.icon} {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </aside>

          {}
          <div className="pp__main">
            {}
            <div className="pp__toolbar">
              <p className="pp__count">
                {loading ? 'Loading…' : `${products.length} product${products.length !== 1 ? 's' : ''} found`}
              </p>
              <div className="pp__search-wrap">
                <span>🔍</span>
                <input
                  type="search"
                  className="pp__search"
                  placeholder="Search products, brands…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
            </div>

            {}
            {loading ? (
              <div className="pp__loading">
                <div className="pp__spinner" />
                <p>Loading products…</p>
              </div>
            ) : products.length === 0 ? (
              <div className="pp__empty">
                <p className="pp__empty-icon">📦</p>
                <p>No products found.</p>
              </div>
            ) : (
              <div className="pp__grid">
                {products.map(p => (
                  <ProductCard key={p.id} product={p} onSelect={setSelected} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />

      {}
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default ProductsPage;
