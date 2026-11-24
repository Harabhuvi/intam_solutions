import React, { useEffect, useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { GET_FOOTER_CONTENT, UPDATE_FOOTER_CONTENT } from '../graphql/queries';

const toLines = (items, social = false) => (items || []).map(item => [item.label, item.href, ...(social ? [item.icon || ''] : [])].join(' | ')).join('\n');
const fromLines = (value, social = false) => value.split('\n').map(line => line.trim()).filter(Boolean).map(line => {
  const [label = '', href = '', icon = ''] = line.split('|').map(part => part.trim());
  return social ? { label, href, icon } : { label, href };
}).filter(link => link.label && link.href);
const fields = [
  ['ctaTitle', 'CTA heading'], ['ctaDescription', 'CTA description', 'textarea'],
  ['ctaContactLabel', 'Contact button label'], ['ctaContactHref', 'Contact button link'],
  ['whatsappLabel', 'WhatsApp button label'], ['whatsappHref', 'WhatsApp link'],
  ['brandName', 'Footer brand name'], ['tagline', 'Tagline'], ['brandDescription', 'Brand description', 'textarea'],
  ['quickLinksTitle', 'Quick links heading'], ['servicesTitle', 'Services heading'], ['contactTitle', 'Contact heading'],
  ['phone', 'Phone number'], ['phoneHref', 'Phone link (tel:...)'], ['email', 'Email address'], ['emailHref', 'Email link (mailto:...)'],
  ['address', 'Address / location'], ['copyrightText', 'Copyright text'],
];

export default function FooterManager() {
  const { data, loading, error } = useQuery(GET_FOOTER_CONTENT);
  const [updateFooterContent, { loading: saving }] = useMutation(UPDATE_FOOTER_CONTENT, { refetchQueries: [{ query: GET_FOOTER_CONTENT }] });
  const [form, setForm] = useState(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const footer = data?.footerContent;
    if (!footer) return;
    setForm({ ...footer, quickLinksText: toLines(footer.quickLinks), serviceLinksText: toLines(footer.serviceLinks), socialLinksText: toLines(footer.socialLinks, true) });
  }, [data]);

  function updateField(key, value) { setForm(current => ({ ...current, [key]: value })); }
  async function submit(event) {
    event.preventDefault(); setStatus('');
    const content = { ...form };
    delete content.__typename;
    delete content.quickLinksText; delete content.serviceLinksText; delete content.socialLinksText;
    content.quickLinks = fromLines(form.quickLinksText);
    content.serviceLinks = fromLines(form.serviceLinksText);
    content.socialLinks = fromLines(form.socialLinksText, true);
    try {
      await updateFooterContent({ variables: { content } });
      setStatus('Footer saved. The public website now uses this content.');
    } catch (err) { setStatus(`Could not save footer: ${err.message}`); }
  }

  if (loading || !form) return <section className="footer-admin"><h1>Footer content</h1><p>Loading footer settings…</p></section>;
  if (error) return <section className="footer-admin"><h1>Footer content</h1><p className="footer-admin__error">Could not load footer settings: {error.message}</p></section>;

  return <section className="footer-admin">
    <header className="footer-admin__header"><div><h1>Footer content</h1><p>Edit the content shown in the website footer. Changes are saved to the site database.</p></div></header>
    {status && <p className="footer-admin__status" role="status">{status}</p>}
    <form onSubmit={submit}>
      <div className="footer-admin__grid">{fields.map(([key, label, type]) => <label key={key} className={type === 'textarea' ? 'footer-admin__wide' : ''}>{label}{type === 'textarea' ? <textarea rows="3" value={form[key] || ''} onChange={e => updateField(key, e.target.value)} /> : <input value={form[key] || ''} onChange={e => updateField(key, e.target.value)} />}</label>)}
        <label className="footer-admin__wide">Quick links (one per line: label | URL)<textarea rows="5" value={form.quickLinksText || ''} onChange={e => updateField('quickLinksText', e.target.value)} placeholder={'Home | /\nProducts | /products'} /></label>
        <label className="footer-admin__wide">Service links (one per line: label | URL)<textarea rows="5" value={form.serviceLinksText || ''} onChange={e => updateField('serviceLinksText', e.target.value)} placeholder={'Projects | /projects\nServices & AMC | /services'} /></label>
        <label className="footer-admin__wide">Social links (one per line: label | URL | icon text)<textarea rows="4" value={form.socialLinksText || ''} onChange={e => updateField('socialLinksText', e.target.value)} placeholder={'Facebook | https://facebook.com/... | f'} /></label>
      </div>
      <div className="footer-admin__actions"><button className="product-admin__primary" disabled={saving}>{saving ? 'Saving…' : 'Save footer'}</button></div>
    </form>
  </section>;
}
