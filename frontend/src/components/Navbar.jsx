import { useNavigate, NavLink } from 'react-router-dom';

function Navbar({ setIsAuth }) {
  const navigate = useNavigate();
  
  const logout = () => {
    localStorage.clear();
    setIsAuth(false);
    navigate('/');
  };

  const linkClasses = "px-3 py-2 rounded-md text-sm font-medium transition-colors";
  const activeLinkClasses = "bg-blue-700 text-white";
  const inactiveLinkClasses = "text-blue-100 hover:bg-blue-500 hover:text-white";

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="flex justify-between items-center max-w-6xl mx-auto">
        <span className="text-xl font-bold">Visitor CRM</span>
        <div className="flex items-center gap-6">
          <div className="flex gap-6">
            <NavLink to="/dashboard" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
              Dashboard
            </NavLink>
            <NavLink to="/customers" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
              Customers
            </NavLink>
            <NavLink to="/visitors" className={({ isActive }) => `${linkClasses} ${isActive ? activeLinkClasses : inactiveLinkClasses}`}>
              Visitors
            </NavLink>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={logout} className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md transition-colors">Logout</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
