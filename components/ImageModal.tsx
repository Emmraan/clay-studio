
import React, { useState, useEffect } from 'react';

interface ImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  svgContent?: string;
  prompt: string;
  onDownload: () => void;
  onDownloadSVG: () => void;
}

export const ImageModal: React.FC<ImageModalProps> = ({ 
  isOpen, 
  onClose, 
  imageUrl, 
  svgContent, 
  prompt, 
  onDownload,
  onDownloadSVG
}) => {
  const [viewMode, setViewMode] = useState<'3d' | 'svg'>('3d');
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 transition-all duration-500 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      style={{ backgroundColor: 'rgba(2, 6, 23, 0.85)', backdropFilter: 'blur(16px)' }}
      onClick={onClose}
    >
      <div 
        className={`clay-raised max-w-5xl w-full max-h-[90vh] overflow-hidden flex flex-col items-center p-4 md:p-10 relative !bg-[var(--clay-bg)] transition-all duration-500 cubic-bezier(0.175, 0.885, 0.32, 1.275) ${isOpen ? 'animate-clay-squish scale-100 opacity-100' : 'scale-90 opacity-0'}`}
        onClick={(e) => e.stopPropagation()}
        onAnimationEnd={() => !isOpen && setIsAnimating(false)}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 clay-btn text-[var(--text-dim)] hover:text-red-500 z-50 transition-all hover:rotate-90"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        <div className="w-full h-full flex flex-col items-center">
          {/* View Toggle */}
          {svgContent && (
            <div className="flex justify-center mb-8">
              <div className="clay-inset p-1.5 flex items-center space-x-1 w-48 relative">
                <button 
                  onClick={() => setViewMode('3d')}
                  className={`flex-1 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all relative z-10 ${viewMode === '3d' ? 'text-white' : 'text-[var(--text-dim)]'}`}
                >
                  3D Render
                  {viewMode === '3d' && <div className="absolute inset-0 clay-pill-active rounded-xl -z-10 animate-[dropdownPop_0.3s_var(--spring)]" />}
                </button>
                <button 
                  onClick={() => setViewMode('svg')}
                  className={`flex-1 py-2 rounded-xl font-bold text-[10px] uppercase tracking-widest transition-all relative z-10 ${viewMode === 'svg' ? 'text-white' : 'text-[var(--text-dim)]'}`}
                >
                  Vector
                  {viewMode === 'svg' && <div className="absolute inset-0 clay-pill-active rounded-xl -z-10 animate-[dropdownPop_0.3s_var(--spring)]" />}
                </button>
              </div>
            </div>
          )}

          <div className="w-full aspect-square md:aspect-video max-h-[55vh] rounded-3xl overflow-hidden bg-white/5 clay-inset mb-8 flex items-center justify-center relative group shadow-2xl">
            {viewMode === '3d' ? (
              <img 
                src={imageUrl} 
                alt={prompt} 
                className="w-full h-full object-contain drop-shadow-[0_30px_60px_rgba(0,0,0,0.4)] animate-in zoom-in-95 duration-500"
              />
            ) : (
              <div 
                className="w-full h-full p-12 flex items-center justify-center animate-in zoom-in-95 duration-500"
                dangerouslySetInnerHTML={{ __html: svgContent || '' }}
              />
            )}
          </div>
          
          <div className="w-full flex flex-col md:flex-row items-center justify-between gap-6 px-4">
            <div className="text-center md:text-left flex-1">
              <p className="text-[10px] font-black text-purple-500 uppercase tracking-[0.2em] mb-2">Icon Concept</p>
              <p className="text-[var(--text-main)] text-base md:text-lg font-bold italic line-clamp-2 leading-relaxed opacity-80">"{prompt}"</p>
            </div>
            
            <div className="flex space-x-4">
              {viewMode === '3d' ? (
                <button
                  onClick={onDownload}
                  className="clay-btn px-10 py-4 text-[var(--text-main)] rounded-2xl font-bold flex items-center space-x-3 text-lg hover:text-purple-500"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>Export PNG</span>
                </button>
              ) : (
                <button
                  onClick={onDownloadSVG}
                  className="clay-btn px-10 py-4 text-amber-500 rounded-2xl font-bold flex items-center space-x-3 text-lg hover:scale-105"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485" />
                  </svg>
                  <span>Export SVG</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
