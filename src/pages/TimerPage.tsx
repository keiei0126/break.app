import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const TimerPage = () => {
  const navigate = useNavigate();

  // タイマー初期値（10分 = 600秒）
  const INITIAL_SECONDS = 600;
  const [secondsLeft, setSecondsLeft] = useState<number>(INITIAL_SECONDS);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // カウントダウン処理（型エラーとESLint警告を解消した安全な書き方）
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          // 完了通知と画面遷移
          setTimeout(() => {
            alert('10分が経過しました！深呼吸をして動画を切り替えましょう！');
            navigate('/switch?app=YouTube');
          }, 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, navigate]);

  // 分と秒のフォーマット表示（例: 10:00）
  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // 円ゲージの計算
  const progressRatio = secondsLeft / INITIAL_SECONDS;
  const strokeDashoffset = 565 * (1 - progressRatio);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '20px', color: '#111827', margin: '0 0 24px', fontWeight: 'bold' }}>
        タイマー
      </h2>

      {/* 1. 大きな緑色の円形タイマーサークル */}
      <div style={{ position: 'relative', width: '220px', height: '220px', margin: '20px auto 30px' }}>
        <svg width="220" height="220" style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx="110"
            cy="110"
            r="90"
            stroke="#e5e7eb"
            strokeWidth="10"
            fill="transparent"
          />
          <circle
            cx="110"
            cy="110"
            r="90"
            stroke="#007404"
            strokeWidth="10"
            fill="transparent"
            strokeDasharray="565"
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s linear' }}
          />
        </svg>

        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '40px',
          fontWeight: 'bold',
          color: '#111827',
          fontFamily: 'monospace',
        }}>
          {timeDisplay}
        </div>
      </div>

      {/* 2. 「決定」/「一時停止」ボタン */}
      <button
        onClick={() => setIsRunning(!isRunning)}
        style={{
          width: '160px',
          padding: '12px',
          background: isRunning ? '#ef4444' : '#007404',
          color: '#ffffff',
          border: 'none',
          borderRadius: '24px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: isRunning ? '0 4px 10px rgba(239,68,68,0.3)' : '0 4px 10px rgba(0,116,4,0.3)',
          marginBottom: '28px',
          transition: 'all 0.2s',
        }}
      >
        {isRunning ? '一時停止' : '決定'}
      </button>

      {/* 3. 「10分ごとにリマインドします」カード */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '18px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        fontSize: '14px',
        color: '#4b5563',
        fontWeight: 'bold',
      }}>
        🔔 10分ごとにリマインドします
      </div>
    </div>
  );
};