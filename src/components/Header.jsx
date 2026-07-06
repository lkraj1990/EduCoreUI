import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { navItems } from '../mockupData/mockupData';

function Header() {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const visibleItems = navItems.filter((item) => {
    const role = currentUser?.role;

    if (!role) {
      return ['/register-school','/forgot-password','/pricing'].includes(item.to);
    }

    if (role === 'super-admin') {
      return ['/home', '/super-admin', '/tenant-management', '/school-registration'].includes(item.to);
    }

    if (role === 'school-admin') {
      return ['/home', '/school-admin', '/students', '/staff', '/attendance', '/fees', '/exams', '/reports'].includes(item.to);
    }

    if (role === 'teacher') {
      return ['/home', '/teacher-portal', '/attendance', '/exams', '/reports'].includes(item.to);
    }

    if (role === 'student') {
      return ['/home', '/student-portal', '/fees', '/exams', '/reports'].includes(item.to);
    }

    if (role === 'parent') {
      return ['/home', '/parent-portal', '/fees', '/reports'].includes(item.to);
    }

    return false;
  });

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
    navigate('/');
  };

  const handleMenuAction = (path) => {
    setIsMenuOpen(false);
    navigate(path);
  };

  return (
    <header className="topbar">
      <div>
        <h4 className="mb-0">School ERP Starter UI</h4>
        <div className="small text-muted">{currentUser ? `${currentUser.name} • ${currentUser.role.replace('-', ' ')}` : 'Guest'}</div>
      </div>

      <nav className="topbar-nav">
        {visibleItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {item.to === '/' && currentUser ? 'Login' : item.label}
          </NavLink>
        ))}
      </nav>

      <div className="d-flex align-items-center gap-2">
        <div className="profile-menu position-relative">
          <button className="profile-trigger" onClick={() => setIsMenuOpen((prev) => !prev)}>
            <span className="profile-avatar">{currentUser ? currentUser.name.charAt(0).toUpperCase() : 'G'}</span>
          </button>

          {isMenuOpen && (
            <div className="profile-dropdown">
              {currentUser ? (
                <>
                  <div className="dropdown-header">
                    <strong>{currentUser.name}</strong>
                    <div className="small text-muted">{currentUser.email}</div>
                  </div>
                  <button className="dropdown-item" onClick={() => handleMenuAction('/profile')}>
                    My Profile
                  </button>
                  <button className="dropdown-item" onClick={() => handleMenuAction('/settings')}>
                    Settings
                  </button>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <div className="dropdown-header">
                    <strong>Guest</strong>
                    <div className="small text-muted">Sign in to access your account</div>
                  </div>
                  <button className="dropdown-item" onClick={() => handleMenuAction('/')}>
                    Login
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
