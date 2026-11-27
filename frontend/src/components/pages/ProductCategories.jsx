import React, { useState, useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { GET_CATEGORIES } from '../../graphql/queries';
import '../style/ProductCategories.css';

const FALLBACK_CATEGORIES = [];

const getRelativeOffset = (index, active, total) => {
  if (total === 0) return 0;
  const half = total / 2;
  return (((index - active + half) % total) + total) % total - half;
};


const ProductCategories = () => {
  const { loading, error, data } = useQuery(GET_CATEGORIES);
  const categories =
    data?.categories?.length > 0 ? data.categories : FALLBACK_CATEGORIES;

  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (categories.length > 0 && active >= categories.length) {
      setActive(0);
    }
  }, [categories.length, active]);

  const total = categories.length;
  const activeCat = categories[active] || null;

  useEffect(() => {
    if (total <= 1 || paused) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      setActive((i) => (i + 1) % total);
    }, 3500);
    return () => window.clearInterval(timer);
  }, [total, paused]);

  return (
    <section className="prod-cats section" id="categories">
      <div className="container">
        <div className="prod-cats__header">
          <div>
            <p className="prod-cats__eyebrow">Explore the range</p>
            <h2 className="prod-cats__title">Our Product Categories</h2>
            <p className="prod-cats__sub">
              Explore our wide range of electronic security and automation products.
            </p>
          </div>
          <a href="/products" className="prod-cats__view-all">View All Products →</a>
        </div>

        {loading && <p className="prod-cats__status">Loading categories…</p>}
        {error && <p className="prod-cats__status prod-cats__status--warn">⚠ Showing default categories.</p>}

        {total > 0 && (
          <div
            className="cat-showcase"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            <div className="cat-coverflow" role="region" aria-label="Product categories carousel">
              {categories.map((cat, index) => {
                const offset = getRelativeOffset(index, active, total);
                const absOffset = Math.abs(offset);
                const isVisible = absOffset <= 2;
                const isCenter = offset === 0;

                if (!isVisible) return null;

                const cardClass = `cat-slide cat-slide--pos-${offset}`;

                if (isCenter) {
                  return (
                    <a
                      key={cat.id || cat.slug}
                      href={`/products/${cat.slug}`}
                      className={cardClass}
                      aria-label={cat.name}
                    >
                      <div className="cat-slide__media">
                        {cat.image ? (
                          <img src={cat.image} alt={cat.name} loading="lazy" />
                        ) : (
                          <div className="cat-slide__placeholder" aria-hidden="true">
                            <span>{cat.icon || '◈'}</span>
                            <small>SECURITY SYSTEMS</small>
                          </div>
                        )}
                      </div>
                      <div className="cat-slide__overlay">
                        <span className="cat-slide__name">{cat.name}</span>
                        <span className="cat-slide__circle" aria-hidden="true">
                          <ArrowRight size={15} strokeWidth={2.2} />
                        </span>
                      </div>
                    </a>
                  );
                }

                return (
                  <button
                    key={cat.id || cat.slug}
                    type="button"
                    className={cardClass}
                    onClick={() => setActive(index)}
                    aria-label={`View ${cat.name}`}
                  >
                    <div className="cat-slide__media">
                      {cat.image ? (
                        <img src={cat.image} alt={cat.name} loading="lazy" />
                      ) : (
                        <div className="cat-slide__placeholder" aria-hidden="true">
                          <span>{cat.icon || '◈'}</span>
                          <small>SECURITY SYSTEMS</small>
                        </div>
                      )}
                    </div>
                    <div className="cat-slide__overlay">
                      <span className="cat-slide__name">{cat.name}</span>
                      <span className="cat-slide__circle" aria-hidden="true">
                        <ArrowRight size={14} strokeWidth={2.2} />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>

            {activeCat && (
              <div className="cat-showcase__meta">
                <h3 className="cat-showcase__name">{activeCat.name}</h3>
                {activeCat.description && (
                  <p className="cat-showcase__desc">{activeCat.description}</p>
                )}
              </div>
            )}

            {total > 1 && (
              <div className="cat-showcase__controls">
                {/* <button
                  type="button"
                  className="cat-showcase__nav"
                  onClick={goPrev}
                  aria-label="Previous category"
                >
                  <ChevronLeft size={18} />
                </button> */}
                <div className="cat-showcase__dots">
                  {categories.map((cat, index) => (
                    <button
                      key={cat.id || cat.slug}
                      type="button"
                      className={`cat-showcase__dot ${index === active ? 'cat-showcase__dot--active' : ''}`}
                      onClick={() => setActive(index)}
                      aria-label={`Select ${cat.name}`}
                      aria-pressed={index === active}
                    />
                  ))}
                </div>
                {/* <button
                  type="button"
                  className="cat-showcase__nav"
                  onClick={goNext}
                  aria-label="Next category"
                >
                  <ChevronRight size={18} />
                </button> */}
              </div>
            )}
          </div>
        )}

        <div className="prod-cats__help">
          <span className="prod-cats__help-mark" aria-hidden="true">i</span>
          <p><strong>Not sure where to start?</strong><span>Tell us about your site and we’ll help narrow down the right systems.</span></p>
          <a href="/contact">Talk to our team <span aria-hidden="true">→</span></a>
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
