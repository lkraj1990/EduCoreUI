import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/auth/LoginPage';
import RegisterSchoolPage from '../pages/auth/RegisterSchoolPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import PricingPage from '../pages/auth/PricingPage';
import HomePage from '../pages/dashboard/HomePage';
import SuperAdminPage from '../pages/admin/SuperAdminPage';
import TenantManagementPage from '../pages/admin/TenantManagementPage';
import SchoolRegistrationPage from '../pages/admin/SchoolRegistrationPage';
import SchoolAdminPage from '../pages/admin/SchoolAdminPage';
import StudentPage from '../pages/academic/StudentPage';
import StaffPage from '../pages/academic/StaffPage';
import AttendancePage from '../pages/academic/AttendancePage';
import FeesPage from '../pages/academic/FeesPage';
import ExamsPage from '../pages/academic/ExamsPage';
import ReportsPage from '../pages/academic/ReportsPage';
import SettingsPage from '../pages/admin/SettingsPage';
import TeacherPortalPage from '../pages/parent/TeacherPortalPage';
import StudentPortalPage from '../pages/student/StudentPortalPage';
import ParentPortalPage from '../pages/parent/ParentPortalPage';
import ProfilePage from '../pages/dashboard/ProfilePage';
import AccessDeniedPage from '../pages/shared/AccessDeniedPage';
import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  const { currentUser } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register-school" element={<RegisterSchoolPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/pricing" element={<PricingPage />} />
      <Route path="/access-denied" element={<AccessDeniedPage currentUser={currentUser} />} />

      <Route element={<ProtectedRoute currentUser={currentUser} allowedRoles={['super-admin', 'school-admin', 'teacher', 'student', 'parent']} />}>
        <Route path="/home" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      <Route element={<ProtectedRoute currentUser={currentUser} allowedRoles={['super-admin']} />}>
        <Route path="/super-admin" element={<SuperAdminPage />} />
        <Route path="/tenant-management" element={<TenantManagementPage />} />
        <Route path="/school-registration" element={<SchoolRegistrationPage />} />
      </Route>

      <Route element={<ProtectedRoute currentUser={currentUser} allowedRoles={['school-admin']} />}>
        <Route path="/school-admin" element={<SchoolAdminPage />} />
        <Route path="/students" element={<StudentPage />} />
        <Route path="/staff" element={<StaffPage />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/fees" element={<FeesPage />} />
        <Route path="/exams" element={<ExamsPage />} />
        <Route path="/reports" element={<ReportsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      <Route element={<ProtectedRoute currentUser={currentUser} allowedRoles={['teacher']} />}>
        <Route path="/teacher-portal" element={<TeacherPortalPage />} />
      </Route>

      <Route element={<ProtectedRoute currentUser={currentUser} allowedRoles={['student']} />}>
        <Route path="/student-portal" element={<StudentPortalPage />} />
      </Route>

      <Route element={<ProtectedRoute currentUser={currentUser} allowedRoles={['parent']} />}>
        <Route path="/parent-portal" element={<ParentPortalPage />} />
      </Route>
    </Routes>
  );
}

export default AppRoutes;
