// src/types/index.ts
export type TargetApp = 'YouTube' | 'Instagram' | 'TikTok' | 'X' | 'ゲーム' | 'その他';

export interface ActionItem {
  id: string;
  title: string;
  durationMinutes: number;
}

export interface StopLog {
  id: string;
  timestamp: string;
  targetApp: TargetApp;
  actionTitle: string;
  savedMinutes: number;
}