import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import Users from './pages/Users';
import Login from './pages/Login';
import Books from './pages/Books'; 
import Transactions from './pages/Transactions';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile'; // YENİ: Profil sayfasını içeri aldık

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--surface-base)' }}>
        {/* Sol Menü */}
        <Sidebar />
        
        {/* Sağ İçerik Alanı */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', marginLeft: '250px' }}>
          <Topbar onLogout={handleLogout} />
          
          <div style={{ padding: '24px', overflowY: 'auto' }}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/books" element={<Books />} />
              <Route path="/transactions" element={<Transactions />} />
              {/* YENİ: Profil rotasını ekledik, artık beyaz ekran çıkmayacak! */}
              <Route path="/profile" element={<Profile />} /> 
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}