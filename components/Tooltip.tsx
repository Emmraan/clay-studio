
import React from 'react';

interface TooltipProps {
  text: string;
}

export const Tooltip: React.FC<TooltipProps> = ({ text }) => {
  return (
    <div className="group relative inline-block ml-1.5 align-middle">
      <div className="cursor-help text-slate-600 hover:text-purple-400 transition-colors">
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 hidden group-hover:block w-56 p-3 bg-slate-900 text-slate-200 text-[11px] leading-relaxed rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] z-50 pointer-events-none border border-white/10 backdrop-blur-md">
        {text}
        <div className="absolute top-full left-1/2 -translate-x-1/2 border-8 border-transparent border-t-slate-900"></div>
      </div>
    </div>
  );
};