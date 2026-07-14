import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { navItems } from '../mockupData/mockupData';

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const visibleItems = navItems.filter((item) => {
    const role = currentUser?.role;

    if (!role) {
      return ['/', '/register-school', '/forgot-password', '/pricing'].includes(item.to);
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
      <div className="topbar-brand-wrap">
        <div className="topbar-logo" aria-label="EC logo" role="img">
          <span className="topbar-logo-chip">EC</span>
        </div>
        <div>
          <h4 className="topbar-title">EduCoreUi Control Center</h4>
          <div className="topbar-subtitle">
            <span>{currentUser ? currentUser.name : 'Guest User'}</span>
            <span className="status-pill">{currentUser ? currentUser.role.replace('-', ' ') : 'guest'}</span>
          </div>
        </div>
      </div>

      <nav className="topbar-nav" aria-label="Primary">
        {visibleItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="d-flex align-items-center gap-2">
        {currentUser ? (
          <div className="profile-menu position-relative">
            <button className="profile-trigger" onClick={() => setIsMenuOpen((prev) => !prev)}>
              <span className="profile-avatar">{currentUser.name.charAt(0).toUpperCase()}</span>
            </button>

            {isMenuOpen && (
              <div className="profile-dropdown">
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
              </div>
            )}
          </div>
        ) : (
          <button type="button" className="btn btn-primary btn-sm topbar-login-btn" onClick={() => navigate('/login')}>
            Login
          </button>
        )}
      </div>
    </header>
  );
}

export default Header;
