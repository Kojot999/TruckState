import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@app/context/AuthContext';

function LayoutContent() {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const isLoginPage = pathname === '/login';

  useEffect(() => {
    if (!isAuthenticated && !isLoginPage) {
      navigate('/login', { replace: true });
    }

    if (isAuthenticated && isLoginPage) {
      navigate('/', { replace: true });
    }
  }, [isAuthenticated, isLoginPage, navigate]);

  if (!isAuthenticated && !isLoginPage) {
    return null;
  }

  return <Outlet />;
}

function Layout() {
  return (
    <AuthProvider>
      <LayoutContent />
    </AuthProvider>
  );
}

export default Layout;
