
import React, { useRef, useEffect } from 'react';
import { GenerationMode } from '../hooks/useIconGenerator';

interface CreationSectionProps {
  generationMode: GenerationMode;
  setGenerationMode: (v: GenerationMode) => void;
  prompt: string;
  setPrompt: (v: string) => void;
  batchItems: string;
  setBatchItems: (v: string) => void;
  isEnhancing: boolean;
  handleEnhance: () => void;
  imagePreview: string | null;
  processFile: (file: File) => void;
  removeUploadedImage: () => void;
}

export const CreationSection: React.FC<CreationSectionProps> = ({
  generationMode, setGenerationMode,
  prompt, setPrompt, batchItems, setBatchItems, isEnhancing, handleEnhance,
  imagePreview, processFile, removeUploadedImage
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handlePaste = (event: ClipboardEvent) => {
      const items = event.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          if (blob) {
            setGenerationMode('image');
            processFile(blob);
            event.preventDefault();
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [setGenerationMode, processFile]);

  return (
    <div className="relative group transition-all duration-500">
      <div className="clay-inset p-3 md:p-4 bg-white/5 border border-white/5 focus-within:shadow-2xl transition-all">
        {generationMode === 'text' ? (
          <textarea 
            value={prompt} onChange={(e) => setPrompt(e.target.value)}
            placeholder="What should we sculpt today? e.g., 'a playful robot chef'..."
            className="bg-transparent w-full h-10 md:h-12 outline-none text-xs md:text-sm font-bold resize-none text-[var(--text-main)] placeholder-[var(--text-dim)] leading-tight pr-12 scroll-smooth no-scrollbar"
          />
        ) : generationMode === 'batch' ? (
          <input 
            type="text" value={batchItems} onChange={(e) => setBatchItems(e.target.value)}
            placeholder="Items (comma-separated): Home, Search, Heart..."
            className="bg-transparent w-full h-10 md:h-12 outline-none text-xs md:text-sm font-bold text-[var(--text-main)] placeholder-[var(--text-dim)] pr-12"
          />
        ) : (
          <div 
            className="h-10 md:h-12 flex items-center justify-center cursor-pointer hover:bg-white/10 rounded-xl transition-all border-2 border-dashed border-white/10"
            onClick={() => fileInputRef.current?.click()}
          >
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files?.[0] && processFile(e.target.files[0])} />
            {imagePreview ? (
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg overflow-hidden shadow-lg ring-2 ring-purple-500/20">
                  <img src={imagePreview} className="w-full h-full object-cover" alt="Preview" />
                </div>
                <span className="text-[9px] font-black uppercase tracking-widest text-purple-400">Reference Ready</span>
                <button onClick={(e) => { e.stopPropagation(); removeUploadedImage(); }} className="w-6 h-6 clay-btn rounded-full text-[10px] text-red-500 font-black flex items-center justify-center hover:scale-125 transition-transform">×</button>
              </div>
            ) : (
               <div className="flex items-center space-x-2">
                 <svg className="w-4 h-4 text-[var(--text-dim)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                 <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-dim)]">Tap to Load Reference</span>
               </div>
            )}
          </div>
        )}
        
        {generationMode !== 'image' && (
          <button 
            onClick={handleEnhance} disabled={isEnhancing || (!prompt.trim() && generationMode === 'text')}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-purple-400 disabled:opacity-20 active:scale-90 transition-transform p-1 group/enhance"
            title="Polish Prompt via AI"
          >
            {isEnhancing ? (
              <div className="w-4 h-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5 group-hover/enhance:rotate-12 group-hover/enhance:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
};
