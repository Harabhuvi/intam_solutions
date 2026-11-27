import React, { useEffect, useState } from 'react';
import { ArrowRight, Building2, ChevronRight, Network, ShieldCheck, SlidersHorizontal, Wrench } from 'lucide-react';
import '../style/Hero.css';

/* Add as many slides as you like (2 or more). Each slide = background image + its own headline.
   Tip: put your own photos in /public/images/hero/ and use '/images/hero/slide-1.jpg' for faster, reliable loading. */
const slides = [
  {
    id: 1,
    tag: 'Security',
    badge: 'Electronic Security & Automation Solutions',
    heading: 'Protecting What',
    highlight: 'Matters Most',
    sub: 'Integrated security and automation solutions for homes, businesses and industries.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1920&q=75',
  },
  {
    id: 2,
    tag: 'Automation',
    badge: 'Smart Automation',
    heading: 'Automate Your',
    highlight: 'World Smartly',
    sub: 'From home automation to enterprise-grade security systems — all under one roof.',
    image: 'https://images.unsplash.com/photo-1558002038-bb0237755b88?auto=format&fit=crop&w=1920&q=75',
  },
];

const features = [
  { icon: ShieldCheck, title: 'Reliable Security', desc: 'Keep your people, property and assets safe' },
  { icon: SlidersHorizontal, title: 'Smart Automation', desc: 'Simplify and control your environment' },
  { icon: Wrench, title: 'Professional Support', desc: 'Installation, maintenance and AMC services' },
  { icon: Network, title: 'Multiple Brands', desc: 'Trusted global and local brands' },
  { icon: Building2, title: 'Residential & Commercial', desc: 'Tailored solutions for every space' },
];

const SLIDE_MS = 6000;
const TRANSITION_MS = 1000;

const Hero = () => {
  /* current = slide on screen, prev = slide sliding out (null when idle) */
  const [state, setState] = useState({ current: 0, prev: null });
  const { current, prev } = state;
  const slide = slides[current];

  const goTo = (next) =>
    setState((s) => (s.current === next ? s : { current: next, prev: s.current }));

  /* Preload every background so slides never pop in */
  useEffect(() => {
    slides.forEach((s) => {
      const img = new Image();
      img.src = s.image;
    });
  }, []);

  /* Autoplay */
  useEffect(() => {
    if (slides.length < 2) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const timer = window.setInterval(() => {
      setState((s) => ({ current: (s.current + 1) % slides.length, prev: s.current }));
    }, SLIDE_MS);
    return () => window.clearInterval(timer);
  }, []);

  /* Remove the outgoing slide once the slide animation has finished */
  useEffect(() => {
    if (prev === null) return undefined;
    const timer = window.setTimeout(() => setState((s) => ({ ...s, prev: null })), TRANSITION_MS + 100);
    return () => window.clearTimeout(timer);
  }, [current, prev]);

  return (
    <section className="hero" aria-roledescription="carousel" aria-label="Featured solutions">
      <div className="hero__slide">
        <div className="hero__bg" aria-hidden="true">
          {prev !== null && (
            <div key={`out-${slides[prev].id}`} className="hero__bg-slide hero__bg-slide--out">
              <img src={slides[prev].image} alt="" decoding="async" />
            </div>
          )}
          <div
            key={`in-${slide.id}`}
            className={`hero__bg-slide ${prev !== null ? 'hero__bg-slide--in' : ''}`}
          >
            <img src={slide.image} alt="" decoding="async" />
          </div>
          <div className="hero__overlay" />
        </div>

        <div className="hero__content container">
          <div key={slide.id} className="hero__copy">
            <div className="hero__pill">
              <span className="hero__pill-tag">{slide.tag}</span>
              <span className="hero__pill-text">{slide.badge}</span>
            </div>

            <h1 className="hero__heading">
              {slide.heading}{' '}
              <span className="hero__heading--blue">{slide.highlight}</span>
            </h1>

            <p className="hero__sub">{slide.sub}</p>
          </div>

          <div className="hero__cta-group">
            <a href="/products" className="hero__btn hero__btn--primary">
              Explore Products <ArrowRight size={17} />
            </a>
            <a href="/contact" className="hero__btn hero__btn--secondary">
              Request a Quote <ChevronRight size={17} />
            </a>
          </div>

          <p className="hero__proof">
            <span aria-hidden="true" /> Solutions for homes, workplaces and industrial sites
          </p>
        </div>

        {slides.length > 1 && (
          <div className="hero__dots">
            {slides.map((s, i) => (
              <button
                key={s.id}
                type="button"
                className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
                onClick={() => goTo(i)}
                aria-label={`Show slide ${i + 1}: ${s.tag}`}
                aria-pressed={i === current}
              />
            ))}
          </div>
        )}
      </div>

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