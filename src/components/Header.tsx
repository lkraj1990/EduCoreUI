import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Roles, BaseLinks, type TopHeaderLink } from './LinkRowData';

const buildTopHeaderLinks = (role?: string): TopHeaderLink[] => {
  const activeRole = role || Roles.Guest;
  const matchedRoleLinks = BaseLinks.find((item) => item.RoleName === activeRole && item.IsActive);

  return (matchedRoleLinks?.Links ?? []).map((link) => ({
    DisplayName: link.DisplayName,
    Link: link.Link,
    Roles: [activeRole],
    IsActive: true,
  }));
};

const Header = () => {
  const { currentUser, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const topHeaderLinks = buildTopHeaderLinks(currentUser?.role);

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
        {topHeaderLinks.map((item) => (
          <NavLink key={item.Link} to={item.Link} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {item.DisplayName}
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
