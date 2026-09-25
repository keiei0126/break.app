import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import { Confetti } from '../components/Confetti';
import type { TargetApp } from '../types';

const COUNTDOWN_LIST: number[] = Array.of(5, 4, 3, 2, 1);

export const SwitchPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { actions, addLog, currentApp, setCurrentApp } = useApp();

  const appFromUrl = searchParams.get('app') as TargetApp | null;
  const target = appFromUrl || currentApp || 'SNS';

  const [countdown, setCountdown] = useState<number>(5);
  const [selectedActionIndex, setSelectedActionIndex] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  const currentAction = actions[selectedActionIndex] || { title: '深呼吸をしよう', durationMinutes: 1 };

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

  // 「はい！」を押して紙吹雪を飛ばす
  const handleDone = () => {
    setShowConfetti(true);
    addLog(currentAction.title, currentAction.durationMinutes);
    // 0.8秒紙吹雪を見せてから画面移動
    setTimeout(() => {
      navigate('/dashboard');
    }, 800);
  };

  const handleNotYet = () => {
    setCountdown(5);
    setSelectedActionIndex((prev) => (prev + 1) % actions.length);
  };

  return (
    <div style={{ padding: '24px 20px', textAlign: 'center' }}>
      {showConfetti && <Confetti />}

      <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 'bold', marginBottom: '8px' }}>
        切り替えタイム（{target}）
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '32px 20px',
        margin: '20px 0 32px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.04)',
      }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', color: '#111827', margin: '0 0 16px' }}>
          {currentAction.title}
        </h2>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', margin: '20px 0' }}>
          {COUNTDOWN_LIST.map((num: number) => (
            <span
              key={num}
              style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: countdown === num ? '#007404' : '#d1d5db',
                transform: countdown === num ? 'scale(1.25)' : 'scale(1)',
                transition: 'all 0.3s ease',
              }}
            >
              {num}
            </span>
          ))}
        </div>

        <p style={{ fontSize: '13px', color: '#9ca3af', margin: 0 }}>
          {countdown > 0 ? '画面から目を離して息を整えよう' : '準備ができたら完了ボタンを押そう'}
        </p>
      </div>

      <div style={{ marginTop: '24px' }}>
        <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1f2937', marginBottom: '16px' }}>
          できた？
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <button
            onClick={handleDone}
            style={{
              flex: 1,
              maxWidth: '130px',
              padding: '14px',
              borderRadius: '24px',
              border: 'none',
              background: '#007404',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: '0 4px 10px rgba(0,116,4,0.3)',
            }}
          >
            はい !
          </button>

          <button
            onClick={handleNotYet}
            style={{
              flex: 1,
              maxWidth: '130px',
              padding: '14px',
              borderRadius: '24px',
              border: '1px solid #d1d5db',
              background: '#ffffff',
              color: '#374151',
              fontSize: '16px',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
          >
            まだ !
          </button>
        </div>
      </div>
    </div>
  );
};