import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PROBLEMS = [
  { title: 'You repost the same photos daily', body: 'Every morning, same products, same captions. Manually. Because if you stop, your reach drops.' },
  { title: 'Orders get buried in chats', body: "A customer asked about the bag three days ago. You can't find the message. The order is lost." },
  { title: 'No link to share everywhere', body: "You can't put your catalogue on a flyer, in a bio, or send one link that shows everything." },
  { title: 'A website feels out of reach', body: 'Too expensive. Too technical. Too much time. So you keep doing it all manually.' },
];

const FEATURES = [
  { num: '01', title: 'Your own store link', body: 'One clean link that opens a beautiful mobile storefront. Share it on WhatsApp, Instagram, anywhere.' },
  { num: '02', title: 'Product listings in minutes', body: 'Upload a photo or video, set a price, and your product goes live. AI writes the description for you.' },
  { num: '03', title: 'Orders straight to WhatsApp', body: 'Customers tap a product, hit "Message Vendor" and WhatsApp opens with the order already written.' },
  { num: '04', title: 'Your brand, your colours', body: 'Pick a colour palette during setup. Your storefront looks like your own — not a generic listing.' },
];

const STEPS = [
  { num: '1', title: 'Create your store', body: 'Add your business name, logo, a short bio and pick your brand colour.' },
  { num: '2', title: 'List your products', body: 'Upload photos or videos, set prices. AI writes your product descriptions instantly.' },
  { num: '3', title: 'Share your link', body: 'Copy your store link and share it on WhatsApp status, groups, Instagram — anywhere.' },
  { num: '4', title: 'Get orders on WhatsApp', body: 'Customers browse and message you directly. No checkout, no complexity.' },
];

export default function Landing() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  const joinWaitlist = () => {
    if (!email || !email.includes('@')) { setError(true); return; }
    setError(false);
    const waitlist = JSON.parse(localStorage.getItem('eazee_waitlist') || '[]');
    if (!waitlist.includes(email)) waitlist.push(email);
    localStorage.setItem('eazee_waitlist', JSON.stringify(waitlist));
    setSubmitted(true);
    setEmail('');
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif", color: '#111827', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500&display=swap');
        * { box-sizing: border-box; }
        .sora { font-family: 'Sora', sans-serif; }
        .fade-in { animation: fadeIn 0.6s ease both; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .pulse-dot { animation: pulse 2s infinite; }
        @keyframes pulse { 0%,100% { opacity:1; } 50% { opacity:0.4; } }
        .btn-hover:hover { transform: translateY(-2px); }
        .card-hover:hover { transform: translateY(-3px); box-shadow: 0 12px 32px rgba(0,0,0,0.08); }
        .nav-cta-hover:hover { background: #ea580c !important; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,0.93)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #e5e7eb', padding: '0 24px', height: 64, display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '100%', maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span className="sora" style={{ fontWeight: 800, fontSize: 22, color: '#f97316', letterSpacing: -0.5 }}>Eazee</span>
          <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <button onClick={() => navigate('/login')} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, color: '#6b7280', fontFamily: 'Inter, sans-serif' }}>Log in</button>
            <a href="#waitlist" className="sora nav-cta-hover" style={{ background: '#f97316', color: 'white', fontWeight: 600, fontSize: 14, padding: '10px 20px', borderRadius: 50, textDecoration: 'none', transition: 'all 0.2s' }}>Get early access</a>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <div style={{ padding: '80px 24px 56px', textAlign: 'center', background: 'white', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, background: 'radial-gradient(circle, rgba(249,115,22,0.07) 0%, transparent 70%)', pointerEvents: 'none' }} />

        <div className="fade-in" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: '#ffedd5', color: '#ea580c', fontSize: 12, fontWeight: 600, padding: '6px 14px', borderRadius: 50, marginBottom: 24, fontFamily: 'Sora, sans-serif', letterSpacing: 0.3 }}>
          <span className="pulse-dot" style={{ width: 6, height: 6, borderRadius: '50%', background: '#f97316' }} />
          Now in beta — limited spots open
        </div>

        <h1 className="sora fade-in" style={{ fontSize: 'clamp(36px, 6vw, 62px)', fontWeight: 800, lineHeight: 1.1, letterSpacing: -1.5, maxWidth: 720, margin: '0 auto 20px', animationDelay: '0.1s' }}>
          Your WhatsApp hustle<br />deserves a <span style={{ color: '#f97316' }}>real store</span>
        </h1>

        <p className="fade-in" style={{ fontSize: 'clamp(16px, 2vw, 18px)', color: '#6b7280', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.65, animationDelay: '0.2s' }}>
          Stop reposting photos every day. Eazee gives you one clean store link — customers browse, tap a product, and message you on WhatsApp instantly.
        </p>

        <div className="fade-in" style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap', animationDelay: '0.3s' }}>
          <a href="#waitlist" className="sora btn-hover" style={{ background: '#f97316', color: 'white', fontWeight: 700, fontSize: 16, padding: '16px 32px', borderRadius: 50, textDecoration: 'none', boxShadow: '0 4px 20px rgba(249,115,22,0.3)', transition: 'all 0.2s', display: 'inline-block' }}>Join the waitlist</a>
          <a href="#how-it-works" style={{ background: 'transparent', color: '#6b7280', fontWeight: 500, fontSize: 15, padding: '16px 24px', borderRadius: 50, textDecoration: 'none', border: '1.5px solid #e5e7eb', transition: 'all 0.2s', display: 'inline-block' }}>See how it works</a>
        </div>
      </div>

      {/* PHONE MOCKUP */}
      <div style={{ display: 'flex', justifyContent: 'center', padding: '0 24px 72px' }}>
        <div style={{ width: 260, background: 'white', borderRadius: 24, border: '1.5px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.10)' }}>
          <div style={{ background: '#fff1f2', padding: '20px 16px 16px', textAlign: 'center' }}>
            <div className="sora" style={{ width: 44, height: 44, borderRadius: 10, background: '#e11d48', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: 16 }}>S</div>
            <div className="sora" style={{ fontWeight: 700, fontSize: 14, color: '#111827' }}>Simply She</div>
            <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>The glow is her secret.</div>
            <div style={{ display: 'inline-block', marginTop: 8, background: '#ffe4e6', color: '#881337', fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 50 }}>Store is open</div>
          </div>
          <div style={{ padding: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {[
              { bg: '#fce7f3', name: 'Classy skirt', price: '₦15,000' },
              { bg: '#fef3c7', name: 'Rose lip gloss', price: '₦5,000' },
              { bg: '#f0fdf4', name: 'Nike custom', price: '₦30,000' },
              { bg: '#ede9fe', name: 'Gold earrings', price: '₦6,000' },
            ].map((p, i) => (
              <div key={i} style={{ background: '#f9f9f9', borderRadius: 12, overflow: 'hidden', border: '1px solid #f0f0f0' }}>
                <div style={{ width: '100%', aspectRatio: '1', background: p.bg }} />
                <div style={{ padding: '6px 8px 8px' }}>
                  <div className="sora" style={{ fontSize: 10, fontWeight: 600, color: '#111827', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.name}</div>
                  <div style={{ fontSize: 10, fontWeight: 700, color: '#e11d48', marginTop: 2 }}>{p.price}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="sora" style={{ margin: '0 12px 12px', background: '#25D366', color: 'white', fontWeight: 600, fontSize: 11, padding: 10, borderRadius: 12, textAlign: 'center' }}>Message Vendor on WhatsApp</div>
        </div>
      </div>

      {/* PROBLEM */}
      <div style={{ background: '#fafafa', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="sora" style={{ fontSize: 12, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>The problem</div>
          <h2 className="sora" style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: -1, lineHeight: 1.15, marginBottom: 12 }}>You're already selling.<br />It's just harder than it needs to be.</h2>
          <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, lineHeight: 1.6, marginBottom: 40 }}>WhatsApp built your business. But it was never built for business.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
            {PROBLEMS.map((p, i) => (
              <div key={i} className="card-hover" style={{ background: 'white', border: '1.5px solid #e5e7eb', borderRadius: 20, padding: 24, transition: 'all 0.2s' }}>
                <div style={{ width: 32, height: 3, background: '#f97316', borderRadius: 2, marginBottom: 16 }} />
                <h3 className="sora" style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>{p.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* FEATURES */}
      <div style={{ padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="sora" style={{ fontSize: 12, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>What Eazee does</div>
          <h2 className="sora" style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: -1, lineHeight: 1.15, marginBottom: 12 }}>A storefront built for the<br />way you already sell</h2>
          <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, lineHeight: 1.6, marginBottom: 40 }}>No website. No Jumia fees. No technical setup. Just your store, your products, your link.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
            {FEATURES.map((f, i) => (
              <div key={i} style={{ background: '#fff7ed', borderRadius: 24, padding: 28, border: '1.5px solid #ffedd5' }}>
                <div className="sora" style={{ fontSize: 13, fontWeight: 700, color: '#f97316', marginBottom: 12 }}>{f.num}</div>
                <h3 className="sora" style={{ fontSize: 17, fontWeight: 700, marginBottom: 8 }}>{f.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{f.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div id="how-it-works" style={{ background: '#fafafa', padding: '72px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="sora" style={{ fontSize: 12, fontWeight: 600, color: '#f97316', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>How it works</div>
          <h2 className="sora" style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: -1, lineHeight: 1.15, marginBottom: 12 }}>Up and running in under 5 minutes</h2>
          <p style={{ fontSize: 16, color: '#6b7280', maxWidth: 480, lineHeight: 1.6, marginBottom: 48 }}>No developer. No designer. Just you and your phone.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 24 }}>
            {STEPS.map((s, i) => (
              <div key={i} style={{ textAlign: 'center', padding: 8 }}>
                <div className="sora" style={{ width: 44, height: 44, borderRadius: '50%', background: '#f97316', color: 'white', fontWeight: 800, fontSize: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>{s.num}</div>
                <h3 className="sora" style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: '#6b7280', lineHeight: 1.6 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* WAITLIST */}
      <div id="waitlist" style={{ background: '#111827', color: 'white', padding: '80px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="sora" style={{ fontSize: 12, fontWeight: 600, color: '#fb923c', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 12 }}>Early access</div>
          <h2 className="sora" style={{ fontSize: 'clamp(26px, 4vw, 40px)', fontWeight: 800, letterSpacing: -1, lineHeight: 1.15, color: 'white', marginBottom: 12 }}>We're starting small, on purpose.</h2>
          <p style={{ fontSize: 16, color: '#9ca3af', maxWidth: 520, lineHeight: 1.65, marginBottom: 32 }}>
            Eazee is in beta. We're onboarding vendors in Akwa Ibom and Bayelsa first so we can give everyone proper attention. Join the waitlist and we'll invite you personally.
          </p>
          {!submitted ? (
            <div>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', maxWidth: 480 }}>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(false); }}
                  onKeyDown={e => e.key === 'Enter' && joinWaitlist()}
                  placeholder="your@email.com"
                  style={{ flex: 1, minWidth: 200, background: 'rgba(255,255,255,0.08)', border: `1.5px solid ${error ? '#ef4444' : 'rgba(255,255,255,0.15)'}`, borderRadius: 50, padding: '14px 20px', fontSize: 15, color: 'white', fontFamily: 'Inter, sans-serif', outline: 'none' }}
                />
                <button onClick={joinWaitlist} className="sora btn-hover" style={{ background: '#f97316', color: 'white', fontWeight: 700, fontSize: 15, padding: '14px 28px', borderRadius: 50, border: 'none', cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap' }}>
                  Request access
                </button>
              </div>
              {error && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>Please enter a valid email address.</p>}
              <p style={{ color: '#6b7280', fontSize: 13, marginTop: 12 }}>No spam. Just your invite when your spot opens up.</p>
            </div>
          ) : (
            <div style={{ background: 'rgba(249,115,22,0.12)', border: '1px solid rgba(249,115,22,0.25)', borderRadius: 14, padding: '16px 22px', maxWidth: 460 }}>
              <p style={{ color: '#fdba74', fontSize: 15, fontWeight: 500, fontFamily: 'Sora, sans-serif' }}>You're on the list.</p>
              <p style={{ color: '#9ca3af', fontSize: 14, marginTop: 4 }}>We'll reach out with your invite soon. Thank you for believing in Eazee.</p>
            </div>
          )}
        </div>
      </div>

      {/* FOOTER */}
      <div style={{ borderTop: '1px solid #e5e7eb', padding: '28px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <span className="sora" style={{ fontWeight: 800, fontSize: 20, color: '#f97316' }}>Eazee</span>
          <span style={{ fontSize: 13, color: '#9ca3af' }}>Built for African vendors. &copy; 2026 Eazee.</span>
        </div>
      </div>
    </div>
  );
}
