import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';
import type { TargetApp } from '../types';

const APPS: TargetApp[] = ['YouTube', 'Instagram', 'TikTok', 'X', 'ゲーム', 'その他'];

export const HomePage = () => {
  const navigate = useNavigate();
  const { currentApp, setCurrentApp } = useApp();

  const handleStop = () => {
    if (!currentApp) {
      alert('やめたいアプリを選択してください！');
      return;
    }
    // 切り替え画面へ移動
    navigate('/switch');
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '22px', color: '#1f2937' }}>何をやめたいですか？</h1>
      <p style={{ color: '#6b7280', fontSize: '14px' }}>今開いてしまっているアプリを選んでください</p>

      {/* アプリ選択ボタン一覧 */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', margin: '24px 0' }}>
        {APPS.map((app) => (
          <button
            key={app}
            onClick={() => setCurrentApp(app)}
            style={{
              padding: '10px 16px',
              borderRadius: '20px',
              border: currentApp === app ? '2px solid #ef4444' : '1px solid #d1d5db',
              background: currentApp === app ? '#fee2e2' : '#ffffff',
              color: currentApp === app ? '#b91c1c' : '#374151',
              fontWeight: currentApp === app ? 'bold' : 'normal',
              cursor: 'pointer',
              fontSize: '14px',
            }}
          >
            {app}
          </button>
        ))}
      </div>

      {/* 巨大なストップボタン */}
      <div style={{ margin: '40px 0' }}>
        <button
  onClick={handleStop}
  style={{
    width: '180px',
    height: '180px',
    borderRadius: '50%',
    backgroundColor: '#ef4444',
    color: '#ffffff',
    fontSize: '22px',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer',
    boxShadow: '0 8px 20px rgba(239, 68, 68, 0.4)',
    transition: 'transform 0.1s',
  }}
>
  今すぐやめる！
</button>
      </div>
    </div>
  );
};