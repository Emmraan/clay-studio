
import React, { useState, useEffect } from 'react';
import { LOADING_MESSAGES } from '../constants';

export const LoadingSpinner: React.FC = () => {
  const [msgIdx, setMsgIdx] = useState(0);

  useEffect(() => {
    const itv = setInterval(() => setMsgIdx(p => (p + 1) % LOADING_MESSAGES.length), 2000);
    return () => clearInterval(itv);
  }, []);

  return (
    <div className="flex flex-col items-center space-y-12">
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute inset-0 bg-white/20 blur-2xl rounded-full"></div>
        <div className="w-24 h-24 rounded-full loader-sphere animate-bounce bg-gradient-to-br from-[var(--accent-purple)] to-[var(--accent-yellow)]"></div>
        <div className="absolute -bottom-4 w-12 h-2 bg-black/10 blur-sm rounded-full animate-pulse scale-x-125"></div>
      </div>
      <div className="text-center space-y-3">
        <p className="font-extrabold text-[var(--text-main)] text-lg">{LOADING_MESSAGES[msgIdx]}</p>
        <div className="w-32 h-1 clay-inset mx-auto relative overflow-hidden">
           <div className="absolute inset-y-0 left-0 bg-[var(--accent-purple)] w-1/2 animate-[progress_2s_infinite]"></div>
        </div>
      </div>
      <style>{`
        @keyframes progress {
          0% { left: -100%; width: 30%; }
          50% { left: 20%; width: 60%; }
          100% { left: 100%; width: 30%; }
        }
        .loader-sphere {
          box-shadow: inset -10px -10px 20px rgba(0,0,0,0.1), inset 10px 10px 20px rgba(255,255,255,0.4);
        }
      `}</style>
    </div>
  );
};
