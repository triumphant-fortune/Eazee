import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../utils/api';
import { useAuth } from '../context/AuthContext';

const PALETTES = {
  warm: { primary: '#f97316', bg: '#fff7ed', light: '#ffedd5' },
  fresh: { primary: '#16a34a', bg: '#f0fdf4', light: '#dcfce7' },
  royal: { primary: '#7c3aed', bg: '#faf5ff', light: '#ede9fe' },
  ocean: { primary: '#0284c7', bg: '#f0f9ff', light: '#e0f2fe' },
  rose: { primary: '#e11d48', bg: '#fff1f2', light: '#ffe4e6' },
  earth: { primary: '#92400e', bg: '#fef3c7', light: '#fde68a' },
};

const PALETTE_LIST = [
  { id: 'warm', label: 'Warm Sunset', primary: '#f97316', bg: '#fff7ed', text: '#9a3412' },
  { id: 'fresh', label: 'Fresh Green', primary: '#16a34a', bg: '#f0fdf4', text: '#14532d' },
  { id: 'royal', label: 'Royal Purple', primary: '#7c3aed', bg: '#faf5ff', text: '#4c1d95' },
  { id: 'ocean', label: 'Ocean Blue', primary: '#0284c7', bg: '#f0f9ff', text: '#0c4a6e' },
  { id: 'rose', label: 'Rose Pink', primary: '#e11d48', bg: '#fff1f2', text: '#881337' },
  { id: 'earth', label: 'Earth Brown', primary: '#92400e', bg: '#fef3c7', text: '#451a03' },
];

const STOCK_TAGS = [
  { id: 'fully_stocked', label: 'Fully stocked', color: '#16a34a', bg: '#f0fdf4', dot: '#16a34a' },
  { id: 'limited_stock', label: 'Limited stock', color: '#d97706', bg: '#fffbeb', dot: '#d97706' },
  { id: 'running_out', label: 'Running out', color: '#ea580c', bg: '#fff7ed', dot: '#ea580c' },
  { id: 'out_of_stock', label: 'Out of stock', color: '#dc2626', bg: '#fef2f2', dot: '#dc2626' },
];

export default function Dashboard() {
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [addingProduct, setAddingProduct] = useState(false);
  const [generatingDesc, setGeneratingDesc] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [savingProfile, setSavingProfile] = useState(false);
  const [savingProduct, setSavingProduct] = useState(false);

  const [productForm, setProductForm] = useState({
    name: '', price: '', description: '', media: null, mediaPreview: null, mediaType: 'image', stock_tag: 'fully_stocked'
  });

  const [editProductForm, setEditProductForm] = useState({
    name: '', price: '', description: '', stock_tag: 'fully_stocked', is_available: true
  });

  const [profileForm, setProfileForm] = useState({
    business_name: '', bio: '', whatsapp_number: '', palette: 'warm', is_inactive: false, logo: null, logoPreview: null
  });

  const loadData = useCallback(async () => {
    try {
      const [vendorRes, productsRes] = await Promise.all([
        api.get('/api/vendor/profile'),
        api.get('/api/products/mine')
      ]);
      if (vendorRes.error) { navigate('/onboarding'); return; }
      setVendor(vendorRes.vendor);
      setProducts(productsRes.products || []);
      setProfileForm({
        business_name: vendorRes.vendor.business_name || '',
        bio: vendorRes.vendor.bio || '',
        whatsapp_number: vendorRes.vendor.whatsapp_number || '',
        palette: vendorRes.vendor.palette || 'warm',
        is_inactive: vendorRes.vendor.is_inactive || false,
        logo: null,
        logoPreview: vendorRes.vendor.logo_url || null
      });
    } catch {
      navigate('/onboarding');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => { loadData(); }, [loadData]);

  const palette = PALETTES[vendor?.palette] || PALETTES.warm;

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const isVideo = file.type.startsWith('video/');
    setProductForm(f => ({ ...f, media: file, mediaPreview: URL.createObjectURL(file), mediaType: isVideo ? 'video' : 'image' }));
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileForm(f => ({ ...f, logo: file, logoPreview: URL.createObjectURL(file) }));
  };

  const generateDescription = async () => {
    if (!productForm.name) return toast.error('Enter product name first');
    setGeneratingDesc(true);
    try {
      const data = await api.post('/api/ai/description', { product_name: productForm.name, price: productForm.price });
      if (data.description) setProductForm(f => ({ ...f, description: data.description }));
      else toast.error('Could not generate description');
    } catch { toast.error('Could not generate description'); }
    finally { setGeneratingDesc(false); }
  };

  const handleAddProduct = async () => {
    if (!productForm.name || !productForm.price) return toast.error('Name and price are required');
    setAddingProduct(true);
    try {
      const formData = new FormData();
      formData.append('name', productForm.name);
      formData.append('price', productForm.price);
      formData.append('description', productForm.description);
      formData.append('stock_tag', productForm.stock_tag);
      if (productForm.media) formData.append('media', productForm.media);
      const data = await api.postForm('/api/products', formData);
      if (data.error) throw new Error(data.error);
      toast.success('Product added!');
      setProducts(p => [data.product, ...p]);
      setProductForm({ name: '', price: '', description: '', media: null, mediaPreview: null, mediaType: 'image', stock_tag: 'fully_stocked' });
      setShowAddProduct(false);
    } catch (err) { toast.error(err.message); }
    finally { setAddingProduct(false); }
  };

  const handleSaveProfile = async () => {
    if (!profileForm.business_name.trim()) return toast.error('Business name is required');
    if (!profileForm.whatsapp_number.trim()) return toast.error('WhatsApp number is required');
    setSavingProfile(true);
    try {
      const formData = new FormData();
      formData.append('business_name', profileForm.business_name);
      formData.append('bio', profileForm.bio);
      formData.append('whatsapp_number', profileForm.whatsapp_number);
      formData.append('palette', profileForm.palette);
      formData.append('is_inactive', profileForm.is_inactive);
      if (profileForm.logo) formData.append('logo', profileForm.logo);
      const data = await api.postForm('/api/vendor/onboard', formData);
      if (data.error) throw new Error(data.error);
      setVendor(data.vendor);
      toast.success('Profile updated!');
      setShowEditProfile(false);
    } catch (err) { toast.error(err.message); }
    finally { setSavingProfile(false); }
  };

  const handleSaveProduct = async () => {
    if (!editProductForm.name || !editProductForm.price) return toast.error('Name and price are required');
    setSavingProduct(true);
    try {
      const data = await api.put(`/api/products/${editingProduct.id}`, {
        name: editProductForm.name,
        price: editProductForm.price,
        description: editProductForm.description,
        stock_tag: editProductForm.stock_tag,
        is_available: editProductForm.is_available
      });
      if (data.error) throw new Error(data.error);
      setProducts(p => p.map(p => p.id === editingProduct.id ? data.product : p));
      toast.success('Product updated!');
      setEditingProduct(null);
    } catch (err) { toast.error(err.message); }
    finally { setSavingProduct(false); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    const data = await api.delete(`/api/products/${id}`);
    if (data.success) { setProducts(p => p.filter(p => p.id !== id)); toast.success('Product deleted'); }
  };

  const openEditProduct = (product) => {
    setEditProductForm({ name: product.name, price: product.price, description: product.description || '', stock_tag: product.stock_tag || 'fully_stocked', is_available: product.is_available });
    setEditingProduct(product);
  };

  const storeUrl = `${window.location.origin}/store/${vendor?.slug}`;
  const copyLink = () => { navigator.clipboard.writeText(storeUrl); setCopied(true); toast.success('Link copied!'); setTimeout(() => setCopied(false), 2000); };
  const getStockTag = (tag) => STOCK_TAGS.find(t => t.id === tag);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => setShowEditProfile(true)} className="flex items-center gap-3 hover:opacity-80 transition">
            {vendor?.logo_url
              ? <img src={vendor.logo_url} alt="Logo" className="w-9 h-9 rounded-xl object-cover" />
              : <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: palette.primary }}>{vendor?.business_name?.[0]}</div>
            }
            <div className="text-left">
              <p className="font-semibold text-gray-800 text-sm">{vendor?.business_name}</p>
              <p className="text-xs text-gray-400">Tap to edit profile</p>
            </div>
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/captions')}
              className="text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition font-medium"
            >
              Captions
            </button>
            <button onClick={signOut} className="text-xs px-3 py-2 rounded-lg text-gray-400 hover:text-gray-600 transition">Log out</button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Inactive banner */}
        {vendor?.is_inactive && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <p className="font-semibold text-amber-800 text-sm">Your store is inactive</p>
              <p className="text-xs text-amber-600 mt-0.5">Customers see a "be right back" message</p>
            </div>
            <button onClick={() => setShowEditProfile(true)} className="text-xs font-medium text-amber-700 underline">Go live</button>
          </div>
        )}

        {/* Store link */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: palette.bg }}>
          <p className="text-xs font-medium mb-2" style={{ color: palette.primary }}>Your store link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-xl px-3 py-2 text-sm text-gray-600 border border-gray-100 truncate">{storeUrl}</div>
            <button onClick={copyLink} className="px-3 py-2 rounded-xl text-sm font-medium text-white flex-shrink-0" style={{ backgroundColor: palette.primary }}>{copied ? 'Copied' : 'Copy'}</button>
          </div>
          <div className="flex gap-2 mt-3">
            <a href={storeUrl} target="_blank" rel="noreferrer" className="text-xs font-medium px-3 py-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Preview</a>
            <a href={`https://wa.me/?text=Check out my store: ${encodeURIComponent(storeUrl)}`} target="_blank" rel="noreferrer" className="text-xs font-medium px-3 py-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition">Share on WhatsApp</a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100"><p className="text-2xl font-bold text-gray-800">{products.length}</p><p className="text-sm text-gray-400 mt-0.5">Products listed</p></div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100"><p className="text-2xl font-bold text-gray-800">{products.filter(p => p.is_available).length}</p><p className="text-sm text-gray-400 mt-0.5">Available now</p></div>
        </div>

        {/* Add product button */}
        <button onClick={() => setShowAddProduct(true)} className="w-full py-4 rounded-2xl border-2 border-dashed text-sm font-medium transition" style={{ borderColor: palette.primary, color: palette.primary, backgroundColor: palette.bg }}>
          + Add new product
        </button>

        {/* Add Product Form */}
        {showAddProduct && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">New product</h3>
              <button onClick={() => setShowAddProduct(false)} className="text-gray-400 text-xl">×</button>
            </div>
            <label className="block cursor-pointer">
              <div className="w-full h-40 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden hover:border-gray-300 transition">
                {productForm.mediaPreview
                  ? (productForm.mediaType === 'video'
                    ? <video src={productForm.mediaPreview} className="w-full h-full object-cover" />
                    : <img src={productForm.mediaPreview} alt="Product" className="w-full h-full object-cover" />)
                  : <div className="text-center text-gray-400"><svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="mx-auto mb-2"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg><p className="text-sm">Tap to add photo or video</p></div>
                }
              </div>
              <input type="file" accept="image/*,video/*" onChange={handleMediaChange} className="hidden" />
            </label>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Product name *</label>
              <input type="text" value={productForm.name} onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Jollof Rice + Chicken" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 transition" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Price (₦) *</label>
              <input type="number" value={productForm.price} onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))} placeholder="2500" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 transition" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-600">Description</label>
                <button onClick={generateDescription} disabled={generatingDesc} className="text-xs font-medium px-3 py-1 rounded-lg transition" style={{ backgroundColor: palette.bg, color: palette.primary }}>
                  {generatingDesc ? 'Writing...' : 'AI write it'}
                </button>
              </div>
              <textarea value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe this product..." rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 transition resize-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Stock status</label>
              <div className="grid grid-cols-2 gap-2">
                {STOCK_TAGS.map(tag => (
                  <button key={tag.id} onClick={() => setProductForm(f => ({ ...f, stock_tag: tag.id }))}
                    className={`px-3 py-2 rounded-xl text-xs font-medium border-2 transition text-left flex items-center gap-2 ${productForm.stock_tag === tag.id ? 'border-gray-800' : 'border-transparent'}`}
                    style={{ backgroundColor: tag.bg }}>
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: tag.dot }} />
                    <span style={{ color: tag.color }}>{tag.label}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowAddProduct(false)} className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl text-sm">Cancel</button>
              <button onClick={handleAddProduct} disabled={addingProduct} className="flex-1 text-white font-semibold py-3 rounded-xl disabled:opacity-60 text-sm" style={{ backgroundColor: palette.primary }}>{addingProduct ? 'Adding...' : 'Add product'}</button>
            </div>
          </div>
        )}

        {/* Product list */}
        {products.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm px-1">Your products</h3>
            {products.map(product => {
              const stockTag = getStockTag(product.stock_tag);
              return (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex">
                  {product.media_url && (
                    <div className="w-24 h-24 flex-shrink-0">
                      {product.media_type === 'video'
                        ? <video src={product.media_url} className="w-full h-full object-cover" />
                        : <img src={product.media_url} alt={product.name} className="w-full h-full object-cover" />}
                    </div>
                  )}
                  <div className="flex-1 p-3 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800 text-sm truncate">{product.name}</p>
                        <p className="text-sm font-bold mt-0.5" style={{ color: palette.primary }}>₦{Number(product.price).toLocaleString()}</p>
                        {stockTag && (
                          <span className="inline-flex items-center gap-1.5 mt-1 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: stockTag.bg, color: stockTag.color }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stockTag.dot }} />
                            {stockTag.label}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col items-end gap-2 flex-shrink-0">
                        <button onClick={() => openEditProduct(product)} className="text-xs px-2 py-1 rounded-lg font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition">Edit</button>
                        <button onClick={() => handleDeleteProduct(product.id)} className="text-xs text-red-400 hover:text-red-600 transition">Delete</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {products.length === 0 && !showAddProduct && (
          <div className="text-center py-12 text-gray-400">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 mx-auto mb-4 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1.5"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
            </div>
            <p className="font-medium text-gray-500">No products yet</p>
            <p className="text-sm mt-1">Add your first product to go live</p>
          </div>
        )}
      </div>

      {/* Edit Profile Modal */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-3xl p-5 pb-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Edit profile</h2>
              <button onClick={() => setShowEditProfile(false)} className="text-gray-400 text-2xl">×</button>
            </div>
            <div className="flex justify-center mb-4">
              <label className="cursor-pointer">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-dashed border-gray-200 flex items-center justify-center hover:border-orange-400 transition">
                  {profileForm.logoPreview
                    ? <img src={profileForm.logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    : <div className="text-center text-gray-400 text-xs">Add logo</div>}
                </div>
                <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
              </label>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Business name *</label>
                <input type="text" value={profileForm.business_name} onChange={e => setProfileForm(f => ({ ...f, business_name: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Bio</label>
                <textarea value={profileForm.bio} onChange={e => setProfileForm(f => ({ ...f, bio: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 transition resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">WhatsApp number *</label>
                <input type="tel" value={profileForm.whatsapp_number} onChange={e => setProfileForm(f => ({ ...f, whatsapp_number: e.target.value }))} placeholder="+2348012345678" className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Brand colour</label>
                <div className="grid grid-cols-3 gap-2">
                  {PALETTE_LIST.map(p => (
                    <button key={p.id} onClick={() => setProfileForm(f => ({ ...f, palette: p.id }))}
                      className={`p-2 rounded-xl border-2 flex items-center gap-2 transition ${profileForm.palette === p.id ? 'border-gray-800' : 'border-transparent'}`}
                      style={{ backgroundColor: p.bg }}>
                      <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: p.primary }} />
                      <span className="text-xs font-medium truncate" style={{ color: p.text }}>{p.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-800">Set store as inactive</p>
                  <p className="text-xs text-gray-400 mt-0.5">Shows "be right back" to customers</p>
                </div>
                <button onClick={() => setProfileForm(f => ({ ...f, is_inactive: !f.is_inactive }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${profileForm.is_inactive ? 'bg-orange-500' : 'bg-gray-200'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${profileForm.is_inactive ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
              <button onClick={handleSaveProfile} disabled={savingProfile} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60">
                {savingProfile ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center">
          <div className="bg-white w-full max-w-lg rounded-t-3xl p-5 pb-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Edit product</h2>
              <button onClick={() => setEditingProduct(null)} className="text-gray-400 text-2xl">×</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Product name *</label>
                <input type="text" value={editProductForm.name} onChange={e => setEditProductForm(f => ({ ...f, name: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Price (₦) *</label>
                <input type="number" value={editProductForm.price} onChange={e => setEditProductForm(f => ({ ...f, price: e.target.value }))} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 transition" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Description</label>
                <textarea value={editProductForm.description} onChange={e => setEditProductForm(f => ({ ...f, description: e.target.value }))} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 transition resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 mb-2">Stock status</label>
                <div className="grid grid-cols-2 gap-2">
                  {STOCK_TAGS.map(tag => (
                    <button key={tag.id} onClick={() => setEditProductForm(f => ({ ...f, stock_tag: tag.id }))}
                      className={`px-3 py-2 rounded-xl text-xs font-medium border-2 transition text-left flex items-center gap-2 ${editProductForm.stock_tag === tag.id ? 'border-gray-800' : 'border-transparent'}`}
                      style={{ backgroundColor: tag.bg }}>
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: tag.dot }} />
                      <span style={{ color: tag.color }}>{tag.label}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div>
                  <p className="text-sm font-medium text-gray-800">Show on storefront</p>
                  <p className="text-xs text-gray-400 mt-0.5">Hide to remove from public view</p>
                </div>
                <button onClick={() => setEditProductForm(f => ({ ...f, is_available: !f.is_available }))}
                  className={`w-12 h-6 rounded-full transition-colors relative ${editProductForm.is_available ? 'bg-green-500' : 'bg-gray-200'}`}>
                  <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${editProductForm.is_available ? 'translate-x-7' : 'translate-x-1'}`} />
                </button>
              </div>
              <button onClick={handleSaveProduct} disabled={savingProduct} className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60">
                {savingProduct ? 'Saving...' : 'Save changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
