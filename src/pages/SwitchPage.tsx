import { useState, useEffect } from 'react';

// 代替アクションのリスト（後から自由に追加・変更できます）
const ACTIONS = [
  { id: '1', title: 'コップ1杯の冷たい水を飲む', time: '1分' },
  { id: '2', title: '立ち上がって肩と首のストレッチ', time: '3分' },
  { id: '3', title: '窓を開けて外の空気を吸う', time: '2分' },
  { id: '4', title: '机の上にあるゴミを1つ捨てる', time: '1分' },
  { id: '5', title: '目を閉じてゆっくり深呼吸を3回', time: '1分' },
];

export const SwitchPage = () => {
  // 深呼吸タイマー（5秒からカウントダウン）
  const [countdown, setCountdown] = useState<number>(5);
  // 提案する代替アクション
  const [action, setAction] = useState(ACTIONS[0]);

  // カウントダウン処理
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // 別のアクションをランダムで選ぶ
  const handleReroll = () => {
    const nextAction = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
    setAction(nextAction);
  };

  return (
    <div style={{
      maxWidth: '400px',
      margin: '40px auto',
      padding: '24px',
      textAlign: 'center',
      fontFamily: 'sans-serif',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      borderRadius: '16px',
      background: '#fff'
    }}>
      {countdown > 0 ? (
        // ① まずは画面から目を離して深呼吸させるフェーズ
        <div>
          <h2 style={{ fontSize: '18px', color: '#666' }}>画面から目を離して深呼吸...</h2>
          <div style={{
            fontSize: '64px',
            fontWeight: 'bold',
            color: '#10b981',
            margin: '30px 0'
          }}>
            {countdown}
          </div>
          <p style={{ color: '#888', fontSize: '14px' }}>息をゆっくり吸って、吐いて</p>
        </div>
      ) : (
        // ② 深呼吸が終わったら、次の行動を提案するフェーズ
        <div>
          <span style={{ fontSize: '32px' }}>🌱</span>
          <h2 style={{ fontSize: '20px', margin: '10px 0' }}>ナイス気づき！</h2>
          <p style={{ color: '#666', fontSize: '14px' }}>刺激から離れて、次はこれをやってみよう</p>

          {/* 提案カード */}
          <div style={{
            background: '#f0fdf4',
            border: '2px solid #86efac',
            borderRadius: '12px',
            padding: '20px',
            margin: '20px 0'
          }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '18px', color: '#166534' }}>
              {action.title}
            </h3>
            <span style={{
              fontSize: '12px',
              background: '#dcfce7',
              color: '#15803d',
              padding: '4px 8px',
              borderRadius: '20px'
            }}>
              目安時間: {action.time}
            </span>
          </div>

          {/* 操作ボタン */}
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
            <button
              onClick={handleReroll}
              style={{
                padding: '10px 16px',
                border: '1px solid #ccc',
                borderRadius: '8px',
                background: '#f9fafb',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              別の行動にする 🔄
            </button>
            <button
              onClick={() => alert('行動切り替え成功！お疲れ様でした！')}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                background: '#10b981',
                color: '#fff',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: '14px'
              }}
            >
              できた！ ✨
            </button>
          </div>
        </div>
      )}
    </div>
  );
};