import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_CATEGORIES } from '../graphql/queries';
import './ProductCategories.css';

const FALLBACK_CATEGORIES = [
  {
    id: '1', slug: 'cctv',
    name: 'CCTV & Video Surveillance',
    image: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=400&q=75',
  },
  {
    id: '2', slug: 'alarms',
    name: 'Intrusion & Burglar Alarms',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&q=75',
  },
  {
    id: '3', slug: 'access-control',
    name: 'Biometric & Access Control',
    image: 'https://images.unsplash.com/photo-1614064641938-3bbee52942c7?w=400&q=75',
  },
  {
    id: '4', slug: 'intercoms',
    name: 'Video Door Phones & Intercoms',
    image: 'https://media.istockphoto.com/id/184857175/photo/intercom.jpg?s=1024x1024&w=is&k=20&c=SrtCYDxohv5Z06jKl3JNuNjDfbqiO3XoTXEsEMs5_Hw=',
  },
  {
    id: '5', slug: 'automation',
    name: 'Home & Building Automation',
    image: 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400&q=75',
  },
  {
    id: '6', slug: 'fire',
    name: 'Fire Detection & Alarm Systems',
    image: 'https://images.unsplash.com/photo-1562564055-71e051d33c19?w=400&q=75',
  },
  {
    id: '7', slug: 'gate',
    name: 'Gate Automation & Parking',
    image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=400&q=75',
  },
  {
    id: '8', slug: 'networking',
    name: 'Networking & Structured Cabling',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=400&q=75',
  },
];

const CategoryCard = ({ category }) => (
  <a href={`/products/${category.slug}`} className="cat-card" aria-label={category.name}>
    <div className="cat-card__img-wrap">
      <img
        src={category.image || `https://picsum.photos/seed/${category.slug}/400/300`}
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
        <div className="prod-cats__header">
          <div>
            <h2 className="prod-cats__title">Our Product Categories</h2>
            <p className="prod-cats__sub">
              Explore our wide range of electronic security and automation products.
            </p>
          </div>
          <a href="/products" className="prod-cats__view-all">View All Products →</a>
        </div>

        {loading && <p className="prod-cats__status">Loading categories…</p>}
        {error   && <p className="prod-cats__status prod-cats__status--warn">⚠ Showing default categories.</p>}

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
