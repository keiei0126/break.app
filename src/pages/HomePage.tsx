import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { getRankInfo } from '../utils/rank';
import type { TargetApp, StopReason } from '../types';

const REASONS: StopReason[] = Array.of('無意識', '退屈', '疲労', 'ストレス');

export const HomePage = () => {
  const navigate = useNavigate();
  const { logs, setCurrentApp, currentReason, setCurrentReason } = useApp();
  const [targetAppToStop, setTargetAppToStop] = useState<TargetApp | null>(null);
  const [returnInfo, setReturnInfo] = useState<{ app: string; minutes: number } | null>(null);

  const todayCount = logs.length;
  const totalMinutes = logs.reduce((sum, log) => sum + log.savedMinutes, 0);

  const rank = getRankInfo(todayCount);

  // 生還検知（YouTube等から戻ってきたとき）
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        const launchTimeStr = localStorage.getItem('kingdom_launch_time');
        const launchAppStr = localStorage.getItem('kingdom_launch_app');
        if (launchTimeStr && launchAppStr) {
          const launchTime = Number(launchTimeStr);
          const elapsedMinutes = Math.max(1, Math.round((Date.now() - launchTime) / (1000 * 60)));
          setReturnInfo({ app: launchAppStr, minutes: elapsedMinutes });
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

  // 視聴中リマインド通知予約
  const scheduleReminderNotification = (targetApp: string) => {
    const remindMinsStr = localStorage.getItem('kingdom_remind_interval');
    const remindMins = remindMinsStr ? Number(remindMinsStr) : 10;
    if (remindMins <= 0) return;

    if ('Notification' in window && Notification.permission === 'granted') {
      setTimeout(() => {
        new Notification(`🔔 ${remindMins}分が経過しました！`, {
          body: `${targetApp} の見すぎに注意！そろそろ深呼吸をして現実に戻りませんか？`,
          icon: '/nodopa-icon.png',
        });
      }, remindMins * 60 * 1000);
    }
  };

  // 👇 【バグ修正】NoDopaの画面をWeb版YouTubeで上書きしないように修正！
  const handleLaunchApp = () => {
    if (!targetAppToStop) return;

    localStorage.setItem('kingdom_launch_time', Date.now().toString());
    localStorage.setItem('kingdom_launch_app', targetAppToStop);

    scheduleReminderNotification(targetAppToStop);

    const ua = navigator.userAgent.toLowerCase();
    const isAndroid = /android/.test(ua);

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
      'ゲーム': { scheme: '', intent: '', fallback: 'https://google.com' },
      'その他': { scheme: '', intent: '', fallback: 'https://google.com' }
    };

    const config = appConfigs[targetAppToStop];
    setTargetAppToStop(null);

    if (!config) return;

    if (isAndroid) {
      window.location.href = config.intent || config.fallback;
    } else {
      // iOS：アプリ起動用スキームを叩くだけ（NoDopa画面を上書きしない！）
      if (config.scheme) {
        window.location.href = config.scheme;
      } else {
        window.open(config.fallback, '_blank');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* NoDopa ロゴ */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
        <img src="/nodopa-icon.png" alt="NoDopa" style={{ width: '32px', height: '32px', borderRadius: '8px' }} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
        <span style={{ fontSize: '24px', fontWeight: '900', color: '#111827', letterSpacing: '-0.5px' }}>
          NoDopa
        </span>
      </div>

      {/* 称号ランクバッジ */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '12px 16px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
        border: '1px solid #e2ece4',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '26px' }}>{rank.badge}</span>
          <div>
            <div style={{ fontSize: '11px', color: '#6b7280', fontWeight: 'bold' }}>Lv.{rank.level} 称号</div>
            <div style={{ fontSize: '15px', fontWeight: 'bold', color: '#007404' }}>{rank.title}</div>
          </div>
        </div>
        {rank.level < 10 && (
          <div style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'right' }}>
            次まであと <strong>{rank.nextCount - todayCount}回</strong> 🔥
          </div>
        )}
      </div>

      {/* 1. サマリーカード */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <div onClick={() => navigate('/dashboard')} style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', cursor: 'pointer' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>脱出成功回数</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: '8px 0 4px' }}>
            {todayCount}<span style={{ fontSize: '14px', color: '#6b7280' }}>/10回</span>
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'right' }}>&gt;</div>
        </div>

        <div onClick={() => navigate('/dashboard')} style={{ flex: 1, background: '#fff', borderRadius: '16px', padding: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', cursor: 'pointer' }}>
          <div style={{ fontSize: '12px', color: '#6b7280', fontWeight: 'bold' }}>合計節約時間</div>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#007404', margin: '8px 0 4px' }}>
            {totalMinutes}<span style={{ fontSize: '14px', color: '#6b7280' }}>分</span>
          </div>
          <div style={{ fontSize: '11px', color: '#9ca3af', textAlign: 'right' }}>&gt;</div>
        </div>
      </div>

      {/* 2. 今日のひとことカード */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 'bold', marginBottom: '8px' }}>今日のひとこと</div>
        <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>見る前に深呼吸してみない？</div>
        <button onClick={() => navigate('/switch?app=YouTube')} style={{ width: '100%', padding: '12px', background: '#007404', color: '#fff', border: 'none', borderRadius: '24px', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer' }}>
          切り替えを始める ➔
        </button>
      </div>

      <div style={{ fontSize: '13px', fontWeight: 'bold', color: '#4b5563', marginBottom: '12px', textAlign: 'center' }}>
        開こうとしているアプリを選択：
      </div>

      {/* 3. アプリ一覧 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        {[
          { name: 'YouTube', icon: '▶️' },
          { name: 'Instagram', icon: '📷' },
          { name: 'TikTok', icon: '🎵' },
          { name: 'X', icon: '✖️' },
        ].map((app) => (
          <button key={app.name} onClick={() => handleAppClick(app.name as TargetApp)} style={{ background: '#fff', border: 'none', borderRadius: '16px', padding: '20px 12px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)', cursor: 'pointer' }}>
            <span style={{ fontSize: '32px' }}>{app.icon}</span>
            <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>{app.name}</span>
          </button>
        ))}
      </div>

      {/* 4. STOP警告モーダル */}
      {targetAppToStop && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#ffdada', borderRadius: '24px', padding: '28px 20px', maxWidth: '320px', width: '100%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '26px', fontWeight: '900', color: '#111827' }}>STOP !</div>
            <div style={{ fontSize: '17px', fontWeight: 'bold', color: '#1f2937', margin: '8px 0 16px' }}>本当に見る？</div>

            <div style={{ fontSize: '12px', color: '#4b5563', fontWeight: 'bold', marginBottom: '8px' }}>なぜ見ようとした？</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '20px' }}>
              {REASONS.map((r) => (
                <button
                  key={r}
                  onClick={() => setCurrentReason(r)}
                  style={{
                    padding: '8px 4px',
                    borderRadius: '12px',
                    border: currentReason === r ? '2px solid #007404' : '1px solid #d1d5db',
                    background: currentReason === r ? '#ffffff' : 'rgba(255,255,255,0.6)',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    color: currentReason === r ? '#007404' : '#4b5563',
                    cursor: 'pointer',
                  }}
                >
                  {r === '無意識' ? '🌀 無意識' : r === '退屈' ? '🥱 退屈' : r === '疲労' ? '😫 疲労' : '⚡ ストレス'}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={handleLaunchApp} style={{ flex: 1, padding: '12px', borderRadius: '24px', border: '1px solid #d1d5db', background: '#fff', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer' }}>
                はい
              </button>
              <button onClick={handleConfirmStop} style={{ flex: 1, padding: '12px', borderRadius: '24px', border: 'none', background: '#007404', color: '#fff', fontSize: '14px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0,116,4,0.3)' }}>
                いいえ
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. 生還おかえりモーダル */}
      {returnInfo && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '24px', padding: '28px 24px', maxWidth: '320px', width: '100%', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.25)' }}>
            <span style={{ fontSize: '40px' }}>👏</span>
            <h3 style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', margin: '12px 0 8px' }}>おかえりなさい！</h3>
            <p style={{ fontSize: '14px', color: '#4b5563', lineHeight: '1.6', margin: '0 0 20px' }}>
              <strong>{returnInfo.app}</strong> を約 <strong style={{ color: '#ef4444', fontSize: '18px' }}>{returnInfo.minutes}分</strong> 見ていたね。<br />
              沼にハマりきる前に戻ってこれたの、ナイス判断！
            </p>
            <button onClick={() => { setReturnInfo(null); navigate('/switch?app=YouTube'); }} style={{ width: '100%', padding: '12px', borderRadius: '24px', border: 'none', background: '#007404', color: '#fff', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer' }}>
              深呼吸してリセットする 🌿
            </button>
          </div>
        </div>
      )}
    </div>
  );
};