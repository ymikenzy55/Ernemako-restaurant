import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from './Button';
import { Mail, User, Phone, MessageSquare, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { contactApi } from '../../lib/adminApi';

interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  message: string;
}

export const ContactForm = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<ContactFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      await contactApi.create(data);
      setSubmitSuccess(true);
      reset();
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSubmitSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error submitting contact form:', error);
      setSubmitError('Failed to send message. Please try again or call us directly.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 md:p-8 shadow-lg border-2 border-[#8D6E63]/20">
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-[#3E2723] mb-2">Send Us a Message</h3>
        <p className="text-[#5D4037]/70">We'll get back to you as soon as possible</p>
      </div>

      <AnimatePresence mode="wait">
        {submitSuccess ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <CheckCircle size={64} className="text-green-500 mb-4" />
            <h4 className="text-xl font-bold text-[#3E2723] mb-2">Message Sent!</h4>
            <p className="text-[#5D4037]/70 text-center">
              Thank you for contacting us. We'll respond shortly.
            </p>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-4"
          >
            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-2 flex items-center gap-2">
                <User size={16} /> Your Name *
              </label>
              <input
                {...register('name', { required: 'Name is required' })}
                className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border-2 border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all"
                placeholder="John Doe"
              />
              {errors.name && (
                <span className="text-red-500 text-xs mt-1">{errors.name.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-2 flex items-center gap-2">
                <Mail size={16} /> Email Address *
              </label>
              <input
                type="email"
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address'
                  }
                })}
                className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border-2 border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all"
                placeholder="john@example.com"
              />
              {errors.email && (
                <span className="text-red-500 text-xs mt-1">{errors.email.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-2 flex items-center gap-2">
                <Phone size={16} /> Phone Number (Optional)
              </label>
              <input
                type="tel"
                {...register('phone')}
                className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border-2 border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all"
                placeholder="+233 24 456 7890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#5D4037] mb-2 flex items-center gap-2">
                <MessageSquare size={16} /> Your Message *
              </label>
              <textarea
                {...register('message', { required: 'Message is required' })}
                rows={5}
                className="w-full px-4 py-3 rounded-xl bg-[#FDFBF7] border-2 border-[#D7CCC8] focus:border-[#8D6E63] focus:ring-1 focus:ring-[#8D6E63] outline-none transition-all resize-none"
                placeholder="Tell us how we can help you..."
              />
              {errors.message && (
                <span className="text-red-500 text-xs mt-1">{errors.message.message}</span>
              )}
            </div>

            {submitError && (
              <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 text-red-700 text-sm">
                {submitError}
              </div>
            )}

            <Button
              type="submit"
              fullWidth
              size="lg"
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail size={20} />
                  Send Message
                </>
              )}
            </Button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
};
