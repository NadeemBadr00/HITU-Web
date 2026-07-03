'use client';
import React from 'react';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  pulse?: boolean;
}

export function StatCard({ label, value, icon, color, bgColor, pulse = false }: StatCardProps) {
  return (
    <div className="glass-panel-hover group relative overflow-hidden p-5 transition-all duration-300">
      {/* Subtle gradient overlay on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <div className="relative flex items-start justify-between">
        <div className="flex flex-col gap-1">
          <span className="text-2xl font-bold text-gray-100 tracking-tight">
            {value}
          </span>
          <span className="text-sm text-gray-400">
            {label}
          </span>
        </div>

        <div
          className={`
            flex items-center justify-center w-11 h-11 rounded-xl
            ${bgColor} ${color}
            transition-all duration-300
            group-hover:scale-110
            ${pulse ? 'animate-pulse' : ''}
          `}
        >
          {icon}
        </div>
      </div>

      {/* Bottom accent line on hover */}
      <div className={`absolute bottom-0 left-0 right-0 h-[1px] ${bgColor} opacity-0 group-hover:opacity-60 transition-opacity duration-300`} />
    </div>
  );
}
