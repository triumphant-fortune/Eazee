import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ⚠️ Replace this import path with your actual screenshot image
import storePic from '../assets/simply-she.png';
// ⚠️ Add this import — save eazee_order.jpeg into your assets folder
import whatsappMsg from '../assets/eazee_order.jpeg';

const TICKER_ITEMS = [
  'Chop n Go — Calabar',
  'Simply She — Lagos',
  'Ada Glow Skincare — Abuja',
  'ET Sneakers — PH',
  'Mama Ngozi Kitchen — Uyo',
  'Glam by Temi — Benin',
  'Fresh Farms — Warri',
  'Blessing Fabrics — Owerri',
];

const PRODUCTS = [
  { img: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300&q=80', name: 'Body Butter', price: '₦8,500', store: 'Ada Glow', palette: '#f97316' },
  { img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=300&q=80', name: 'Custom Air Force', price: '₦45,000', store: 'ET Sneakers', palette: '#7c3aed' },
  { img: 'https://images.unsplash.com/photo-1611085583191-a3b181a88401?w=300&q=80', name: 'Gold Earrings', price: '₦12,000', store: 'Simply She', palette: '#e11d48' },
  { img: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=300&q=80', name: 'Ankara Co-ord', price: '₦32,000', store: 'Blessing Fabrics', palette: '#16a34a' },
  { img: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&q=80', name: 'Nike AF1 Purple', price: '₦55,000', store: 'ET Sneakers', palette: '#7c3aed' },
  { img: 'https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=300&q=80', name: 'Skincare Bundle', price: '₦22,000', store: 'Ada Glow', palette: '#f97316' },
];

const BEFORE_AFTER = [
  { before: 'Reposting the same photos every morning', after: 'One link. Every product. Always live.' },
  { before: 'Orders buried in 47 unread messages', after: 'Clean WhatsApp DMs with order details ready.' },
  { before: '"Send me your catalogue" — every single day', after: 'Share your link once. They browse on their own.' },
  { before: "No way to show you're a real business", after: 'A storefront that looks and feels like yours.' },
];

const VENDORS = [
  { initial: 'A', name: 'Adaeze N.', biz: 'Ada Glow Skincare', color: '#f97316', quote: 'I spent 2 hours every morning reposting. Now I share my link once and rest. My customers say it feels like a real website.' },
  { initial: 'B', name: 'Blessing O.', biz: "Blessing's Boutique", color: '#e11d48', quote: 'Set it up in 10 minutes. My sister called me asking how I built a website. I just laughed.' },
  { initial: 'E', name: 'Emeka T.', biz: 'ET Sneakers', color: '#7c3aed', quote: 'Customers message me with the product name and price already in the message. No confusion, no back and forth.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) setVisibleSections(p => ({ ...p, [e.target.dataset.section]: true }));
      }),
      { threshold: 0.12 }
    );
    Object.values(sectionRefs.current).forEach(ref => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const reg = (key) => (el) => { if (el) { el.dataset.section = key; sectionRefs.current[key] = el; } };
  const vis = (key) => visibleSections[key];

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#1a1a1a', overflowX: 'hidden', background: '#fffbf7' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .sora { font-family: 'Sora', sans-serif !important; }

        .fade-up { opacity: 0; transform: translateY(32px); transition: all 0.7s cubic-bezier(0.22,1,0.36,1); }
        .fade-up.in { opacity: 1; transform: translateY(0); }
        .fade-up.delay-1 { transition-delay: 0.1s; }
        .fade-up.delay-2 { transition-delay: 0.2s; }
        .fade-up.delay-3 { transition-delay: 0.3s; }
        .fade-up.delay-4 { transition-delay: 0.4s; }

        .ticker-wrap { overflow: hidden; white-space: nowrap; }
        .ticker { display: inline-flex; animation: ticker 28s linear infinite; }
        .ticker:hover { animation-play-state: paused; }
        @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }

        .product-card { transition: transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s; cursor: pointer; }
        .product-card:hover { transform: translateY(-8px) scale(1.02); box-shadow: 0 20px 48px rgba(0,0,0,0.13) !important; }

        .cta-btn { transition: all 0.2s cubic-bezier(0.22,1,0.36,1); position: relative; overflow: hidden; }
        .cta-btn::after { content:''; position:absolute; inset:0; background:rgba(255,255,255,0.15); opacity:0; transition:opacity 0.2s; }
        .cta-btn:hover::after { opacity:1; }
        .cta-btn:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(249,115,22,0.45) !important; }
        .cta-btn:active { transform: translateY(0); }

        .ghost-btn { transition: all 0.2s; }
        .ghost-btn:hover { background: rgba(249,115,22,0.08) !important; border-color: #f97316 !important; color: #f97316 !important; }

        .vendor-card { transition: all 0.25s; }
        .vendor-card:hover { transform: translateY(-4px); box-shadow: 0 16px 40px rgba(0,0,0,0.09) !important; }

        @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        .float  { animation: float 5s ease-in-out infinite; }
        .float-2 { animation: float 6s ease-in-out infinite 1s; }
        .float-3 { animation: float 7s ease-in-out infinite 2s; }

        /* ── Hero screenshot column ── */
        .hero-screenshot-col {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          min-height: 480px;
        }
        .hero-badge { position: absolute; z-index: 4; }
        .hero-badge-whatsapp { top: 16px; right: 0; }
        .hero-badge-views    { top: 64px; left: 0; }
        .hero-badge-link     { bottom: 16px; left: 0; }

        @media(max-width:768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .hero-screenshot-col {
            flex-direction: column;
            align-items: flex-start;
            min-height: unset;
            margin-top: 32px;
            gap: 12px;
          }
          .hero-badge { position: static !important; width: 100%; }
          .hero-screenshot-img { width: 100% !important; max-width: 100% !important; border-radius: 20px !important; }

          .products-scroll { display: flex !important; overflow-x: auto !important; gap: 14px !important; padding-bottom: 12px; scroll-snap-type: x mandatory; }
          .products-scroll::-webkit-scrollbar { display: none; }
          .product-snap { scroll-snap-align: start; flex-shrink: 0 !important; width: 180px !important; }
          .footer-links { flex-direction: column !important; gap: 8px !important; align-items: flex-start !important; }
        }
        @media(max-width:480px) {
          .hero-title   { font-size: 38px !important; letter-spacing: -1.5px !important; }
          .section-title { font-size: 28px !important; }
          .hero-actions { flex-direction: column !important; }
          .hero-actions > * { width: 100% !important; text-align: center !important; }
        }
      `}</style>

      {/* ─── NAV ─── */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200, padding: '0 24px', height: 64, display: 'flex', alignItems: 'center', background: scrolled ? 'rgba(255,251,247,0.96)' : 'transparent', backdropFilter: scrolled ? 'blur(16px)' : 'none', borderBottom: scrolled ? '1px solid rgba(249,115,22,0.12)' : '1px solid transparent', transition: 'all 0.3s' }}>
        <div style={{ width: '100%', maxWidth: 1160, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="sora" style={{ fontWeight: 900, fontSize: 26, color: '#f97316', letterSpacing: -1 }}>Eazee</span>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <button onClick={() => navigate('/login')} className="ghost-btn sora" style={{ background: 'transparent', border: '1.5px solid #e5e7eb', color: '#6b7280', fontWeight: 600, fontSize: 13, padding: '9px 18px', borderRadius: 50, cursor: 'pointer' }}>Log in</button>
            <button onClick={() => navigate('/login')} className="cta-btn sora" style={{ background: '#f97316', color: 'white', fontWeight: 700, fontSize: 13, padding: '10px 20px', borderRadius: 50, border: 'none', cursor: 'pointer', boxShadow: '0 4px 16px rgba(249,115,22,0.3)' }}>Sign up free</button>
          </div>
        </div>
      </nav>

      {/* ─── TICKER ─── */}
      <div style={{ paddingTop: 64, background: '#f97316', overflow: 'hidden' }}>
        <div className="ticker-wrap" style={{ padding: '10px 0' }}>
          <div className="ticker">
            {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
              <span key={i} className="sora" style={{ display: 'inline-block', fontSize: 12, fontWeight: 600, color: 'white', padding: '0 28px', opacity: 0.85, letterSpacing: 0.3 }}>
                {item} <span style={{ color: 'rgba(255,255,255,0.5)', margin: '0 4px' }}>·</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* ─── HERO ─── */}
      <div style={{ background: 'linear-gradient(180deg, #fff7ed 0%, #fffbf7 100%)', padding: '72px 24px 64px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -60, right: -80, width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.1) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -40, left: -60, width: 320, height: 320, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.06) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="hero-grid" style={{ maxWidth: 1160, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 56, alignItems: 'center' }}>

          {/* Left copy */}
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'white', border: '1px solid #fed7aa', borderRadius: 50, padding: '7px 16px', marginBottom: 28, boxShadow: '0 2px 8px rgba(249,115,22,0.12)' }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#f97316', display: 'inline-block', animation: 'float 2s ease-in-out infinite' }} />
              <span className="sora" style={{ fontSize: 12, fontWeight: 700, color: '#ea580c', letterSpacing: 0.3 }}>Now in beta — free to join</span>
            </div>

            <h1 className="sora hero-title" style={{ fontSize: 'clamp(42px, 5.5vw, 68px)', fontWeight: 900, lineHeight: 1.05, letterSpacing: -2.5, color: '#0f172a', marginBottom: 22 }}>
              You built your<br />business on<br />WhatsApp.<br />
              <span style={{ color: '#f97316', display: 'block', marginTop: 4 }}>Now own it.</span>
            </h1>

            <p style={{ fontSize: 'clamp(15px, 1.8vw, 18px)', color: '#4b5563', lineHeight: 1.75, marginBottom: 36, maxWidth: 440, fontWeight: 400 }}>
              You've been selling hard — reposting, explaining, following up. Eazee takes that load off. One clean store link, all your products, orders straight to your WhatsApp. That's it.
            </p>

            <div className="hero-actions" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 36 }}>
              <button onClick={() => navigate('/login')} className="cta-btn sora" style={{ background: '#f97316', color: 'white', fontWeight: 800, fontSize: 16, padding: '17px 34px', borderRadius: 50, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(249,115,22,0.35)' }}>Set up my store — free</button>
              <button onClick={() => navigate('/login')} className="ghost-btn sora" style={{ background: 'white', color: '#374151', fontWeight: 600, fontSize: 15, padding: '17px 28px', borderRadius: 50, border: '1.5px solid #e5e7eb', cursor: 'pointer' }}>Log in</button>
            </div>

            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {[['100% free', 'to start'], ['5 minutes', 'to set up'], ['Zero fees', 'ever']].map(([a, b], i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 20, height: 20, borderRadius: '50%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M2 5l2.5 2.5L8 3" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                  </div>
                  <span style={{ fontSize: 13, color: '#6b7280' }}><strong style={{ color: '#0f172a', fontWeight: 700 }}>{a}</strong> {b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── RIGHT COLUMN — Simply She store + real WhatsApp badge ── */}
          <div className="hero-screenshot-col">

            {/* Badge — Real WhatsApp order message (replaces "New order" text badge) */}
            <div className="hero-badge hero-badge-whatsapp float-2" style={{ background: '#111', borderRadius: 16, overflow: 'hidden', boxShadow: '0 8px 24px rgba(0,0,0,0.25)', border: '1px solid #222', maxWidth: 260 }}>
              {/* WhatsApp dark header */}
              <div style={{ background: '#1f2c34', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: '#25D366', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="white"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/><path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.17 1.535 5.943L.057 23.57a.75.75 0 00.952.908l5.4-1.763A11.95 11.95 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.7-.49-5.27-1.377l-.38-.22-3.94 1.285 1.332-3.83-.245-.393A9.955 9.955 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/></svg>
                </div>
                <div>
                  <div className="sora" style={{ fontSize: 11, fontWeight: 700, color: 'white' }}>WhatsApp</div>
                  <div style={{ fontSize: 9, color: '#8696a0' }}>New message</div>
                </div>
                <div style={{ marginLeft: 'auto', width: 8, height: 8, borderRadius: '50%', background: '#25D366' }} />
              </div>
              {/* Real WhatsApp screenshot */}
              <img
                src={whatsappMsg}
                alt="Customer WhatsApp order message"
                style={{ width: '100%', display: 'block' }}
              />
            </div>

            {/* Badge — 47 views */}
            <div className="hero-badge hero-badge-views float" style={{ background: '#f97316', borderRadius: 14, padding: '8px 12px', boxShadow: '0 6px 16px rgba(249,115,22,0.35)', animationDelay: '0.5s' }}>
              <div className="sora" style={{ fontSize: 11, fontWeight: 800, color: 'white' }}>47 views today</div>
            </div>

            {/* Simply She store screenshot */}
            <img
              className="hero-screenshot-img"
              src={storePic}
              alt="Simply She store on Eazee"
              style={{ width: '100%', maxWidth: 280, borderRadius: 28, boxShadow: '0 24px 64px rgba(0,0,0,0.14)', border: '1.5px solid #f0f0f0', display: 'block', position: 'relative', zIndex: 3 }}
            />

            {/* Badge — real store link */}
            <div className="hero-badge hero-badge-link float-3" style={{ background: 'white', borderRadius: 16, padding: '10px 14px', boxShadow: '0 8px 24px rgba(0,0,0,0.1)', border: '1px solid #f3f4f6' }}>
              <div className="sora" style={{ fontSize: 11, fontWeight: 700, color: '#0f172a' }}>eazee-lac.vercel.app/store/simply-she</div>
              <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>Your store link, live 24/7</div>
            </div>

          </div>
        </div>
      </div>

      {/* ─── SOCIAL PROOF STRIP ─── */}
      <div style={{ background: 'white', borderTop: '1px solid #f3f4f6', borderBottom: '1px solid #f3f4f6', padding: '20px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[['Free forever', 'to start'], ['No website needed', 'just a link'], ['WhatsApp native', 'orders in your DM'], ['Live in minutes', 'not days']].map(([a, b], i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div className="sora" style={{ fontSize: 15, fontWeight: 800, color: '#0f172a' }}>{a}</div>
              <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 2 }}>{b}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── PRODUCTS SHOWCASE ─── */}
      <div ref={reg('products')} style={{ padding: '80px 24px', background: '#fffbf7' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div className={`fade-up ${vis('products') ? 'in' : ''}`} style={{ textAlign: 'center', marginBottom: 48 }}>
            <div className="sora" style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>Real vendor stores on Eazee</div>
            <h2 className="sora section-title" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, color: '#0f172a', marginBottom: 10 }}>
              This is what your<br />customers see
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 400, margin: '0 auto', lineHeight: 1.65 }}>
              Clean. Fast. Yours. No Jumia. No website. Just your store, your way.
            </p>
          </div>
          <div className="products-scroll" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
            {PRODUCTS.map((p, i) => (
              <div key={i} className={`product-card product-snap fade-up ${vis('products') ? 'in' : ''} delay-${Math.min(i + 1, 4)}`} style={{ background: 'white', borderRadius: 20, overflow: 'hidden', border: '1px solid #f0f0f0', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
                <div style={{ width: '100%', aspectRatio: '1', overflow: 'hidden', position: 'relative' }}>
                  <img src={p.img} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  <div style={{ position: 'absolute', top: 10, left: 10, background: p.palette, color: 'white', fontSize: 10, fontWeight: 700, padding: '4px 10px', borderRadius: 50, fontFamily: 'Sora' }}>{p.store}</div>
                </div>
                <div style={{ padding: '14px 16px 16px' }}>
                  <div className="sora" style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>{p.name}</div>
                  <div style={{ fontWeight: 800, fontSize: 15, color: p.palette, marginTop: 4 }}>{p.price}</div>
                  <div style={{ marginTop: 12, background: '#25D366', color: 'white', fontFamily: 'Sora', fontWeight: 600, fontSize: 11, padding: '8px', borderRadius: 10, textAlign: 'center' }}>Message Vendor</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── BEFORE / AFTER ─── */}
      <div ref={reg('ba')} style={{ padding: '80px 24px', background: 'white' }}>
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <div className={`fade-up ${vis('ba') ? 'in' : ''}`} style={{ marginBottom: 48 }}>
            <div className="sora" style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>Before Eazee vs. After Eazee</div>
            <h2 className="sora section-title" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, color: '#0f172a' }}>
              Same hustle.<br />Half the stress.
            </h2>
          </div>

          <style>{`
            .ba-desktop { display: grid; }
            .ba-mobile  { display: none; }
            @media(max-width:768px) {
              .ba-desktop { display: none; }
              .ba-mobile  { display: flex; flex-direction: column; gap: 12px; }
            }
          `}</style>

          {/* Desktop 2-col grid */}
          <div className="ba-desktop" style={{ gridTemplateColumns: '1fr 1fr', gap: 0, borderRadius: 20, overflow: 'hidden', border: '1.5px solid #f3f4f6' }}>
            <div style={{ background: '#fafafa', padding: '16px 20px', borderBottom: '1px solid #f3f4f6' }}>
              <div className="sora" style={{ fontSize: 12, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1 }}>Before</div>
            </div>
            <div style={{ background: '#fff7ed', padding: '16px 20px', borderBottom: '1px solid #f3f4f6', borderLeft: '1.5px solid #fed7aa' }}>
              <div className="sora" style={{ fontSize: 12, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1 }}>With Eazee</div>
            </div>
            {BEFORE_AFTER.map((row, i) => (
              <React.Fragment key={i}>
                <div style={{ background: '#fafafa', padding: '18px 20px', borderBottom: i < BEFORE_AFTER.length - 1 ? '1px solid #f3f4f6' : 'none', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ color: '#dc2626', fontSize: 16, marginTop: 1, flexShrink: 0 }}>✗</span>
                  <span style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.55 }}>{row.before}</span>
                </div>
                <div style={{ background: '#fffbf7', padding: '18px 20px', borderBottom: i < BEFORE_AFTER.length - 1 ? '1px solid #fde8cc' : 'none', borderLeft: '1.5px solid #fed7aa', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ color: '#f97316', fontSize: 16, marginTop: 1, flexShrink: 0 }}>✓</span>
                  <span className="sora" style={{ fontSize: 14, color: '#0f172a', fontWeight: 600, lineHeight: 1.55 }}>{row.after}</span>
                </div>
              </React.Fragment>
            ))}
          </div>

          {/* Mobile stacked cards */}
          <div className="ba-mobile">
            {BEFORE_AFTER.map((row, i) => (
              <div key={i} className={`fade-up ${vis('ba') ? 'in' : ''} delay-${i + 1}`} style={{ borderRadius: 16, overflow: 'hidden', border: '1.5px solid #f3f4f6' }}>
                <div style={{ background: '#fafafa', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ color: '#dc2626', fontSize: 15, flexShrink: 0, marginTop: 1 }}>✗</span>
                  <div>
                    <div className="sora" style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Before</div>
                    <span style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.55 }}>{row.before}</span>
                  </div>
                </div>
                <div style={{ height: 1, background: '#fed7aa' }} />
                <div style={{ background: '#fffbf7', padding: '14px 16px', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <span style={{ color: '#f97316', fontSize: 15, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <div>
                    <div className="sora" style={{ fontSize: 10, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>With Eazee</div>
                    <span className="sora" style={{ fontSize: 14, color: '#0f172a', fontWeight: 600, lineHeight: 1.55 }}>{row.after}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── HOW IT WORKS ─── */}
      <div ref={reg('steps')} style={{ padding: '80px 24px', background: '#0f172a' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div className={`fade-up ${vis('steps') ? 'in' : ''}`} style={{ textAlign: 'center', marginBottom: 56 }}>
            <div className="sora" style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>How it works</div>
            <h2 className="sora section-title" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, color: 'white' }}>
              Your store is live<br />before lunch.
            </h2>
            <p style={{ fontSize: 16, color: '#6b7280', marginTop: 12 }}>No developer. No designer. No wahala.</p>
          </div>

          <style>{`
            .steps-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2px; }
            @media(max-width:768px) { .steps-grid { grid-template-columns: 1fr !important; } }
          `}</style>

          <div className="steps-grid">
            {[
              { num: '01', title: 'Sign up free', body: 'Create your account in 30 seconds. No credit card. No technical knowledge.' },
              { num: '02', title: 'Set up your store', body: 'Add your business name, photo, bio and pick a colour that matches your brand.' },
              { num: '03', title: 'Add your products', body: 'Upload photos or videos. Set your price. AI writes the description for you.' },
              { num: '04', title: 'Share and sell', body: 'Copy your link. Put it in your status, bio, groups. Orders come to your WhatsApp.' },
            ].map((s, i) => (
              <div key={i} className={`fade-up ${vis('steps') ? 'in' : ''} delay-${i + 1}`} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 20, padding: '28px 24px' }}>
                <div className="sora" style={{ fontSize: 48, fontWeight: 900, color: 'rgba(249,115,22,0.15)', lineHeight: 1, marginBottom: 16 }}>{s.num}</div>
                <h3 className="sora" style={{ fontSize: 17, fontWeight: 700, color: 'white', marginBottom: 10 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#9ca3af', lineHeight: 1.65 }}>{s.body}</p>
              </div>
            ))}
          </div>

          <div className={`fade-up ${vis('steps') ? 'in' : ''} delay-4`} style={{ textAlign: 'center', marginTop: 48 }}>
            <button onClick={() => navigate('/login')} className="cta-btn sora" style={{ background: '#f97316', color: 'white', fontWeight: 800, fontSize: 16, padding: '17px 36px', borderRadius: 50, border: 'none', cursor: 'pointer', boxShadow: '0 6px 24px rgba(249,115,22,0.4)' }}>
              I'm ready — set up my store
            </button>
          </div>
        </div>
      </div>

      {/* ─── VENDOR VOICES ─── */}
      <div ref={reg('vendors')} style={{ padding: '80px 24px', background: '#fffbf7' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto' }}>
          <div className={`fade-up ${vis('vendors') ? 'in' : ''}`} style={{ marginBottom: 48 }}>
            <div className="sora" style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 10 }}>Vendor voices</div>
            <h2 className="sora section-title" style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 900, letterSpacing: -1.5, lineHeight: 1.1, color: '#0f172a' }}>
              They made the switch.<br />They don't look back.
            </h2>
          </div>

          <style>{`
            .vendors-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }
            @media(max-width:768px) { .vendors-grid { grid-template-columns: 1fr !important; } }
          `}</style>

          <div className="vendors-grid">
            {VENDORS.map((v, i) => (
              <div key={i} className={`vendor-card fade-up ${vis('vendors') ? 'in' : ''} delay-${i + 1}`} style={{ background: 'white', borderRadius: 24, padding: 28, border: '1.5px solid #f3f4f6', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', gap: 3, marginBottom: 16 }}>
                  {[1,2,3,4,5].map(s => <span key={s} style={{ color: '#f97316', fontSize: 16 }}>★</span>)}
                </div>
                <p style={{ fontSize: 15, color: '#374151', lineHeight: 1.7, marginBottom: 22, fontStyle: 'italic' }}>"{v.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: '50%', background: v.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontFamily: 'Sora', fontWeight: 800, fontSize: 16, flexShrink: 0 }}>{v.initial}</div>
                  <div>
                    <div className="sora" style={{ fontWeight: 700, fontSize: 14, color: '#0f172a' }}>{v.name}</div>
                    <div style={{ fontSize: 12, color: '#9ca3af', marginTop: 1 }}>{v.biz}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ─── FINAL CTA ─── */}
      <div ref={reg('cta')} style={{ padding: '96px 24px', background: 'linear-gradient(135deg, #fff7ed 0%, #fffbf7 50%, #fff7ed 100%)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 65%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: 640, margin: '0 auto', position: 'relative' }}>
          <div className={`fade-up ${vis('cta') ? 'in' : ''}`}>
            <div className="sora" style={{ fontSize: 11, fontWeight: 700, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1.5, marginBottom: 16 }}>Your store is waiting</div>
            <h2 className="sora" style={{ fontSize: 'clamp(36px, 6vw, 64px)', fontWeight: 900, letterSpacing: -2, lineHeight: 1.05, color: '#0f172a', marginBottom: 16 }}>
              You've done the hard<br />part already.
            </h2>
            <p style={{ fontSize: 18, color: '#6b7280', lineHeight: 1.7, maxWidth: 460, margin: '0 auto 20px' }}>
              You built a business from your phone, on WhatsApp, from scratch. Setting up your Eazee store takes 5 minutes.
            </p>
            <p className="sora" style={{ fontSize: 20, fontWeight: 800, color: '#f97316', marginBottom: 36 }}>You've earned this.</p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => navigate('/login')} className="cta-btn sora" style={{ background: '#f97316', color: 'white', fontWeight: 800, fontSize: 17, padding: '18px 40px', borderRadius: 50, border: 'none', cursor: 'pointer', boxShadow: '0 6px 28px rgba(249,115,22,0.4)' }}>Create my free store</button>
              <button onClick={() => navigate('/login')} className="ghost-btn sora" style={{ background: 'white', color: '#374151', fontWeight: 600, fontSize: 16, padding: '18px 32px', borderRadius: 50, border: '1.5px solid #e5e7eb', cursor: 'pointer' }}>Log in to my store</button>
            </div>
            <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 16 }}>Free forever to start. No credit card. No stress.</p>
          </div>
        </div>
      </div>

      {/* ─── FOOTER ─── */}
      <div style={{ background: '#0f172a', padding: '32px 24px' }}>
        <div style={{ maxWidth: 1160, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <span className="sora" style={{ fontWeight: 900, fontSize: 22, color: '#f97316' }}>Eazee</span>
          <div className="footer-links" style={{ display: 'flex', gap: 24, alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6b7280', fontFamily: 'Inter' }}>Log in</button>
            <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6b7280', fontFamily: 'Inter' }}>Sign up</button>
          </div>
          <span style={{ fontSize: 13, color: '#4b5563' }}>Built for African vendors. &copy; 2026 Eazee.</span>
        </div>
      </div>
    </div>
  );
}
