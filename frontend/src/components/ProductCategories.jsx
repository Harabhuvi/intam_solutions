import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../graphql/queries';
import './ProductCategories.css';

/* Fallback data shown while GraphQL loads or if DB is empty */
const FALLBACK_CATEGORIES = [
  { id: '1', name: 'CCTV & Video Surveillance', slug: 'cctv', image: '/categories/cctv.jpg' },
  { id: '2', name: 'Intrusion & Burglar Alarms', slug: 'alarms', image: '/categories/alarm.jpg' },
  { id: '3', name: 'Biometric & Access Control', slug: 'access-control', image: '/categories/biometric.jpg' },
  { id: '4', name: 'Video Door Phones & Intercoms', slug: 'intercoms', image: '/categories/intercom.jpg' },
  { id: '5', name: 'Home & Building Automation', slug: 'automation', image: '/categories/automation.jpg' },
  { id: '6', name: 'Fire Detection & Alarm Systems', slug: 'fire', image: '/categories/fire.jpg' },
  { id: '7', name: 'Gate Automation & Parking', slug: 'gate', image: '/categories/gate.jpg' },
  { id: '8', name: 'Networking & Structured Cabling', slug: 'networking', image: '/categories/networking.jpg' },
];

const CategoryCard = ({ category }) => (
  <a
    href={`/products/${category.slug}`}
    className="cat-card"
    aria-label={category.name}
  >
    <div className="cat-card__img-wrap">
      <img
        src={category.image || '/categories/placeholder.jpg'}
        alt={category.name}
        className="cat-card__img"
        loading="lazy"
      />
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
        {/* Section header */}
        <div className="prod-cats__header">
          <div>
            <h2 className="prod-cats__title">Our Product Categories</h2>
            <p className="prod-cats__sub">
              Explore our wide range of electronic security and automation products.
            </p>
          </div>
          <a href="/products" className="prod-cats__view-all">
            View All Products →
          </a>
        </div>

        {/* Loading / error states */}
        {loading && (
          <p className="prod-cats__status">Loading categories…</p>
        )}
        {error && (
          <p className="prod-cats__status prod-cats__status--warn">
            ⚠ Could not load from server – showing defaults.
          </p>
        )}

        {/* Grid */}
        <div className="prod-cats__grid">
          {categories.map((cat) => (
            <CategoryCard key={cat.id} category={cat} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductCategories;
