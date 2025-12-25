
import React from 'react';
import { GeneratedIcon } from '../types';

interface VaultShelfProps {
  history: GeneratedIcon[];
  onSelect: (item: GeneratedIcon) => void;
  onRestore: (item: GeneratedIcon) => void;
  onClear: () => void;
  isVertical?: boolean;
}

export const VaultShelf: React.FC<VaultShelfProps> = ({ history, onSelect, onRestore, onClear, isVertical = false }) => {
  if (history.length === 0) {
    return (
      <div className="p-8 clay-inset bg-white/5 border border-white/5 text-center">
        <p className="text-[10px] font-bold text-[var(--text-dim)] opacity-40 uppercase tracking-widest">Vault is Empty</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-4 gap-3">
        {history.map((item, idx) => (
          <div 
            key={item.id} 
            className="group relative animate-[dropdownPop_0.6s_var(--spring)_forwards]"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <div 
              onClick={() => onSelect(item)}
              className="aspect-square clay-raised p-2 cursor-pointer transition-all duration-500 hover:scale-110 active:scale-95 group-hover:z-50 border border-white/5"
            >
              <img src={item.url} alt="" className="w-full h-full object-contain drop-shadow-md" />
            </div>
            
            {/* Quick Restore Action */}
            <button 
              onClick={(e) => { e.stopPropagation(); onRestore(item); }}
              className="absolute -top-1 -right-1 w-6 h-6 clay-btn rounded-full bg-purple-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg scale-75 group-hover:scale-100"
              title="Restore"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
          </div>
        ))}
      </div>

      <button 
        onClick={onClear}
        className="w-full py-3 clay-btn text-red-500/50 hover:text-red-500 text-[9px] font-black uppercase tracking-[0.2em] transition-all"
      >
        Flush Vault
      </button>
    </div>
  );
};
