
import React from 'react';
import { ClayDropdown } from './ClayDropdown';
import { Tooltip } from './Tooltip';
import { ApiProvider, DropdownOption } from '../types';
import { setBaseUrl as saveBaseUrl } from '../services/storageService';

const PROVIDER_OPTIONS = [
  { id: 'gemini', name: 'Google Gemini (Native)' },
  { id: 'openai-compatible', name: 'OpenAI Compatible (Custom)' },
];

const GEMINI_MODELS = [
  { id: 'gemini-2.5-flash-image', name: 'Gemini 2.5 Flash' },
  { id: 'gemini-3-pro-image-preview', name: 'Gemini 3 Pro' },
];

interface SetupSectionProps {
  apiProvider: ApiProvider;
  setApiProvider: (v: ApiProvider) => void;
  baseUrl: string;
  setBaseUrl: (v: string) => void;
  localApiKey: string;
  setApiKey: (v: string) => void;
  selectedGeminiModel: string;
  setSelectedGeminiModel: (v: string) => void;
  openAIModels: DropdownOption[];
  selectedOpenAIModel: string;
  setSelectedOpenAIModel: (v: string) => void;
}

export const SetupSection: React.FC<SetupSectionProps> = ({
  apiProvider, setApiProvider, baseUrl, setBaseUrl,
  localApiKey, setApiKey,
  selectedGeminiModel, setSelectedGeminiModel, openAIModels,
  selectedOpenAIModel, setSelectedOpenAIModel
}) => {
  return (
    <div className="space-y-6 animate-in slide-in-from-right-4 duration-500 pb-10">
      
      {/* Provider Card */}
      <div className="space-y-3">
        <div className="flex items-center space-x-2">
          <span className="text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest ml-1">AI Engine Provider</span>
          <Tooltip text="Gemini uses native environment keys. OpenAI Compatible lets you use custom endpoints like OpenRouter or Together AI." />
        </div>
        <ClayDropdown options={PROVIDER_OPTIONS} value={apiProvider} onChange={(v) => setApiProvider(v as ApiProvider)} openUpwards={false} />
      </div>
      
      {/* Dynamic Config Area */}
      {apiProvider === 'openai-compatible' ? (
        <div className="space-y-6 animate-in fade-in zoom-in-95 duration-300">
          
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest ml-1">Endpoint URL</span>
              </div>
              <span className="text-[8px] font-bold text-blue-400 uppercase opacity-60">Required</span>
            </div>
            <div className="clay-inset p-3.5 flex items-center group-focus-within:shadow-inner transition-all bg-white/5 border border-white/5">
              <input 
                type="text" value={baseUrl} 
                onChange={(e) => { setBaseUrl(e.target.value); saveBaseUrl(e.target.value); }} 
                placeholder="https://api.openai.com/v1" 
                className="bg-transparent w-full outline-none text-xs font-bold px-1 text-[var(--text-main)] placeholder-[var(--text-dim)]/20" 
              />
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest ml-1">Access Token / API Key</span>
              </div>
              <span className="text-[8px] font-bold text-amber-400 uppercase opacity-60">Sensitive</span>
            </div>
            <div className="clay-inset p-3.5 flex items-center group-focus-within:shadow-inner transition-all bg-white/5 border border-white/5">
              <input 
                type="password" value={localApiKey} 
                onChange={(e) => setApiKey(e.target.value)} 
                placeholder="sk-••••••••••••••••" 
                className="bg-transparent w-full outline-none text-xs font-bold px-1 text-[var(--text-main)] placeholder-[var(--text-dim)]/20 tracking-widest" 
              />
            </div>
            <p className="text-[8px] text-[var(--text-dim)] opacity-40 ml-1 uppercase">Stored encrypted in your browser cache.</p>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest ml-1">Target Model</span>
            </div>
            <ClayDropdown 
              options={openAIModels} 
              value={selectedOpenAIModel} 
              onChange={setSelectedOpenAIModel} 
              placeholder={openAIModels.length > 0 ? "Select from list..." : "Enter URL & Key to fetch..."} 
              openUpwards={false} 
            />
          </div>
        </div>
      ) : (
        <div className="space-y-3 animate-in fade-in zoom-in-95 duration-300">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase text-[var(--text-dim)] tracking-widest ml-1">Gemini Model Series</span>
          </div>
          <ClayDropdown options={GEMINI_MODELS} value={selectedGeminiModel} onChange={setSelectedGeminiModel} openUpwards={false} />
          <div className="mt-4 p-4 clay-inset bg-purple-500/5 border border-purple-400/10">
            <p className="text-[9px] font-bold text-purple-400/80 leading-relaxed uppercase tracking-widest">
              Gemini key managed automatically via environment. No manual input needed.
            </p>
          </div>
        </div>
      )}

      {/* Security Footer Info (Condensed) */}
      <div className="mt-auto pt-8">
        <div className="flex items-start space-x-3 opacity-40 hover:opacity-100 transition-opacity p-2">
          <svg className="w-4 h-4 text-[var(--text-dim)] mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="space-y-1">
            <p className="text-[9px] font-black uppercase tracking-widest text-[var(--text-dim)]">Private Studio</p>
            <p className="text-[8px] font-bold text-[var(--text-dim)] leading-tight">
              All data is processed securely. We never log or relay your sensitive custom keys to any third-party databases.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
