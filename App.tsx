
import React, { useState, useEffect } from 'react';
import { ImageModal } from './components/ImageModal';
import { Branding } from './components/Branding';
import { SetupSection } from './components/SetupSection';
import { VisualConfigSection } from './components/VisualConfigSection';
import { CreationSection } from './components/CreationSection';
import { OutputSection } from './components/OutputSection';
import { VaultShelf } from './components/VaultShelf';
import { useIconGenerator } from './hooks/useIconGenerator';
import { GenerationStatus } from './types';

type Theme = 'light' | 'dark';

const App: React.FC = () => {
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('studio_theme') as Theme) || 'light');
  const [activeModalIcon, setActiveModalIcon] = useState<any>(null);
  const [isSetupOpen, setIsSetupOpen] = useState(false);
  const [isVisualConfigOpen, setIsVisualConfigOpen] = useState(false);
  const generator = useIconGenerator();

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('studio_theme', theme);
  }, [theme]);

  // Reactive Background Palette
  useEffect(() => {
    const blob1 = document.getElementById('blob1');
    const blob2 = document.getElementById('blob2');
    if (!blob1 || !blob2) return;

    if (generator.state.status === GenerationStatus.GENERATING) {
      blob1.style.backgroundColor = '#a78bfa';
      blob2.style.backgroundColor = '#6366f1';
    } else {
      blob1.style.backgroundColor = generator.state.primaryColor;
      blob2.style.backgroundColor = generator.state.secondaryColor;
    }
  }, [generator.state.status, generator.state.primaryColor, generator.state.secondaryColor]);

  const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

  const handleDownload = (url: string, filename: string = '3d-icon.png') => {
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
  };

  const handleDownloadSVG = (svgContent: string, filename: string = '3d-icon.svg') => {
    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="relative w-screen h-screen flex flex-col items-center overflow-hidden bg-[var(--clay-bg)]">
      
      {/* Studio Header Area */}
      <header className="absolute top-0 left-0 right-0 p-4 md:p-8 flex justify-between items-start z-[80] pointer-events-none">
        <div className="pointer-events-auto flex items-center gap-4">
          <Branding theme={theme} toggleTheme={toggleTheme} isCompact />
          <button 
            onClick={() => setIsVisualConfigOpen(true)}
            className={`w-12 h-12 clay-btn rounded-full flex items-center justify-center text-[var(--text-main)] transition-all ${isVisualConfigOpen ? 'opacity-0 scale-90' : 'opacity-100 hover:text-purple-500'}`}
            title="Studio Tools"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
            </svg>
          </button>
        </div>
        
        <div className="pointer-events-auto flex flex-col items-end gap-4 relative">
          <button 
            onClick={() => setIsSetupOpen(true)}
            className={`w-12 h-12 clay-btn rounded-full flex items-center justify-center text-[var(--text-main)] group transition-all ${isSetupOpen ? 'shadow-inner scale-95 opacity-0' : 'opacity-100'}`}
            title="Engine Settings"
          >
            <svg className="w-6 h-6 transition-transform duration-500 group-hover:rotate-45" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      </header>

      {/* Visual Configuration Sidebar (Left) */}
      <aside 
        className={`fixed top-0 left-0 h-full w-80 md:w-96 z-[100] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isVisualConfigOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="h-full clay-raised !rounded-none md:!rounded-r-[3rem] p-8 flex flex-col bg-[var(--clay-bg)]/98 backdrop-blur-2xl border-r border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 clay-btn rounded-full flex items-center justify-center text-purple-400">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
               </div>
               <h2 className="text-sm font-black text-[var(--text-main)] uppercase tracking-[0.2em]">Studio Tools</h2>
             </div>
             <button onClick={() => setIsVisualConfigOpen(false)} className="w-10 h-10 clay-btn rounded-full flex items-center justify-center text-[var(--text-dim)] hover:text-red-500 transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
            <VisualConfigSection {...generator.state} {...generator.setters} />
            <div className="mt-10">
              <h3 className="text-[10px] font-black text-[var(--text-dim)] uppercase tracking-[0.3em] mb-4 ml-1">Sculptor's Vault</h3>
              <VaultShelf 
                history={generator.state.history}
                onSelect={setActiveModalIcon}
                onRestore={(item) => {
                  generator.handlers.restoreFromHistory(item);
                  setIsVisualConfigOpen(false);
                }}
                onClear={() => generator.setters.setHistory([])}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Engine Configuration Sidebar (Right) */}
      <aside 
        className={`fixed top-0 right-0 h-full w-80 md:w-96 z-[100] transition-transform duration-700 ease-[cubic-bezier(0.19,1,0.22,1)] ${isSetupOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="h-full clay-raised !rounded-none md:!rounded-l-[3rem] p-8 flex flex-col bg-[var(--clay-bg)]/98 backdrop-blur-2xl border-l border-white/10 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
             <div className="flex items-center space-x-3">
               <div className="w-10 h-10 clay-btn rounded-full flex items-center justify-center text-purple-400">
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
               </div>
               <h2 className="text-sm font-black text-[var(--text-main)] uppercase tracking-[0.2em]">Engine Config</h2>
             </div>
             <button onClick={() => setIsSetupOpen(false)} className="w-10 h-10 clay-btn rounded-full flex items-center justify-center text-[var(--text-dim)] hover:text-red-500 transition-colors">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" /></svg>
             </button>
          </div>
          
          <div className="flex-1 overflow-y-auto no-scrollbar pr-1">
            <SetupSection {...generator.state} {...generator.setters} />
          </div>

          <div className="mt-8 pt-6 border-t border-white/5">
            <div className="clay-inset p-4 bg-purple-500/5">
              <p className="text-[10px] font-bold text-purple-400/80 leading-relaxed uppercase tracking-widest text-center">
                API connectivity managed securely.
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlays */}
      {(isSetupOpen || isVisualConfigOpen) && (
        <div 
          className="fixed inset-0 z-[95] bg-black/20 backdrop-blur-sm animate-in fade-in duration-500"
          onClick={() => { setIsSetupOpen(false); setIsVisualConfigOpen(false); }}
        />
      )}

      {/* Main Studio Canvas Stage */}
      <main className="flex-1 w-full flex items-center justify-center relative z-10">
        {/* Center Display Workspace - Removed max-w-5xl to allow full width dragging and better batch view */}
        <div className="w-full h-full flex flex-col items-center justify-center mb-32 md:mb-40 px-4 md:px-8 overflow-y-auto no-scrollbar">
          <OutputSection 
            status={generator.state.status}
            currentActionLabel={generator.state.currentActionLabel}
            generationMode={generator.state.generationMode}
            batchResults={generator.state.batchResults}
            batchItems={generator.state.batchItems}
            isRemixMode={generator.state.isRemixMode}
            singleResult={generator.state.singleResult}
            remixResult={generator.state.remixResult}
            selectedStyleId={generator.state.selectedStyleId}
            remixStyleId={generator.state.remixStyleId}
            setActiveModalIcon={setActiveModalIcon}
            handleDownload={handleDownload}
            handleDownloadSVG={handleDownloadSVG}
            isStudioView
          />
        </div>
      </main>

      {/* Simplified Persistent Bottom Workbench */}
      <footer className="absolute bottom-6 md:bottom-10 w-full flex justify-center px-4 md:px-8 z-[90] pointer-events-none">
        <div className={`pointer-events-auto clay-raised w-full max-w-3xl p-4 md:p-6 transition-all duration-700 shadow-[0_35px_65px_-15px_rgba(0,0,0,0.5)] bg-[var(--clay-bg)]/95 backdrop-blur-md border border-white/10 ${generator.state.status === GenerationStatus.GENERATING ? 'scale-[0.97] opacity-90' : 'scale-100'}`}>
          
          {generator.state.error && (
            <div className="absolute -top-16 left-0 right-0 flex justify-center animate-in slide-in-from-bottom-3 duration-300">
              <div className="flex items-center space-x-2 bg-red-900/40 backdrop-blur-2xl px-5 py-2.5 rounded-full border border-red-500/30 shadow-2xl">
                <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <p className="text-red-400 text-[10px] font-black uppercase tracking-widest">{generator.state.error}</p>
              </div>
            </div>
          )}
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-5">
            <div className="flex-1 min-w-0">
              <CreationSection 
                {...generator.state} 
                {...generator.setters} 
                {...generator.handlers}
              />
            </div>
            
            <button 
              onClick={generator.handlers.handleGenerate} 
              disabled={generator.state.status === GenerationStatus.GENERATING}
              className={`w-full md:w-44 h-14 clay-btn font-black text-[11px] uppercase tracking-[0.25em] transition-all flex items-center justify-center space-x-3 relative overflow-hidden ${generator.state.status === GenerationStatus.GENERATING ? 'opacity-50 cursor-not-allowed' : 'hover:text-purple-500 hover:shadow-2xl active:scale-95'}`}
            >
              {generator.state.status === GenerationStatus.GENERATING ? (
                <>
                  <div className="w-5 h-5 border-2 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                  <span className="animate-pulse">Forging</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">{generator.state.isRemixMode ? "Remix" : "Sculpt"}</span>
                  <svg className="w-4 h-4 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>
      </footer>

      {/* Modal/Overlay Layer */}
      <ImageModal 
        isOpen={!!activeModalIcon} onClose={() => setActiveModalIcon(null)} 
        imageUrl={activeModalIcon?.url || ''} svgContent={activeModalIcon?.svg}
        prompt={activeModalIcon?.prompt || ''} 
        onDownload={() => activeModalIcon && handleDownload(activeModalIcon.url, 'icon-3d.png')}
        onDownloadSVG={() => activeModalIcon?.svg && handleDownloadSVG(activeModalIcon.svg, 'icon-vector.svg')}
      />

      <div className="fixed top-6 left-1/2 -translate-x-1/2 opacity-15 hidden md:block select-none z-[5] pointer-events-none">
        <span className="text-[7px] font-black text-[var(--text-dim)] uppercase tracking-[1em]">Tactile Surface Studio</span>
      </div>
    </div>
  );
};

export default App;
