// src/components/RankModal.tsx
import { getRankInfo } from '../utils/rank';

const ALL_RANKS = Array.of(
  { level: 1, title: '重度ドパガキ', badge: '🌀', count: '0回〜', desc: 'スマホが体の一部。無意識にYouTubeを開く生物。' },
  { level: 2, title: '深呼吸を覚えた鳥', badge: '🕊️', count: '3回〜', desc: '画面から目を離すことの偉大さに気づいた。' },
  { level: 3, title: '脱出の見習い', badge: '🐣', count: '6回〜', desc: '親指の反射的な動きにブレーキがかかり始める。' },
  { level: 4, title: '脱出ルーキー', badge: '🌱', count: '10回〜', desc: '「本当に見る？」の問いかけに理性が勝てる。' },
  { level: 5, title: 'ショート動画バスター', badge: '🛡️', count: '15回〜', desc: 'スワイプの沼から自力で這い上がれる戦士。' },
  { level: 6, title: '時間の錬金術師', badge: '⏳', count: '25回〜', desc: '浮いた時間で読書や勉強をし、人生を取り戻す。' },
  { level: 7, title: 'リアル充実ファイター', badge: '✨', count: '40回〜', desc: '現実世界の楽しさに目覚め、スマホを放置しがち。' },
  { level: 8, title: 'デジタルデトックス仙人', badge: '🍵', count: '60回〜', desc: '通知が鳴っても動じない。心の平穏を手に入れた。' },
  { level: 9, title: '覚醒のチルマスター', badge: '🧘‍♂️', count: '80回〜', desc: 'もはや刺激的なアルゴリズムなど無力。' },
  { level: 10, title: '超越者：NoDopa神', badge: '👑', count: '100回〜', desc: 'ドーパミンを完全に支配した現代の奇跡。' }
);

export const RankModal = ({ totalCount, onClose }: { totalCount: number; onClose: () => void }) => {
  const currentRank = getRankInfo(totalCount);

  return (
    <div style={{
      position: 'fixed',
      top: 0, left: 0, right: 0, bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 3000, padding: '20px',
    }}>
      <div style={{
        background: '#ffffff',
        borderRadius: '24px',
        padding: '24px 20px',
        maxWidth: '360px',
        width: '100%',
        maxHeight: '80vh',
        display: 'flex',
        flexDirection: 'column',
        boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
            🏆 称号ランク一覧（全10段階）
          </h3>
          <button onClick={onClose} style={{ border: 'none', background: 'transparent', fontSize: '20px', color: '#9ca3af', cursor: 'pointer' }}>
            ✕
          </button>
        </div>

        {/* ランク一覧スクロールエリア */}
        <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', paddingRight: '4px' }}>
          {ALL_RANKS.map((r) => {
            const isCurrent = currentRank.level === r.level;
            return (
              <div
                key={r.level}
                style={{
                  padding: '10px 14px',
                  borderRadius: '14px',
                  background: isCurrent ? '#f0fdf4' : '#f9fafb',
                  border: isCurrent ? '2px solid #007404' : '1px solid #e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <span style={{ fontSize: '26px' }}>{r.badge}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', fontWeight: 'bold', color: isCurrent ? '#007404' : '#111827' }}>
                      Lv.{r.level} {r.title}
                    </span>
                    <span style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold' }}>{r.count}</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#4b5563', marginTop: '2px', lineHeight: '1.4' }}>
                    {r.desc}
                  </div>
                  {isCurrent && (
                    <span style={{ display: 'inline-block', fontSize: '10px', background: '#007404', color: '#fff', padding: '1px 6px', borderRadius: '4px', fontWeight: 'bold', marginTop: '4px' }}>
                      現在のランク
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        <button
          onClick={onClose}
          style={{
            marginTop: '16px',
            padding: '12px',
            background: '#007404',
            color: '#ffffff',
            border: 'none',
            borderRadius: '24px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
          }}
        >
          閉じる
        </button>
      </div>
    </div>
  );
};