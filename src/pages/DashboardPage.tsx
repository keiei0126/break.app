import { useApp } from '../contexts/AppContext';

export const DashboardPage = () => {
  const { logs } = useApp();

  // 合計節約時間（分）の計算
  const totalSavedMinutes = logs.reduce((sum, log) => sum + log.savedMinutes, 0);

  return (
    <div style={{ padding: '20px', maxWidth: '500px', margin: '0 auto' }}>
      <h2>📊 これまでの成果</h2>

      <div style={{ display: 'flex', gap: '15px', margin: '20px 0' }}>
        <div style={{ flex: 1, padding: '15px', background: '#e6f7ff', borderRadius: '8px', textAlign: 'center' }}>
          <h3>やめられた回数</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>{logs.length} 回</p>
        </div>

        <div style={{ flex: 1, padding: '15px', background: '#f6ffed', borderRadius: '8px', textAlign: 'center' }}>
          <h3>浮いた時間</h3>
          <p style={{ fontSize: '28px', fontWeight: 'bold' }}>
            約 {totalSavedMinutes} 分
          </p>
        </div>
      </div>

      <h3>直近の切り替え履歴</h3>

      {logs.length === 0 ? (
        <p>まだ記録がありません。ホームから「やめる！」を押してみましょう！</p>
      ) : (
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {logs.map((log) => (
            <li
              key={log.id}
              style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}
            >
              <div>
                <strong>{log.targetApp}</strong> をやめて 👉{' '}
                <strong>{log.actionTitle}</strong>
              </div>
              <small style={{ color: '#888' }}>
                {log.timestamp}（約{log.savedMinutes}分 節約）
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};