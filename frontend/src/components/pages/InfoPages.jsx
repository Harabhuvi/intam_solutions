import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../../graphql/queries';
import Header from './Header';
import Footer from './Footer';
import '../style/InfoPages.css';

const solutions = [
  { icon: '⌂', title: 'Residential', text: 'Protect the people and spaces at home with a coordinated plan for entry, surveillance and automation.', tags: ['CCTV', 'Access control', 'Smart home'] },
  { icon: '▤', title: 'Commercial', text: 'Connect security across offices, retail spaces and campuses, with systems planned around daily operations.', tags: ['Video surveillance', 'Networking', 'Fire safety'] },
  { icon: '⌘', title: 'Industrial', text: 'Plan dependable coverage for facilities, perimeters and controlled areas with room to expand over time.', tags: ['Perimeter', 'Access control', 'Automation'] },
];

const projects = [
  { icon: '◉', title: 'Video surveillance', text: 'Plan camera coverage around entrances, shared spaces, perimeters and the areas that matter most.', tags: ['CCTV', 'NVR', 'Remote viewing'] },
  { icon: '▣', title: 'Entry management', text: 'Coordinate access points with the right readers, controllers, door hardware and visitor workflows.', tags: ['Biometric', 'RFID', 'Intercom'] },
  { icon: '△', title: 'Life safety', text: 'Bring detection, alarms and notification equipment together in a site-appropriate system.', tags: ['Fire detection', 'Alarm', 'Monitoring'] },
  { icon: '⌂', title: 'Connected buildings', text: 'Connect automation, networking and security equipment into an easier-to-manage environment.', tags: ['Automation', 'Networking', 'Integration'] },
];

const services = [
  { icon: '⌕', title: 'Consultation & design', text: 'Review your site, priorities and existing equipment to shape a clear plan and practical scope.', tags: ['Site review', 'System planning'] },
  { icon: '⚙', title: 'Installation & commissioning', text: 'Coordinate equipment installation, configuration and handover around your project requirements.', tags: ['Installation', 'Configuration'] },
  { icon: '↻', title: 'Maintenance & AMC', text: 'Keep systems maintained with planned inspections, troubleshooting and support for installed equipment.', tags: ['Preventive care', 'Support'] },
];

function PageShell({ eyebrow, title, intro, children }) {
  return <><Header /><main className="info-page">
    <section className="info-hero"><div className="container info-hero__inner"><div className="info-hero__copy"><p className="info-hero__eyebrow">{eyebrow}</p><h1>{title}</h1><p className="info-hero__intro">{intro}</p><div className="info-hero__actions"><a href="/contact" className="btn btn--primary">Talk to our team <span aria-hidden="true">→</span></a><a href="/products" className="info-hero__secondary">Explore products <span aria-hidden="true">↗</span></a></div></div><aside className="info-hero__panel"><span className="info-hero__panel-kicker">A coordinated approach</span><h2>Plan for the whole site.</h2><ul><li><span>01</span>Understand the space</li><li><span>02</span>Match the right systems</li><li><span>03</span>Support through the lifecycle</li></ul></aside></div></section>
    {children}
  </main><Footer /></>;
}

function CardGrid({ items, className = '' }) {
  return <div className={`info-card-grid ${className}`}>{items.map(item => <article className="info-card" key={item.title}>
    <span className="info-card__icon" aria-hidden="true">{item.icon}</span><h2>{item.title}</h2><p>{item.text}</p>
    {item.tags && <ul className="info-card__tags">{item.tags.map(tag => <li key={tag}>{tag}</li>)}</ul>}
  </article>)}</div>;
}

export function SolutionsPage() {
  return <PageShell eyebrow="Solutions" title="Security designed around your space" intro="Explore connected security and automation options for homes, workplaces and larger facilities.">
    <section className="info-section container"><div className="info-section__heading"><p className="info-kicker">By environment</p><h2>Find the right starting point</h2><p>Every site has different entry points, people and operating needs. Start with the environment that best matches yours.</p></div><CardGrid items={solutions} /></section>
    <section className="info-band"><div className="container info-band__inner"><div><p className="info-kicker">One coordinated plan</p><h2>Bring systems together</h2><p>Combine surveillance, alarms, access control, fire detection, networking and automation in a plan suited to your site.</p></div><a href="/products" className="btn btn--outline">Browse products <span aria-hidden="true">→</span></a></div></section>
  </PageShell>;
}

export function BrandsPage() {
  const { data, loading, error } = useQuery(GET_PRODUCTS);
  const products = data?.products || [];
  const brandCounts = products.reduce((counts, product) => {
    if (product.brand) counts.set(product.brand, (counts.get(product.brand) || 0) + 1);
    return counts;
  }, new Map());
  const brandNames = [...brandCounts.keys()].sort((a, b) => a.localeCompare(b));
  return <PageShell eyebrow="Brands" title="Brands available in our range" intro="Browse the manufacturers represented across our current product catalog. Availability can vary by model and project requirement.">
    <section className="info-section container"><div className="info-section__heading"><p className="info-kicker">Product manufacturers</p><h2>Explore by brand</h2><p>Choose a brand to see matching products in the catalog.</p></div>
      {loading ? <p className="info-state">Loading brands…</p> : error ? <p className="info-state">Brands are temporarily unavailable. Please try again later.</p> : brandNames.length ? <div className="brand-grid">{brandNames.map(brand => {
        const count = brandCounts.get(brand);
        return <a className="brand-card" href={`/products?q=${encodeURIComponent(brand)}`} key={brand}><span className="brand-card__mark" aria-hidden="true">{brand.slice(0, 1).toUpperCase()}</span><span className="brand-card__body"><strong>{brand}</strong><small>{count} catalog product{count === 1 ? '' : 's'}</small><span className="brand-card__link">View products <span aria-hidden="true">→</span></span></span></a>;
      })}</div> : <div className="info-empty"><h2>Brand catalog is being prepared</h2><p>Contact our team for current brand and model availability.</p><a href="/contact">Ask about availability →</a></div>}
    </section>
  </PageShell>;
}

export function ProjectsPage() {
  return <PageShell eyebrow="Projects" title="Plan a system for your site" intro="Explore the kinds of integrated security and automation work we can scope for residential, commercial and industrial environments.">
    <section className="info-section container"><div className="info-section__heading"><p className="info-kicker">Project capabilities</p><h2>Common project scopes</h2><p>We can help define a scope around the building, coverage goals and existing infrastructure.</p></div><CardGrid items={projects} /></section>
    <section className="info-note container"><span className="info-note__icon" aria-hidden="true">📋</span><div><h2>Have a site or project requirement?</h2><p>Share the location, building type and systems you need. We can discuss the next steps and arrange a site assessment.</p></div><a href="/contact" className="btn btn--primary">Discuss a project →</a></section>
  </PageShell>;
}

export function ServicesPage() {
  return <PageShell eyebrow="Services & AMC" title="Support through the life of your system" intro="From planning and installation to maintenance and upgrades, get support for your security and automation equipment.">
    <section className="info-section container"><div className="info-section__heading"><p className="info-kicker">How we can help</p><h2>Services for every stage</h2><p>Service scope and maintenance schedules are agreed around your installation and site needs.</p></div><CardGrid items={services} className="info-card-grid--three" /></section>
    <section className="info-band"><div className="container info-band__inner"><div><p className="info-kicker">Annual Maintenance Contract</p><h2>Keep your systems ready</h2><p>Ask about a maintenance plan for inspections, system health checks and support for your installed equipment.</p></div><a href="/contact" className="btn btn--outline">Request service information <span aria-hidden="true">→</span></a></div></section>
  </PageShell>;
}

export function AboutPage() {
  const principles = [
    { icon: '⌖', title: 'Planned for your site', text: 'We start with the people, spaces and operating needs your system must support.', tags: ['Site focused', 'Practical scope'] },
    { icon: '◈', title: 'Connected systems', text: 'Bring security, safety and automation equipment together in a coordinated design.', tags: ['Integrated', 'Expandable'] },
    { icon: '↻', title: 'Support that continues', text: 'Get help with installation, commissioning, maintenance and future upgrades.', tags: ['Installation', 'Ongoing care'] },
  ];
  return <PageShell eyebrow="About Intam Solutions" title="Security and automation, thoughtfully connected" intro="We help homes, businesses and facilities plan and implement electronic security and automation systems around the way each site works.">
    <section className="info-section container"><div className="info-section__heading"><p className="info-kicker">What guides our work</p><h2>Clear planning. Dependable systems.</h2><p>From the first site conversation to ongoing support, our focus is on solutions that fit the space and the people who use it.</p></div><CardGrid items={principles} /></section>
    <section className="info-band"><div className="container info-band__inner"><div><p className="info-kicker">Let’s talk about your site</p><h2>Start with a conversation</h2><p>Tell us about your goals and we’ll help identify a useful next step.</p></div><a href="/contact" className="btn btn--outline">Contact our team <span aria-hidden="true">→</span></a></div></section>
  </PageShell>;
}
