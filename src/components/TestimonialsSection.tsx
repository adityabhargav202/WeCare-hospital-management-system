/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

interface Testimonial {
  name: string;
  role: string;
  quote: string;
  rating: number;
  initials: string;
  color: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    name: 'Priya Sharma',
    role: 'Cardiology Patient',
    quote: 'The cardiology team walked me through every step before my procedure. I have never felt so informed and cared for at a hospital.',
    rating: 5,
    initials: 'PS',
    color: 'bg-blue-100 text-blue-700',
  },
  {
    name: 'Rohan Verma',
    role: "Orthopedics Patient",
    quote: 'From my first consultation to physical therapy after knee surgery, the staff was attentive and the facility was spotless.',
    rating: 5,
    initials: 'RV',
    color: 'bg-emerald-100 text-emerald-700',
  },
  {
    name: 'Anjali Mehta',
    role: 'Pediatrics Parent',
    quote: 'Our pediatrician was patient and gentle with my daughter. Booking the appointment online took less than two minutes.',
    rating: 5,
    initials: 'AM',
    color: 'bg-amber-100 text-amber-700',
  },
];

export default function TestimonialsSection() {
  return (
    <div id="testimonials-section" className="relative bg-white py-16 sm:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-14"
        >
          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest font-mono block mb-2">
            Patient Stories
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight">
            Trusted by Thousands of Families
          </h2>
          <p className="text-sm text-slate-500 mt-3">
            Real experiences from patients who chose WeCare for their care journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="relative bg-slate-50/60 border border-slate-100 rounded-[32px] p-7 hover:shadow-lg hover:bg-white transition-all"
            >
              <Quote className="h-8 w-8 text-blue-200 mb-4" strokeWidth={2.5} />

              <div className="flex items-center gap-0.5 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-6">
                “{t.quote}”
              </p>

              <div className="flex items-center gap-3 pt-4 border-t border-slate-100">
                <div className={`h-10 w-10 rounded-full flex items-center justify-center text-xs font-bold ${t.color}`}>
                  {t.initials}
                </div>
                <div>
                  <span className="block text-sm font-bold text-slate-800">{t.name}</span>
                  <span className="block text-[11px] text-slate-400 font-medium">{t.role}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
