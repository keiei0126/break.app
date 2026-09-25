import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PRESET_MINUTES = Array.of(3, 5, 10, 15, 25);

const TIPS: Record<number, string> = {
  3: '👀 遠くの景色をぼーっと眺めて、目の筋肉を休めよう',
  5: '☕ コップ1杯の白湯かお茶をゆっくり飲んでリフレッシュ',
  10: '🧘‍♂️ 肩甲骨を大きく回して、首と肩のコリをほぐそう',
  15: '📖 スマホを置いて、好きな本を数ページ読んでみよう',
  25: '💻 ポモドーロ集中タイム！画面以外の作業に没頭しよう',
};

export const TimerPage = () => {
  const navigate = useNavigate();

  const [selectedMinutes, setSelectedMinutes] = useState<number>(10);
  const [secondsLeft, setSecondsLeft] = useState<number>(10 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);

  // プリセット時間が変わったらタイマーをリセット
  const handleSelectMinutes = (mins: number) => {
    setIsRunning(false);
    setSelectedMinutes(mins);
    setSecondsLeft(mins * 60);
  };

  // カウントダウン処理
  useEffect(() => {
    if (!isRunning) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsRunning(false);
          setTimeout(() => {
            alert(`${selectedMinutes}分が経過しました！深呼吸をして現実に戻りましょう！`);
            navigate('/switch?app=YouTube');
          }, 100);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, selectedMinutes, navigate]);

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const timeDisplay = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const totalSec = selectedMinutes * 60;
  const progressRatio = secondsLeft / totalSec;
  const strokeDashoffset = 565 * (1 - progressRatio);

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2 style={{ fontSize: '18px', color: '#111827', margin: '0 0 16px', fontWeight: 'bold' }}>
        リセットタイマー
      </h2>

      {/* 1. クイック時間プリセットボタン */}
      <div style={{ display: 'flex', gap: '6px', justifyContent: 'center', marginBottom: '20px' }}>
        {PRESET_MINUTES.map((mins) => (
          <button
            key={mins}
            onClick={() => handleSelectMinutes(mins)}
            style={{
              padding: '6px 12px',
              borderRadius: '16px',
              border: selectedMinutes === mins ? '2px solid #007404' : '1px solid #d1d5db',
              background: selectedMinutes === mins ? '#007404' : '#ffffff',
              color: selectedMinutes === mins ? '#ffffff' : '#4b5563',
              fontSize: '12px',
              fontWeight: 'bold',
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            {mins}分
          </button>
        ))}
      </div>

      {/* 2. 円形タイマー（呼吸アニメーション付き） */}
      <div style={{ position: 'relative', width: '220px', height: '220px', margin: '0 auto 20px' }}>
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

        {/* 中央テキスト */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          <span style={{ fontSize: '38px', fontWeight: 'bold', color: '#111827', fontFamily: 'monospace' }}>
            {timeDisplay}
          </span>
          <span style={{ fontSize: '11px', color: '#007404', fontWeight: 'bold', marginTop: '2px' }}>
            {isRunning ? '🍃 呼吸を整え中' : '準備完了'}
          </span>
        </div>
      </div>

      {/* 3. 「スタート・決定 / 一時停止」ボタン */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={{
            width: '140px',
            padding: '12px',
            background: isRunning ? '#ef4444' : '#007404',
            color: '#ffffff',
            border: 'none',
            borderRadius: '24px',
            fontWeight: 'bold',
            fontSize: '15px',
            cursor: 'pointer',
            boxShadow: isRunning ? '0 4px 10px rgba(239,68,68,0.3)' : '0 4px 10px rgba(0,116,4,0.3)',
            transition: 'all 0.2s',
          }}
        >
          {isRunning ? '一時停止' : '決定（開始）'}
        </button>
        <button
          onClick={() => {
            setIsRunning(false);
            setSecondsLeft(selectedMinutes * 60);
          }}
          style={{
            padding: '12px 16px',
            background: '#ffffff',
            color: '#6b7280',
            border: '1px solid #d1d5db',
            borderRadius: '24px',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
          }}
        >
          リセット
        </button>
      </div>

      {/* 4. おすすめの過ごし方アドバイスカード */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '16px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        textAlign: 'left',
        marginBottom: '12px',
        border: '1px solid #dcfce7',
      }}>
        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#007404', marginBottom: '4px' }}>
          💡 この時間のおすすめの過ごし方
        </div>
        <div style={{ fontSize: '13px', color: '#374151', lineHeight: '1.5' }}>
          {TIPS[selectedMinutes] || '深呼吸をして、画面から目を離してリラックスしよう'}
        </div>
      </div>

      {/* 5. リマインド通知の案内 */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '14px 20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        fontSize: '12px',
        color: '#6b7280',
        fontWeight: 'bold',
      }}>
        🔔 {selectedMinutes}分後にリマインド通知が届きます
      </div>
    </div>
  );
};