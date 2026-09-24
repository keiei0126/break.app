import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import type { TargetApp } from '../types';

export const HomePage = () => {
  const navigate = useNavigate();
  const { logs, setCurrentApp } = useApp();
  const [targetAppToStop, setTargetAppToStop] = useState<TargetApp | null>(null);

  const todayCount = logs.length;
  const totalMinutes = logs.reduce((sum, log) => sum + log.savedMinutes, 0);

  const handleAppClick = (app: TargetApp) => {
    setTargetAppToStop(app);
  };

  const handleConfirmStop = () => {
    if (targetAppToStop) {
      setCurrentApp(targetAppToStop);
      navigate(`/switch?app=${targetAppToStop}`);
    }
  };

  // 「はい（見る）」が押されたときに外部アプリを起動する関数
  const handleLaunchApp = () => {
    if (!targetAppToStop) return;

    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(ua);

    // 👇 Partial をつけて未登録のアプリがあってもエラーが出ないように修正
    const appConfigs: Partial<Record<TargetApp, { scheme: string; intent: string; fallback: string }>> = {
      YouTube: {
        scheme: 'youtube://',
        intent: 'intent://www.youtube.com#Intent;scheme=https;package=com.google.android.youtube;end',
        fallback: 'https://www.youtube.com'
      },
      Instagram: {
        scheme: 'instagram://',
        intent: 'intent://instagram.com#Intent;scheme=https;package=com.instagram.android;end',
        fallback: 'https://instagram.com'
      },
      TikTok: {
        scheme: 'snssdk1233://',
        intent: 'intent://tiktok.com#Intent;scheme=https;package=com.zhiliaoapp.musically;end',
        fallback: 'https://tiktok.com'
      },
      X: {
        scheme: 'twitter://',
        intent: 'intent://x.com#Intent;scheme=https;package=com.twitter.android;end',
        fallback: 'https://x.com'
      },
      'ゲーム': {
        scheme: '',
        intent: '',
        fallback: 'https://google.com'
      },
      'その他': {
        scheme: '',
        intent: '',
        fallback: 'https://google.com'
      }
    };

    const config = appConfigs[targetAppToStop];

    if (!config || !config.fallback) {
      alert(`「${targetAppToStop}」への自動遷移には未対応です。`);
      setTargetAppToStop(null);
      return;
    }

    // モーダルを閉じる
    setTargetAppToStop(null);

    if (isAndroid) {
      // Android Chrome等：Intent構文で起動
      window.location.href = config.intent || config.fallback;
    } else {
      // iOS Safari等：URLスキームで起動、なければブラウザ版へ
      if (config.scheme) {
        window.location.href = config.scheme;
        setTimeout(() => {
          window.location.href = config.fallback;
        }, 1500);
      } else {
        window.location.href = config.fallback;
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* 1. 今日の記録カード */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '12px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}>
        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 'bold' }}>今日の記録</div>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginTop: '6px' }}>
          {todayCount > 0 ? `🎉 目標達成中！（${todayCount}回 回避）` : 'まだ記録はありません'}
        </div>
      </div>

      {/* 2. 今日の合計時間カード */}
      <div style={{
        background: '#fff',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '24px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}>
        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 'bold' }}>⏰ 今日の合計節約時間</div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#10b981', marginTop: '4px' }}>
          {totalMinutes} <span style={{ fontSize: '16px', color: '#4b5563' }}>分</span>
        </div>
      </div>

      <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', marginBottom: '12px' }}>
        開こうとしているアプリを選択：
      </div>

      {/* 3. アプリ一覧グリッド */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <button
          onClick={() => handleAppClick('YouTube')}
          style={{
            background: '#fff',
            border: 'none',
            borderRadius: '16px',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '32px' }}>▶️</span>
          <span style={{ fontWeight: 'bold', color: '#ef4444' }}>YouTube</span>
        </button>

        <button
          onClick={() => handleAppClick('Instagram')}
          style={{
            background: '#fff',
            border: 'none',
            borderRadius: '16px',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '32px' }}>📷</span>
          <span style={{ fontWeight: 'bold', color: '#ec4899' }}>Instagram</span>
        </button>

        <button
          onClick={() => handleAppClick('TikTok')}
          style={{
            background: '#fff',
            border: 'none',
            borderRadius: '16px',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '32px' }}>🎵</span>
          <span style={{ fontWeight: 'bold', color: '#111827' }}>TikTok</span>
        </button>

        <button
          onClick={() => handleAppClick('X')}
          style={{
            background: '#fff',
            border: 'none',
            borderRadius: '16px',
            padding: '24px 16px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
            cursor: 'pointer',
          }}
        >
          <span style={{ fontSize: '32px' }}>✖️</span>
          <span style={{ fontWeight: 'bold', color: '#1f2937' }}>X (Twitter)</span>
        </button>
      </div>

      {/* 4. STOPモーダル */}
      {targetAppToStop && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px',
        }}>
          <div style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '32px 24px',
            maxWidth: '320px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#ef4444' }}>STOP !</div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '16px 0 24px' }}>本当に見る？</div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={handleLaunchApp}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px',
                  border: '1px solid #d1d5db', background: '#f9fafb',
                  fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
                }}
              >
                はい（見る）
              </button>
              <button
                onClick={handleConfirmStop}
                style={{
                  flex: 1, padding: '12px', borderRadius: '12px',
                  border: 'none', background: '#10b981', color: '#fff',
                  fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
                }}
              >
                いいえ（止める）
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};