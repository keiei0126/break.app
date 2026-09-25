import React, { createContext, useContext, useState, useEffect } from 'react';
import type { TargetApp, ActionItem, StopLog, StopReason } from '../types';

interface AppContextType {
  logs: StopLog[];
  actions: ActionItem[];
  currentApp: TargetApp | null;
  currentReason: StopReason;
  setCurrentApp: (app: TargetApp | null) => void;
  setCurrentReason: (reason: StopReason) => void;
  addLog: (actionTitle: string, savedMinutes: number) => void;
  addAction: (title: string, durationMinutes: number) => void;
  deleteAction: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const DEFAULT_ACTIONS: ActionItem[] = Array.of(
  { id: '1', title: 'コップ1杯の冷たい水を飲む', durationMinutes: 1 },
  { id: '2', title: '立ち上がって肩と首のストレッチ', durationMinutes: 3 },
  { id: '3', title: '窓を開けて外の空気を吸う', durationMinutes: 2 },
  { id: '4', title: '机の上のゴミを1つ捨てる', durationMinutes: 1 },
  { id: '5', title: '目を閉じてゆっくり深呼吸を3回', durationMinutes: 1 }
);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [logs, setLogs] = useState<StopLog[]>(() => {
    const saved = localStorage.getItem('kingdom_logs');
    return saved ? JSON.parse(saved) : [];
  });

  const [actions, setActions] = useState<ActionItem[]>(() => {
    const saved = localStorage.getItem('kingdom_custom_actions');
    return saved ? JSON.parse(saved) : DEFAULT_ACTIONS;
  });

  const [currentApp, setCurrentApp] = useState<TargetApp | null>(null);
  const [currentReason, setCurrentReason] = useState<StopReason>('無意識');

  useEffect(() => {
    localStorage.setItem('kingdom_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('kingdom_custom_actions', JSON.stringify(actions));
  }, [actions]);

  const addLog = (actionTitle: string, savedMinutes: number) => {
    const app = currentApp || 'その他';
    const newLog: StopLog = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      targetApp: app,
      actionTitle,
      savedMinutes,
      reason: currentReason,
    };
    setLogs((prev) => [newLog, ...prev]);
    setCurrentApp(null);
    setCurrentReason('無意識');
  };

  const addAction = (title: string, durationMinutes: number) => {
    const newAction: ActionItem = {
      id: Date.now().toString(),
      title,
      durationMinutes,
    };
    setActions((prev) => [...prev, newAction]);
  };

  const deleteAction = (id: string) => {
    if (actions.length <= 1) {
      alert('アクションは最低1つ必要です！');
      return;
    }
    setActions((prev) => prev.filter((a) => a.id !== id));
  };

  return (
    <AppContext.Provider value={{
      logs, actions, currentApp, currentReason,
      setCurrentApp, setCurrentReason, addLog, addAction, deleteAction
    }}>
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