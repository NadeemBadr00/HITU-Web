import React from 'react';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center animate-fade-in-up">
      <div className="text-gray-500 opacity-50 mb-5" style={{ fontSize: 48 }}>
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-gray-300 mb-2">
        {title}
      </h3>

      {description && (
        <p className="text-sm text-gray-500 max-w-sm mb-6">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className="
            px-5 py-2.5 rounded-xl text-sm font-medium
            bg-teal-500/20 text-teal-400
            border border-teal-500/30
            hover:bg-teal-500/30 hover:border-teal-500/50
            hover:shadow-[0_0_20px_rgba(45,212,191,0.15)]
            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[#050505]
            transition-all duration-300
          "
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
