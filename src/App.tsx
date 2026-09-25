import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { HomePage } from './pages/HomePage';
import { SwitchPage } from './pages/SwitchPage';
import { DashboardPage } from './pages/DashboardPage';
import { SettingsPage } from './pages/SettingsPage';
import { TimerPage } from './pages/TimerPage';

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;
  const activeColor = '#007404';
  const inactiveColor = '#9ca3af';

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      height: '68px',
      background: '#ffffff',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100,
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: isActive('/') ? activeColor : inactiveColor, textAlign: 'center' }}>
        <div style={{ fontSize: '22px' }}>🏠</div>
        <div style={{ fontSize: '11px', fontWeight: isActive('/') ? 'bold' : 'normal' }}>ホーム</div>
      </Link>

      <Link to="/timer" style={{ textDecoration: 'none', color: isActive('/timer') ? activeColor : inactiveColor, textAlign: 'center' }}>
        <div style={{ fontSize: '22px' }}>⏱️</div>
        <div style={{ fontSize: '11px', fontWeight: isActive('/timer') ? 'bold' : 'normal' }}>タイマー</div>
      </Link>

      {/* 👇 ここがタップできるように <Link to="/settings"> になっています */}
      <Link to="/settings" style={{ textDecoration: 'none', color: isActive('/settings') ? activeColor : inactiveColor, textAlign: 'center' }}>
        <div style={{ fontSize: '22px' }}>⚙️</div>
        <div style={{ fontSize: '11px', fontWeight: isActive('/settings') ? 'bold' : 'normal' }}>設定</div>
      </Link>
    </nav>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{
          minHeight: '100vh',
          background: '#d5e8d8',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '430px',
            minHeight: '100vh',
            background: '#eaf4ec',
            paddingBottom: '80px',
            position: 'relative',
            boxShadow: '0 0 20px rgba(0,0,0,0.06)',
            fontFamily: 'sans-serif',
          }}>
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/switch" element={<SwitchPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/timer" element={<TimerPage />} />
              </Routes>
            </main>
            <BottomNav />
          </div>
        </div>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;