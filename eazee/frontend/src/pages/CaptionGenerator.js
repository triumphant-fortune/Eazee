import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../utils/api';

const TONES = [
  { id: 'excited', label: '🔥 Hype', desc: 'High energy, fresh stock vibes' },
  { id: 'professional', label: '💼 Professional', desc: 'Trusted brand feel' },
  { id: 'funny', label: '😄 Funny', desc: 'Playful, makes them smile' },
  { id: 'urgent', label: '⚡ Urgent', desc: 'Limited stock, buy now' },
];

export default function CaptionGenerator() {
  const navigate = useNavigate();
  const [productName, setProductName] = useState('');
  const [price, setPrice] = useState('');
  const [tone, setTone] = useState('excited');
  const [caption, setCaption] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const generateCaption = async () => {
    if (!productName.trim()) return toast.error('Enter a product name first');
    setLoading(true);
    setCaption('');
    try {
      const data = await api.post('/api/ai/caption', { product_name: productName, price, tone });
      if (data.error) throw new Error(data.error);
      setCaption(data.caption);
    } catch (err) {
      toast.error(err.message || 'Could not generate caption');
    } finally {
      setLoading(false);
    }
  };

  const copyCaption = () => {
    navigator.clipboard.writeText(caption);
    setCopied(true);
    toast.success('Caption copied!');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600 transition text-lg">
            ←
          </button>
          <div>
            <h1 className="font-semibold text-gray-800">Caption Generator</h1>
            <p className="text-xs text-gray-400">AI-written WhatsApp captions</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-6 space-y-4">
        {/* Form */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">What are you promoting?</label>
            <input
              type="text"
              value={productName}
              onChange={e => setProductName(e.target.value)}
              placeholder="e.g. Ankara Bag, Fresh Catfish, Chin Chin..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">Price (optional)</label>
            <input
              type="number"
              value={price}
              onChange={e => setPrice(e.target.value)}
              placeholder="5000"
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-2">Pick a tone</label>
            <div className="grid grid-cols-2 gap-2">
              {TONES.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id)}
                  className={`p-3 rounded-xl border-2 text-left transition ${tone === t.id ? 'border-orange-400 bg-orange-50' : 'border-gray-100 hover:border-gray-200 bg-white'}`}
                >
                  <p className="text-sm font-medium text-gray-800">{t.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={generateCaption}
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
          >
            {loading ? 'Writing your caption...' : '✨ Generate caption'}
          </button>
        </div>

        {/* Result */}
        {caption && (
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-gray-800">Your caption</h3>
              <button
                onClick={generateCaption}
                disabled={loading}
                className="text-xs text-orange-500 font-medium hover:underline"
              >
                Regenerate
              </button>
            </div>

            {/* WhatsApp preview */}
            <div className="bg-[#e5ddd5] rounded-xl p-3 mb-4">
              <div className="bg-white rounded-xl px-3 py-2 max-w-xs shadow-sm">
                <p className="text-sm text-gray-800 leading-relaxed whitespace-pre-line">{caption}</p>
                <p className="text-right text-xs text-gray-400 mt-1">12:00 ✓✓</p>
              </div>
            </div>

            <button
              onClick={copyCaption}
              className="w-full py-3 rounded-xl font-semibold text-sm transition"
              style={{ backgroundColor: copied ? '#16a34a' : '#f97316', color: 'white' }}
            >
              {copied ? '✓ Copied to clipboard!' : 'Copy caption'}
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              Paste directly into WhatsApp status or group
            </p>
          </div>
        )}

        {/* Tip */}
        {!caption && (
          <div className="bg-orange-50 rounded-2xl p-4">
            <p className="text-sm font-medium text-orange-700 mb-1">💡 How it works</p>
            <p className="text-sm text-orange-600 leading-relaxed">
              Enter your product name, pick a vibe, and the AI writes a WhatsApp-ready caption in seconds. Copy it and post manually — that's it.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
