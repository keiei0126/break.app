// src/App.tsx
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { SwitchPage } from './pages/SwitchPage';
import { HomePage } from './pages/HomePage';
import { DashboardPage } from './pages/DashboardPage';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{ maxWidth: '480px', margin: '0 auto', minHeight: '100vh', background: '#f9fafb', fontFamily: 'sans-serif' }}>
          {/* 上部メニュー */}
          <header style={{ display: 'flex', justifyContent: 'space-around', padding: '12px', background: '#fff', borderBottom: '1px solid #e5e7eb' }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#374151', fontWeight: 'bold' }}>🏠 ホーム</Link>
            <Link to="/switch" style={{ textDecoration: 'none', color: '#374151', fontWeight: 'bold' }}>🔄 切り替え</Link>
            <Link to="/dashboard" style={{ textDecoration: 'none', color: '#374151', fontWeight: 'bold' }}>📊 記録</Link>
          </header>

          {/* 画面切り替えエリア */}
          <main style={{ padding: '16px' }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/switch" element={<SwitchPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;