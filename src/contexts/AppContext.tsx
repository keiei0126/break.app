import React, { createContext, useContext, useState, useEffect } from 'react';
// ↓ ここに「type」を追加しました
import type { TargetApp, ActionItem, StopLog } from '../types';

interface AppContextType {
  logs: StopLog[];
  actions: ActionItem[];
  currentApp: TargetApp | null;
  setCurrentApp: (app: TargetApp | null) => void;
  addLog: (actionTitle: string, savedMinutes: number) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_ACTIONS: ActionItem[] = [
  { id: '1', title: 'コップ1杯の冷たい水を飲む', durationMinutes: 1 },
  { id: '2', title: '立ち上がって肩と首のストレッチ', durationMinutes: 3 },
  { id: '3', title: '窓を開けて外の空気を吸う', durationMinutes: 2 },
  { id: '4', title: '机の上にあるゴミを1つ捨てる', durationMinutes: 1 },
  { id: '5', title: '目を閉じてゆっくり深呼吸を3回', durationMinutes: 1 },
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<StopLog[]>(() => {
    const saved = localStorage.getItem('kingdom_logs');
    return saved ? JSON.parse(saved) : [];
  });
  const [actions] = useState<ActionItem[]>(DEFAULT_ACTIONS);
  const [currentApp, setCurrentApp] = useState<TargetApp | null>(null);

  useEffect(() => {
    localStorage.setItem('kingdom_logs', JSON.stringify(logs));
  }, [logs]);

  const addLog = (actionTitle: string, savedMinutes: number) => {
    const app = currentApp || 'その他';
    const newLog: StopLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetApp: app,
      actionTitle,
      savedMinutes,
    };
    setLogs((prev) => [newLog, ...prev]);
    setCurrentApp(null);
  };

  return (
    <AppContext.Provider value={{ logs, actions, currentApp, setCurrentApp, addLog }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};