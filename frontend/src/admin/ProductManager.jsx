import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import { ADD_PRODUCT, DELETE_PRODUCT, GET_CATEGORIES, GET_PRODUCTS, UPDATE_PRODUCT } from '../graphql/queries';

const emptyProduct = { name: '', description: '', category: '', image: '', brand: '', price: '', inStock: true };

export default function ProductManager() {
  const { data, loading, error } = useQuery(GET_PRODUCTS);
  const { data: categoryData } = useQuery(GET_CATEGORIES);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [message, setMessage] = useState('');
  const refresh = [{ query: GET_PRODUCTS }];
  const [addProduct, { loading: adding }] = useMutation(ADD_PRODUCT, { refetchQueries: refresh, onCompleted: () => finish('Product added.') });
  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, { refetchQueries: refresh, onCompleted: () => finish('Product updated.') });
  const [deleteProduct] = useMutation(DELETE_PRODUCT, { refetchQueries: refresh, onCompleted: () => setMessage('Product deleted.') });
  const products = data?.products || [];
  const categories = categoryData?.categories || [];

  function finish(text) { setMessage(text); setEditing(null); setForm(emptyProduct); }
  function beginEdit(product) {
    setMessage(''); setEditing(product.id);
    setForm({ name: product.name, description: product.description || '', category: product.category, image: product.image || '', brand: product.brand || '', price: product.price ?? '', inStock: product.inStock !== false });
  }
  function submit(event) {
    event.preventDefault(); setMessage('');
    const input = { ...form, price: form.price === '' ? null : Number(form.price) };
    const action = editing ? updateProduct({ variables: { id: editing, ...input } }) : addProduct({ variables: input });
    action.catch((e) => setMessage(e.message));
  }
  function remove(product) {
    if (window.confirm(`Delete “${product.name}”? This cannot be undone.`)) {
      deleteProduct({ variables: { id: product.id } }).catch((e) => setMessage(e.message));
    }
  }

  return <section className="product-admin">
    <div className="product-admin__header"><div><h2>Products</h2><p>Add, edit, and remove products shown on the website.</p></div><button className="product-admin__primary" onClick={() => { setEditing(null); setForm({ ...emptyProduct, category: categories[0]?.slug || '' }); setMessage(''); }}>+ Add Product</button></div>
    {message && <p className="product-admin__message" role="status">{message}</p>}
    {(editing !== null || form.name === '' && message === '') && form.category && <form className="product-admin__form" onSubmit={submit}>
      <h3>{editing ? 'Edit product' : 'Add a product'}</h3>
      <div className="product-admin__fields">
        <label>Product name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></label>
        <label>Brand<input value={form.brand} onChange={e => setForm({ ...form, brand: e.target.value })} /></label>
        <label>Category<select required value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>{categories.map(c => <option key={c.id} value={c.slug}>{c.name}</option>)}</select></label>
        <label>Price<input type="number" min="0" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} /></label>
        <label className="product-admin__wide">Image URL<input type="url" placeholder="https://…" value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} /></label>
        <label className="product-admin__wide">Description<textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></label>
        <label className="product-admin__stock"><input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} /> In stock</label>
      </div>
      <div className="product-admin__form-actions"><button className="product-admin__primary" disabled={adding || updating}>{adding || updating ? 'Saving…' : editing ? 'Save changes' : 'Add product'}</button><button type="button" className="product-admin__secondary" onClick={() => { setEditing(null); setForm(emptyProduct); }}>Cancel</button></div>
    </form>}
    {loading ? <p>Loading products…</p> : error ? <p className="product-admin__error">Could not load products: {error.message}</p> : products.length === 0 ? <p className="product-admin__empty">No products yet.</p> : <div className="product-admin__table-wrap"><table className="product-admin__table"><thead><tr><th>Product</th><th>Category</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead><tbody>{products.map(p => <tr key={p.id}><td><div className="product-admin__item">{p.image && <img src={p.image} alt="" />}<span><strong>{p.name}</strong><small>{p.brand}</small></span></div></td><td>{categories.find(c => c.slug === p.category)?.name || p.category}</td><td>{p.price == null ? '—' : `₹${Number(p.price).toLocaleString('en-IN')}`}</td><td>{p.inStock === false ? 'Out of stock' : 'In stock'}</td><td className="product-admin__actions"><button onClick={() => beginEdit(p)}>Edit</button><button className="product-admin__delete" onClick={() => remove(p)}>Delete</button></td></tr>)}</tbody></table></div>}
  </section>;
}
