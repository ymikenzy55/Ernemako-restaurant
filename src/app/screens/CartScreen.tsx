import React from 'react';
import { ScreenType, CartItem } from '../types';
import { Button } from '../components/Button';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';

interface CartScreenProps {
  onNavigate: (screen: ScreenType) => void;
  cart: CartItem[];
  removeFromCart: (index: number) => void;
  updateQuantity: (index: number, delta: number) => void;
}

export const CartScreen = ({ onNavigate, cart, removeFromCart, updateQuantity }: CartScreenProps) => {
  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="max-w-4xl mx-auto h-full flex flex-col pt-24">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={() => onNavigate('MENU')}>
          <ArrowLeft size={20} className="mr-2" /> Back to Menu
        </Button>
        <h2 className="text-3xl font-bold text-[#3E2723]">Your Order</h2>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row gap-8">
        {/* Cart Items */}
        <div className="flex-1 space-y-4 overflow-y-auto pr-2">
          {cart.length === 0 ? (
            <div className="text-center py-20 text-[#5D4037]/50">
              <p className="text-xl font-medium">Your cart is empty</p>
              <Button variant="outline" className="mt-4" onClick={() => onNavigate('MENU')}>Start Ordering</Button>
            </div>
          ) : (
            cart.map((item, index) => (
              <motion.div 
                key={`${item.id}-${index}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-white p-4 rounded-xl shadow-sm border border-[#D7CCC8]/30 flex gap-4 items-center"
              >
                <img src={item.image} alt={item.name} className="w-20 h-20 rounded-lg object-cover" />
                
                <div className="flex-1">
                  <h4 className="font-bold text-[#3E2723]">{item.name}</h4>
                  <p className="text-sm text-[#8D6E63]">GH₵ {item.price.toFixed(2)}</p>
                  {item.instructions && <p className="text-xs text-[#5D4037]/60 mt-1">Note: {item.instructions}</p>}
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center bg-[#FDFBF7] rounded-lg border border-[#D7CCC8]">
                    <button 
                      onClick={() => updateQuantity(index, -1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#D7CCC8]/20 transition-colors"
                    >
                      -
                    </button>
                    <span className="w-8 text-center font-medium text-sm">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(index, 1)}
                      className="w-8 h-8 flex items-center justify-center hover:bg-[#D7CCC8]/20 transition-colors"
                    >
                      +
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(index)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>

        {/* Order Summary */}
        {cart.length > 0 && (
          <div className="lg:w-96">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-[#D7CCC8]/30 sticky top-24">
              <h3 className="font-bold text-lg mb-4 text-[#3E2723]">Order Summary</h3>
              
              <div className="space-y-3 mb-6 text-sm">
                <div className="flex justify-between text-[#5D4037]">
                  <span>Subtotal</span>
                  <span>GH₵ {subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-[#5D4037]">
                  <span>Tax (10%)</span>
                  <span>GH₵ {tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-[#D7CCC8] pt-3 flex justify-between font-bold text-lg text-[#3E2723]">
                  <span>Total</span>
                  <span>GH₵ {total.toFixed(2)}</span>
                </div>
              </div>

              <div className="space-y-3">
                <Button fullWidth size="lg" onClick={() => onNavigate('PAYMENT')}>
                  Proceed to Checkout
                </Button>
                <Button fullWidth variant="outline" onClick={() => onNavigate('MENU')}>
                  Add More Items
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
