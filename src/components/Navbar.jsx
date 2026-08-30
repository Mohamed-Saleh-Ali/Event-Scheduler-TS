import { Link, NavLink, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className='navbar bg-base-100 shadow-md px-4'>
      <div className='flex-1'>
        <Link to='/' className='btn btn-ghost text-xl'>
          🎫 Events App
        </Link>
      </div>
      <div className='flex-none gap-2'>
        <ul className='menu menu-horizontal items-center gap-1'>
          <li>
            <NavLink to='/'>Home</NavLink>
          </li>
          {isAuthenticated ? (
            <>
              <li>
                <NavLink to='/events/new'>Create Event</NavLink>
              </li>
              <li className='hidden sm:block'>
                <span className='opacity-70'>{user?.email}</span>
              </li>
              <li>
                <button onClick={handleLogout}>Log out</button>
              </li>
            </>
          ) : (
            <>
              <li>
                <NavLink to='/signin'>Sign In</NavLink>
              </li>
              <li>
                <NavLink to='/signup' className='btn btn-primary btn-sm text-white'>
                  Sign Up
                </NavLink>
              </li>
            </>
          )}
        </ul>
      </div>
    </div>
  );
}