import { useNavigate } from 'react-router-dom';

function Navbar({ setIsAuth }) {
  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.clear();
    setIsAuth(false);
    navigate('/');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-xl font-bold">Visitor CRM</h1>
        <div className="flex gap-6">
          <a href="/dashboard" className="hover:underline">Dashboard</a>
          <a href="/customers" className="hover:underline">Customers</a>
          <a href="/visitors" className="hover:underline">Visitors</a>
          <button onClick={logout} className="hover:underline">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
