// src/components/request/CompassionPointsSlider.jsx
import React, { useRef, useState, useLayoutEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';

// Level definitions
const levels = [
  { value: 1, label: '💤', color: '#d1fae5', thumbColor: '#10b981', name: 'Resting' },
  { value: 2, label: '🙂', color: '#a7f3d0', thumbColor: '#059669', name: 'Gentle' },
  { value: 3, label: '💪', color: '#6ee7b7', thumbColor: '#047857', name: 'Moderate' },
  { value: 4, label: '🔥', color: '#34d399', thumbColor: '#065f46', name: 'Strong' },
  { value: 5, label: '❤️‍🔥', color: '#10b981', thumbColor: '#064e3b', name: 'Intense' },
];

export default function CompassionPointsSlider({ value = 3, onChange }) {
  // Find current level data
  const current = levels.find(l => l.value === value) || levels[0];
  // Calculate fill percentage
  const percent = ((value - 1) / (levels.length - 1)) * 100;
  // Dynamic gradient for track background
  const background = `linear-gradient(90deg, ${current.color} ${percent}%, #e5e7eb ${percent}%)`;

  return (
    <div className="w-full max-w-md mx-auto text-center space-y-4 p-4">
      {/* Label with numeric value */}
      <label className="block text-lg font-semibold text-gray-800">
        Compassion Level: <span className="font-bold">{value}</span>
      </label>

      {/* Styled Range Input */}
      <input
        type="range"
        min="1"
        max={levels.length}
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 rounded-full appearance-none focus:outline-none"
        style={{ background }}
      />

      {/* Emoji and name animation */}
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={value}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="text-center"
        >
          <div className="text-4xl mb-1">{current.label}</div>
          <div className="text-sm font-medium text-gray-600">{current.name}</div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
