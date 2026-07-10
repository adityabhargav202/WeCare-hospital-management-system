/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Phone, MessageCircle, X, PhoneCall } from 'lucide-react';

export default function FloatingContactButton() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-5 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col items-end gap-2.5"
          >
            <a
              href="https://wa.me/15551234567"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2.5 bg-white shadow-lg border border-slate-100 pl-4 pr-2 py-2 rounded-full hover:shadow-xl transition-all group"
            >
              <span className="text-xs font-semibold text-slate-700 group-hover:text-emerald-600 transition-colors">
                Chat on WhatsApp
              </span>
              <span className="p-2 bg-emerald-500 text-white rounded-full">
                <MessageCircle className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </a>

            <a
              href="tel:+15551234567"
              className="flex items-center gap-2.5 bg-white shadow-lg border border-slate-100 pl-4 pr-2 py-2 rounded-full hover:shadow-xl transition-all group"
            >
              <span className="text-xs font-semibold text-slate-700 group-hover:text-blue-600 transition-colors">
                Call Us Now
              </span>
              <span className="p-2 bg-blue-600 text-white rounded-full">
                <PhoneCall className="h-4 w-4" strokeWidth={2.5} />
              </span>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        id="floating-contact-toggle"
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full shadow-xl shadow-blue-600/30 transition-colors"
        aria-label="Contact options"
      >
        {!isOpen && (
          <span className="absolute inset-0 rounded-full bg-blue-500 animate-ping opacity-40" />
        )}
        <span className="relative block">
          {isOpen ? <X className="h-5 w-5" /> : <Phone className="h-5 w-5" />}
        </span>
      </motion.button>
    </div>
  );
}
