// src/utils/rank.ts

export interface RankInfo {
  level: number;
  title: string;
  badge: string;
  nextCount: number; // 次のランクに必要な回数
  desc: string;
}

export const getRankInfo = (totalCount: number): RankInfo => {
  if (totalCount >= 100) return { level: 10, title: '超越者：NoDopa神', badge: '👑', nextCount: 100, desc: 'ドーパミンを完全に支配した現代の奇跡。' };
  if (totalCount >= 80) return { level: 9, title: '覚醒のチルマスター', badge: '🧘‍♂️', nextCount: 100, desc: 'もはや刺激的なアルゴリズムなど無力。' };
  if (totalCount >= 60) return { level: 8, title: 'デジタルデトックス仙人', badge: '🍵', nextCount: 80, desc: '通知が鳴っても動じない。心の平穏を手に入れた。' };
  if (totalCount >= 40) return { level: 7, title: 'リアル充実ファイター', badge: '✨', nextCount: 60, desc: '現実世界の楽しさに目覚め、スマホを放置しがち。' };
  if (totalCount >= 25) return { level: 6, title: '時間の錬金術師', badge: '⏳', nextCount: 40, desc: '浮いた時間で読書や勉強をし、人生を取り戻す。' };
  if (totalCount >= 15) return { level: 5, title: 'ショート動画バスター', badge: '🛡️', nextCount: 25, desc: 'スワイプの沼から自力で這い上がれる戦士。' };
  if (totalCount >= 10) return { level: 4, title: '脱出ルーキー', badge: '🌱', nextCount: 15, desc: '「本当に見る？」の問いかけに理性が勝てる。' };
  if (totalCount >= 6) return { level: 3, title: '脱出の見習い', badge: '🐣', nextCount: 10, desc: '親指の反射的な動きにブレーキがかかり始める。' };
  if (totalCount >= 3) return { level: 2, title: '深呼吸を覚えた鳥', badge: '🕊️', nextCount: 6, desc: '画面から目を離すことの偉大さに気づいた。' };
  return { level: 1, title: '重度ドパガキ', badge: '🌀', nextCount: 3, desc: 'スマホが体の一部。無意識にYouTubeを開く生物。' };
};