export type TargetApp = 'YouTube' | 'Instagram' | 'TikTok' | 'X' | 'ゲーム' | 'その他';

// 見ようとした理由の選択肢
export type StopReason = '退屈' | '疲労' | 'ストレス' | '無意識';

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
  reason: StopReason; // 👈 理由を追加
}