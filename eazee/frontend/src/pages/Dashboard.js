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

  const [productForm, setProductForm] = useState({
    name: '', price: '', description: '', media: null, mediaPreview: null, mediaType: 'image'
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
    setProductForm(f => ({
      ...f, media: file,
      mediaPreview: URL.createObjectURL(file),
      mediaType: isVideo ? 'video' : 'image'
    }));
  };

  const generateDescription = async () => {
    if (!productForm.name) return toast.error('Enter product name first');
    setGeneratingDesc(true);
    try {
      const data = await api.post('/api/ai/description', { product_name: productForm.name, price: productForm.price });
      if (data.description) setProductForm(f => ({ ...f, description: data.description }));
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
      if (productForm.media) formData.append('media', productForm.media);

      const data = await api.postForm('/api/products', formData);
      if (data.error) throw new Error(data.error);

      toast.success('Product added!');
      setProducts(p => [data.product, ...p]);
      setProductForm({ name: '', price: '', description: '', media: null, mediaPreview: null, mediaType: 'image' });
      setShowAddProduct(false);
    } catch (err) { toast.error(err.message); }
    finally { setAddingProduct(false); }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    const data = await api.delete(`/api/products/${id}`);
    if (data.success) {
      setProducts(p => p.filter(p => p.id !== id));
      toast.success('Product deleted');
    }
  };

  const toggleAvailability = async (product) => {
    const data = await api.put(`/api/products/${product.id}`, { ...product, is_available: !product.is_available });
    if (data.success) {
      setProducts(p => p.map(p => p.id === product.id ? data.product : p));
    }
  };

  const storeUrl = `${window.location.origin}/store/${vendor?.slug}`;

  const copyLink = () => {
    navigator.clipboard.writeText(storeUrl);
    setCopied(true);
    toast.success('Link copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {vendor?.logo_url ? (
              <img src={vendor.logo_url} alt="Logo" className="w-9 h-9 rounded-xl object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: palette.primary }}>
                {vendor?.business_name?.[0]}
              </div>
            )}
            <div>
              <p className="font-semibold text-gray-800 text-sm">{vendor?.business_name}</p>
              <p className="text-xs text-gray-400">Dashboard</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/captions')}
              className="text-xs px-3 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition font-medium"
            >
              ✍️ Captions
            </button>
            <button
              onClick={signOut}
              className="text-xs px-3 py-2 rounded-lg text-gray-400 hover:text-gray-600 transition"
            >
              Log out
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-4">
        {/* Store link card */}
        <div className="rounded-2xl p-4" style={{ backgroundColor: palette.bg }}>
          <p className="text-xs font-medium mb-2" style={{ color: palette.primary }}>Your store link</p>
          <div className="flex items-center gap-2">
            <div className="flex-1 bg-white rounded-xl px-3 py-2 text-sm text-gray-600 border border-gray-100 truncate">
              {storeUrl}
            </div>
            <button
              onClick={copyLink}
              className="px-3 py-2 rounded-xl text-sm font-medium text-white transition flex-shrink-0"
              style={{ backgroundColor: palette.primary }}
            >
              {copied ? '✓ Copied' : 'Copy'}
            </button>
          </div>
          <div className="flex gap-2 mt-3">
            <a
              href={storeUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium px-3 py-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              👁 Preview store
            </a>
            <a
              href={`https://wa.me/?text=Check out my store: ${encodeURIComponent(storeUrl)}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium px-3 py-2 bg-white rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
            >
              💬 Share on WhatsApp
            </a>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-2xl font-bold text-gray-800">{products.length}</p>
            <p className="text-sm text-gray-400 mt-0.5">Products listed</p>
          </div>
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <p className="text-2xl font-bold text-gray-800">{products.filter(p => p.is_available).length}</p>
            <p className="text-sm text-gray-400 mt-0.5">Available now</p>
          </div>
        </div>

        {/* Add Product Button */}
        <button
          onClick={() => setShowAddProduct(true)}
          className="w-full py-4 rounded-2xl border-2 border-dashed text-sm font-medium transition"
          style={{ borderColor: palette.primary, color: palette.primary, backgroundColor: palette.bg }}
        >
          + Add new product
        </button>

        {/* Add Product Form */}
        {showAddProduct && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-800">New product</h3>
              <button onClick={() => setShowAddProduct(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>

            {/* Media upload */}
            <label className="block cursor-pointer">
              <div className="w-full h-40 rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center overflow-hidden hover:border-gray-300 transition">
                {productForm.mediaPreview ? (
                  productForm.mediaType === 'video' ? (
                    <video src={productForm.mediaPreview} className="w-full h-full object-cover" />
                  ) : (
                    <img src={productForm.mediaPreview} alt="Product" className="w-full h-full object-cover" />
                  )
                ) : (
                  <div className="text-center">
                    <div className="text-3xl">🖼</div>
                    <p className="text-sm text-gray-400 mt-1">Tap to add photo or video</p>
                  </div>
                )}
              </div>
              <input type="file" accept="image/*,video/*" onChange={handleMediaChange} className="hidden" />
            </label>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Product name *</label>
              <input
                type="text"
                value={productForm.name}
                onChange={e => setProductForm(f => ({ ...f, name: e.target.value }))}
                placeholder="e.g. Jollof Rice + Chicken"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Price (₦) *</label>
              <input
                type="number"
                value={productForm.price}
                onChange={e => setProductForm(f => ({ ...f, price: e.target.value }))}
                placeholder="2500"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-sm font-medium text-gray-600">Description</label>
                <button
                  onClick={generateDescription}
                  disabled={generatingDesc}
                  className="text-xs font-medium px-3 py-1 rounded-lg transition"
                  style={{ backgroundColor: palette.bg, color: palette.primary }}
                >
                  {generatingDesc ? 'Generating...' : '✨ AI write it'}
                </button>
              </div>
              <textarea
                value={productForm.description}
                onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))}
                placeholder="Describe this product..."
                rows={3}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition resize-none"
              />
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowAddProduct(false)}
                className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition text-sm"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                disabled={addingProduct}
                className="flex-1 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60 text-sm"
                style={{ backgroundColor: palette.primary }}
              >
                {addingProduct ? 'Adding...' : 'Add product'}
              </button>
            </div>
          </div>
        )}

        {/* Product list */}
        {products.length > 0 && (
          <div className="space-y-3">
            <h3 className="font-semibold text-gray-700 text-sm px-1">Your products</h3>
            {products.map(product => (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex">
                {product.media_url && (
                  <div className="w-24 h-24 flex-shrink-0">
                    {product.media_type === 'video' ? (
                      <video src={product.media_url} className="w-full h-full object-cover" />
                    ) : (
                      <img src={product.media_url} alt={product.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                )}
                <div className="flex-1 p-3 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-800 text-sm truncate">{product.name}</p>
                      <p className="text-sm font-bold mt-0.5" style={{ color: palette.primary }}>₦{Number(product.price).toLocaleString()}</p>
                      {product.description && (
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description}</p>
                      )}
                    </div>
                    <div className="flex flex-col items-end gap-2 flex-shrink-0">
                      <button
                        onClick={() => toggleAvailability(product)}
                        className={`text-xs px-2 py-1 rounded-lg font-medium transition ${product.is_available ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}
                      >
                        {product.is_available ? 'Live' : 'Hidden'}
                      </button>
                      <button
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-xs text-red-400 hover:text-red-600 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {products.length === 0 && !showAddProduct && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-5xl mb-3">📦</div>
            <p className="font-medium text-gray-500">No products yet</p>
            <p className="text-sm mt-1">Add your first product to go live</p>
          </div>
        )}
      </div>
    </div>
  );
}
