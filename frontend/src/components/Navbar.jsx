import { useNavigate, NavLink } from 'react-router-dom';

function Navbar({ setIsAuth }) {
  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.clear();
    setIsAuth(false);
    navigate('/');
  };

  const activeLinkStyle = { textDecoration: 'underline' };

  return (
    <nav className="bg-blue-600 text-white p-4 shadow">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <h1 className="text-xl font-bold">Visitor CRM</h1>
        <div className="flex gap-6">
          <NavLink to="/dashboard" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Dashboard</NavLink>
          <NavLink to="/customers" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Customers</NavLink>
          <NavLink to="/visitors" style={({ isActive }) => isActive ? activeLinkStyle : undefined}>Visitors</NavLink>
          <button onClick={logout} className="hover:underline">Logout</button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
