import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from '../graphql/queries';
import Header from './Header';
import Footer from './Footer';
import './InfoPages.css';

const solutions = [
  { icon: '🏠', title: 'Homes & Villas', text: 'Bring CCTV, video door phones, intrusion alarms, smart locks and automation together for everyday peace of mind.', tags: ['CCTV', 'Video door phones', 'Smart home'] },
  { icon: '🏢', title: 'Offices & Commercial Spaces', text: 'Plan access control, surveillance, alarms and network infrastructure around staff, visitors and business operations.', tags: ['Access control', 'Surveillance', 'Networking'] },
  { icon: '🏭', title: 'Industrial Facilities', text: 'Coordinate perimeter monitoring, fire detection, controlled entry and reliable connectivity across larger sites.', tags: ['Perimeter security', 'Fire detection', 'Structured cabling'] },
  { icon: '🏬', title: 'Apartments & Communities', text: 'Support shared entrances and common areas with video intercoms, gate automation, CCTV and access management.', tags: ['Intercoms', 'Gate automation', 'CCTV'] },
];

const projects = [
  { icon: '🎥', title: 'Video surveillance deployments', text: 'Camera placement, recording and viewing plans tailored to entrances, common areas, perimeters and operational spaces.' },
  { icon: '🚪', title: 'Access & visitor management', text: 'Door readers, biometric access, video door phones and intercom systems configured around site entry requirements.' },
  { icon: '🔥', title: 'Life safety systems', text: 'Fire alarm panels and detection devices planned for the building layout and the customer’s safety requirements.' },
  { icon: '⚙️', title: 'Automation & connectivity', text: 'Gate automation, smart building controls, switching and structured cabling integrated into a practical site plan.' },
];

const services = [
  { icon: '🧭', title: 'Consultation & site assessment', text: 'Discuss the site, usage, coverage goals and existing equipment to shape a suitable system plan.' },
  { icon: '🛠️', title: 'Installation & commissioning', text: 'Install and configure security, fire, access, intercom, networking and automation equipment.' },
  { icon: '🔍', title: 'Preventive maintenance', text: 'Schedule checks of system operation, device condition, recording, power and connectivity.' },
  { icon: '🔄', title: 'AMC & support', text: 'Arrange an annual maintenance plan based on the installed equipment and the support requirements of the site.' },
  { icon: '⬆️', title: 'Repair & upgrades', text: 'Review faults, replace aging components and expand existing systems as needs change.' },
  { icon: '🎓', title: 'Handover & guidance', text: 'Walk users through everyday operation, basic checks and escalation of service issues.' },
];

function PageShell({ eyebrow, title, intro, children }) {
  return <><Header /><main className="info-page">
    <section className="info-hero"><div className="container"><p className="info-hero__eyebrow">{eyebrow}</p><h1>{title}</h1><p className="info-hero__intro">{intro}</p><a href="/contact" className="btn btn--primary">Talk to our team <span aria-hidden="true">→</span></a></div></section>
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
  const brandNames = [...new Set(products.map(p => p.brand).filter(Boolean))].sort((a, b) => a.localeCompare(b));
  return <PageShell eyebrow="Brands" title="Brands available in our range" intro="Browse the manufacturers represented across our current product catalog. Availability can vary by model and project requirement.">
    <section className="info-section container"><div className="info-section__heading"><p className="info-kicker">Product manufacturers</p><h2>Explore by brand</h2><p>Choose a brand to see matching products in the catalog.</p></div>
      {loading ? <p className="info-state">Loading brands…</p> : error ? <p className="info-state">Brands are temporarily unavailable. Please try again later.</p> : brandNames.length ? <div className="brand-grid">{brandNames.map(brand => {
        const matching = products.filter(p => p.brand === brand);
        return <a className="brand-card" href={`/products?q=${encodeURIComponent(brand)}`} key={brand}><span className="brand-card__mark" aria-hidden="true">{brand.slice(0, 1).toUpperCase()}</span><span className="brand-card__body"><strong>{brand}</strong><small>{matching.length} catalog product{matching.length === 1 ? '' : 's'}</small><span className="brand-card__link">View products →</span></span></a>;
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
