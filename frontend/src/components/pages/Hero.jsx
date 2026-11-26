import React, { useEffect, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../graphql/queries';
import '../style/Hero.css';

import { ArrowRight, Building2, Globe2, Network, ShieldCheck, SlidersHorizontal, Wrench } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';


const slides = [
  {
    id: 1,
    badge: 'Electronic Security & Automation Solutions',
    heading: 'Protecting What',
    highlight: 'Matters Most',
    sub: 'Integrated security and automation solutions for homes, businesses and industries.',
    alt: 'Professional security camera mounted inside a modern building',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=960&q=65',
    imageSrcSet: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=480&q=65 480w, https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=768&q=65 768w, https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=65 1200w, https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=65 1600w',
  },
  {
    id: 2,
    badge: 'Smart Automation',
    heading: 'Automate Your',
    highlight: 'World Smartly',
    sub: 'From home automation to enterprise-grade security systems — all under one roof.',
    alt: 'Smart home automation controls in a modern living space',
    image: 'https://images.unsplash.com/photo-1558002038-bb0237755b88?auto=format&fit=crop&w=960&q=65',
    imageSrcSet: 'https://images.unsplash.com/photo-1558002038-bb0237755b88?auto=format&fit=crop&w=480&q=65 480w, https://images.unsplash.com/photo-1558002038-bb0237755b88?auto=format&fit=crop&w=768&q=65 768w, https://images.unsplash.com/photo-1558002038-bb0237755b88?auto=format&fit=crop&w=1200&q=65 1200w, https://images.unsplash.com/photo-1558002038-bb0237755b88?auto=format&fit=crop&w=1600&q=65 1600w',
  },
];

const features = [
  { icon: ShieldCheck, title: 'Reliable Security', desc: 'Keep your people, property and assets safe' },
  { icon: SlidersHorizontal, title: 'Smart Automation', desc: 'Simplify and control your environment' },
  { icon: Wrench, title: 'Professional Support', desc: 'Installation, maintenance and AMC services' },
  { icon: Network, title: 'Multiple Brands', desc: 'Trusted global and local brands' },
  { icon: Building2, title: 'Residential & Commercial', desc: 'Tailored solutions for every space' },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);
  const { data } = useQuery(GET_PRODUCTS);
  const products = (data?.products || []).filter((product) => product.image);
  const contentSlide = slides[current % slides.length];
  const slideCount = products.length || slides.length;
  const indicatorCount = Math.min(slideCount, 5);
  const activeIndicator = Math.round((current / Math.max(slideCount - 1, 1)) * (indicatorCount - 1));

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || products.length < 2) return undefined;
    const timer = window.setInterval(() => setCurrent((index) => (index + 1) % products.length), 5500);
    return () => window.clearInterval(timer);
  }, [products.length]);

  return (
    <section className="hero">
      {}
      <div className="hero__slide">
        <div className="hero__product-visual" key={products[current]?.id || contentSlide.id}>
          <div className="hero__product-image-wrap">
            <img
              src={products[current]?.image || contentSlide.image}
              alt={products[current]?.name || contentSlide.alt}
            />
          </div>
        </div>
        <div className="hero__content container mx-auto flex w-full flex-col items-center px-6 text-center">
          <div className="hero__eyebrow-row"><span className="hero__globe"><Globe2 size={19} /></span><Badge>{contentSlide.badge}</Badge></div>
          <h1 className="hero__heading">
            {contentSlide.heading}
            <br />
            <span className="hero__heading--blue">{contentSlide.highlight}</span>
          </h1>
          <p className="hero__sub">{contentSlide.sub}</p>
          <div className="hero__cta-group">
            <Button variant="primary" size="lg" asChild><a href="/products">Explore Products <ArrowRight size={17} /></a></Button>
            <Button variant="outline" size="lg" asChild><a href="/contact">Request a Quote</a></Button>
          </div>
          <p className="hero__proof"><span aria-hidden="true" /> Solutions for homes, workplaces and industrial sites</p>
        </div>

        {}
        <div className="hero__dots">
          {Array.from({ length: indicatorCount }, (_, i) => (
            <button
              key={i}
              className={`hero__dot ${i === activeIndicator ? 'hero__dot--active' : ''}`}
              onClick={() => setCurrent(Math.round((i / Math.max(indicatorCount - 1, 1)) * (slideCount - 1)))}
              aria-label={`Slide ${i + 1}`}
              aria-pressed={i === current}
            />
          ))}
        </div>
      </div>

      {}
      <div className="hero__features">
        <div className="hero__features-inner container">
          {features.map(({ icon: FeatureIcon, ...feature }) => (
            <div key={feature.title} className="hero__feature">
              <span className="hero__feature-icon" aria-hidden="true"><FeatureIcon size={19} strokeWidth={1.8} /></span>
              <div className="hero__feature-copy">
                <p className="hero__feature-title">{feature.title}</p>
                <p className="hero__feature-desc">{feature.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
