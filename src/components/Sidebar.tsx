import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { BaseLinks } from './LinkRowData';

const schoolMenuByRole: Record<string, Array<{ to: string; label: string }>> = {
  'school-admin': [
    { to: '/school-admin', label: 'Dashboard' },
    { to: '/students', label: 'Students' },
    { to: '/staff', label: 'Staff' },
    { to: '/attendance', label: 'Attendance' },
    { to: '/fees', label: 'Fees' },
    { to: '/exams', label: 'Exams' },
    { to: '/reports', label: 'Reports' },
    { to: '/settings', label: 'Settings' },
  ],
  teacher: [
    { to: '/teacher-portal', label: 'Teacher Portal' },
    { to: '/attendance', label: 'Attendance' },
    { to: '/exams', label: 'Exams' },
    { to: '/reports', label: 'Reports' },
  ],
  student: [
    { to: '/student-portal', label: 'Student Portal' },
    { to: '/fees', label: 'Fees' },
    { to: '/exams', label: 'Exams' },
    { to: '/reports', label: 'Reports' },
  ],
  parent: [
    { to: '/parent-portal', label: 'Parent Portal' },
    { to: '/fees', label: 'Fees' },
    { to: '/reports', label: 'Reports' },
  ],
};

const masterDataItems = [
  { to: '/master-data/session', label: 'Session' },
  { to: '/master-data/class', label: 'Class' },
  { to: '/master-data/section', label: 'Section' },
];

const Sidebar = () => {
  const { currentUser } = useAuth();
  const role = currentUser?.role || '';
  const topbarLinks = BaseLinks.find((entry) => entry.RoleName === role && entry.IsActive)?.Links || [];
  const topbarPaths = new Set(topbarLinks.map((link) => link.Link));

  const visibleItems = (schoolMenuByRole[role] || []).filter((item) => !topbarPaths.has(item.to));
  const showMasterData = ['school-admin', 'teacher', 'student', 'parent'].includes(role);

  if (!visibleItems.length && !showMasterData) {
    return null;
  }

  return (
    <aside className="sidebar">
      <div className="brand">EduCoreUi</div>
      <nav className="nav flex-column gap-1">
        {visibleItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            {item.label}
          </NavLink>
        ))}

        {showMasterData && (
          <div className="sidebar-group mt-2">
            <NavLink
              to="/master-data/session"
              className={({ isActive }) => `nav-link sidebar-group-title ${isActive ? 'active' : ''}`}
            >
              MasterData
            </NavLink>

            <div className="sidebar-submenu">
              {masterDataItems.map((item) => (
                <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link sidebar-sub-link ${isActive ? 'active' : ''}`}>
                  {item.label}
                </NavLink>
              ))}
            </div>
          </div>
        )}
      </nav>
    </aside>
  );
}

export default Sidebar;
