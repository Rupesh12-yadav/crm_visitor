import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Customers from './pages/Customers';
import Visitors from './pages/Visitors';
import Navbar from './components/Navbar';

function PrivateRoute({ children }) {
  return localStorage.getItem('token') ? children : <Navigate to="/" />;
}

function App() {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem('token'));

  useEffect(() => {
    const handleStorage = () => setIsAuth(!!localStorage.getItem('token'));
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
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
  );
}

export default App;
