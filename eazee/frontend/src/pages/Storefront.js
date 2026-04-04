import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PALETTES = {
  warm: { primary: '#f97316', bg: '#fff7ed', light: '#ffedd5', text: '#9a3412' },
  fresh: { primary: '#16a34a', bg: '#f0fdf4', light: '#dcfce7', text: '#14532d' },
  royal: { primary: '#7c3aed', bg: '#faf5ff', light: '#ede9fe', text: '#4c1d95' },
  ocean: { primary: '#0284c7', bg: '#f0f9ff', light: '#e0f2fe', text: '#0c4a6e' },
  rose: { primary: '#e11d48', bg: '#fff1f2', light: '#ffe4e6', text: '#881337' },
  earth: { primary: '#92400e', bg: '#fef3c7', light: '#fde68a', text: '#451a03' },
};

const STOCK_TAGS = {
  fully_stocked: { label: 'Fully stocked', color: '#16a34a', bg: '#f0fdf4' },
  limited_stock: { label: 'Limited stock', color: '#d97706', bg: '#fffbeb' },
  running_out: { label: 'Running out', color: '#ea580c', bg: '#fff7ed' },
  out_of_stock: { label: 'Out of stock', color: '#dc2626', bg: '#fef2f2' },
};

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000';

export default function Storefront() {
  const { slug } = useParams();
  const [vendor, setVendor] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetch(`${API_URL}/api/storefront/${slug}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setNotFound(true); return; }
        setVendor(data.vendor);
        setProducts(data.products);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-8 h-8 border-4 border-orange-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (notFound) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-xl font-semibold text-gray-800">Store not found</h1>
        <p className="text-gray-400 mt-2 text-sm">This store link doesn't exist or has been removed.</p>
      </div>
    </div>
  );

  const palette = PALETTES[vendor?.palette] || PALETTES.warm;

  // Inactive store
  if (vendor?.is_inactive) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: palette.bg }}>
      <div className="text-center max-w-sm">
        {vendor.logo_url ? (
          <img src={vendor.logo_url} alt="Logo" className="w-24 h-24 rounded-2xl object-cover mx-auto mb-5 shadow-sm" />
        ) : (
          <div className="w-24 h-24 rounded-2xl mx-auto mb-5 flex items-center justify-center text-white text-4xl font-bold shadow-sm" style={{ backgroundColor: palette.primary }}>
            {vendor.business_name?.[0]}
          </div>
        )}
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{vendor.business_name}</h1>
        <div className="text-5xl my-6">🤧</div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Be right back!</h2>
        <p className="text-gray-500 text-sm leading-relaxed mb-1">
          <span className="font-semibold" style={{ color: palette.primary }}>{vendor.business_name}</span> will be back shortly.
        </p>
        <p className="text-gray-400 text-sm">Don't leave just yet — good things are coming! 🙏</p>
        {vendor.whatsapp_number && (
          <a href={`https://wa.me/${vendor.whatsapp_number.replace(/\D/g, '')}?text=Hi! I visited your Eazee store and wanted to reach out.`}
            target="_blank" rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold text-sm"
            style={{ backgroundColor: '#25D366' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Message us on WhatsApp
          </a>
        )}
      </div>
      <p className="absolute bottom-6 text-xs text-gray-300">Powered by <span className="font-semibold text-gray-400">Eazee</span></p>
    </div>
  );

  const buildWhatsAppLink = (product) => {
    const number = vendor.whatsapp_number.replace(/\D/g, '');
    const message = `Hi! I'd like to order *${product.name}* for ₦${Number(product.price).toLocaleString()} from your Eazee store.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <div className="py-10 px-4" style={{ backgroundColor: palette.bg }}>
        <div className="max-w-3xl mx-auto text-center">
          {vendor.logo_url ? (
            <img src={vendor.logo_url} alt="Logo" className="w-24 h-24 rounded-2xl object-cover mx-auto mb-4 shadow-sm" />
          ) : (
            <div className="w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center text-white text-4xl font-bold shadow-sm" style={{ backgroundColor: palette.primary }}>
              {vendor.business_name?.[0]}
            </div>
          )}
          <h1 className="text-3xl font-bold text-gray-900">{vendor.business_name}</h1>
          {vendor.bio && <p className="mt-2 text-sm text-gray-500 max-w-md mx-auto leading-relaxed">{vendor.bio}</p>}
          <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: palette.light, color: palette.text }}>
            <span>●</span> Store is open
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {products.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <div className="w-16 h-16 rounded-2xl bg-gray-100 mx-auto mb-4 flex items-center justify-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 7H4a2 2 0 00-2 2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
            </div>
            <p className="font-medium text-gray-500">No products yet</p>
            <p className="text-sm mt-1">Check back soon!</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-5 font-medium">{products.length} product{products.length !== 1 ? 's' : ''} available</p>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: '16px' }}>
              {products.map(product => {
                const stockTag = STOCK_TAGS[product.stock_tag];
                const isOutOfStock = product.stock_tag === 'out_of_stock';
                return (
                  <button
                    key={product.id}
                    onClick={() => !isOutOfStock && setSelectedProduct(product)}
                    className={`bg-white rounded-2xl overflow-hidden border border-gray-100 text-left transition-all ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-lg hover:-translate-y-0.5'}`}
                    style={{ transition: 'box-shadow 0.2s, transform 0.2s' }}
                  >
                    {/* Square image */}
                    <div className="w-full relative" style={{ paddingBottom: '100%' }}>
                      <div className="absolute inset-0 overflow-hidden" style={{ backgroundColor: palette.light }}>
                        {product.media_url ? (
                          product.media_type === 'video' ? (
                            <video src={product.media_url} className="w-full h-full object-cover" muted />
                          ) : (
                            <img src={product.media_url} alt={product.name} className="w-full h-full object-cover" />
                          )
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1"><path d="M21 19V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14l3-3h12l3 3z"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                          </div>
                        )}
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                            <span className="text-xs font-bold text-red-500 bg-white px-2 py-1 rounded-full shadow-sm">Out of stock</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-3">
                      <p className="font-semibold text-gray-800 text-sm leading-tight truncate">{product.name}</p>
                      <p className="font-bold text-sm mt-1" style={{ color: palette.primary }}>₦{Number(product.price).toLocaleString()}</p>
                      {stockTag && !isOutOfStock && (
                        <span className="inline-flex items-center gap-1.5 mt-1.5 text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: stockTag.bg, color: stockTag.color }}>
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: stockTag.color }} />
                          {stockTag.label}
                        </span>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div className="text-center py-10 text-xs text-gray-300">
        Powered by <span className="font-semibold text-gray-400">Eazee</span>
      </div>

      {/* Product modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {selectedProduct.media_url && (
              <div className="w-full overflow-hidden bg-gray-100" style={{ aspectRatio: selectedProduct.media_type === 'video' ? '9/16' : '1/1', maxHeight: '60vh' }}>
                {selectedProduct.media_type === 'video' ? (
                  <video src={selectedProduct.media_url} className="w-full h-full object-cover" controls />
                ) : (
                  <img src={selectedProduct.media_url} alt={selectedProduct.name} className="w-full h-full object-cover" />
                )}
              </div>
            )}
            <div className="p-5">
              <h2 className="text-xl font-bold text-gray-800">{selectedProduct.name}</h2>
              <p className="text-2xl font-bold mt-1" style={{ color: palette.primary }}>₦{Number(selectedProduct.price).toLocaleString()}</p>
              {selectedProduct.stock_tag && STOCK_TAGS[selectedProduct.stock_tag] && (
                <span className="inline-flex items-center gap-1.5 mt-2 text-xs font-medium px-2 py-1 rounded-full" style={{ backgroundColor: STOCK_TAGS[selectedProduct.stock_tag].bg, color: STOCK_TAGS[selectedProduct.stock_tag].color }}>
                  <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: STOCK_TAGS[selectedProduct.stock_tag].color }} />
                  {STOCK_TAGS[selectedProduct.stock_tag].label}
                </span>
              )}
              {selectedProduct.description && (
                <p className="text-sm text-gray-500 mt-3 leading-relaxed">{selectedProduct.description}</p>
              )}
              <a href={buildWhatsAppLink(selectedProduct)} target="_blank" rel="noreferrer"
                className="mt-5 flex items-center justify-center gap-2 w-full py-4 rounded-2xl text-white font-semibold text-base"
                style={{ backgroundColor: '#25D366' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Message Vendor
              </a>
              <button onClick={() => setSelectedProduct(null)} className="mt-3 w-full py-3 rounded-2xl text-gray-500 text-sm font-medium border border-gray-100 hover:bg-gray-50 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
