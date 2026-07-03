'use client';
import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  as?: 'div' | 'section' | 'article';
}

export function GlassPanel({ children, className = '', hover = false, as: Tag = 'div' }: GlassPanelProps) {
  return (
    <Tag className={`${hover ? 'glass-panel-hover' : 'glass-panel'} ${className}`}>
      {children}
    </Tag>
  );
}
