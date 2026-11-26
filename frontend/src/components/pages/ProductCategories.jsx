import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../../graphql/queries';
import '../style/ProductCategories.css';

const FALLBACK_CATEGORIES = [];

const CategoryCard = ({ category }) => (
  <a href={`/products/${category.slug}`} className="cat-card" aria-label={category.name}>
    <div className="cat-card__img-wrap">
      {category.image ? (
        <img src={category.image} alt={category.name} className="cat-card__img" loading="lazy" />
      ) : (
        <div className="cat-card__placeholder" aria-hidden="true"><span>{category.icon || '◈'}</span><small>SECURITY SYSTEMS</small></div>
      )}
    </div>
    <div className="cat-card__label">
      <span>{category.name}</span>
      <span className="cat-card__arrow">→</span>
    </div>
  </a>
);

const ProductCategories = () => {
  const { loading, error, data } = useQuery(GET_CATEGORIES);

  const categories =
    data?.categories?.length > 0 ? data.categories : FALLBACK_CATEGORIES;

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

        <div className="prod-cats__grid">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
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
