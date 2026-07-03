'use client';
import React from 'react';
import { X } from 'lucide-react';

const colorMap = {
  brand: {
    bg: 'bg-teal-500/20',
    text: 'text-teal-400',
    border: 'border-teal-500/30',
    hoverClose: 'hover:bg-teal-500/30',
  },
  ai: {
    bg: 'bg-violet-500/20',
    text: 'text-violet-400',
    border: 'border-violet-500/30',
    hoverClose: 'hover:bg-violet-500/30',
  },
  default: {
    bg: 'bg-white/10',
    text: 'text-gray-300',
    border: 'border-white/10',
    hoverClose: 'hover:bg-white/20',
  },
} as const;

interface ChipProps {
  label: string;
  onRemove?: () => void;
  color?: 'brand' | 'ai' | 'default';
}

export function Chip({ label, onRemove, color = 'default' }: ChipProps) {
  const scheme = colorMap[color];

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
        ${scheme.bg} ${scheme.text} border ${scheme.border}
        transition-all duration-200
      `}
    >
      {label}

      {onRemove && (
        <button
          onClick={onRemove}
          aria-label={`Remove ${label}`}
          className={`
            inline-flex items-center justify-center w-4 h-4 rounded-full
            ${scheme.hoverClose}
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50
            transition-colors duration-200
          `}
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}
