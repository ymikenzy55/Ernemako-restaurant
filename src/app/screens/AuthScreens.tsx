import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { ScreenType } from '../types';
import { ArrowLeft, Mail, Lock, User, Eye, EyeOff } from 'lucide-react';
import { motion } from 'motion/react';

interface AuthProps {
  onNavigate: (screen: ScreenType) => void;
  onLogin: () => void;
}

export const SignInScreen = ({ onNavigate, onLogin }: AuthProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = (data: any) => {
    // Simulate login
    console.log(data);
    onLogin();
  };

  return (
    <div className="max-w-md mx-auto pt-24">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('HOME')}>
          <ArrowLeft size={20} className="mr-2" /> Back
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-lg border border-[#D7CCC8]/30"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#3E2723] mb-2">Welcome Back</h2>
          <p className="text-[#5D4037]/70">Sign in to access your account</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#5D4037] flex items-center gap-2">
              <Mail size={16} /> Email Address
            </label>
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all"
              placeholder="hello@example.com"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message as string}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#5D4037] flex items-center gap-2">
              <Lock size={16} /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register('password', { required: 'Password is required' })}
                className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all pr-12"
                placeholder="Enter your password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D6E63]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message as string}</span>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-[#5D4037] cursor-pointer">
              <input type="checkbox" className="rounded border-[#D7CCC8] text-[#8D6E63] focus:ring-[#8D6E63]" />
              Remember me
            </label>
            <button type="button" className="text-[#8D6E63] font-medium hover:underline">
              Forgot Password?
            </button>
          </div>

          <Button type="submit" fullWidth size="lg">
            Sign In
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[#5D4037]">
          Don't have an account?{' '}
          <button onClick={() => onNavigate('REGISTER')} className="text-[#8D6E63] font-bold hover:underline">
            Create Account
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export const RegisterScreen = ({ onNavigate, onLogin }: AuthProps) => {
  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const password = watch("password");

  const onSubmit = (data: any) => {
    // Simulate registration
    console.log(data);
    onLogin();
  };

  return (
    <div className="max-w-md mx-auto pt-24">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('HOME')}>
          <ArrowLeft size={20} className="mr-2" /> Back
        </Button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-lg border border-[#D7CCC8]/30"
      >
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-[#3E2723] mb-2">Create Account</h2>
          <p className="text-[#5D4037]/70">Join Ernemako Restaurant rewards</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-[#5D4037] flex items-center gap-2">
              <User size={16} /> Full Name
            </label>
            <input
              {...register('name', { required: 'Name is required' })}
              className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all"
              placeholder="Kwame Mensah"
            />
            {errors.name && <span className="text-red-500 text-xs">{errors.name.message as string}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#5D4037] flex items-center gap-2">
              <Mail size={16} /> Email Address
            </label>
            <input
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all"
              placeholder="hello@example.com"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message as string}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#5D4037] flex items-center gap-2">
              <Lock size={16} /> Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register('password', { 
                  required: 'Password is required',
                  minLength: { value: 6, message: "Password must be at least 6 characters" }
                })}
                className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all pr-12"
                placeholder="Create a password"
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#8D6E63]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message as string}</span>}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#5D4037] flex items-center gap-2">
              <Lock size={16} /> Confirm Password
            </label>
            <input
              type="password"
              {...register('confirmPassword', { 
                required: 'Please confirm password',
                validate: value => value === password || "Passwords do not match"
              })}
              className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all"
              placeholder="Confirm password"
            />
            {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message as string}</span>}
          </div>

          <Button type="submit" fullWidth size="lg">
            Create Account
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-[#5D4037]">
          Already have an account?{' '}
          <button onClick={() => onNavigate('SIGN_IN')} className="text-[#8D6E63] font-bold hover:underline">
            Sign In
          </button>
        </div>
      </motion.div>
    </div>
  );
};
