
import React from 'react';

interface CardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', icon }) => {
  return (
    <div className={`bg-surface rounded-xl shadow-sm border border-gray-200/80 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-on-surface flex items-center">
          {icon && <span className="mr-2 text-primary">{icon}</span>}
          {title}
        </h3>
      </div>
      <div className="text-on-surface-muted">
        {children}
      </div>
    </div>
  );
};
