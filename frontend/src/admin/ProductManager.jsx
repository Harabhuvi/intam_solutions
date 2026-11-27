import React, { useState } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  ADD_CATEGORY,
  ADD_PRODUCT,
  DELETE_CATEGORY,
  DELETE_PRODUCT,
  GET_CATEGORIES,
  GET_PRODUCTS,
  UPDATE_CATEGORY,
  UPDATE_PRODUCT,
} from '../graphql/queries';

const emptyProduct = { name: '', description: '', category: '', image: '', brand: '', price: '', inStock: true };
const emptyCategory = { name: '', slug: '', description: '', image: '', icon: '' };

const slugify = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export default function ProductManager() {
  const { data, loading, error } = useQuery(GET_PRODUCTS);
  const { data: categoryData } = useQuery(GET_CATEGORIES);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyProduct);
  const [message, setMessage] = useState('');
  const [catOpen, setCatOpen] = useState(false);
  const [editingCat, setEditingCat] = useState(null);
  const [catForm, setCatForm] = useState(emptyCategory);
  const [catMessage, setCatMessage] = useState('');
  const refresh = [{ query: GET_PRODUCTS }];
  const refreshCats = [{ query: GET_CATEGORIES }];
  const [addProduct, { loading: adding }] = useMutation(ADD_PRODUCT, { refetchQueries: refresh, onCompleted: () => finish('Product added.') });
  const [updateProduct, { loading: updating }] = useMutation(UPDATE_PRODUCT, { refetchQueries: refresh, onCompleted: () => finish('Product updated.') });
  const [deleteProduct] = useMutation(DELETE_PRODUCT, { refetchQueries: refresh, onCompleted: () => setMessage('Product deleted.') });
  const [addCategory, { loading: addingCat }] = useMutation(ADD_CATEGORY, { refetchQueries: refreshCats, onCompleted: () => finishCat('Category added.') });
  const [updateCategory, { loading: updatingCat }] = useMutation(UPDATE_CATEGORY, { refetchQueries: refreshCats, onCompleted: () => finishCat('Category updated.') });
  const [deleteCategory] = useMutation(DELETE_CATEGORY, { refetchQueries: refreshCats, onCompleted: () => setCatMessage('Category deleted.') });
  const products = data?.products || [];
  const categories = categoryData?.categories || [];

  function finish(text) { setMessage(text); setEditing(null); setForm(emptyProduct); }
  function finishCat(text) { setCatMessage(text); setEditingCat(null); setCatForm(emptyCategory); }
  function beginEdit(product) {
    setMessage(''); setEditing(product.id);
    setForm({ name: product.name, description: product.description || '', category: product.category, image: product.image || '', brand: product.brand || '', price: product.price ?? '', inStock: product.inStock !== false });
  }
  function beginEditCat(cat) {
    setCatMessage(''); setEditingCat(cat.id); setCatOpen(true);
    setCatForm({ name: cat.name, slug: cat.slug, description: cat.description || '', image: cat.image || '', icon: cat.icon || '' });
  }
  function submit(event) {
    event.preventDefault(); setMessage('');
    const input = { ...form, price: form.price === '' ? null : Number(form.price) };
    const action = editing ? updateProduct({ variables: { id: editing, ...input } }) : addProduct({ variables: input });
    action.catch((e) => setMessage(e.message));
  }
  function submitCat(event) {
    event.preventDefault(); setCatMessage('');
    const slug = slugify(catForm.slug || catForm.name);
    if (!slug) { setCatMessage('Please provide a valid category name or slug.'); return; }
    const input = { ...catForm, slug };
    const action = editingCat
      ? updateCategory({ variables: { id: editingCat, ...input } })
      : addCategory({ variables: input });
    action.catch((e) => setCatMessage(e.message));
  }
  function remove(product) {
    if (window.confirm(`Delete “${product.name}”? This cannot be undone.`)) {
      deleteProduct({ variables: { id: product.id } }).catch((e) => setMessage(e.message));
    }
  }
  function removeCat(cat) {
    if (window.confirm(`Delete category “${cat.name}”? Products in this category will still keep their slug.`)) {
      deleteCategory({ variables: { id: cat.id } }).catch((e) => setCatMessage(e.message));
    }
  }

  return <section className="product-admin">
    <div className="product-admin__header">
      <div><h2>Products</h2><p>Add, edit, and remove products and categories shown on the website.</p></div>
      <div className="product-admin__form-actions">
        <button type="button" className="product-admin__secondary" onClick={() => { setCatOpen((v) => !v); setCatMessage(''); }}>
          {catOpen ? 'Hide Categories' : `Manage Categories (${categories.length})`}
        </button>
        <button className="product-admin__primary" onClick={() => { setEditing(null); setForm({ ...emptyProduct, category: categories[0]?.slug || '' }); setMessage(''); }}>+ Add Product</button>
      </div>
    </div>

    {catOpen && (
      <div className="product-admin__form" style={{ marginBottom: '1.5rem' }}>
        <h3>{editingCat ? 'Edit category' : 'Manage Categories'}</h3>
        {catMessage && <p className="product-admin__message" role="status">{catMessage}</p>}
        <form onSubmit={submitCat}>
          <div className="product-admin__fields">
            <label>Category name<input required value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value, slug: editingCat ? catForm.slug : slugify(e.target.value) })} /></label>
            <label>Slug<input required value={catForm.slug} onChange={e => setCatForm({ ...catForm, slug: slugify(e.target.value) })} /></label>
            <label>Icon<input placeholder="e.g. 📷" value={catForm.icon} onChange={e => setCatForm({ ...catForm, icon: e.target.value })} /></label>
            <label>Image URL<input type="url" placeholder="https://…" value={catForm.image} onChange={e => setCatForm({ ...catForm, image: e.target.value })} /></label>
            <label className="product-admin__wide">Description<textarea rows="2" value={catForm.description} onChange={e => setCatForm({ ...catForm, description: e.target.value })} /></label>
          </div>
          <div className="product-admin__form-actions">
            <button className="product-admin__primary" disabled={addingCat || updatingCat}>{addingCat || updatingCat ? 'Saving…' : editingCat ? 'Save category' : '+ Add category'}</button>
            {editingCat && <button type="button" className="product-admin__secondary" onClick={() => { setEditingCat(null); setCatForm(emptyCategory); }}>Cancel edit</button>}
          </div>
        </form>
        {categories.length > 0 && (
          <div className="product-admin__table-wrap" style={{ marginTop: '1rem' }}>
            <table className="product-admin__table">
              <thead><tr><th>Name</th><th>Slug</th><th>Description</th><th>Actions</th></tr></thead>
              <tbody>
                {categories.map((cat) => (
                  <tr key={cat.id}>
                    <td><strong>{cat.icon ? `${cat.icon} ` : ''}{cat.name}</strong></td>
                    <td><code>{cat.slug}</code></td>
                    <td>{cat.description || '—'}</td>
                    <td className="product-admin__actions">
                      <button type="button" onClick={() => beginEditCat(cat)}>Edit</button>
                      <button type="button" className="product-admin__delete" onClick={() => removeCat(cat)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    )}
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
