import { useState } from 'react';
import { useApp } from '../contexts/AppContext';

// 曜日の定義
const WEEK_DAYS = Array.of('日', '月', '火', '水', '木', '金', '土');

export const DashboardPage = () => {
  const { logs } = useApp();

  // タブ状態
  const [metricTab, setMetricTab] = useState<'count' | 'time'>('count'); // 'count': 回数, 'time': 時間
  const [periodTab, setPeriodTab] = useState<'week' | 'month'>('week'); // 'week': 週間, 'month': 月間

  // 全体の集計
  const totalCount = logs.length;
  const totalMinutes = logs.reduce((sum, log) => sum + log.savedMinutes, 0);

  // 1日の目標（localStorageから取得、デフォルト10回/60分）
  const savedCount = localStorage.getItem('kingdom_target_count');
  const savedMinutes = localStorage.getItem('kingdom_target_minutes');
  const targetCount = savedCount ? Number(savedCount) : 10;
  const targetMinutes = savedMinutes ? Number(savedMinutes) : 60;

  // 達成率計算
  const progressPercent = metricTab === 'count'
    ? Math.min(100, Math.round((totalCount / targetCount) * 100))
    : Math.min(100, Math.round((totalMinutes / targetMinutes) * 100));

  // 👇 【動的集計】日(0)〜土(6) の曜日ごとの数値を集計
  const dayValues = Array.of(0, 0, 0, 0, 0, 0, 0);

  logs.forEach((log) => {
    // ログのidは作成時のミリ秒タイムスタンプ
    const logDate = new Date(Number(log.id));
    if (!isNaN(logDate.getTime())) {
      const dayIndex = logDate.getDay(); // 0(日) 〜 6(土)
      if (metricTab === 'count') {
        dayValues[dayIndex] += 1;
      } else {
        dayValues[dayIndex] += log.savedMinutes;
      }
    }
  });

  // グラフの最大値（バーの高さの基準。最低でも回数なら5、時間なら30）
  const maxVal = Math.max(...dayValues, metricTab === 'count' ? 5 : 30);
  const todayIndex = new Date().getDay();

  return (
    <div style={{ padding: '20px' }}>
      <h2 style={{ fontSize: '18px', color: '#111827', textAlign: 'center', margin: '0 0 16px', fontWeight: 'bold' }}>
        切り替え履歴
      </h2>

      {/* 1. 上段タブ：「切り替えた回数」 / 「節約時間」 */}
      <div style={{
        display: 'flex',
        background: '#e2ece4',
        borderRadius: '24px',
        padding: '4px',
        marginBottom: '12px',
      }}>
        <button
          onClick={() => setMetricTab('count')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '20px',
            border: 'none',
            background: metricTab === 'count' ? '#ffffff' : 'transparent',
            color: metricTab === 'count' ? '#007404' : '#6b7280',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: metricTab === 'count' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          切り替えた回数
        </button>
        <button
          onClick={() => setMetricTab('time')}
          style={{
            flex: 1,
            padding: '8px',
            borderRadius: '20px',
            border: 'none',
            background: metricTab === 'time' ? '#ffffff' : 'transparent',
            color: metricTab === 'time' ? '#007404' : '#6b7280',
            fontWeight: 'bold',
            fontSize: '13px',
            cursor: 'pointer',
            boxShadow: metricTab === 'time' ? '0 2px 4px rgba(0,0,0,0.05)' : 'none',
            transition: 'all 0.2s',
          }}
        >
          節約時間
        </button>
      </div>

      {/* 2. 下段タブ：「週間」 / 「月間」 */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '16px' }}>
        <button
          onClick={() => setPeriodTab('week')}
          style={{
            padding: '6px 20px',
            borderRadius: '16px',
            border: 'none',
            background: periodTab === 'week' ? '#007404' : '#ffffff',
            color: periodTab === 'week' ? '#ffffff' : '#6b7280',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          週間
        </button>
        <button
          onClick={() => setPeriodTab('month')}
          style={{
            padding: '6px 20px',
            borderRadius: '16px',
            border: 'none',
            background: periodTab === 'month' ? '#007404' : '#ffffff',
            color: periodTab === 'month' ? '#ffffff' : '#6b7280',
            fontSize: '12px',
            fontWeight: 'bold',
            cursor: 'pointer',
          }}
        >
          月間
        </button>
      </div>

      {/* 3. メイン統計カード ＆ 動的棒グラフ */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
        marginBottom: '20px',
      }}>
        <div style={{ fontSize: '13px', color: '#6b7280' }}>
          {periodTab === 'week' ? '今週の' : '今月の'}
          {metricTab === 'count' ? '回数' : '浮いた時間'}
        </div>
        <div style={{ fontSize: '28px', fontWeight: 'bold', color: '#111827', margin: '4px 0 12px' }}>
          {metricTab === 'count' ? `${totalCount} 回` : `${totalMinutes} 分`}
        </div>

        {/* 達成率プログレスバー */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
          <div style={{ flex: 1, height: '10px', background: '#e5e7eb', borderRadius: '5px', overflow: 'hidden' }}>
            <div style={{
              width: `${progressPercent}%`,
              height: '100%',
              background: '#007404',
              borderRadius: '5px',
              transition: 'width 0.5s ease',
            }} />
          </div>
          <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#007404' }}>{progressPercent}%</span>
        </div>

        {/* 動的棒グラフ（本物のログデータから計算） */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          height: '130px',
          padding: '10px 8px 0',
          borderBottom: '1px solid #f3f4f6',
        }}>
          {WEEK_DAYS.map((day: string, idx: number) => {
            const val = dayValues[idx];
            // バーの高さ（0の場合は平らな4px、最大100pxまで伸びる）
            const barHeight = val === 0 ? 4 : Math.max(8, Math.round((val / maxVal) * 90));
            const isToday = idx === todayIndex;

            return (
              <div key={day} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', width: '28px' }}>
                {/* バーの上の数値（0より大きい時だけ表示） */}
                <span style={{ fontSize: '10px', color: isToday ? '#007404' : '#9ca3af', fontWeight: 'bold', minHeight: '14px' }}>
                  {val > 0 ? (metricTab === 'count' ? `${val}` : `${val}m`) : ''}
                </span>

                {/* 棒本体 */}
                <div style={{
                  width: '14px',
                  height: `${barHeight}px`,
                  background: isToday ? '#007404' : (val > 0 ? '#86efac' : '#e5e7eb'),
                  borderRadius: '6px 6px 0 0',
                  transition: 'height 0.4s ease, background-color 0.3s ease',
                }} />

                {/* 曜日ラベル */}
                <span style={{
                  fontSize: '11px',
                  color: isToday ? '#007404' : '#6b7280',
                  fontWeight: isToday ? 'bold' : 'normal',
                }}>
                  {day}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. 直近の記録リスト */}
      <div style={{
        background: '#ffffff',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
      }}>
        <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#374151', margin: '0 0 12px' }}>
          直近の記録
        </h3>

        {logs.length === 0 ? (
          <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', margin: '16px 0' }}>
            まだ記録がありません
          </p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {logs.slice(0, 5).map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #f3f4f6',
                  fontSize: '13px',
                }}
              >
                <div>
                  <span style={{ color: '#6b7280', marginRight: '8px' }}>{log.timestamp}</span>
                  <span style={{ fontWeight: 'bold', color: '#111827' }}>{log.targetApp}</span>
                  <span style={{ color: '#9ca3af', margin: '0 6px' }}>➔</span>
                  <span style={{ color: '#007404', fontWeight: 'bold' }}>{log.actionTitle}</span>
                </div>
                <div style={{ color: '#6b7280', fontSize: '12px', fontWeight: 'bold' }}>
                  {metricTab === 'count' ? '1回' : `${log.savedMinutes}分`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};