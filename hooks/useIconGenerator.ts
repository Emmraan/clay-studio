import { useState, useEffect } from 'react';
import { GeneratedIcon, GenerationStatus, ApiProvider, DropdownOption } from '../types';
import { APP_THEME, CLAY_STYLES } from '../constants';
import { getBaseUrl, getApiKey, setApiKey as saveApiKey } from '../services/storageService';
import { generateClayIcon, enhancePrompt, vectorizeIcon } from '../services/geminiService';
import { fetchOpenAIModels, generateOpenAIImage, enhanceOpenAIPrompt } from '../services/openaiService';
import { dataUriToObjectURL } from '../services/imageUtils';

export type GenerationMode = 'text' | 'image' | 'batch';

export const useIconGenerator = () => {
  const [apiProvider, setApiProvider] = useState<ApiProvider>('gemini');
  const [baseUrl, setBaseUrl] = useState(() => getBaseUrl());
  const [localApiKey, setLocalApiKey] = useState(() => getApiKey());
  
  const [generationMode, setGenerationMode] = useState<GenerationMode>('text');
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [batchItems, setBatchItems] = useState("Home, Settings, Profile, Search, Heart, Star");
  const [primaryColor, setPrimaryColor] = useState(APP_THEME.primary);
  const [secondaryColor, setSecondaryColor] = useState(APP_THEME.secondary);
  const [vectorizeEnabled, setVectorizeEnabled] = useState(false);
  const [isRemixMode, setIsRemixMode] = useState(false);
  
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [uploadedImage, setUploadedImage] = useState<{ data: string; mimeType: string } | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [selectedStyleId, setSelectedStyleId] = useState(CLAY_STYLES[0].id);
  const [remixStyleId, setRemixStyleId] = useState(CLAY_STYLES[1].id);
  const [selectedGeminiModel, setSelectedGeminiModel] = useState('gemini-2.5-flash-image');
  
  const [openAIModels, setOpenAIModels] = useState<DropdownOption[]>([]);
  const [selectedOpenAIModel, setSelectedOpenAIModel] = useState('');
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [currentActionLabel, setCurrentActionLabel] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [singleResult, setSingleResult] = useState<GeneratedIcon | null>(null);
  const [remixResult, setRemixResult] = useState<GeneratedIcon | null>(null);
  const [batchResults, setBatchResults] = useState<GeneratedIcon[]>([]);
  const [history, setHistory] = useState<GeneratedIcon[]>(() => {
    const saved = localStorage.getItem('sculptor_vault');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('sculptor_vault', JSON.stringify(history.slice(0, 12)));
  }, [history]);

  useEffect(() => {
    if (apiProvider === 'openai-compatible' && baseUrl) {
      const apiKey = localApiKey || process.env.API_KEY || "";
      fetchOpenAIModels(baseUrl, apiKey)
        .then(models => {
          const formatted = models.map(m => ({ id: m.id, name: m.id }));
          setOpenAIModels(formatted);
          if (formatted.length > 0 && !selectedOpenAIModel) setSelectedOpenAIModel(formatted[0].id);
        })
        .catch(() => setError("Model sync failed. Check URL or Key."));
    }
  }, [apiProvider, baseUrl, localApiKey]);

  const restoreFromHistory = (item: GeneratedIcon) => {
    if (!item.settings) return;
    setPrompt(item.prompt);
    setSelectedStyleId(item.settings.styleId);
    setPrimaryColor(item.settings.primaryColor);
    setSecondaryColor(item.settings.secondaryColor);
    setNegativePrompt(item.settings.negativePrompt);
    setGenerationMode(item.settings.mode as GenerationMode);
  };

  const handleEnhance = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    setError(null);
    const style = CLAY_STYLES.find(s => s.id === selectedStyleId);
    try {
      let enhanced = '';
      if (apiProvider === 'gemini') {
        enhanced = await enhancePrompt(prompt, undefined, primaryColor, secondaryColor, style?.description);
      } else {
        if (!selectedOpenAIModel) throw new Error("Select a model for enhancement.");
        const key = localApiKey || process.env.API_KEY || "";
        enhanced = await enhanceOpenAIPrompt(prompt, selectedOpenAIModel, baseUrl, key, primaryColor, secondaryColor, style?.description);
      }
      setPrompt(enhanced);
    } catch (err: any) {
      setError(`Enhancement failed: ${err.message}`);
    } finally {
      setIsEnhancing(false);
    }
  };

  const generateSingle = async (styleId: string, currentSeed?: number) => {
    const style = CLAY_STYLES.find(s => s.id === styleId);
    let imageUrl = '';
    
    if (apiProvider === 'gemini') {
      if (selectedGeminiModel === 'gemini-3-pro-image-preview') {
        const hasKey = await (window as any).aistudio?.hasSelectedApiKey?.();
        if (!hasKey) await (window as any).aistudio?.openSelectKey?.();
      }
      imageUrl = await generateClayIcon(
        prompt, selectedGeminiModel, undefined, primaryColor, secondaryColor, style?.description,
        generationMode === 'image' ? uploadedImage! : undefined,
        currentSeed, negativePrompt
      );
    } else {
      const key = localApiKey || process.env.API_KEY || "";
      if (!key) throw new Error("API Key required for OpenAI provider.");
      imageUrl = await generateOpenAIImage(
        prompt, selectedOpenAIModel, selectedOpenAIModel, baseUrl, key, primaryColor, secondaryColor, style?.description,
        generationMode === 'image' ? uploadedImage! : undefined,
        negativePrompt
      );
    }

    let svg: string | undefined;
    if (vectorizeEnabled && apiProvider === 'gemini') {
      svg = await vectorizeIcon(imageUrl, undefined, primaryColor, secondaryColor);
    }

    const result: GeneratedIcon = {
      id: `${Date.now()}-${styleId}`,
      url: dataUriToObjectURL(imageUrl),
      svg,
      prompt: generationMode === 'text' ? prompt : 'Image Reference',
      timestamp: Date.now(),
      settings: {
        styleId,
        primaryColor,
        secondaryColor,
        negativePrompt,
        mode: generationMode
      }
    };

    setHistory(prev => [result, ...prev].slice(0, 20));
    return result;
  };

  const handleGenerate = async () => {
    if (generationMode === 'text' && !prompt.trim()) return;
    if (generationMode === 'batch' && !batchItems.trim()) return;
    if (generationMode === 'image' && !uploadedImage) {
      setError("Please upload an image first.");
      return;
    }

    setStatus(GenerationStatus.GENERATING);
    setCurrentActionLabel("Sculpting...");
    setError(null);
    
    try {
      if (generationMode === 'batch') {
        const items = batchItems.split(',').map(i => i.trim()).filter(Boolean);
        const seed = Math.floor(Math.random() * 1000000);
        const results: GeneratedIcon[] = [];

        for (const item of items) {
          setCurrentActionLabel(`Forging ${item}...`);
          let imageUrl = '';
          const style = CLAY_STYLES.find(s => s.id === selectedStyleId);
          if (apiProvider === 'gemini') {
            imageUrl = await generateClayIcon(`A 3D clay icon of a ${item}`, selectedGeminiModel, undefined, primaryColor, secondaryColor, style?.description, undefined, seed, negativePrompt);
          } else {
            const key = localApiKey || process.env.API_KEY || "";
            imageUrl = await generateOpenAIImage(`A 3D clay icon of a ${item}`, selectedOpenAIModel, selectedOpenAIModel, baseUrl, key, primaryColor, secondaryColor, style?.description, undefined, negativePrompt);
          }

          let svg: string | undefined;
          if (vectorizeEnabled && apiProvider === 'gemini') {
            setCurrentActionLabel(`Vectorizing ${item}...`);
            svg = await vectorizeIcon(imageUrl, undefined, primaryColor, secondaryColor);
          }

          results.push({
            id: `${Date.now()}-${item}`,
            url: dataUriToObjectURL(imageUrl),
            svg,
            prompt: `3D clay icon of a ${item}`,
            timestamp: Date.now(),
            item
          });
          setBatchResults([...results]);
        }
        setBatchResults(results);
        setSingleResult(null);
        setRemixResult(null);
      } else if (isRemixMode) {
        setCurrentActionLabel("Comparing Styles...");
        const seed = Math.floor(Math.random() * 1000000);
        const [res1, res2] = await Promise.all([
          generateSingle(selectedStyleId, seed),
          generateSingle(remixStyleId, seed)
        ]);
        setSingleResult(res1);
        setRemixResult(res2);
        setBatchResults([]);
      } else {
        const res = await generateSingle(selectedStyleId);
        setSingleResult(res);
        setRemixResult(null);
        setBatchResults([]);
      }
      setStatus(GenerationStatus.SUCCESS);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
      setStatus(GenerationStatus.ERROR);
    } finally {
      setCurrentActionLabel(null);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target?.result as string;
      if (base64) {
        const [header, data] = base64.split(',');
        const mimeType = header.match(/:(.*?);/)?.[1] || 'image/png';
        setUploadedImage({ data, mimeType });
        setImagePreview(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const updateApiKey = (val: string) => {
    setLocalApiKey(val);
    saveApiKey(val);
  };

  const removeUploadedImage = () => {
    setUploadedImage(null);
    setImagePreview(null);
  };

  return {
    state: {
      apiProvider, apiKey: localApiKey || process.env.API_KEY || "", baseUrl, localApiKey, generationMode, prompt, negativePrompt, batchItems, primaryColor, secondaryColor,
      vectorizeEnabled, isRemixMode, isEnhancing, uploadedImage, imagePreview, selectedStyleId, remixStyleId,
      selectedGeminiModel, openAIModels, selectedOpenAIModel, status, currentActionLabel, error,
      singleResult, remixResult, batchResults, history
    },
    setters: {
      setApiProvider, setApiKey: updateApiKey, setBaseUrl, setGenerationMode, setPrompt, setNegativePrompt, setBatchItems,
      setPrimaryColor, setSecondaryColor, setVectorizeEnabled, setIsRemixMode, setSelectedStyleId,
      setRemixStyleId, setSelectedGeminiModel, setSelectedOpenAIModel, setError, setHistory
    },
    handlers: {
      handleEnhance, handleGenerate, processFile, removeUploadedImage, restoreFromHistory
    }
  };
};
