import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { api } from '../utils/api';

const validatePassword = (password) => {
  if (password.length < 8) return 'Password must be at least 8 characters';
  if (!/[A-Z]/.test(password)) return 'Password must include an uppercase letter';
  if (!/[a-z]/.test(password)) return 'Password must include a lowercase letter';
  if (!/[0-9]/.test(password)) return 'Password must include a number';
  if (!/[^A-Za-z0-9]/.test(password)) return 'Password must include a special character (@, #, !)';
  return null;
};

export default function Login() {
  const [mode, setMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await signInWithGoogle();
      if (error) throw error;
      // Redirect handled by Supabase OAuth flow
    } catch (err) {
      toast.error(err.message || 'Google sign in failed');
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error('Fill in all fields');

    if (mode === 'signup') {
      const error = validatePassword(password);
      if (error) return toast.error(error);
    }

    setLoading(true);
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        const profile = await api.get('/api/vendor/profile');
        navigate(profile.vendor ? '/dashboard' : '/onboarding');
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        toast.success('Account created! Set up your store.');
        navigate('/onboarding');
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const passwordStrength = () => {
    if (!password || mode === 'login') return null;
    const checks = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /[0-9]/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];
    const passed = checks.filter(Boolean).length;
    if (passed <= 2) return { label: 'Weak', color: '#ef4444', width: '33%' };
    if (passed <= 4) return { label: 'Almost there', color: '#f97316', width: '66%' };
    return { label: 'Strong', color: '#16a34a', width: '100%' };
  };

  const strength = passwordStrength();

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-sm">

        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500 tracking-tight">Eazee</h1>
          <p className="text-gray-500 mt-1 text-sm">Your store, one link away</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create your store'}
          </h2>
          <p className="text-sm text-gray-400 mb-5">
            {mode === 'login' ? 'Log in to your Eazee account' : 'Free to start, no credit card needed'}
          </p>

          {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-3 text-sm font-medium text-gray-700 hover:bg-gray-50 transition disabled:opacity-60 mb-4"
          >
            {googleLoading ? (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin" />
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? 'Connecting...' : 'Continue with Google'}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>

          {/* Email/Password form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="you@email.com"
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 transition pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-medium">
                  {showPassword ? 'Hide' : 'Show'}
                </button>
              </div>

              {/* Password strength */}
              {mode === 'signup' && password.length > 0 && strength && (
                <div className="mt-2">
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-300" style={{ width: strength.width, backgroundColor: strength.color }} />
                  </div>
                  <p className="text-xs mt-1 font-medium" style={{ color: strength.color }}>{strength.label}</p>
                </div>
              )}

              {/* Requirements */}
              {mode === 'signup' && (
                <div className="mt-2 space-y-1">
                  {[
                    { check: password.length >= 8, label: 'At least 8 characters' },
                    { check: /[A-Z]/.test(password), label: 'One uppercase letter' },
                    { check: /[a-z]/.test(password), label: 'One lowercase letter' },
                    { check: /[0-9]/.test(password), label: 'One number' },
                    { check: /[^A-Za-z0-9]/.test(password), label: 'One special character (@, #, !)' },
                  ].map((req, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${req.check && password.length > 0 ? 'bg-green-500' : 'bg-gray-200'}`} />
                      <span className={`text-xs ${req.check && password.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>{req.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 rounded-xl transition disabled:opacity-60"
            >
              {loading ? 'Please wait...' : mode === 'login' ? 'Log in' : 'Create account'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-5">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setPassword(''); }}
              className="text-orange-500 font-medium hover:underline"
            >
              {mode === 'login' ? 'Sign up free' : 'Log in'}
            </button>
          </p>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">Built for African vendors</p>
      </div>
    </div>
  );
}
