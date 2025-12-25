
import React, { useState, useRef, useEffect } from 'react';
import { DropdownOption } from '../types';

interface ClayDropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  openUpwards?: boolean;
}

export const ClayDropdown: React.FC<ClayDropdownProps> = ({ 
  options, 
  value, 
  onChange, 
  label, 
  placeholder = "Select...",
  openUpwards = false 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const selectedOption = options.find(o => o.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="clay-inset p-3 md:p-3.5 flex items-center justify-between cursor-pointer group active:scale-[0.98] transition-all bg-white/5 hover:bg-white/10"
      >
        <span className="font-bold text-[10px] md:text-xs text-[var(--text-main)] truncate pr-2">
          {selectedOption ? selectedOption.name : placeholder}
        </span>
        <svg 
          className={`w-3.5 h-3.5 text-[var(--text-dim)] flex-shrink-0 transition-transform duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${isOpen ? 'rotate-180 scale-110' : ''}`} 
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <div className={`absolute ${openUpwards ? 'bottom-full mb-3' : 'top-full mt-3'} left-0 right-0 z-[200] clay-raised p-1.5 overflow-hidden max-h-60 overflow-y-auto dropdown-pop origin-${openUpwards ? 'bottom' : 'top'} border border-white/10 shadow-2xl bg-[var(--clay-bg)]`}>
          {options.length > 0 ? options.map((option, idx) => (
            <div 
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className={`p-2.5 md:p-3 rounded-xl cursor-pointer font-bold text-[9px] md:text-xs transition-all mb-1 last:mb-0 transform hover:translate-x-1 ${
                value === option.id 
                ? 'clay-pill-active shadow-md' 
                : 'text-[var(--text-dim)] hover:bg-white/10 hover:text-[var(--text-main)]'
              }`}
              style={{ animationDelay: `${idx * 30}ms` }}
            >
              {option.name}
            </div>
          )) : (
            <div className="p-4 text-[var(--text-dim)] font-bold text-center text-[10px] italic">No Options Available</div>
          )}
        </div>
      )}
    </div>
  );
};
