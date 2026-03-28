import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../utils/api';

const PALETTES = [
  { id: 'warm', label: 'Warm Sunset', primary: '#f97316', bg: '#fff7ed', text: '#9a3412' },
  { id: 'fresh', label: 'Fresh Green', primary: '#16a34a', bg: '#f0fdf4', text: '#14532d' },
  { id: 'royal', label: 'Royal Purple', primary: '#7c3aed', bg: '#faf5ff', text: '#4c1d95' },
  { id: 'ocean', label: 'Ocean Blue', primary: '#0284c7', bg: '#f0f9ff', text: '#0c4a6e' },
  { id: 'rose', label: 'Rose Pink', primary: '#e11d48', bg: '#fff1f2', text: '#881337' },
  { id: 'earth', label: 'Earth Brown', primary: '#92400e', bg: '#fef3c7', text: '#451a03' },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    business_name: '',
    bio: '',
    whatsapp_number: '',
    palette: 'warm',
    logo: null,
    logoPreview: null,
  });

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(f => ({ ...f, logo: file, logoPreview: URL.createObjectURL(file) }));
  };

  const handleSubmit = async () => {
    if (!form.business_name.trim()) return toast.error('Business name is required');
    if (!form.whatsapp_number.trim()) return toast.error('WhatsApp number is required');
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('business_name', form.business_name);
      formData.append('bio', form.bio);
      formData.append('whatsapp_number', form.whatsapp_number);
      formData.append('palette', form.palette);
      if (form.logo) formData.append('logo', form.logo);

      const data = await api.postForm('/api/vendor/onboard', formData);
      if (data.error) throw new Error(data.error);

      toast.success('Store created! 🎉');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const selectedPalette = PALETTES.find(p => p.id === form.palette);

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-orange-500">Eazee</h1>
          <p className="text-gray-500 text-sm mt-1">Let's set up your store</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-2 rounded-full transition-all ${s === step ? 'w-8 bg-orange-500' : s < step ? 'w-4 bg-orange-300' : 'w-4 bg-gray-200'}`} />
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          {/* Step 1: Business Info */}
          {step === 1 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Tell us about your business</h2>
                <p className="text-sm text-gray-400">This shows on your storefront</p>
              </div>

              {/* Logo upload */}
              <div className="flex flex-col items-center">
                <label className="cursor-pointer group">
                  <div className="w-24 h-24 rounded-2xl bg-orange-50 border-2 border-dashed border-orange-200 flex items-center justify-center overflow-hidden group-hover:border-orange-400 transition">
                    {form.logoPreview ? (
                      <img src={form.logoPreview} alt="Logo" className="w-full h-full object-cover" />
                    ) : (
                      <div className="text-center">
                        <div className="text-2xl">📸</div>
                        <div className="text-xs text-gray-400 mt-1">Add logo</div>
                      </div>
                    )}
                  </div>
                  <input type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                </label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Business name *</label>
                <input
                  type="text"
                  value={form.business_name}
                  onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))}
                  placeholder="e.g. Mama Ngozi's Kitchen"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">Short bio</label>
                <textarea
                  value={form.bio}
                  onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                  placeholder="What do you sell? Who do you sell to?"
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition resize-none"
                />
              </div>

              <button
                onClick={() => {
                  if (!form.business_name.trim()) return toast.error('Business name is required');
                  setStep(2);
                }}
                className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
              >
                Next →
              </button>
            </div>
          )}

          {/* Step 2: WhatsApp Number */}
          {step === 2 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Your WhatsApp number</h2>
                <p className="text-sm text-gray-400">Customers will message you here when they want to order</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-600 mb-1">WhatsApp number *</label>
                <input
                  type="tel"
                  value={form.whatsapp_number}
                  onChange={e => setForm(f => ({ ...f, whatsapp_number: e.target.value }))}
                  placeholder="+2348012345678"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
                />
                <p className="text-xs text-gray-400 mt-1">Include country code e.g. +234 for Nigeria</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition">
                  ← Back
                </button>
                <button
                  onClick={() => {
                    if (!form.whatsapp_number.trim()) return toast.error('WhatsApp number is required');
                    setStep(3);
                  }}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition"
                >
                  Next →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Palette */}
          {step === 3 && (
            <div className="space-y-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Pick your brand colour</h2>
                <p className="text-sm text-gray-400">This sets the vibe of your storefront</p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                {PALETTES.map(palette => (
                  <button
                    key={palette.id}
                    onClick={() => setForm(f => ({ ...f, palette: palette.id }))}
                    className={`p-3 rounded-xl border-2 flex items-center gap-3 transition ${form.palette === palette.id ? 'border-gray-800' : 'border-gray-100 hover:border-gray-200'}`}
                    style={{ backgroundColor: palette.bg }}
                  >
                    <div className="w-6 h-6 rounded-full flex-shrink-0" style={{ backgroundColor: palette.primary }} />
                    <span className="text-sm font-medium" style={{ color: palette.text }}>{palette.label}</span>
                  </button>
                ))}
              </div>

              {/* Preview */}
              <div className="rounded-xl p-4 mt-2" style={{ backgroundColor: selectedPalette.bg }}>
                <p className="text-xs font-medium mb-1" style={{ color: selectedPalette.text }}>Preview</p>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full" style={{ backgroundColor: selectedPalette.primary }} />
                  <div>
                    <p className="text-sm font-semibold" style={{ color: selectedPalette.text }}>{form.business_name || 'Your Business'}</p>
                    <p className="text-xs" style={{ color: selectedPalette.primary }}>eazee.store/your-link</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className="flex-1 border border-gray-200 text-gray-600 font-medium py-3 rounded-xl hover:bg-gray-50 transition">
                  ← Back
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
                >
                  {loading ? 'Creating...' : 'Launch store 🚀'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
