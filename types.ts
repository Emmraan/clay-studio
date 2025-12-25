
export type ApiProvider = 'gemini' | 'openai-compatible';

export interface DropdownOption {
  id: string;
  name: string;
}

export interface GeneratedIcon {
  id: string;
  url: string;
  svg?: string;
  prompt: string;
  timestamp: number;
  item?: string;
  // Metadata for recall
  settings?: {
    styleId: string;
    primaryColor: string;
    secondaryColor: string;
    negativePrompt: string;
    mode: string;
  };
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  GENERATING = 'GENERATING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
