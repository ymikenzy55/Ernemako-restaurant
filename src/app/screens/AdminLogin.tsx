import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Eye, EyeOff } from 'lucide-react';
import { Button } from '../components/Button';
import { supabase } from '../../lib/supabase';

interface AdminLoginProps {
  onLogin: () => void;
}

export const AdminLogin = ({ onLogin }: AdminLoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        onLogin();
      }
    } catch (error: any) {
      setError(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#3E2723] via-[#5D4037] to-[#2C1810] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <svg className="w-full h-full">
          <defs>
            <pattern id="grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <circle cx="2" cy="2" r="1" fill="white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Logo Card */}
        <div className="bg-white/10 backdrop-blur-md rounded-t-3xl p-8 text-center border-t-4 border-[#8D6E63]">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-[#8D6E63] flex items-center justify-center">
            <span className="text-4xl font-bold text-white">E</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">ERNEMAKO</h1>
          <p className="text-[#D7CCC8] text-sm uppercase tracking-widest">Admin Portal</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-b-3xl p-8 shadow-2xl">
          <h2 className="text-2xl font-bold text-[#3E2723] mb-2">Welcome Back</h2>
          <p className="text-[#5D4037]/70 mb-6">Sign in to manage your restaurant</p>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#3E2723] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6E63]" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@ernemako.com"
                  className="w-full pl-12 pr-4 py-3 rounded-lg border-2 border-[#D7CCC8] focus:border-[#8D6E63] focus:outline-none transition-colors"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#3E2723] mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8D6E63]" size={20} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 rounded-lg border-2 border-[#D7CCC8] focus:border-[#8D6E63] focus:outline-none transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8D6E63] hover:text-[#5D4037] transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-2 border-[#D7CCC8] text-[#8D6E63] focus:ring-[#8D6E63]"
                />
                <span className="text-sm text-[#5D4037]/70">Remember me</span>
              </label>
              <a href="#" className="text-sm text-[#8D6E63] hover:underline">
                Forgot password?
              </a>
            </div>

            <Button type="submit" fullWidth size="lg" className="mt-6" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#D7CCC8]">
            <p className="text-center text-sm text-[#5D4037]/70">
              Use the credentials you created in Supabase
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white/60 text-sm mt-6">
          © 2026 Ernemako Restaurant. All rights reserved.
        </p>
      </motion.div>
    </div>
  );
};
