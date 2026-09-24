import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { HomePage } from './pages/HomePage';
import { SwitchPage } from './pages/SwitchPage';
import { DashboardPage } from './pages/DashboardPage';

const BottomNav = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav style={{
      position: 'fixed',
      bottom: 0,
      left: '50%',
      transform: 'translateX(-50%)',
      width: '100%',
      maxWidth: '430px',
      height: '64px',
      background: '#ffffff',
      borderTop: '1px solid #e5e7eb',
      display: 'flex',
      justifyContent: 'space-around',
      alignItems: 'center',
      zIndex: 100,
    }}>
      <Link to="/" style={{ textDecoration: 'none', color: isActive('/') ? '#10b981' : '#9ca3af', textAlign: 'center' }}>
        <div style={{ fontSize: '20px' }}>🏠</div>
        <div style={{ fontSize: '11px', fontWeight: isActive('/') ? 'bold' : 'normal' }}>ホーム</div>
      </Link>
      <Link to="/dashboard" style={{ textDecoration: 'none', color: isActive('/dashboard') ? '#10b981' : '#9ca3af', textAlign: 'center' }}>
        <div style={{ fontSize: '20px' }}>📄</div>
        <div style={{ fontSize: '11px', fontWeight: isActive('/dashboard') ? 'bold' : 'normal' }}>記録</div>
      </Link>
      <div style={{ color: '#d1d5db', textAlign: 'center', cursor: 'not-allowed' }}>
        <div style={{ fontSize: '20px' }}>⚙️</div>
        <div style={{ fontSize: '11px' }}>設定</div>
      </div>
    </nav>
  );
};

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <div style={{
          minHeight: '100vh',
          background: '#dcfce7',
          paddingBottom: '80px',
          display: 'flex',
          justifyContent: 'center',
        }}>
          <div style={{
            width: '100%',
            maxWidth: '430px',
            minHeight: '100vh',
            background: '#eef8f2',
            position: 'relative',
            boxShadow: '0 0 20px rgba(0,0,0,0.05)',
          }}>
            <main>
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/switch" element={<SwitchPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
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