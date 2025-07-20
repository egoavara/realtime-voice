import { AudioFormat } from '../types/generated.js';

export interface AudioMessageModel {
  id: string;
  sessionId: string;
  audioData: string;
  timestamp: string;
  duration: number;
  format: AudioFormat;
}

export const audioMessages: AudioMessageModel[] = [];