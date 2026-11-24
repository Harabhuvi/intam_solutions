import React, { useState } from 'react';
import './Hero.css';

const slides = [
  {
    id: 1,
    badge: 'Electronic Security & Automation Solutions',
    heading: 'Protecting What',
    highlight: 'Matters Most',
    sub: 'Integrated security and automation solutions for homes, businesses and industries.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=960&q=65',
    imageSrcSet: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=480&q=65 480w, https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=768&q=65 768w, https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=65 1200w, https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1600&q=65 1600w',
  },
  {
    id: 2,
    badge: 'Smart Automation',
    heading: 'Automate Your',
    highlight: 'World Smartly',
    sub: 'From home automation to enterprise-grade security systems — all under one roof.',
    image: 'https://images.unsplash.com/photo-1558002038-bb0237755b88?auto=format&fit=crop&w=960&q=65',
    imageSrcSet: 'https://images.unsplash.com/photo-1558002038-bb0237755b88?auto=format&fit=crop&w=480&q=65 480w, https://images.unsplash.com/photo-1558002038-bb0237755b88?auto=format&fit=crop&w=768&q=65 768w, https://images.unsplash.com/photo-1558002038-bb0237755b88?auto=format&fit=crop&w=1200&q=65 1200w, https://images.unsplash.com/photo-1558002038-bb0237755b88?auto=format&fit=crop&w=1600&q=65 1600w',
  },
];

const features = [
  { icon: '🛡️', title: 'Reliable Security',       desc: 'Keep your people, property and assets safe' },
  { icon: '⚙️', title: 'Smart Automation',         desc: 'Simplify and control your environment' },
  { icon: '🔧', title: 'Professional Support',     desc: 'Installation, maintenance and AMC services' },
  { icon: '🤝', title: 'Multiple Brands',           desc: 'Trusted global and local brands' },
  { icon: '🏢', title: 'Residential & Commercial', desc: 'Tailored solutions for every space' },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  return (
    <section className="hero">
      {/* ── Slider ─────────────────────────────────────── */}
      <div className="hero__slide">
        <div className="hero__bg-wrap">
          <img
            src={slides[current].image}
            srcSet={slides[current].imageSrcSet}
            sizes="100vw"
            alt="Security"
            className="hero__bg-img"
            loading={current === 0 ? 'eager' : 'lazy'}
            fetchPriority={current === 0 ? 'high' : 'auto'}
          />
        </div>

        <div className="hero__content container">
          <span className="hero__badge">{slides[current].badge}</span>
          <h1 className="hero__heading">
            {slides[current].heading}
            <br />
            <span className="hero__heading--blue">{slides[current].highlight}</span>
          </h1>
          <p className="hero__sub">{slides[current].sub}</p>
          <div className="hero__cta-group">
            <a href="/products" className="btn btn--primary">Explore Products →</a>
            <a href="/contact"  className="btn btn--outline">Request a Quote</a>
          </div>
        </div>

        {/* Dots */}
        <div className="hero__dots">
          {slides.map((_, i) => (
            <button
              key={i}
              className={`hero__dot ${i === current ? 'hero__dot--active' : ''}`}
              onClick={() => setCurrent(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* ── Feature Strip ──────────────────────────────── */}
      <div className="hero__features">
        <div className="hero__features-inner container">
          {features.map((f) => (
            <div key={f.title} className="hero__feature">
              <span className="hero__feature-icon">{f.icon}</span>
              <div>
                <p className="hero__feature-title">{f.title}</p>
                <p className="hero__feature-desc">{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Hero;
