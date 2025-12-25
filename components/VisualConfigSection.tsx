
import React, { useState } from 'react';
import { ClayDropdown } from './ClayDropdown';
import { Tooltip } from './Tooltip';
import { CLAY_STYLES, COLOR_PRESETS } from '../constants';
import { GenerationMode } from '../hooks/useIconGenerator';

interface VisualConfigSectionProps {
  generationMode: GenerationMode;
  setGenerationMode: (v: GenerationMode) => void;
  vectorizeEnabled: boolean;
  setVectorizeEnabled: (v: boolean) => void;
  selectedStyleId: string;
  setSelectedStyleId: (v: string) => void;
  primaryColor: string;
  setPrimaryColor: (v: string) => void;
  secondaryColor: string;
  setSecondaryColor: (v: string) => void;
  isRemixMode: boolean;
  setIsRemixMode: (v: boolean) => void;
  remixStyleId: string;
  setRemixStyleId: (v: string) => void;
}

export const VisualConfigSection: React.FC<VisualConfigSectionProps> = ({
  generationMode, setGenerationMode, vectorizeEnabled, setVectorizeEnabled,
  selectedStyleId, setSelectedStyleId, primaryColor, setPrimaryColor,
  secondaryColor, setSecondaryColor, isRemixMode, setIsRemixMode,
  remixStyleId, setRemixStyleId
}) => {
  const applyPreset = (p: { primary: string; secondary: string }) => {
    setPrimaryColor(p.primary);
    setSecondaryColor(p.secondary);
  };

  return (
    <div className="space-y-8 animate-in slide-in-from-left-4 duration-500">
      
      {/* Creation Mode */}
      <div className="space-y-3">
        <span className="text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest ml-1">Creation Mode</span>
        <div className="flex items-center bg-[var(--clay-shadow)]/10 p-1 rounded-2xl w-full">
           {['text', 'batch', 'image'].map((m) => (
              <button 
                key={m}
                onClick={() => setGenerationMode(m as GenerationMode)}
                className={`flex-1 px-3 py-2.5 rounded-xl font-bold text-[9px] uppercase tracking-widest transition-all relative z-10 ${generationMode === m ? 'text-white' : 'text-[var(--text-dim)] hover:text-[var(--text-main)]'}`}
              >
                {m === 'text' ? 'Single' : m === 'batch' ? 'Set' : 'Sculpt'}
                {generationMode === m && (
                  <div className="absolute inset-0 clay-pill-active rounded-xl -z-10 animate-[dropdownPop_0.3s_var(--spring)]" />
                )}
              </button>
            ))}
        </div>
      </div>

      {/* Surface Style */}
      <div className="space-y-3">
        <span className="text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest ml-1">Surface Style</span>
        <ClayDropdown 
          options={CLAY_STYLES} 
          value={selectedStyleId} 
          onChange={setSelectedStyleId} 
          openUpwards={false}
        />
      </div>

      {/* Manual Material Selection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest ml-1">Custom Material</span>
          <Tooltip text="Manually select your primary and secondary colors for the clay sculpture." />
        </div>
        <div className="flex gap-4 p-1">
          <label className="flex-1 cursor-pointer group">
            <div className="clay-inset p-3 flex flex-col items-center space-y-2 group-hover:bg-white/5 transition-all">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 shadow-lg" style={{ backgroundColor: primaryColor }}></div>
              <span className="text-[7px] font-black uppercase text-[var(--text-dim)] tracking-widest">Primary</span>
            </div>
            <input 
              type="color" 
              value={primaryColor} 
              onChange={(e) => setPrimaryColor(e.target.value)} 
              className="sr-only" 
            />
          </label>
          <label className="flex-1 cursor-pointer group">
            <div className="clay-inset p-3 flex flex-col items-center space-y-2 group-hover:bg-white/5 transition-all">
              <div className="w-8 h-8 rounded-full border-2 border-white/20 shadow-lg" style={{ backgroundColor: secondaryColor }}></div>
              <span className="text-[7px] font-black uppercase text-[var(--text-dim)] tracking-widest">Secondary</span>
            </div>
            <input 
              type="color" 
              value={secondaryColor} 
              onChange={(e) => setSecondaryColor(e.target.value)} 
              className="sr-only" 
            />
          </label>
        </div>
      </div>

      {/* Material Presets */}
      <div className="space-y-3">
        <span className="text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest ml-1">Presets Gallery</span>
        <div className="grid grid-cols-3 gap-3 p-1">
          {COLOR_PRESETS.map((p) => (
            <button
              key={p.name}
              onClick={() => applyPreset(p)}
              className={`clay-btn p-3 rounded-xl transition-all hover:scale-110 active:scale-95 group ${primaryColor === p.primary && secondaryColor === p.secondary ? 'ring-2 ring-purple-500 ring-offset-4 ring-offset-[var(--clay-bg)]' : ''}`}
              title={p.name}
            >
              <div className="flex -space-x-1 group-hover:scale-110 transition-transform">
                <div className="w-4 h-4 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: p.primary }}></div>
                <div className="w-4 h-4 rounded-full border border-white/10 shadow-sm" style={{ backgroundColor: p.secondary }}></div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Capabilities */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between group">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-[var(--text-main)] tracking-widest">Remix Dual-Tone</span>
            <span className="text-[7px] text-[var(--text-dim)] uppercase opacity-50">Compare Styles</span>
          </div>
          <button onClick={() => setIsRemixMode(!isRemixMode)} className={`w-10 h-5 clay-btn rounded-full relative transition-colors ${isRemixMode ? 'bg-purple-500/10' : ''}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${isRemixMode ? 'right-0.5 bg-purple-500 shadow-md' : 'left-0.5 bg-[var(--text-dim)]'}`} />
          </button>
        </div>

        {isRemixMode && (
          <div className="space-y-2 animate-in slide-in-from-top-2 duration-300">
            <span className="text-[8px] font-black uppercase text-purple-400 tracking-widest ml-1">Secondary Surface</span>
            <ClayDropdown options={CLAY_STYLES} value={remixStyleId} onChange={setRemixStyleId} openUpwards={false} />
          </div>
        )}
        
        <div className="flex items-center justify-between group">
          <div className="flex flex-col">
            <span className="text-[9px] font-black uppercase text-[var(--text-main)] tracking-widest">SVG Extraction</span>
            <span className="text-[7px] text-[var(--text-dim)] uppercase opacity-50">Scalable Vector Output</span>
          </div>
          <button onClick={() => setVectorizeEnabled(!vectorizeEnabled)} className={`w-10 h-5 clay-btn rounded-full relative transition-colors ${vectorizeEnabled ? 'bg-purple-500/10' : ''}`}>
            <div className={`absolute top-0.5 w-4 h-4 rounded-full transition-all duration-300 ${vectorizeEnabled ? 'right-0.5 bg-purple-500 shadow-md' : 'left-0.5 bg-[var(--text-dim)]'}`} />
          </button>
        </div>
      </div>

    </div>
  );
};
