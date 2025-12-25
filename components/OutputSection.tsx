
import React, { useState, useRef, useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { GeneratedIcon, GenerationStatus } from '../types';
import { CLAY_STYLES } from '../constants';

interface OutputSectionProps {
  status: GenerationStatus;
  currentActionLabel: string | null;
  generationMode: string;
  batchResults: GeneratedIcon[];
  batchItems: string;
  isRemixMode: boolean;
  singleResult: GeneratedIcon | null;
  remixResult: GeneratedIcon | null;
  selectedStyleId: string;
  remixStyleId: string;
  setActiveModalIcon: (icon: GeneratedIcon | null) => void;
  handleDownload: (url: string) => void;
  handleDownloadSVG: (svg: string) => void;
  isStudioView?: boolean;
}

export const OutputSection: React.FC<OutputSectionProps> = ({
  status, currentActionLabel, generationMode, batchResults, batchItems,
  isRemixMode, singleResult, remixResult, selectedStyleId, remixStyleId,
  setActiveModalIcon, handleDownload, handleDownloadSVG, isStudioView = false
}) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartPos = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    
    // Check if we are clicking an interactive element that should NOT trigger a drag
    // Interactive: actual images, buttons, or links inside the cards
    const isImage = target.tagName.toLowerCase() === 'img';
    const isButton = target.closest('button');
    const isLabel = target.closest('span') || target.closest('p');
    
    // If it's a button, let the button handle it
    if (isButton) return;
    
    // We only prevent dragging if specifically clicking the IMAGE (to allow zoom) 
    // or if clicking labels that might be selectable.
    // Clicking the card's background or the shelf's background should trigger drag.
    if (isImage) {
      // Small delay check could be used for "drag vs click" but here we simplify:
      // Clicking the image opens the modal. Clicking anything else drags.
      return;
    }

    setIsDragging(true);
    dragStartPos.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      setPosition({
        x: e.clientX - dragStartPos.current.x,
        y: e.clientY - dragStartPos.current.y
      });
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  const draggableStyle: React.CSSProperties = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    cursor: isDragging ? 'grabbing' : (status === GenerationStatus.IDLE ? 'default' : 'grab'),
    transition: isDragging ? 'none' : 'transform 0.5s var(--spring)',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    touchAction: 'none'
  };

  if (status === GenerationStatus.GENERATING) {
    return (
      <div className="flex flex-col items-center justify-center space-y-12 animate-in zoom-in-95 duration-700">
        <LoadingSpinner />
        <div className="flex flex-col items-center space-y-2">
          <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.4em] animate-pulse">{currentActionLabel}</p>
          <span className="text-[9px] font-bold text-[var(--text-dim)] uppercase opacity-40">Molding material...</span>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      onMouseDown={handleMouseDown}
      style={draggableStyle}
      className={`relative select-none w-full ${isDragging ? 'z-50' : ''}`}
    >
      {/* Studio Drag Hint */}
      {status !== GenerationStatus.IDLE && (
        <div className="mb-4 flex flex-col items-center opacity-40 hover:opacity-100 transition-opacity pointer-events-none">
           <div className="w-12 h-1 bg-[var(--text-dim)]/20 rounded-full mb-1"></div>
           <span className="text-[7px] font-black uppercase tracking-[0.4em] text-[var(--text-dim)]">Draggable Studio Canvas</span>
        </div>
      )}

      {generationMode === 'batch' && batchResults.length > 0 ? (
        <div className="w-full max-w-screen-2xl">
          {/* Main Shelf: Clicking between items now triggers the parent onMouseDown (Drag) */}
          <div className="flex flex-row items-center space-x-12 overflow-x-auto py-16 px-12 md:px-24 mask-fade-edges scroll-smooth no-scrollbar">
            {batchResults.map((res, idx) => (
              <div 
                key={res.id} 
                className="flex-shrink-0 clay-inset p-4 md:p-8 transition-all duration-700 cubic-bezier(0.175, 0.885, 0.32, 1.275) animate-[dropdownPop_0.6s_var(--spring)_forwards] shadow-2xl border border-white/5 bg-[var(--clay-bg)]/40 hover:bg-[var(--clay-bg)]/80 hover:scale-110 active:scale-95 group" 
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div 
                  className="relative w-40 h-40 md:w-60 md:h-60 flex items-center justify-center cursor-zoom-in"
                  onClick={(e) => { e.stopPropagation(); setActiveModalIcon(res); }}
                >
                  <div className="absolute inset-0 bg-white/5 blur-3xl group-hover:bg-purple-500/10 transition-all rounded-full scale-110"></div>
                  <img 
                    src={res.url} 
                    alt={res.item} 
                    className="w-full h-full object-contain transition-transform group-hover:rotate-6 drop-shadow-[0_25px_45px_rgba(0,0,0,0.3)] relative z-10" 
                  />
                </div>
                <div className="mt-6 text-center pointer-events-none">
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-dim)] group-hover:text-purple-400 transition-colors">{res.item}</span>
                </div>
              </div>
            ))}
            {/* Extended Spacer to allow full view of last item */}
            <div className="w-40 md:w-80 flex-shrink-0 h-4"></div>
          </div>
          
          <div className="flex flex-col items-center mt-4 space-y-3 pointer-events-none">
            <div className="flex space-x-2 opacity-10">
               {batchResults.map((_, i) => (
                 <div key={i} className="w-1.5 h-1.5 rounded-full bg-[var(--text-dim)]"></div>
               ))}
            </div>
            <p className="text-[8px] font-black uppercase tracking-[0.5em] text-[var(--text-dim)]/40">Reposition canvas by dragging empty space</p>
          </div>

          <style>{`
            .mask-fade-edges {
              mask-image: linear-gradient(to right, transparent, black 10%, black 90%, transparent);
            }
          `}</style>
        </div>
      ) : isRemixMode && (singleResult || remixResult) ? (
        <div className="w-full flex flex-col items-center justify-center space-y-8 animate-in zoom-in-95 duration-1000">
           <div className="flex flex-col md:flex-row gap-16 items-center">
              <div className="space-y-6 group">
                <div className="clay-inset p-6 md:p-12 cursor-zoom-in transition-all duration-700 hover:scale-105 active:scale-95 shadow-2xl border border-white/5" onClick={(e) => { e.stopPropagation(); setActiveModalIcon(singleResult); }}>
                  <img src={singleResult?.url} className="w-72 h-72 md:w-96 md:h-96 object-contain rounded-2xl group-hover:rotate-2 transition-transform drop-shadow-[0_45px_65px_rgba(0,0,0,0.4)]" />
                </div>
                <p className="text-[10px] font-black text-center uppercase text-[var(--text-dim)] tracking-[0.3em] opacity-40">{CLAY_STYLES.find(s => s.id === selectedStyleId)?.name}</p>
              </div>
              <div className="h-32 w-px bg-[var(--text-dim)]/10 hidden md:block"></div>
              <div className="space-y-6 group">
                <div className="clay-inset p-6 md:p-12 cursor-zoom-in transition-all duration-700 hover:scale-105 active:scale-95 shadow-2xl border border-white/5" onClick={(e) => { e.stopPropagation(); setActiveModalIcon(remixResult); }}>
                  <img src={remixResult?.url} className="w-72 h-72 md:w-96 md:h-96 object-contain rounded-2xl group-hover:-rotate-2 transition-transform drop-shadow-[0_45px_65px_rgba(0,0,0,0.4)]" />
                </div>
                <p className="text-[10px] font-black text-center uppercase text-[var(--text-dim)] tracking-[0.3em] opacity-40">{CLAY_STYLES.find(s => s.id === remixStyleId)?.name}</p>
              </div>
           </div>
        </div>
      ) : singleResult ? (
        <div className="w-full flex flex-col items-center justify-center space-y-12 animate-[dropdownPop_0.8s_var(--spring)_forwards]">
          <div className="relative group cursor-zoom-in" onClick={(e) => { e.stopPropagation(); setActiveModalIcon(singleResult); }}>
            <div className="absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 w-[130%] h-[130%] bg-white/5 blur-[140px] rounded-full opacity-40 group-hover:opacity-100 transition-opacity duration-1500"></div>
            
            <div className="clay-inset p-12 md:p-16 rounded-[4.5rem] relative z-10 hover:scale-[1.03] hover:-rotate-1 transition-all duration-700 cubic-bezier(0.175, 0.885, 0.32, 1.275) border border-white/5 shadow-2xl">
               <img src={singleResult.url} alt="Result" className="w-80 h-80 md:w-[32rem] md:h-[32rem] object-contain relative z-10 drop-shadow-[0_55px_105px_rgba(0,0,0,0.4)]" />
            </div>
            
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-max max-w-sm clay-raised px-8 py-4 opacity-0 group-hover:opacity-100 transition-all duration-700 transform translate-y-6 group-hover:translate-y-0 z-20 border border-white/10">
               <p className="text-[11px] font-bold text-[var(--text-dim)] italic line-clamp-2 leading-relaxed">"{singleResult.prompt}"</p>
            </div>
          </div>

          <div className="flex gap-8 relative z-30">
            <button 
              onClick={(e) => { e.stopPropagation(); handleDownload(singleResult.url); }} 
              className="px-12 py-5 clay-btn font-black text-[11px] uppercase tracking-[0.25em] active:scale-90 flex items-center space-x-4 shadow-lg"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              <span>Export PNG</span>
            </button>
            {singleResult.svg && (
              <button 
                onClick={(e) => { e.stopPropagation(); handleDownloadSVG(singleResult.svg!); }} 
                className="px-12 py-5 clay-btn font-black text-[11px] uppercase tracking-[0.25em] text-amber-500 active:scale-90 flex items-center space-x-4 shadow-lg"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 002 2z" /></svg>
                <span>Vector SVG</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-10 group transition-all duration-1500">
          <div className="relative animate-float">
            <div className="absolute inset-0 bg-purple-400/10 blur-[120px] rounded-full scale-[1.8] opacity-40"></div>
            <div className="w-56 h-56 clay-inset flex items-center justify-center relative z-10 transition-all duration-1000 group-hover:rotate-[45deg] group-hover:scale-110 shadow-lg border border-white/5">
              <svg className="w-20 h-20 text-[var(--text-dim)] opacity-20" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" /></svg>
            </div>
          </div>
          <div className="text-center space-y-3 pointer-events-none">
            <p className="font-black text-[var(--text-dim)] uppercase tracking-[1em] text-[10px] opacity-30 group-hover:opacity-50 transition-all duration-1000">Studio Initialized</p>
          </div>
        </div>
      )}
    </div>
  );
};
