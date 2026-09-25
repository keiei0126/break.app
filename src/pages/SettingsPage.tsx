import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../contexts/AppContext';

// リマインド間隔の選択肢（3分〜30分、OFF）
const REMIND_OPTIONS = Array.of(3, 5, 10, 15, 20, 30, 0);

export const SettingsPage = () => {
  const navigate = useNavigate();
  const { actions, addAction, deleteAction } = useApp();

  const [newActionTitle, setNewActionTitle] = useState('');
  const [newActionTime, setNewActionTime] = useState<number>(2);

  const [targetCount, setTargetCount] = useState<number>(() => {
    const saved = localStorage.getItem('kingdom_target_count');
    return saved ? Number(saved) : 10;
  });

  const [targetMinutes, setTargetMinutes] = useState<number>(() => {
    const saved = localStorage.getItem('kingdom_target_minutes');
    return saved ? Number(saved) : 60;
  });

  // リマインド間隔（分単位）
  const [remindInterval, setRemindInterval] = useState<number>(() => {
    const saved = localStorage.getItem('kingdom_remind_interval');
    return saved ? Number(saved) : 10;
  });

  // カスタム入力用の状態
  const [customMinutes, setCustomMinutes] = useState<string>('');

  const [appsStatus, setAppsStatus] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('kingdom_apps_status');
    return saved ? JSON.parse(saved) : { YouTube: true, Instagram: true, TikTok: true, X: true };
  });

  const [goalType, setGoalType] = useState<'count' | 'time'>('count');

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      await Notification.requestPermission();
    }
  };

  const handleSave = () => {
    localStorage.setItem('kingdom_target_count', targetCount.toString());
    localStorage.setItem('kingdom_target_minutes', targetMinutes.toString());
    localStorage.setItem('kingdom_remind_interval', remindInterval.toString());
    localStorage.setItem('kingdom_apps_status', JSON.stringify(appsStatus));

    if (remindInterval > 0) {
      requestNotificationPermission();
    }

    alert('設定を保存しました！');
    navigate('/');
  };

  const handleAddNewAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActionTitle.trim()) return;
    addAction(newActionTitle.trim(), newActionTime);
    setNewActionTitle('');
  };

  const toggleApp = (name: string) => {
    setAppsStatus((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // カスタム分数の適用
  const handleApplyCustomMinutes = () => {
    const val = parseInt(customMinutes, 10);
    if (!isNaN(val) && val > 0) {
      setRemindInterval(val);
      requestNotificationPermission();
      setCustomMinutes('');
    } else {
      alert('1分以上の半角数字を入力してください');
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '18px', color: '#111827', textAlign: 'center', margin: '0 0 16px', fontWeight: 'bold' }}>
        目標・アプリ設定
      </h2>

      {/* 1. 現在の目標サマリー */}
      <div style={{ background: '#fff', borderRadius: '16px', padding: '16px 20px', marginBottom: '16px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 'bold', marginBottom: '8px' }}>現在の1日の目標</div>
        <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
          ・脱出を <strong style={{ color: '#007404' }}>{targetCount}回</strong> する<br />
          ・合計 <strong style={{ color: '#007404' }}>{targetMinutes}分</strong> の節約時間を作る
        </div>
      </div>

      {/* 2. 視聴中のリマインド間隔設定カード（選択肢拡張 ＆ 自由入力） */}
      <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
          <div style={{ fontSize: '14px', color: '#111827', fontWeight: 'bold' }}>
            🔔 動画視聴中の休憩リマインド
          </div>
          <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#007404', background: '#f0fdf4', padding: '2px 8px', borderRadius: '10px' }}>
            {remindInterval === 0 ? 'OFF' : `現在: ${remindInterval}分`}
          </span>
        </div>
        <p style={{ fontSize: '12px', color: '#6b7280', margin: '0 0 14px' }}>
          指定した時間が経過すると、通知で深呼吸や休憩を促します。
        </p>

        {/* 豊富なクイック選択肢 */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '14px' }}>
          {REMIND_OPTIONS.map((mins) => (
            <button
              key={mins}
              onClick={() => {
                setRemindInterval(mins);
                if (mins > 0) requestNotificationPermission();
              }}
              style={{
                padding: '8px 2px',
                borderRadius: '12px',
                border: remindInterval === mins ? '2px solid #007404' : '1px solid #e5e7eb',
                background: remindInterval === mins ? '#f0fdf4' : '#ffffff',
                color: remindInterval === mins ? '#007404' : '#4b5563',
                fontWeight: 'bold',
                fontSize: '12px',
                cursor: 'pointer',
              }}
            >
              {mins === 0 ? 'OFF' : `${mins}分`}
            </button>
          ))}
        </div>

        {/* 自由な分数入力欄 */}
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', background: '#f9fafb', padding: '8px 12px', borderRadius: '12px' }}>
          <span style={{ fontSize: '12px', color: '#4b5563', fontWeight: 'bold', whiteSpace: 'nowrap' }}>自由指定:</span>
          <input
            type="number"
            placeholder="例: 7"
            min="1"
            max="180"
            value={customMinutes}
            onChange={(e) => setCustomMinutes(e.target.value)}
            style={{ width: '70px', padding: '6px 8px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', textAlign: 'center' }}
          />
          <span style={{ fontSize: '12px', color: '#6b7280' }}>分</span>
          <button
            type="button"
            onClick={handleApplyCustomMinutes}
            style={{ marginLeft: 'auto', padding: '6px 12px', background: '#007404', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}
          >
            セット
          </button>
        </div>
      </div>

      {/* 3. 代替アクション管理 */}
      <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: '14px', color: '#111827', fontWeight: 'bold', marginBottom: '12px' }}>
          🎯 代替アクションの管理
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
          {actions.map((act) => (
            <div key={act.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#f9fafb', padding: '10px 14px', borderRadius: '12px' }}>
              <div>
                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#374151' }}>{act.title}</span>
                <span style={{ fontSize: '11px', color: '#9ca3af', marginLeft: '8px' }}>({act.durationMinutes}分)</span>
              </div>
              <button onClick={() => deleteAction(act.id)} style={{ border: 'none', background: 'transparent', color: '#ef4444', fontSize: '16px', cursor: 'pointer', padding: '2px 6px' }}>
                ✕
              </button>
            </div>
          ))}
        </div>
        <form onSubmit={handleAddNewAction} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <input
            type="text"
            placeholder="新しい行動（例: ギターを弾く、英単語）"
            value={newActionTitle}
            onChange={(e) => setNewActionTitle(e.target.value)}
            style={{ padding: '10px 12px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px' }}
          />
          <div style={{ display: 'flex', gap: '8px' }}>
            <select
              value={newActionTime}
              onChange={(e) => setNewActionTime(Number(e.target.value))}
              style={{ padding: '10px', borderRadius: '10px', border: '1px solid #d1d5db', fontSize: '13px', background: '#fff', flex: 1 }}
            >
              <option value={1}>目安: 1分</option>
              <option value={2}>目安: 2分</option>
              <option value={3}>目安: 3分</option>
              <option value={5}>目安: 5分</option>
            </select>
            <button type="submit" style={{ padding: '10px 18px', background: '#007404', color: '#fff', border: 'none', borderRadius: '10px', fontWeight: 'bold', fontSize: '13px', cursor: 'pointer' }}>
              追加
            </button>
          </div>
        </form>
      </div>

      {/* 4. 目標設定調整 */}
      <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', marginBottom: '20px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 'bold', marginBottom: '12px' }}>目標の種類</div>
        <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
          <button onClick={() => setGoalType('count')} style={{ flex: 1, padding: '12px', borderRadius: '14px', border: goalType === 'count' ? '2px solid #007404' : '1px solid #e5e7eb', background: goalType === 'count' ? '#f0fdf4' : '#fff', fontWeight: 'bold', fontSize: '13px', color: goalType === 'count' ? '#007404' : '#4b5563', cursor: 'pointer' }}>
            🎯 回数
          </button>
          <button onClick={() => setGoalType('time')} style={{ flex: 1, padding: '12px', borderRadius: '14px', border: goalType === 'time' ? '2px solid #007404' : '1px solid #e5e7eb', background: goalType === 'time' ? '#f0fdf4' : '#fff', fontWeight: 'bold', fontSize: '13px', color: goalType === 'time' ? '#007404' : '#4b5563', cursor: 'pointer' }}>
            ⏱️ 時間
          </button>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', background: '#f9fafb', borderRadius: '14px', padding: '16px' }}>
          {goalType === 'count' ? (
            <>
              <button onClick={() => setTargetCount((prev) => Math.max(1, prev - 1))} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #d1d5db', background: '#fff', fontSize: '18px', cursor: 'pointer' }}>-</button>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#007404' }}>{targetCount}</span>
              <span style={{ fontSize: '14px', color: '#374151' }}>回脱出する</span>
              <button onClick={() => setTargetCount((prev) => prev + 1)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #d1d5db', background: '#fff', fontSize: '18px', cursor: 'pointer' }}>+</button>
            </>
          ) : (
            <>
              <button onClick={() => setTargetMinutes((prev) => Math.max(5, prev - 5))} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #d1d5db', background: '#fff', fontSize: '18px', cursor: 'pointer' }}>-</button>
              <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#007404' }}>{targetMinutes}</span>
              <span style={{ fontSize: '14px', color: '#374151' }}>分節約する</span>
              <button onClick={() => setTargetMinutes((prev) => prev + 5)} style={{ width: '36px', height: '36px', borderRadius: '50%', border: '1px solid #d1d5db', background: '#fff', fontSize: '18px', cursor: 'pointer' }}>+</button>
            </>
          )}
        </div>
      </div>

      {/* 5. 制限アプリON/OFF */}
      <div style={{ background: '#fff', borderRadius: '20px', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 6px rgba(0,0,0,0.03)' }}>
        <div style={{ fontSize: '13px', color: '#6b7280', fontWeight: 'bold', marginBottom: '12px' }}>制限するアプリ</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {Object.entries(appsStatus).map(([name, enabled]) => (
            <div key={name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151' }}>{name}</span>
              <button onClick={() => toggleApp(name)} style={{ padding: '6px 14px', borderRadius: '20px', border: 'none', background: enabled ? '#007404' : '#e5e7eb', color: enabled ? '#fff' : '#6b7280', fontSize: '12px', fontWeight: 'bold', cursor: 'pointer' }}>
                {enabled ? 'ON' : 'OFF'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <button onClick={handleSave} style={{ width: '100%', padding: '14px', background: '#007404', color: '#fff', border: 'none', borderRadius: '24px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 4px 10px rgba(0, 116, 4, 0.25)' }}>
        設定を保存する
      </button>
    </div>
  );
};