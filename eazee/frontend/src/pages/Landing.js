import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PROBLEMS = [
  { title: 'You repost the same photos daily', body: 'Every morning, same products, same captions. Manually. Because if you stop, your reach drops.' },
  { title: 'Orders get buried in chats', body: "A customer asked about the bag three days ago. You can't find the message. The order is lost." },
  { title: 'No link to share anywhere', body: "You can't put your catalogue on a flyer, in a bio, or send one link that shows everything you sell." },
  { title: 'A website feels out of reach', body: 'Too expensive. Too technical. Too much time. So you keep doing it all manually, every single day.' },
];

const FEATURES = [
  { num: '01', title: 'Your own store link', body: 'One clean link that opens a beautiful mobile storefront. Share it anywhere — status, bio, flyers.' },
  { num: '02', title: 'List products in minutes', body: 'Upload a photo or video, set a price, go live. AI writes your product description automatically.' },
  { num: '03', title: 'Orders go straight to WhatsApp', body: 'Customers browse, tap a product and WhatsApp opens with the order already typed out for them.' },
  { num: '04', title: 'Your brand, your colours', body: 'Pick a colour palette at setup. Your storefront looks like you — not a generic marketplace.' },
];

const STEPS = [
  { num: '1', title: 'Sign up free', body: 'Create your account in seconds. No credit card, no technical knowledge needed.' },
  { num: '2', title: 'Set up your store', body: 'Add your business name, logo, bio and pick your brand colour. Done in minutes.' },
  { num: '3', title: 'Add your products', body: 'Upload photos or videos, set prices, AI writes descriptions. Everything goes live instantly.' },
  { num: '4', title: 'Share and get orders', body: 'Copy your link, share it everywhere. Customers message you directly on WhatsApp.' },
];

// Real product images from Unsplash (free, no attribution required for demo)
const PRODUCT_IMAGES = [
  { url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80', name: 'Body cream', price: '₦8,500', tag: 'Fully stocked', tagColor: '#16a34a' },
  { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', name: 'Custom sneakers', price: '₦45,000', tag: 'Limited stock', tagColor: '#d97706' },
  { url: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=400&q=80', name: 'Gold earrings', price: '₦12,000', tag: 'Fully stocked', tagColor: '#16a34a' },
  { url: 'https://images.unsplash.com/photo-1564424224827-cd24b8915874?w=400&q=80', name: 'Ankara dress', price: '₦25,000', tag: 'Running out', tagColor: '#ea580c' },
  { url: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=400&q=80', name: 'Skincare set', price: '₦18,000', tag: 'Fully stocked', tagColor: '#16a34a' },
  { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&q=80', name: 'Air Force 1s', price: '₦55,000', tag: 'Limited stock', tagColor: '#d97706' },
];

const TESTIMONIALS = [
  { name: 'Adaeze N.', business: 'Ada Glow Skincare', text: 'I used to spend 2 hours every morning reposting. Now I just share my link and orders come in.' },
  { name: 'Blessing O.', business: "Blessing's Boutique", text: 'My customers love it. They say it feels like a real website. I set it up in 10 minutes.' },
  { name: 'Emeka T.', business: 'ET Sneakers', text: "People actually message me with the product name and price already in the message. No more confusion." },
];

export default function Landing() {
  const navigate = useNavigate();
  const [hoveredProduct, setHoveredProduct] = useState(null);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#111827', overflowX: 'hidden', background: 'white' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .sora { font-family: 'Sora', sans-serif !important; }
        .pulse { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
        .btn-orange { transition: all 0.2s; }
        .btn-orange:hover { background: #ea580c !important; transform: translateY(-2px); box-shadow: 0 8px 28px rgba(249,115,22,0.4) !important; }
        .btn-outline:hover { border-color: #f97316 !important; color: #f97316 !important; }
        .problem-card { transition: all 0.2s; }
        .problem-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(0,0,0,0.08) !important; }
        .product-card { transition: all 0.18s; cursor: pointer; }
        .product-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.12) !important; }
        .testimonial-card { transition: all 0.2s; }
        .testimonial-card:hover { transform: translateY(-3px); }
        @media (max-width: 640px) {
          .hero-actions { flex-direction: column !important; }
          .hero-actions a, .hero-actions button { width: 100% !important; text-align: center !important; }
          .products-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .steps-grid { grid-template-columns: 1fr 1fr !important; }
          .testimonials-grid { grid-template-columns: 1fr !important; }
          .footer-inner { flex-direction: column !important; text-align: center !important; }
          .hide-mobile { display: none !important; }
        }
        @media (max-width: 480px) {
          .problems-grid { grid-template-columns: 1fr !important; }
          .features-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(16px)', borderBottom: '1px solid #f3f4f6', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="sora" style={{ fontWeight: 800, fontSize: 24, color: '#f97316', letterSpacing: -0.5 }}>Eazee</span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6b7280', fontFamily: 'Inter, sans-serif', fontWeight: 500 }} className="hide-mobile">Log in</button>
            <button onClick={() => navigate('/login')} className="sora btn-orange" style={{ background: '#f97316', color: 'white', fontWeight: 700, fontSize: 14, padding: '10px 22px', borderRadius: 50, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(249,115,22,0.3)' }}>Sign up free</button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ padding: '72px 24px 0', background: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: 0, left: -80, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.04) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 1140, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}>

          {/* Left */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, background: '#fff7ed', border: '1px solid #fed7aa', color: '#ea580c', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 50, marginBottom: 24, fontFamily: 'Sora, sans-serif' }}>
              <span className="pulse" style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316', display: 'inline-block' }} />
              Now in beta — sign up free today
            </div>

            <h1 className="sora" style={{ fontSize: 'clamp(38px, 5vw, 58px)', fontWeight: 800, lineHeight: 1.08, letterSpacing: -2, marginBottom: 20, color: '#0f172a' }}>
              Your WhatsApp<br />hustle deserves<br />a <span style={{ color: '#f97316' }}>real store</span>
            </h1>

            <p style={{ fontSize: 17, color: '#6b7280', lineHeight: 1.7, marginBottom: 36, maxWidth: 440 }}>
              Stop reposting photos every day. Get one clean store link — customers browse your products and message you directly on WhatsApp to order.
            </p>

            <div className="hero-actions" style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap', marginBottom: 40 }}>
              <button onClick={() => navigate('/login')} className="sora btn-orange" style={{ background: '#f97316', color: 'white', fontWeight: 700, fontSize: 16, padding: '16px 32px', borderRadius: 50, border: 'none', cursor: 'pointer', boxShadow: '0 4px 20px rgba(249,115,22,0.3)' }}>
                Create your store — it's free
              </button>
              <a href="#how-it-works" className="btn-outline" style={{ color: '#6b7280', fontWeight: 500, fontSize: 15, padding: '16px 24px', borderRadius: 50, border: '1.5px solid #e5e7eb', textDecoration: 'none', fontFamily: 'Inter, sans-serif', display: 'inline-block' }}>
                See how it works
              </a>
            </div>

            <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap' }}>
              {[['Free to start', 'No credit card'], ['5 minutes', 'Setup time'], ['Zero fees', 'No listing costs']].map(([a, b], i) => (
                <div key={i}>
                  <div className="sora" style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{a}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{b}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right — real storefront preview */}
          <div style={{ display: 'flex', justifyContent: 'center', paddingBottom: 0 }} className="hide-mobile">
            <div style={{ width: 300, background: 'white', borderRadius: 28, border: '1.5px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.12)', position: 'relative' }}>
              {/* Store header */}
              <div style={{ background: '#fff1f2', padding: '24px 20px 18px', textAlign: 'center' }}>
                <div style={{ width: 56, height: 56, borderRadius: 14, background: '#e11d48', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Sora, sans-serif', fontWeight: 800, fontSize: 20 }}>S</div>
                <div className="sora" style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Simply She</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginTop: 3 }}>The glow is her secret.</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 8, background: '#ffe4e6', color: '#881337', fontSize: 11, fontWeight: 600, padding: '4px 12px', borderRadius: 50, fontFamily: 'Sora, sans-serif' }}>
                  <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#e11d48', display: 'inline-block' }} />
                  Store is open
                </div>
              </div>

              {/* Products */}
              <div style={{ padding: '12px 12px 8px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                {[
                  { bg: '#fce7f3', name: 'Rose lip gloss', price: '₦5,000' },
                  { bg: '#fef3c7', name: 'Body butter', price: '₦8,500' },
                  { bg: '#f0fdf4', name: 'Ankara skirt', price: '₦18,000' },
                  { bg: '#ede9fe', name: 'Gold chain', price: '₦12,000' },
                ].map((p, i) => (
                  <div key={i} style={{ background: '#f9f9f9', borderRadius: 12, overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                    <div style={{ width: '100%', aspectRatio: '1', background: p.bg }} />
                    <div style={{ padding: '6px 8px 8px' }}>
                      <div className="sora" style={{ fontSize: 10, fontWeight: 600, color: '#0f172a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                      <div style={{ fontSize: 10, fontWeight: 700, color: '#e11d48', marginTop: 2 }}>{p.price}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* WhatsApp button */}
              <div style={{ padding: '4px 12px 14px' }}>
                <div className="sora" style={{ background: '#25D366', color: 'white', fontWeight: 600, fontSize: 12, padding: '10px 14px', borderRadius: 12, textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                  Message Vendor
                </div>
              </div>

              {/* Floating badge */}
              <div style={{ position: 'absolute', top: 16, right: -12, background: '#f97316', color: 'white', fontFamily: 'Sora, sans-serif', fontWeight: 700, fontSize: 10, padding: '6px 12px', borderRadius: 50, boxShadow: '0 4px 12px rgba(249,115,22,0.4)', whiteSpace: 'nowrap' }}>
                eazee.store/simply-she
              </div>
            </div>
          </div>
        </div>

        {/* Responsive: on mobile stack hero */}
        <style>{`
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; }
          }
        `}</style>
      </div>

      {/* PRODUCTS SHOWCASE */}
      <div style={{ padding: '72px 24px 64px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 40 }}>
            <div className="sora" style={{ fontSize: 12, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>Real vendor storefronts</div>
            <h2 className="sora" style={{ fontSize: 'clamp(26px, 4vw, 38px)', fontWeight: 800, letterSpacing: -1, lineHeight: 1.15 }}>This is what your customers see</h2>
            <p style={{ fontSize: 16, color: '#6b7280', marginTop: 10, maxWidth: 460, margin: '10px auto 0' }}>A clean, fast, mobile-first storefront. Photo-forward. Built for how people shop on their phones.</p>
          </div>

          <div className="products-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {PRODUCT_IMAGES.map((p, i) => (
              <div key={i} className="product-card" style={{ background: 'white', borderRadius: 20, overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                onMouseEnter={() => setHoveredProduct(i)} onMouseLeave={() => setHoveredProduct(null)}>
                <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', background: '#f9f9f9' }}>
                  <img src={p.url} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s', transform: hoveredProduct === i ? 'scale(1.05)' : 'scale(1)' }} loading="lazy" />
                </div>
                <div style={{ padding: '12px 14px 14px' }}>
                  <div className="sora" style={{ fontWeight: 600, fontSize: 14, color: '#0f172a' }}>{p.name}</div>
                  <div style={{ fontWeight: 700, fontSize: 14, color: '#f97316', marginTop: 4 }}>{p.price}</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, marginTop: 6 }}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: p.tagColor, display: 'inline-block' }} />
                    <span style={{ fontSize: 11, color: p.tagColor, fontWeight: 600 }}>{p.tag}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* PROBLEM */}
      <div style={{ padding: '72px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div className="sora" style={{ fontSize: 12, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>The problem</div>
          <h2 className="sora" style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: -1, lineHeight: 1.15, marginBottom: 10 }}>You're already selling.<br />It's just harder than it needs to be.</h2>
          <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, lineHeight: 1.6, marginBottom: 44 }}>WhatsApp built your business. But it was never built for business.</p>
          <div className="problems-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {PROBLEMS.map((p, i) => (
              <div key={i} className="problem-card" style={{ background: '#fafafa', border: '1.5px solid #f3f4f6', borderRadius: 20, padding: '24px 24px 24px' }}>
                <div style={{ width: 28, height: 3, background: '#f97316', borderRadius: 2, marginBottom: 14 }} />
                <h3 className="sora" style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: '72px 24px', background: '#fff7ed' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div className="sora" style={{ fontSize: 12, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>What Eazee does</div>
          <h2 className="sora" style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: -1, lineHeight: 1.15, marginBottom: 10 }}>Everything you need.<br />Nothing you don't.</h2>
          <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, lineHeight: 1.6, marginBottom: 44 }}>No website. No listing fees. No stress. Just your store, your products, your link.</p>
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: 'white', borderRadius: 24, padding: 28, border: '1.5px solid #ffedd5' }}>
                <div className="sora" style={{ fontSize: 12, fontWeight: 700, color: '#f97316', marginBottom: 12, letterSpacing: 0.5 }}>{f.num}</div>
                <h3 className="sora" style={{ fontSize: 17, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.65 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how-it-works" style={{ padding: '72px 24px', background: 'white' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="sora" style={{ fontSize: 12, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>How it works</div>
            <h2 className="sora" style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: -1, lineHeight: 1.15 }}>Up and running in under 5 minutes</h2>
            <p style={{ fontSize: 16, color: '#6b7280', marginTop: 10 }}>No developer. No designer. Just you and your phone.</p>
          </div>
          <div className="steps-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: '0 8px' }}>
                <div className="sora" style={{ width: 48, height: 48, borderRadius: '50%', background: '#f97316', color: 'white', fontWeight: 800, fontSize: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', boxShadow: '0 4px 16px rgba(249,115,22,0.25)' }}>{s.num}</div>
                <h3 className="sora" style={{ fontSize: 15, fontWeight: 700, marginBottom: 8, color: '#0f172a' }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ padding: '72px 24px', background: '#fafafa' }}>
        <div style={{ maxWidth: 1140, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 44 }}>
            <div className="sora" style={{ fontSize: 12, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Vendors love it</div>
            <h2 className="sora" style={{ fontSize: 'clamp(24px, 3vw, 36px)', fontWeight: 800, letterSpacing: -1 }}>Don't take our word for it</h2>
          </div>
          <div className="testimonials-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="testimonial-card" style={{ background: 'white', borderRadius: 20, padding: 24, border: '1.5px solid #f3f4f6' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 14 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#f97316', fontSize: 14 }}>★</span>)}
                </div>
                <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.65, marginBottom: 18, fontStyle: 'italic' }}>"{t.text}"</p>
                <div>
                  <div className="sora" style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{t.name}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{t.business}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FINAL CTA */}
      <div style={{ padding: '80px 24px', background: '#0f172a', textAlign: 'center' }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h2 className="sora" style={{ fontSize: 'clamp(30px, 5vw, 50px)', fontWeight: 800, letterSpacing: -1.5, lineHeight: 1.1, color: 'white', marginBottom: 16 }}>
            Your store is<br /><span style={{ color: '#f97316' }}>one link away.</span>
          </h2>
          <p style={{ fontSize: 17, color: '#9ca3af', lineHeight: 1.65, marginBottom: 36, maxWidth: 440, margin: '0 auto 36px' }}>
            Free to start. No credit card. Set up in minutes. Share it today.
          </p>
          <button onClick={() => navigate('/login')} className="sora btn-orange" style={{ background: '#f97316', color: 'white', fontWeight: 700, fontSize: 17, padding: '18px 40px', borderRadius: 50, border: 'none', cursor: 'pointer', boxShadow: '0 4px 24px rgba(249,115,22,0.4)', display: 'inline-block' }}>
            Create your free store
          </button>
          <p style={{ color: '#4b5563', fontSize: 13, marginTop: 14 }}>No credit card required. Free forever to start.</p>
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: '1px solid #f3f4f6', padding: '24px 24px' }}>
        <div className="footer-inner" style={{ maxWidth: 1140, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span className="sora" style={{ fontWeight: 800, fontSize: 20, color: '#f97316' }}>Eazee</span>
          <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
            <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>Log in</button>
            <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>Sign up</button>
          </div>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>Built for African vendors. &copy; 2026 Eazee.</span>
        </div>
      </div>
    </div>
  );
}
