import React, { useState } from 'react';
import { ScreenType } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, CreditCard, Smartphone, Banknote, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PaymentScreenProps {
  onNavigate: (screen: ScreenType) => void;
  onComplete: () => void;
  total: number;
}

export const PaymentScreen = ({ onNavigate, onComplete, total }: PaymentScreenProps) => {
  const [method, setMethod] = useState<'card' | 'wallet' | 'cash' | null>(null);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  const handlePayment = () => {
    setProcessing(true);
    setTimeout(() => {
      setProcessing(false);
      setSuccess(true);
    }, 2000);
  };

  if (success) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center max-w-lg mx-auto">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6"
        >
          <CheckCircle size={48} />
        </motion.div>
        <h2 className="text-3xl font-bold text-[#3E2723] mb-4">Payment Successful!</h2>
        <p className="text-[#5D4037] mb-8">
          Order #8492 confirmed. Please take your receipt.
        </p>
        <div className="flex gap-4 w-full">
          <Button variant="outline" fullWidth onClick={onComplete}>Print Receipt</Button>
          <Button fullWidth onClick={onComplete}>Done</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto pt-24">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('CART')}>
          <ArrowLeft size={20} className="mr-2" /> Back
        </Button>
        <h2 className="text-3xl font-bold text-[#3E2723]">Payment</h2>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-[#D7CCC8]/30">
        <div className="text-center mb-8">
          <p className="text-sm text-[#8D6E63] uppercase tracking-widest font-bold mb-2">Total Amount</p>
          <p className="text-4xl font-bold text-[#3E2723]">GH₵ {total.toFixed(2)}</p>
        </div>

        <h3 className="font-bold text-[#5D4037] mb-4">Select Payment Method</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          {[
            { id: 'card', label: 'Card', icon: <CreditCard size={24} /> },
            { id: 'wallet', label: 'Wallet', icon: <Smartphone size={24} /> },
            { id: 'cash', label: 'Cash', icon: <Banknote size={24} /> },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMethod(m.id as any)}
              className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${
                method === m.id 
                  ? 'border-[#8D6E63] bg-[#8D6E63]/5 text-[#8D6E63]' 
                  : 'border-[#D7CCC8] text-[#5D4037]/60 hover:border-[#8D6E63]/50'
              }`}
            >
              {m.icon}
              <span className="font-bold">{m.label}</span>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {method && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              {method === 'card' && (
                <div className="space-y-4 mb-6 bg-[#FDFBF7] p-4 rounded-xl border border-[#D7CCC8]">
                   <p className="text-sm text-center text-[#5D4037]">Insert or swipe your card on the terminal.</p>
                </div>
              )}
               {method === 'wallet' && (
                <div className="space-y-4 mb-6 bg-[#FDFBF7] p-4 rounded-xl border border-[#D7CCC8]">
                   <p className="text-sm text-center text-[#5D4037]">Scan the QR code to pay.</p>
                </div>
              )}
              
              <Button 
                fullWidth 
                size="lg" 
                onClick={handlePayment}
                disabled={processing}
              >
                {processing ? 'Processing...' : `Pay GH₵ ${total.toFixed(2)}`}
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
