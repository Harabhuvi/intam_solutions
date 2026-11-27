import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, BellRing, Box, Camera, CircleHelp, Cpu, Fingerprint, Headset, Minus, Network, Plus, Search, ShieldCheck, X } from 'lucide-react';
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

const PROBLEM_SOLUTIONS = [
  {
    problem: 'Blind Spots & Poor Low-Light Footage',
    detail: 'Standard cameras often lose clarity after dusk, struggle with backlighting, or miss wide perimeter angles.',
    solutionTitle: 'ColorVu & Starlight IP Surveillance',
    solutionDesc: 'Our catalog features wide-dynamic-range cameras and smart NVRs engineered for sharp 24/7 color visibility even in near-zero light.',
  },
  {
    problem: 'Slow & Vulnerable Entry Management',
    detail: 'Paper logs, misplaced RFID tags, and shared passcodes create queues and leave entry points exposed.',
    solutionTitle: 'Multi-Modal Biometric Access Control',
    solutionDesc: 'Combine facial recognition, palm vein, and encrypted RFID readers for sub-second verification and accurate attendance logs.',
  },
  {
    problem: 'Disconnected Security & Alarm Devices',
    detail: 'Juggling separate apps for CCTV, burglar alarms, intercoms, and gates slows down response during emergencies.',
    solutionTitle: 'Unified Smart Site Integration',
    solutionDesc: 'We supply interoperable hardware with mobile-app alerts and central monitoring so your entire premises works as one system.',
  },
  {
    problem: 'No Site Planning or Post-Sales Support',
    detail: 'Off-the-shelf hardware without proper cabling, storage sizing, or maintenance often fails when you need it most.',
    solutionTitle: 'End-to-End Engineering & AMC',
    solutionDesc: 'From site survey and structured cabling to commissioning and annual maintenance, our team supports every installation.',
  },
];

const CORE_CAPABILITIES = [
  {
    icon: Camera,
    title: '24/7 HD & Night Vision',
    desc: 'High-resolution IP cameras with smart motion alerts, wide dynamic range, and clear low-light imaging.',
  },
  {
    icon: Fingerprint,
    title: 'Biometric & Access Control',
    desc: 'Touchless face, palm, and fingerprint terminals with real-time entry logs and electric lock integration.',
  },
  {
    icon: BellRing,
    title: 'Intrusion & Fire Detection',
    desc: 'Responsive smoke, heat, and perimeter sensors wired to instant sirens and mobile notifications.',
  },
  {
    icon: Cpu,
    title: 'Smart Building & Gate Automation',
    desc: 'Motorized sliding gates, boom barriers, and intelligent lighting controls tailored for modern properties.',
  },
  {
    icon: Network,
    title: 'Enterprise PoE & Networking',
    desc: 'Industrial PoE+ switches, Cat6 cabling, and rack solutions built for uninterrupted video and data uptime.',
  },
  {
    icon: Headset,
    title: 'Genuine OEM & AMC Support',
    desc: 'Authorized multi-brand hardware backed by expert installation, preventive checks, and responsive service.',
  },
];

const ProductsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { slug } = useParams();
  const urlQuery = new URLSearchParams(location.search).get('q') || '';
  const [activeSlug, setActiveSlug] = useState(slug || 'all');
  const [search, setSearch] = useState(urlQuery);
  const [selected, setSelected] = useState(null);
  const [openProblem, setOpenProblem] = useState(0);
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

        <section className="pp__problems" aria-label="Security challenges and solutions">
          <div className="container pp__problems-inner">
            <div className="pp__problems-intro">
              <span className="pp__problems-pill">PROBLEM &amp; SOLUTION</span>
              <h2 className="pp__problems-title">Challenges You Face &amp; Our Solution</h2>
              <p className="pp__problems-sub">
                Generic hardware and disconnected setups leave critical blind spots. See how our curated catalog solves real-world site challenges.
              </p>
            </div>

            <div className="pp__accordion">
              {PROBLEM_SOLUTIONS.map((item, idx) => {
                const isOpen = openProblem === idx;
                return (
                  <div key={item.problem} className={`pp__acc-item ${isOpen ? 'is-open' : ''}`}>
                    <button
                      type="button"
                      className="pp__acc-trigger"
                      aria-expanded={isOpen}
                      onClick={() => setOpenProblem(isOpen ? -1 : idx)}
                    >
                      <span>{item.problem}</span>
                      <span className="pp__acc-icon" aria-hidden="true">
                        {isOpen ? <Minus size={14} /> : <Plus size={14} />}
                      </span>
                    </button>
                    {isOpen && (
                      <div className="pp__acc-body">
                        <p className="pp__acc-detail">{item.detail}</p>
                        <div className="pp__acc-solution">
                          <span className="pp__acc-sol-icon" aria-hidden="true"><ShieldCheck size={16} /></span>
                          <div>
                            <strong>{item.solutionTitle}</strong>
                            <p>{item.solutionDesc}</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section className="pp__capabilities" aria-label="Core product capabilities">
          <div className="container">
            <div className="pp__cap-header">
              <span className="pp__cap-kicker">• KEY CAPABILITIES</span>
              <h2 className="pp__cap-title">Built for Reliable Security &amp; Automation</h2>
              <p className="pp__cap-sub">
                Dependable hardware capabilities engineered to deliver continuous protection and effortless control.
              </p>
            </div>
            <div className="pp__cap-grid">
              {CORE_CAPABILITIES.map(({ icon: CapIcon, title, desc }) => (
                <article key={title} className="pp__cap-card">
                  <span className="pp__cap-icon" aria-hidden="true"><CapIcon size={18} strokeWidth={1.8} /></span>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
      <ProductModal product={selected} onClose={() => setSelected(null)} />
    </>
  );
};

export default ProductsPage;
