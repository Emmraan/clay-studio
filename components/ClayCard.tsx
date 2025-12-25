
import React from 'react';

interface ClayCardProps {
  children: React.ReactNode;
  className?: string;
}

export const ClayCard: React.FC<ClayCardProps> = ({ children, className = '' }) => {
  return (
    <div className={`clay-raised p-10 w-full transition-all duration-500 ${className}`}>
      {children}
    </div>
  );
};
