/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { Users, Stethoscope, Award, Building2 } from 'lucide-react';

interface StatItemProps {
  icon: React.ElementType;
  value: number;
  suffix?: string;
  label: string;
  delay: number;
}

function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const duration = 1600;
    const startTime = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [isInView, target]);

  return (
    <span ref={ref} className="font-mono">
      {count.toLocaleString()}{suffix}
    </span>
  );
}

function StatItem({ icon: Icon, value, suffix, label, delay }: StatItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay, ease: 'easeOut' }}
      className="relative flex flex-col items-center text-center px-4 py-8 sm:py-0"
    >
      <div className="p-3.5 bg-blue-500/10 text-blue-300 rounded-2xl mb-4 border border-blue-400/20">
        <Icon className="h-6 w-6" />
      </div>
      <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
        <AnimatedCounter target={value} suffix={suffix} />
      </span>
      <span className="text-xs sm:text-sm text-slate-400 font-medium mt-2 uppercase tracking-wide">
        {label}
      </span>
    </motion.div>
  );
}

export default function StatsSection() {
  const stats: StatItemProps[] = [
    { icon: Users, value: 24500, suffix: '+', label: 'Patients Treated', delay: 0 },
    { icon: Stethoscope, value: 48, suffix: '+', label: 'Expert Specialists', delay: 0.1 },
    { icon: Award, value: 18, suffix: '+', label: 'Years of Service', delay: 0.2 },
    { icon: Building2, value: 12, label: 'Clinical Departments', delay: 0.3 },
  ];

  return (
    <div id="stats-section" className="relative bg-gradient-to-b from-slate-900 to-slate-950 py-16 sm:py-20 overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((s, idx) => (
            <div key={idx} className="lg:border-l lg:border-slate-800 lg:first:border-l-0">
              <StatItem {...s} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
