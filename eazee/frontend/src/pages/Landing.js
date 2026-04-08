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
  fully_stocked: { label: 'Fully stocked', color: '#16a34a', dot: '#16a34a' },
  limited_stock: { label: 'Limited stock', color: '#d97706', dot: '#d97706' },
  running_out: { label: 'Running out', color: '#ea580c', dot: '#ea580c' },
  out_of_stock: { label: 'Out of stock', color: '#dc2626', dot: '#dc2626' },
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
        <h1 className="text-xl font-semibold text-gray-800">Store not found</h1>
        <p className="text-gray-400 mt-2 text-sm">This store link doesn't exist or has been removed.</p>
      </div>
    </div>
  );

  const palette = PALETTES[vendor?.palette] || PALETTES.warm;

  if (vendor?.is_inactive) return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ backgroundColor: palette.bg }}>
      <div className="text-center max-w-sm">
        {vendor.logo_url
          ? <img src={vendor.logo_url} alt="Logo" className="w-24 h-24 rounded-2xl object-cover mx-auto mb-5 shadow-sm" />
          : <div className="w-24 h-24 rounded-2xl mx-auto mb-5 flex items-center justify-center text-white text-4xl font-bold" style={{ backgroundColor: palette.primary }}>{vendor.business_name?.[0]}</div>
        }
        <h1 className="text-2xl font-bold text-gray-900 mb-2">{vendor.business_name}</h1>
        <h2 className="text-xl font-bold text-gray-800 mb-2 mt-4">Be right back</h2>
        <p className="text-gray-500 text-sm leading-relaxed">
          <span className="font-semibold" style={{ color: palette.primary }}>{vendor.business_name}</span> will be back shortly. Don't leave just yet.
        </p>
        {vendor.whatsapp_number && (
          <a href={`https://wa.me/${vendor.whatsapp_number.replace(/\D/g, '')}?text=Hi! I visited your Eazee store.`}
            target="_blank" rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 px-6 py-3 rounded-2xl text-white font-semibold text-sm"
            style={{ backgroundColor: '#25D366' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
            Message us
          </a>
        )}
      </div>
    </div>
  );

  const buildWhatsAppLink = (product) => {
    const number = vendor.whatsapp_number.replace(/\D/g, '');
    const message = `Hi! I'd like to order *${product.name}* for ₦${Number(product.price).toLocaleString()} from your Eazee store.`;
    return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#f9f9f9' }}>

      {/* Header */}
      <div className="py-8 px-4" style={{ backgroundColor: palette.bg }}>
        <div className="max-w-2xl mx-auto text-center">
          {vendor.logo_url
            ? <img src={vendor.logo_url} alt="Logo" className="w-20 h-20 rounded-2xl object-cover mx-auto mb-3 shadow-sm" />
            : <div className="w-20 h-20 rounded-2xl mx-auto mb-3 flex items-center justify-center text-white text-3xl font-bold shadow-sm" style={{ backgroundColor: palette.primary }}>{vendor.business_name?.[0]}</div>
          }
          <h1 className="text-2xl font-bold text-gray-900">{vendor.business_name}</h1>
          {vendor.bio && <p className="mt-1.5 text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">{vendor.bio}</p>}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: palette.light, color: palette.text }}>
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: palette.primary }} />
            Store is open
          </div>
        </div>
      </div>

      {/* Products */}
      <div className="max-w-2xl mx-auto px-3 py-5">
        {products.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <p className="font-medium text-gray-500">No products yet</p>
            <p className="text-sm mt-1">Check back soon</p>
          </div>
        ) : (
          <>
            <p className="text-xs text-gray-400 mb-4 px-1">{products.length} product{products.length !== 1 ? 's' : ''} available</p>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
              {products.map(product => {
                const stockTag = STOCK_TAGS[product.stock_tag];
                const isOutOfStock = product.stock_tag === 'out_of_stock';
                return (
                  <button
                    key={product.id}
                    onClick={() => !isOutOfStock && setSelectedProduct(product)}
                    className={`bg-white rounded-2xl overflow-hidden border border-gray-100 text-left ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-md active:scale-95'}`}
                    style={{ transition: 'all 0.15s' }}
                  >
                    {/* Square image */}
                    <div className="relative w-full" style={{ paddingBottom: '100%' }}>
                      <div className="absolute inset-0 overflow-hidden rounded-t-2xl" style={{ backgroundColor: palette.light }}>
                        {product.media_url
                          ? product.media_type === 'video'
                            ? <video src={product.media_url} className="w-full h-full object-cover" muted playsInline />
                            : <img src={product.media_url} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
                          : <div className="w-full h-full flex items-center justify-center">
                              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="1"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
                            </div>
                        }
                        {isOutOfStock && (
                          <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center">
                            <span className="text-xs font-semibold text-red-500 bg-white px-2 py-0.5 rounded-full shadow-sm">Out of stock</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="p-2.5">
                      <p className="font-semibold text-gray-800 text-xs leading-tight truncate">{product.name}</p>
                      <p className="font-bold text-xs mt-1" style={{ color: palette.primary }}>₦{Number(product.price).toLocaleString()}</p>
                      {stockTag && !isOutOfStock && (
                        <div className="flex items-center gap-1 mt-1.5">
                          <span className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: stockTag.dot }} />
                          <span className="text-xs" style={{ color: stockTag.color }}>{stockTag.label}</span>
                        </div>
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
      <div className="text-center py-8 text-xs text-gray-300">
        Powered by <span className="font-semibold text-gray-400">Eazee</span>
      </div>

      {/* Product modal */}
      {selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={() => setSelectedProduct(null)}>
          <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl overflow-hidden" onClick={e => e.stopPropagation()}>
            {selectedProduct.media_url && (
              <div className="w-full bg-gray-100 overflow-hidden" style={{ aspectRatio: selectedProduct.media_type === 'video' ? '9/16' : '1/1', maxHeight: '55vh' }}>
                {selectedProduct.media_type === 'video'
                  ? <video src={selectedProduct.media_url} className="w-full h-full object-cover" controls />
                  : <img src={selectedProduct.media_url} alt={selectedProduct.name} className="w-full h-full object-cover" />
                }
              </div>
            )}
            <div className="p-5">
              <h2 className="text-lg font-bold text-gray-800">{selectedProduct.name}</h2>
              <p className="text-xl font-bold mt-1" style={{ color: palette.primary }}>₦{Number(selectedProduct.price).toLocaleString()}</p>
              {selectedProduct.stock_tag && STOCK_TAGS[selectedProduct.stock_tag] && selectedProduct.stock_tag !== 'fully_stocked' && (
                <div className="flex items-center gap-1.5 mt-2">
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: STOCK_TAGS[selectedProduct.stock_tag].dot }} />
                  <span className="text-sm font-medium" style={{ color: STOCK_TAGS[selectedProduct.stock_tag].color }}>{STOCK_TAGS[selectedProduct.stock_tag].label}</span>
                </div>
              )}
              {selectedProduct.description && <p className="text-sm text-gray-500 mt-3 leading-relaxed">{selectedProduct.description}</p>}
              <a href={buildWhatsAppLink(selectedProduct)} target="_blank" rel="noreferrer"
                className="mt-5 flex items-center justify-center gap-2 w-full py-3.5 rounded-2xl text-white font-semibold text-sm"
                style={{ backgroundColor: '#25D366' }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                Message Vendor
              </a>
              <button onClick={() => setSelectedProduct(null)} className="mt-2.5 w-full py-3 rounded-2xl text-gray-500 text-sm border border-gray-100 hover:bg-gray-50 transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
