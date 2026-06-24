'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../../context/AuthContext';
import { Lock, Mail, AlertTriangle, Eye, EyeOff } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login, loginAsDemo, loading } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // If already logged in, direct to dashboard
    if (user) {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const success = await login(email, password);
      if (success) {
        router.push('/admin/dashboard');
      } else {
        setError('Invalid email credentials or password.');
      }
    } catch (err) {
      setError('An error occurred during authentication.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDemoClick = () => {
    loginAsDemo();
    router.push('/admin/dashboard');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=1200')] bg-cover bg-center p-6 relative">
      <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur-md" />

      <div className="relative z-10 w-full max-w-md bg-neutral-900/60 p-8 rounded-3xl border border-white/10 shadow-2xl flex flex-col items-center">
        
        {/* Brand */}
        <div className="text-center mb-8">
          <span className="font-serif text-3xl font-bold tracking-widest text-white block">
            AURELIA
          </span>
          <span className="text-[10px] tracking-[0.3em] font-sans text-gold-400 font-bold uppercase block mt-1">
            Concierge Suite
          </span>
        </div>

        {error && (
          <div className="w-full bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl p-3.5 flex items-center gap-2.5 text-xs mb-6">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="w-full space-y-5">
          {/* Email */}
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@aurelia.com"
                className="w-full pl-10 pr-4 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs outline-none focus:border-gold-400 transition-colors text-white"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[9px] uppercase tracking-widest text-neutral-400 font-bold mb-1.5">
              Secure Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-neutral-950/60 border border-white/10 rounded-xl text-xs outline-none focus:border-gold-400 transition-colors text-white"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-neutral-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 bg-gradient-to-r from-gold-600 to-gold-500 hover:from-gold-700 hover:to-gold-600 text-white font-sans text-xs uppercase tracking-widest rounded-full font-bold shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-8 ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        <div className="relative w-full my-6 flex items-center justify-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10" />
          </div>
          <span className="relative z-10 bg-neutral-900/60 px-3 text-[9px] uppercase tracking-widest text-neutral-550">OR</span>
        </div>

        {/* Demo Login Button */}
        <button
          onClick={handleDemoClick}
          className="w-full py-3 border border-dashed border-gold-500/30 hover:border-gold-500 text-gold-450 hover:text-gold-300 font-sans text-xs uppercase tracking-widest rounded-full font-bold transition-all bg-gold-500/5 hover:bg-gold-500/10 cursor-pointer"
        >
          Login as Demo User (Read-Only)
        </button>



      </div>
    </div>
  );
}
