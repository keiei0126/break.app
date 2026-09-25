import { useState, } from 'react';
import { useNavigate } from 'react-router-dom';

export const SettingsPage = () => {
  const navigate = useNavigate();

  // 1日の目標設定（localStorageから読み込み）
  const [targetCount, setTargetCount] = useState<number>(() => {
    const saved = localStorage.getItem('kingdom_target_count');
    return saved ? Number(saved) : 10;
  });

  const [targetMinutes, setTargetMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('kingdom_target_minutes');
    return saved ? Number(saved) : 60;
  });

  // 制御対象アプリのON/OFF（Figma仕様）
  const [appsStatus, setAppsStatus] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('kingdom_apps_status');
    return saved ? JSON.parse(saved) : { YouTube: true, Instagram: true, TikTok: true, X: true };
  });

  // 目標種類の切り替え（回数 or 時間）
  const [goalType, setGoalType] = useState<'count' | 'time'>('count');

  // 設定の保存
  const handleSave = () => {
    localStorage.setItem('kingdom_target_count', targetCount.toString());
    localStorage.setItem('kingdom_target_minutes', targetMinutes.toString());
    localStorage.setItem('kingdom_apps_status', JSON.stringify(appsStatus));
    alert('設定を保存しました！');
    navigate('/');
  };

  const toggleApp = (name: string) => {
    setAppsStatus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '18px', color: '#111827', textAlign: 'center', margin: '0 0 16px', fontWeight: 'bold' }}>
        目標・アプリ設定
      </h2>

      {/* 1. 現在の1日の目標サマリーカード */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '16px 20px',
        marginBottom: '16px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
      }}>
        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 'bold', marginBottom: '8px' }}>
          現在の1日の目標
        </div>
        <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
          ・脱出を <strong style={{ color: '#007404' }}>{targetCount}回</strong> する<br />
          ・合計 <strong style={{ color: '#007404' }}>{targetMinutes}分</strong> の節約時間を作る
        </div>
      </div>

      {/* 2. 目標設定調整カード（Figma仕様） */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
      }}>
        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 'bold', marginBottom: '12px' }}>
          目標の種類
        </div>

        {/* 回数 / 時間 タブ */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button
            onClick={() => setGoalType('count')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '14px',
              border: goalType === 'count' ? '2px solid #007404' : '1px solid #e5e7eb',
              background: goalType === 'count' ? '#f0fdf4' : '#ffffff',
              fontWeight: 'bold',
              fontSize: '13px',
              color: goalType === 'count' ? '#007404' : '#4b5563',
              cursor: 'pointer',
            }}
          >
            🎯 回数
          </button>
          <button
            onClick={() => setGoalType('time')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '14px',
              border: goalType === 'time' ? '2px solid #007404' : '1px solid #e5e7eb',
              background: goalType === 'time' ? '#f0fdf4' : '#ffffff',
              fontWeight: 'bold',
              fontSize: '13px',
              color: goalType === 'time' ? '#007404' : '#4b5563',
              cursor: 'pointer',
            }}
          >
            ⏱️ 時間
          </button>
        </div>

        {/* 数値変更（[-] [+]） */}
        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 'bold', marginBottom: '10px' }}>
          目標の内容
        </div>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '16px',
          background: '#f9fafb',
          borderRadius: '14px',
          padding: '16px',
        }}>
          {goalType === 'count' ? (
            <>
              <button
                onClick={() => setTargetCount((prev) => Math.max(1, prev - 1))}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #d1d5db', background: '#fff', fontSize: '18px', cursor: 'pointer' }}
              >
                -
              </button>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#007404' }}>{targetCount}</span>
              <span style={{ fontSize: '14px', color: '#374151' }}>回脱出する</span>
              <button
                onClick={() => setTargetCount((prev) => prev + 1)}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #d1d5db', background: '#fff', fontSize: '18px', cursor: 'pointer' }}
              >
                +
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setTargetMinutes((prev) => Math.max(5, prev - 5))}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #d1d5db', background: '#fff', fontSize: '18px', cursor: 'pointer' }}
              >
                -
              </button>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#007404' }}>{targetMinutes}</span>
              <span style={{ fontSize: '14px', color: '#374151' }}>分節約する</span>
              <button
                onClick={() => setTargetMinutes((prev) => prev + 5)}
                style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #d1d5db', background: '#fff', fontSize: '18px', cursor: 'pointer' }}
              >
                +
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3. 制御対象アプリのON/OFFリスト（Figma仕様書準拠） */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '20px',
        marginBottom: '24px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
      }}>
        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 'bold', marginBottom: '12px' }}>
          制限するアプリ
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(appsStatus).map(([name, enabled]) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>{name}</span>
              <button
                onClick={() => toggleApp(name)}
                style={{
                  padding: '6px 14px',
                  borderRadius: '20px',
                  border: 'none',
                  background: enabled ? '#007404' : '#e5e7eb',
                  color: enabled ? '#fff' : '#6b7280',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
              >
                {enabled ? 'ON' : 'OFF'}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 4. 保存するボタン */}
      <button
        onClick={handleSave}
        style={{
          width: '100%',
          padding: '14px',
          background: '#007404',
          color: '#ffffff',
          border: 'none',
          borderRadius: '24px',
          fontWeight: 'bold',
          fontSize: '16px',
          cursor: 'pointer',
          boxShadow: '0 4px 10px rgba(0, 116, 4, 0.25)',
        }}
      >
        設定を保存する
      </button>
    </div>
  );
};