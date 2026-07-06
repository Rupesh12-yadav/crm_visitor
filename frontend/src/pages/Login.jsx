import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Login({ setIsAuth }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      setIsAuth(true);
      navigate('/dashboard'); // Navegación sin recargar la página
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
        <div className="mb-6 text-center">
          <h2 className="text-3xl font-bold text-gray-800">Welcome Back!</h2>
          <p className="text-gray-500">Sign in to your Visitor CRM</p>
        </div>
        {error && <p className="bg-red-100 text-red-600 text-sm mb-4 p-3 rounded-lg text-center">{error}</p>}
        <input
          type="email" placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 bg-gray-50 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required
        />
        <input
          type="password" placeholder="Password" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 border rounded-lg mb-4 bg-gray-50 border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition" required
        />
        <button className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 transition-transform transform hover:scale-105 focus:ring-4 focus:ring-blue-300 font-semibold">Login</button>
        <p className="text-sm text-gray-500 mt-4 text-center">
          Demo: admin@gmail.com / 123456
        </p>
      </form>
    </div>
  );
}

export default Login;
