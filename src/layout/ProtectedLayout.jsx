import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../context/AuthContext.jsx';

export default function ProtectedLayout() {
  const { isAuthenticated, loading } = useAuth();

  // Wait until the stored token has been validated,
  // otherwise logged-in users get redirected on a hard refresh
  if (loading) {
    return (
      <div className='flex justify-center py-24'>
        <span className='loading loading-spinner loading-lg' />
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to='/signin' replace />;

  return <Outlet />;
}