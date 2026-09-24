import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import type { TargetApp } from '../types';

export const SwitchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { actions, addLog, currentApp, setCurrentApp } = useApp();

  const appFromUrl = searchParams.get('app') as TargetApp | null;
  const target = appFromUrl || currentApp || 'その他';

  const [countdown, setCountdown] = useState<number>(5);
  const [selectedAction, setSelectedAction] = useState(actions[0]);

  useEffect(() => {
    if (appFromUrl && !currentApp) {
      setCurrentApp(appFromUrl);
    }
  }, [appFromUrl, currentApp, setCurrentApp]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleReroll = () => {
    const next = actions[Math.floor(Math.random() * actions.length)];
    setSelectedAction(next);
  };

  const handleComplete = () => {
    addLog(selectedAction.title, selectedAction.durationMinutes);
    navigate('/dashboard');
  };

  return (
    <div style={{ maxWidth: '400px', margin: '20px auto', padding: '24px', textAlign: 'center', background: '#fff', borderRadius: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
      {countdown > 0 ? (
        <div>
          <span style={{ fontSize: '13px', background: '#fee2e2', color: '#b91c1c', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
            🚨 {target} の誘惑を検知！
          </span>
          <h2 style={{ fontSize: '18px', color: '#4b5563', marginTop: '16px' }}>画面から目を離して深呼吸...</h2>
          <div style={{ fontSize: '64px', fontWeight: 'bold', color: '#10b981', margin: '20px 0' }}>{countdown}</div>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>衝動が落ち着くまで、ゆっくり息を吐こう</p>
        </div>
      ) : (
        <div>
          <span style={{ fontSize: '36px' }}>🌱</span>
          <h2 style={{ fontSize: '20px', margin: '8px 0', color: '#1f2937' }}>ナイスブレーキ！</h2>
          <p style={{ color: '#6b7280', fontSize: '14px' }}>{target} を開く前に、こっちをやってみよう</p>

          <div style={{ background: '#f0fdf4', border: '2px solid #86efac', borderRadius: '12px', padding: '20px', margin: '20px 0' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#166534' }}>{selectedAction.title}</h3>
            <span style={{ fontSize: '12px', background: '#dcfce7', color: '#15803d', padding: '4px 8px', borderRadius: '20px' }}>
              目安時間: 約{selectedAction.durationMinutes}分
            </span>
          </div>

          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button onClick={handleReroll} style={{ padding: '10px 16px', border: '1px solid #d1d5db', borderRadius: '8px', background: '#f9fafb', cursor: 'pointer' }}>
              別の行動 🔄
            </button>
            <button onClick={handleComplete} style={{ padding: '10px 20px', border: 'none', borderRadius: '8px', background: '#10b981', color: '#fff', cursor: 'pointer', fontWeight: 'bold' }}>
              できた！記録する ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};