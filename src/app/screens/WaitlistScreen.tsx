import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { ScreenType, WaitlistData } from '../types';
import { ArrowLeft, User, Users, Smartphone, Clock } from 'lucide-react';
import { motion } from 'motion/react';

interface WaitlistScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSubmit: (data: WaitlistData) => void;
}

export const WaitlistScreen = ({ onNavigate, onSubmit }: WaitlistScreenProps) => {
  const { register, handleSubmit, formState: { errors } } = useForm<WaitlistData>();
  const [activeTab, setActiveTab] = useState<'join' | 'check'>('join');

  return (
    <div className="max-w-2xl mx-auto pt-24">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('HOME')}>
          <ArrowLeft size={20} className="mr-2" /> Back
        </Button>
        <h2 className="text-3xl font-bold text-[#3E2723]">Waitlist</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-lg border border-[#D7CCC8]/30"
      >
        <div className="mb-8">
          <div className="flex border-b border-[#D7CCC8] mb-6">
            <button 
              onClick={() => setActiveTab('join')}
              className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'join' ? 'border-b-2 border-[#8D6E63] text-[#8D6E63]' : 'text-[#5D4037]/60 hover:text-[#5D4037]'}`}
            >
              Join Waitlist
            </button>
            <button 
              onClick={() => setActiveTab('check')}
              className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'check' ? 'border-b-2 border-[#8D6E63] text-[#8D6E63]' : 'text-[#5D4037]/60 hover:text-[#5D4037]'}`}
            >
              Check Position
            </button>
          </div>
        </div>

        {activeTab === 'join' ? (
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="bg-[#8D6E63]/10 p-4 rounded-xl flex items-center gap-3 text-[#5D4037] mb-6">
              <Clock size={24} />
              <div>
                <p className="font-bold">Current Estimated Wait Time</p>
                <p className="text-sm">15-25 minutes for parties of 2-4</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-[#5D4037] flex items-center gap-2">
                  <User size={16} /> Name
                </label>
                <input
                  {...register('name', { required: 'Name is required' })}
                  className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all"
                  placeholder="Enter your full name"
                />
                {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#5D4037] flex items-center gap-2">
                  <Smartphone size={16} /> Phone Number
                </label>
                <input
                  type="tel"
                  {...register('phone', { required: 'Phone is required' })}
                  className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all"
                  placeholder="We'll text you when your table is ready"
                />
                {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#5D4037] flex items-center gap-2">
                  <Users size={16} /> Party Size
                </label>
                <select
                  {...register('partySize', { required: true })}
                  className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                    <option key={num} value={num}>{num} People</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-4">
              <Button type="submit" fullWidth size="lg">
                Join the Queue
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-6">
             <div className="space-y-2">
                <label className="text-sm font-medium text-[#5D4037] flex items-center gap-2">
                  <Smartphone size={16} /> Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all"
                  placeholder="Enter the phone number you used"
                />
              </div>
              <Button fullWidth size="lg" variant="secondary">
                Find My Spot
              </Button>
          </div>
        )}
      </motion.div>
    </div>
  );
};
