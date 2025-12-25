
import React from 'react';

interface BrandingProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isCompact?: boolean;
}

export const Branding: React.FC<BrandingProps> = ({ theme, toggleTheme, isCompact = false }) => {
  if (isCompact) {
    return (
      <div className="flex items-center space-x-6">
        <button 
          onClick={toggleTheme}
          className="w-12 h-12 clay-btn rounded-full text-[var(--text-main)] flex items-center justify-center"
        >
          {theme === 'light' ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
          )}
        </button>
        <div className="flex flex-col">
          <h1 className="text-xl font-black uppercase tracking-tighter text-[var(--text-main)]">Clay Studio</h1>
          <span className="text-[8px] font-bold text-purple-400 uppercase tracking-widest">Workbench Mode</span>
        </div>
      </div>
    );
  }

  return (
    <div className="text-center mb-16 space-y-4 relative w-full max-w-4xl">
      <button 
        onClick={toggleTheme}
        className="absolute top-0 right-0 w-12 h-12 clay-btn rounded-full text-[var(--text-main)]"
        aria-label="Toggle Theme"
      >
        {theme === 'light' ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" /></svg>
        )}
      </button>

      <div className="w-20 h-20 mx-auto clay-btn rounded-full mb-4 animate-float text-purple-400">
         <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24"><path d="M21 16.5c0 .38-.21.71-.53.88l-7.97 4.44c-.32.18-.71.18-1.03 0l-7.97-4.44c-.31-.17-.53-.5-.53-.88v-9c0-.38.21-.71.53-.88l7.97-4.44c.32-.18.71-.18 1.03 0l7.97 4.44c.31.17.53.5.53.88v9z" /></svg>
      </div>
      <h1 className="text-6xl text-inflated">3d ClayIcon</h1>
      <p className="text-[var(--text-dim)] font-semibold tracking-wide uppercase text-sm">Sculpting Digital Imagination</p>
    </div>
  );
};
