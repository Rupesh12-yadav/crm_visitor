import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Visitors from './pages/Visitors';
import Navbar from './components/Navbar';
import ThemeToggle from './components/ThemeToggle';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/" />;
}

function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    localStorage.setItem('theme', theme);
    const handleStorage = () => setIsAuth(!!localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [theme]);

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle theme={theme} setTheme={setTheme} />
      </div>
      <BrowserRouter>
      {isAuth && <Navbar setIsAuth={setIsAuth} />}
      <Routes>
        <Route 
          path="/" 
          element={isAuth ? <Navigate to="/dashboard" /> : <Login setIsAuth={setIsAuth} />} 
        />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/customers" element={<PrivateRoute><Customers /></PrivateRoute>} />
        <Route path="/visitors" element={<PrivateRoute><Visitors /></PrivateRoute>} />
      </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
