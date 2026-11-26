import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, Box, CircleHelp, Search, ShieldCheck, X } from 'lucide-react';
import { GET_CATEGORIES, GET_PRODUCTS_BY_CATEGORY, GET_PRODUCTS } from '../../graphql/queries';
import { useProductSearch } from '../../graphql/useProductSearch';
import useWhatsappSettings from '../../hooks/useWhatsappSettings';
import Header from './Header';
import Footer from './Footer';
import { Button } from '../ui/button';
import '../style/ProductsPage.css';

const ProductCard = ({ product, onSelect }) => {
  const price = Number.isFinite(product.price)
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)
    : null;

  return (
    <article className="pc-card">
      <button
        className="pc-card__select"
        type="button"
        onClick={() => onSelect(product)}
        aria-label={`View details for ${product.name}`}
      >
        <span className="pc-card__top">
          <span><span className="pc-card__top-dot" /> PRODUCT CATALOG</span>
          <span className="pc-card__top-icon" aria-hidden="true"><ShieldCheck size={15} /></span>
        </span>
        <span className="pc-card__media">
          {product.image ? (
            <img src={product.image} alt={product.name} className="pc-card__img" loading="lazy" />
          ) : (
            <span className="pc-card__placeholder" aria-hidden="true"><Box size={42} strokeWidth={1.35} /></span>
          )}
          <span className={`pc-card__stock ${product.inStock ? 'pc-card__stock--available' : 'pc-card__stock--unavailable'}`}>
            <span aria-hidden="true" />{product.inStock ? 'In stock' : 'Check availability'}
          </span>
        </span>
        <span className="pc-card__body">
          <span className="pc-card__eyebrow">
            {product.brand && <span className="pc-card__brand">{product.brand}</span>}
            {product.category && <span className="pc-card__category">{product.category}</span>}
          </span>
          <span className="pc-card__name">{product.name}</span>
          <span className="pc-card__desc">{product.description || 'Contact our team for specifications and installation details.'}</span>
          <span className="pc-card__footer">
            {price && <span className="pc-card__price">{price}</span>}
            <span className="pc-card__details">View details <span aria-hidden="true">→</span></span>
          </span>
        </span>
      </button>
    </article>
  );
};

const ProductModal = ({ product, onClose }) => {
  const { href: whatsappHref } = useWhatsappSettings();
  if (!product) return null;

  const price = Number.isFinite(product.price)
    ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.price)
    : null;

  return (
    <div className="pm-overlay" onClick={onClose} role="presentation">
      <section className="pm" role="dialog" aria-modal="true" aria-labelledby="pm-title" onClick={(event) => event.stopPropagation()}>
        <button className="pm__close" type="button" onClick={onClose} aria-label="Close product details"><X size={19} /></button>
        <div className="pm__grid">
          <div className="pm__img-wrap">
            {product.image ? (
              <img src={product.image} alt={product.name} className="pm__img" />
            ) : (
              <span className="pm__placeholder" aria-hidden="true"><Box size={72} strokeWidth={1.25} /></span>
            )}
            {!product.inStock && <div className="pm__oos-banner">Check availability with our team</div>}
          </div>
          <div className="pm__info">
            <div className="pm__eyebrow">
              {product.brand && <span className="pm__brand">{product.brand}</span>}
              <span className={`pm__availability ${product.inStock ? 'is-available' : 'is-unavailable'}`}>
                {product.inStock ? 'Available' : 'Availability on request'}
              </span>
            </div>
            <h2 className="pm__name" id="pm-title">{product.name}</h2>
            {price && <p className="pm__price">{price}</p>}
            <p className="pm__desc">{product.description || 'Contact our team for specifications, compatibility, and installation options.'}</p>
            <div className="pm__tags">
              {product.category && <span className="pm__tag">{product.category}</span>}
              {product.inStock && <span className="pm__tag pm__tag--green">In stock</span>}
            </div>
            <div className="pm__actions">
              <Button variant="primary" asChild><a href="/contact">Request a quote <ArrowRight size={16} /></a></Button>
              <Button variant="outline" asChild><a className="pm__whatsapp" href={whatsappHref} target="_blank" rel="noopener noreferrer">Chat on WhatsApp <ArrowUpRight size={15} /></a></Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const urlQuery = new URLSearchParams(location.search).get('q') || '';
  const [activeSlug, setActiveSlug] = useState(slug || 'all');
  const [search, setSearch] = useState(urlQuery);
  const [selected, setSelected] = useState(null);
  const { search: searchProducts } = useProductSearch();

  useEffect(() => {
    setSearch(new URLSearchParams(location.search).get('q') || '');
  }, [location.search]);

  useEffect(() => {
    setActiveSlug(slug || 'all');
  }, [slug]);

  const { data: categoryData, loading: categoriesLoading } = useQuery(GET_CATEGORIES);
  const categories = categoryData?.categories || [];
  const { data: categoryProductsData, loading: categoryProductsLoading } = useQuery(
    GET_PRODUCTS_BY_CATEGORY,
    { variables: { category: activeSlug }, skip: activeSlug === 'all' }
  );
  const { data: allProductsData, loading: allProductsLoading } = useQuery(
    GET_PRODUCTS,
    { skip: activeSlug !== 'all' }
  );

  const loading = categoryProductsLoading || allProductsLoading;
  const rawProducts = activeSlug === 'all'
    ? (allProductsData?.products || [])
    : (categoryProductsData?.productsByCategory || []);

  const products = useMemo(() => {
    const term = search.trim();
    if (!term) return rawProducts;
    return searchProducts(
      term,
      rawProducts.length,
      activeSlug === 'all' ? null : activeSlug
    );
  }, [search, rawProducts, activeSlug, searchProducts]);

  const activeCategory = categories.find((category) => category.slug === activeSlug);
  const selectCategory = (categorySlug) => {
    navigate(categorySlug === 'all' ? '/products' : `/products/${categorySlug}`);
  };

  return (
    <>
      <Header />
      <main className="products-page">
        <section className="pp__hero">
          <div className="container pp__hero-inner">
            <div className="pp__hero-copy">
              {activeCategory && <a href="/products" className="pp__back"><ArrowLeft size={14} /> All products</a>}
              <span className="pp__eyebrow"><span className="pp__eyebrow-dot" /> INTAM SOLUTIONS · PRODUCT CATALOG</span>
              <h1 className="pp__title">{activeCategory ? activeCategory.name : 'Find the right solution'}</h1>
              <p className="pp__subtitle">
                {activeCategory?.description || 'Explore dependable security and automation products, selected for your site and requirements.'}
              </p>
              <div className="pp__hero-actions">
                <a href="#product-catalog" className="pp__hero-primary">Browse products <ArrowDown size={16} /></a>
                <a href="/contact" className="pp__hero-secondary">Talk to a specialist <ArrowRight size={15} /></a>
              </div>
              <div className="pp__hero-proof"><ShieldCheck size={16} /> Thoughtfully selected for homes, businesses and facilities</div>
            </div>
            <div className="pp__hero-visual" aria-label="Featured product preview">
              <div className="pp__visual-orbit pp__visual-orbit--one" />
              <div className="pp__visual-orbit pp__visual-orbit--two" />
              {products[0] ? (
                <article className="pp__showcase-card">
                  <div className="pp__showcase-top"><span><span className="pp__showcase-dot" /> FEATURED FROM THE CATALOG</span><span className="pp__showcase-mark"><ShieldCheck size={16} /></span></div>
                  <div className="pp__showcase-image">
                    {products[0].image ? <img src={products[0].image} alt={products[0].name} /> : <Box size={76} strokeWidth={1.2} />}
                    <span className={`pp__showcase-stock ${products[0].inStock ? 'pp__showcase-stock--available' : ''}`}><span />{products[0].inStock ? 'In stock' : 'Availability on request'}</span>
                  </div>
                  <div className="pp__showcase-info">
                    <span className="pp__showcase-brand">{products[0].brand || products[0].category}</span>
                    <h2>{products[0].name}</h2>
                    <div><span>{Number.isFinite(products[0].price) ? new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(products[0].price) : 'Ask for pricing'}</span><span className="pp__showcase-link">Explore catalog <ArrowUpRight size={14} /></span></div>
                  </div>
                </article>
              ) : (
                <div className="pp__showcase-card pp__showcase-card--loading"><span className="pp__showcase-placeholder"><Box size={76} strokeWidth={1.2} /></span><span className="pp__showcase-loading-text">Explore the product range</span></div>
              )}
              <div className="pp__visual-help"><span><CircleHelp size={17} /></span><div><strong>Need help choosing?</strong><small>We can help match products to your project.</small></div><a href="/contact" aria-label="Talk to a specialist"><ArrowUpRight size={17} /></a></div>
            </div>
          </div>
        </section>

        <section className="container pp__catalog" id="product-catalog" aria-label="Product catalog">
          <div className="pp__main">
            <div className="pp__toolbar">
              <div className="pp__results">
                <h2>{activeCategory?.name || 'All products'}</h2>
                <p>{loading ? 'Updating catalog…' : `${products.length} ${products.length === 1 ? 'product' : 'products'}${search.trim() ? ' matching your search' : ' available'}`}</p>
              </div>
            </div>

            {loading ? (
              <div className="pp__loading" role="status"><span className="pp__spinner" /><span>Loading products…</span></div>
            ) : products.length === 0 ? (
              <div className="pp__empty">
                <span className="pp__empty-icon" aria-hidden="true"><Search size={32} strokeWidth={1.4} /></span>
                <h3>No products found</h3>
                <p>Try another search or choose a different category.</p>
                {search && <button type="button" className="pp__reset" onClick={() => setSearch('')}>Clear search</button>}
              </div>
            ) : (
              <div className="pp__grid">
                {products.map((product) => <ProductCard key={product.id} product={product} onSelect={setSelected} />)}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default ProductsPage;
