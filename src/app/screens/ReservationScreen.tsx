import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../components/Button';
import { ScreenType, ReservationData } from '../types';
import { ArrowLeft, Calendar, Clock, User, Users, Search, Smartphone } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { reservationApi } from '../../lib/adminApi';

interface ReservationScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onSubmit: (data: ReservationData) => void;
}

export const ReservationScreen = ({ onNavigate, onSubmit }: ReservationScreenProps) => {
  const [activeTab, setActiveTab] = useState<'new' | 'existing'>('new');
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ReservationData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  
  // Separate form state for existing booking search to avoid conflict
  const [bookingRef, setBookingRef] = useState('');
  const [searchError, setSearchError] = useState<string | null>(null);

  const handleNewReservation = async (data: ReservationData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await reservationApi.create({
        customer_name: data.name,
        phone: data.phone,
        date: data.date,
        time: data.time,
        guests: Number(data.partySize)
      });
      
      reset();
      onSubmit(data); // Show success message
    } catch (error) {
      console.error('Error creating reservation:', error);
      setSubmitError('Failed to create reservation. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleExistingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSearchError(null);
    
    if (bookingRef) {
      try {
        const reservations = await reservationApi.findByPhone(bookingRef);
        
        if (reservations.length > 0) {
          const latest = reservations[0];
          const mockData: ReservationData = {
            name: latest.customer_name,
            date: latest.date,
            time: latest.time,
            partySize: latest.guests,
            phone: latest.phone
          };
          onSubmit(mockData);
        } else {
          setSearchError('No reservation found with that phone number.');
        }
      } catch (error) {
        console.error('Error finding reservation:', error);
        setSearchError('Error searching for reservation. Please try again.');
      }
    }
  };

  return (
    <div className="max-w-2xl mx-auto pt-24">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('HOME')}>
          <ArrowLeft size={20} className="mr-2" /> Back
        </Button>
        <h2 className="text-3xl font-bold text-[#3E2723]">Reservation Check-in</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-2xl shadow-lg border border-[#D7CCC8]/30"
      >
        <div className="mb-8">
          <div className="flex border-b border-[#D7CCC8] mb-6">
            <button 
              onClick={() => setActiveTab('new')}
              className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'new' ? 'border-b-2 border-[#8D6E63] text-[#8D6E63]' : 'text-[#5D4037]/60 hover:text-[#5D4037]'}`}
            >
              New Reservation
            </button>
            <button 
              onClick={() => setActiveTab('existing')}
              className={`px-6 py-3 font-semibold transition-colors ${activeTab === 'existing' ? 'border-b-2 border-[#8D6E63] text-[#8D6E63]' : 'text-[#5D4037]/60 hover:text-[#5D4037]'}`}
            >
              Existing Booking
            </button>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {activeTab === 'new' ? (
            <motion.form 
              key="new"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleSubmit(handleNewReservation)} 
              className="space-y-6"
            >
              {submitError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-sm">
                  {submitError}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5D4037] flex items-center gap-2">
                    <Calendar size={16} /> Date
                  </label>
                  <input
                    type="date"
                    {...register('date', { required: 'Date is required' })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all"
                  />
                  {errors.date && <span className="text-red-500 text-xs">{errors.date.message}</span>}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#5D4037] flex items-center gap-2">
                    <Clock size={16} /> Time
                  </label>
                  <input
                    type="time"
                    {...register('time', { required: 'Time is required' })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all"
                  />
                  {errors.time && <span className="text-red-500 text-xs">{errors.time.message}</span>}
                </div>
                
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-[#5D4037]">Phone Number</label>
                  <input
                    type="tel"
                    {...register('phone', { required: 'Phone is required' })}
                    className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all"
                    placeholder="+233 24 456 7890"
                  />
                  {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" fullWidth size="lg" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating Reservation...' : 'Confirm Reservation'}
                </Button>
              </div>
            </motion.form>
          ) : (
            <motion.form
              key="existing"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleExistingSubmit}
              className="space-y-6"
            >
              <div className="bg-[#8D6E63]/10 p-4 rounded-xl flex items-start gap-3 text-[#5D4037] mb-6">
                <Smartphone size={24} className="mt-1" />
                <div>
                  <p className="font-bold">Find your reservation</p>
                  <p className="text-sm">Enter the phone number you used when making your reservation.</p>
                </div>
              </div>

              {searchError && (
                <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-sm">
                  {searchError}
                </div>
              )}

              <div className="space-y-2">
                <label className="text-sm font-medium text-[#5D4037] flex items-center gap-2">
                  Phone Number
                </label>
                <div className="relative">
                  <input
                    value={bookingRef}
                    onChange={(e) => setBookingRef(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-[#FDFBF7] border border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all text-lg"
                    placeholder="+233 24 456 7890"
                    required
                  />
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#8D6E63]" size={20} />
                </div>
              </div>

              <div className="pt-4">
                <Button type="submit" fullWidth size="lg">
                  Find Booking
                </Button>
              </div>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
