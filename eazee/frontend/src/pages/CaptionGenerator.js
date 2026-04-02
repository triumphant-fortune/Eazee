import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function CaptionGenerator() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-gray-600 transition text-lg">←</button>
          <div>
            <h1 className="font-semibold text-gray-800">Caption Generator</h1>
            <p className="text-xs text-gray-400">AI-written WhatsApp captions</p>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-2xl bg-orange-50 mx-auto mb-5 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="1.5">
            <path d="M12 20h9"/>
            <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Coming soon</h2>
        <p className="text-gray-400 text-sm leading-relaxed max-w-xs mx-auto">
          We're building AI-powered WhatsApp captions for your products. You'll be the first to know when it's ready.
        </p>
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-3 rounded-xl transition text-sm"
        >
          Back to dashboard
        </button>
      </div>
    </div>
  );
}
