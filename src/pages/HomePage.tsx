import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import type { TargetApp } from '../types';

export const HomePage = () => {
  const navigate = useNavigate();
  const { logs, setCurrentApp } = useApp();
  const [targetAppToStop, setTargetAppToStop] = useState<TargetApp | null>(null);

  // 👇 【新機能】YouTube等から戻ってきた時の検知状態
  const [returnInfo, setReturnInfo] = useState<{ app: string; minutes: number } | null>(null);

  const todayCount = logs.length;
  const totalMinutes = logs.reduce((sum, log) => sum + log.savedMinutes, 0);

  // 画面に戻ってきた（ブラウザを再び開いた）瞬間に経過時間をチェック
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const launchTimeStr = localStorage.getItem('kingdom_launch_time');
        const launchAppStr = localStorage.getItem('kingdom_launch_app');
        if (launchTimeStr && launchAppStr) {
          const launchTime = Number(launchTimeStr);
          const elapsedMinutes = Math.max(1, Math.round((Date.now() - launchTime) / (1000 * 60)));
          setReturnInfo({ app: launchAppStr, minutes: elapsedMinutes });
          // チェックしたらクリア
          localStorage.removeItem('kingdom_launch_time');
          localStorage.removeItem('kingdom_launch_app');
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  const handleAppClick = (app: TargetApp) => {
    setTargetAppToStop(app);
  };

  const handleConfirmStop = () => {
    if (targetAppToStop) {
      setCurrentApp(targetAppToStop);
      navigate(`/switch?app=${targetAppToStop}`);
    }
  };

  // 「はい（見る）」を押してYouTube等へ飛ぶとき
  const handleLaunchApp = () => {
    if (!targetAppToStop) return;

    // 👇 飛んだ時刻とアプリ名を記録しておく
    localStorage.setItem('kingdom_launch_time', Date.now().toString());
    localStorage.setItem('kingdom_launch_app', targetAppToStop);

    const urls: Record<string, string> = {
      YouTube: 'https://www.youtube.com',
      Instagram: 'https://instagram.com',
      TikTok: 'https://tiktok.com',
      X: 'https://x.com',
    };
    const target = targetAppToStop;
    setTargetAppToStop(null);
    window.location.href = urls[target] || 'https://google.com';
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* 1. 上部2分割サマリーカード */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div
          onClick={() => navigate('/dashboard')}
          style={{
            flex: 1,
            background: '#ffffff',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>脱出成功回数</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '8px 0 4px' }}>
            {todayCount}<span style={{ fontSize: '14px', color: '#6b7280' }}>/10回</span>
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'right' }}>&gt;</div>
        </div>

        <div
          onClick={() => navigate('/dashboard')}
          style={{
            flex: 1,
            background: '#ffffff',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
            cursor: 'pointer',
          }}
        >
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>合計節約時間</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007404', margin: '8px 0 4px' }}>
            {totalMinutes}<span style={{ fontSize: '14px', color: '#6b7280' }}>分</span>
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'right' }}>&gt;</div>
        </div>
      </div>

      {/* 2. 今日のひとことカード */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
      }}>
        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 'bold', marginBottom: '8px' }}>
          今日のひとこと
        </div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
          見る前に深呼吸してみない？
        </div>
        <button
          onClick={() => navigate('/switch?app=YouTube')}
          style={{
            width: '100%',
            padding: '12px',
            background: '#007404',
            color: '#ffffff',
            border: 'none',
            borderRadius: '24px',
            fontWeight: 'bold',
            fontSize: '14px',
            cursor: 'pointer',
            boxShadow: '0 4px 10px rgba(0, 116, 4, 0.2)',
          }}
        >
          切り替えを始める ➔
        </button>
      </div>

      {/* 3. アプリ選択 */}
      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#4b5563', marginBottom: '12px', textAlign: 'center' }}>
        開こうとしているアプリを選択：
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {[
          { name: 'YouTube', icon: '▶️' },
          { name: 'Instagram', icon: '📷' },
          { name: 'TikTok', icon: '🎵' },
          { name: 'X', icon: '✖️' },
        ].map((app) => (
          <button
            key={app.name}
            onClick={() => handleAppClick(app.name as TargetApp)}
            style={{
              background: '#ffffff',
              border: 'none',
              borderRadius: '16px',
              padding: '20px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              cursor: 'pointer',
            }}
          >
            <span style={{ fontSize: '32px' }}>{app.icon}</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>{app.name}</span>
          </button>
        ))}
      </div>

      {/* 4. STOP警告モーダル */}
      {targetAppToStop && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.45)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 1000, padding: '20px',
        }}>
          <div style={{
            background: '#ffdada',
            borderRadius: '24px',
            padding: '32px 24px',
            maxWidth: '320px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
          }}>
            <div style={{ fontSize: '28px', fontWeight: '900', color: '#111827', letterSpacing: '1px' }}>
              STOP !
            </div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', margin: '14px 0 24px' }}>
              本当に見る？
            </div>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                onClick={handleLaunchApp}
                style={{
                  flex: 1, padding: '12px', borderRadius: '24px',
                  border: '1px solid #d1d5db', background: '#ffffff',
                  fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
                }}
              >
                はい
              </button>
              <button
                onClick={handleConfirmStop}
                style={{
                  flex: 1, padding: '12px', borderRadius: '24px',
                  border: 'none', background: '#007404', color: '#ffffff',
                  fontSize: '14px', fontWeight: 'bold', cursor: 'pointer',
                  boxShadow: '0 4px 10px rgba(0,116,4,0.3)',
                }}
              >
                いいえ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 👇 【新機能】YouTubeから戻ってきた時の「生還おかえり」モーダル！ */}
      {returnInfo && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          zIndex: 2000, padding: '20px',
        }}>
          <div style={{
            background: '#ffffff',
            borderRadius: '24px',
            padding: '28px 24px',
            maxWidth: '320px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.25)',
          }}>
            <span style={{ fontSize: '40px' }}>👏</span>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '12px 0 8px' }}>
              おかえりなさい！
            </h3>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6', margin: '0 0 20px' }}>
              <strong>{returnInfo.app}</strong> を約 <strong style={{ color: '#ef4444', fontSize: '18px' }}>{returnInfo.minutes}分</strong> 見ていたね。<br />
              沼にハマりきる前に戻ってこれたの、ナイス判断！
            </p>
            <button
              onClick={() => {
                setReturnInfo(null);
                navigate('/switch?app=YouTube');
              }}
              style={{
                width: '100%',
                padding: '12px',
                borderRadius: '24px',
                border: 'none',
                background: '#007404',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: 'bold',
                cursor: 'pointer',
                boxShadow: '0 4px 10px rgba(0,116,4,0.3)',
              }}
            >
              深呼吸してリセットする 🌿
            </button>
          </div>
        </div>
      )}
    </div>
  );
};