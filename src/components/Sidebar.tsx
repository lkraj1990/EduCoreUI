import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { navItems } from '../mockupData/mockupData';

const Sidebar = () => {
  const { currentUser } = useAuth();

  const visibleItems = navItems.filter((item) => {
    const role = currentUser?.role;
    if (!role) {
      return item.to === '/';
    }

    if (role === 'super-admin') {
      return ['/', '/super-admin', '/plans', '/tenant-management', '/school-registration', '/settings', '/home'].includes(item.to);
    }

    if (role === 'school-admin') {
      return ['/', '/school-admin', '/students', '/staff', '/attendance', '/fees', '/exams', '/reports', '/settings', '/home'].includes(item.to);
    }

    if (role === 'teacher') {
      return ['/', '/teacher-portal', '/attendance', '/exams', '/reports', '/home'].includes(item.to);
    }

    if (role === 'student') {
      return ['/', '/student-portal', '/fees', '/exams', '/reports', '/home'].includes(item.to);
    }

    if (role === 'parent') {
      return ['/', '/parent-portal', '/fees', '/reports', '/home'].includes(item.to);
    }

    return false;
  });

  return (
    <aside className="sidebar">
      <div className="brand">EduCoreUi</div>
      <nav className="nav flex-column gap-2">
        {visibleItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;
