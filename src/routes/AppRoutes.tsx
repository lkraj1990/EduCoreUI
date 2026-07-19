import { Routes, Route } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginPage from '../pages/auth/LoginPage';
import RegisterSchoolPage from '../pages/auth/RegisterSchoolPage';
import SchoolRegistrationPaymentPage from '../pages/auth/SchoolRegistrationPaymentPage';
import SchoolPaymentGatewayPage from '../pages/auth/SchoolPaymentGatewayPage';
import PlanDetailsPage from '../pages/auth/PlanDetailsPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import PricingPage from '../pages/auth/PricingPage';
import HomePage from '../pages/dashboard/HomePage';
import SuperAdminPage from '../pages/admin/SuperAdminPage';
import CreatePlanPage from '../pages/admin/CreatePlanPage';
import TenantManagementPage from '../pages/admin/TenantManagementPage';
import AddTenantPage from '../pages/admin/AddTenantPage';
import CreateTenantSubscriptionPage from '../pages/admin/CreateTenantSubscriptionPage';
import GenerateInvoicePage from '../pages/admin/GenerateInvoicePage';
import TenantSubscriptionDetailsPage from '../pages/admin/TenantSubscriptionDetailsPage';
import SchoolRegistrationPage from '../pages/admin/SchoolRegistrationPage';
import SchoolRegistrationDetailsPage from '../pages/admin/SchoolRegistrationDetailsPage';
import SchoolAdminPage from '../pages/admin/SchoolAdminPage';
import StudentPage from '../pages/academic/StudentPage';
import StudentProfilePage from '../pages/student/StudentProfilePage';
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
import ModuleDescriptionPage from '../pages/shared/ModuleDescriptionPage';
import MasterDataPage from '../pages/admin/master-data/MasterDataPage';
import ProtectedRoute from './ProtectedRoute';
import { BaseLinks, Roles } from '../components/LinkRowData';

const activeRoleLinks = BaseLinks.filter((entry) => entry.IsActive);

const allAuthenticatedRoles = activeRoleLinks
  .filter((entry) => entry.RoleName !== Roles.Guest)
  .map((entry) => entry.RoleName);

const schoolEcosystemRoles = [Roles.SchoolAdmin, Roles.Teacher, Roles.Student, Roles.Parent];

const resolveAllowedRoles = (authPath: string) => {
  const normalizedPath = authPath.toLowerCase();

  return activeRoleLinks
    .filter((entry) => entry.RoleName !== Roles.Guest)
    .filter((entry) => entry.Links.some((link) => {
      const normalizedLink = link.Link.toLowerCase();

      if (normalizedPath === normalizedLink) {
        return true;
      }

      if (normalizedPath.startsWith(`${normalizedLink}/`) && normalizedLink !== '/') {
        return true;
      }

      return false;
    }))
    .map((entry) => entry.RoleName);
};

const publicRoutes = [
  { path: '/', element: <HomePage /> },
  { path: '/home', element: <HomePage /> },
  { path: '/login', element: <LoginPage /> },
  { path: '/register-school', element: <RegisterSchoolPage /> },
  { path: '/register-school/:schoolId/payment', element: <SchoolRegistrationPaymentPage /> },
  { path: '/register-school/:schoolId/payment/gateway', element: <SchoolPaymentGatewayPage /> },
  { path: '/register-school/plan-details', element: <PlanDetailsPage /> },
  { path: '/forgot-password', element: <ForgotPasswordPage /> },
  { path: '/pricing', element: <PricingPage /> },
  { path: '/erp-modules/:moduleId', element: <ModuleDescriptionPage /> },
];

const protectedRoutes = [
  { path: '/home', element: <HomePage />, allowedRoles: allAuthenticatedRoles },
  { path: '/profile', element: <ProfilePage />, allowedRoles: allAuthenticatedRoles },
  { path: '/student-profile/:studentId', element: <StudentProfilePage />, allowedRoles: allAuthenticatedRoles },
  { path: '/super-admin', element: <SuperAdminPage />, allowedRoles: resolveAllowedRoles('/super-admin') },
  { path: '/plans', element: <PricingPage />, allowedRoles: resolveAllowedRoles('/plans') },
  { path: '/super-admin/create-plan', element: <CreatePlanPage />, allowedRoles: resolveAllowedRoles('/super-admin') },
  { path: '/tenant-management', element: <TenantManagementPage />, allowedRoles: resolveAllowedRoles('/tenant-management') },
  { path: '/tenant-management/add', element: <AddTenantPage />, allowedRoles: resolveAllowedRoles('/tenant-management') },
  { path: '/tenant-management/:tenantLocalId/subscription', element: <TenantSubscriptionDetailsPage />, allowedRoles: resolveAllowedRoles('/tenant-management') },
  { path: '/tenant-management/:tenantLocalId/subscription/create', element: <CreateTenantSubscriptionPage />, allowedRoles: resolveAllowedRoles('/tenant-management') },
  { path: '/tenant-management/:tenantLocalId/subscription/:subscriptionId/invoice', element: <GenerateInvoicePage />, allowedRoles: resolveAllowedRoles('/tenant-management') },
  { path: '/school-registration', element: <SchoolRegistrationPage />, allowedRoles: resolveAllowedRoles('/school-registration') },
  { path: '/school-registration/:schoolId', element: <SchoolRegistrationDetailsPage />, allowedRoles: resolveAllowedRoles('/school-registration') },
  { path: '/school-admin', element: <SchoolAdminPage />, allowedRoles: resolveAllowedRoles('/school-admin') },
  { path: '/students', element: <StudentPage />, allowedRoles: resolveAllowedRoles('/students') },
  { path: '/staff', element: <StaffPage />, allowedRoles: resolveAllowedRoles('/staff') },
  { path: '/attendance', element: <AttendancePage />, allowedRoles: resolveAllowedRoles('/attendance') },
  { path: '/fees', element: <FeesPage />, allowedRoles: resolveAllowedRoles('/fees') },
  { path: '/exams', element: <ExamsPage />, allowedRoles: resolveAllowedRoles('/exams') },
  { path: '/reports', element: <ReportsPage />, allowedRoles: resolveAllowedRoles('/reports') },
  { path: '/settings', element: <SettingsPage />, allowedRoles: resolveAllowedRoles('/school-admin') },
  { path: '/teacher-portal', element: <TeacherPortalPage />, allowedRoles: resolveAllowedRoles('/teacher-portal') },
  { path: '/student-portal', element: <StudentPortalPage />, allowedRoles: resolveAllowedRoles('/student-portal') },
  { path: '/parent-portal', element: <ParentPortalPage />, allowedRoles: resolveAllowedRoles('/parent-portal') },
  { path: '/master-data', element: <MasterDataPage />, allowedRoles: schoolEcosystemRoles },
  { path: '/master-data/session', element: <MasterDataPage />, allowedRoles: schoolEcosystemRoles },
  { path: '/master-data/class', element: <MasterDataPage />, allowedRoles: schoolEcosystemRoles },
  { path: '/master-data/section', element: <MasterDataPage />, allowedRoles: schoolEcosystemRoles },
];

const AppRoutes = () => {
  const { currentUser } = useAuth();

  return (
    <Routes>
      {publicRoutes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}

      <Route path="/access-denied" element={<AccessDeniedPage currentUser={currentUser} />} />

      {protectedRoutes.map((route) => (
        <Route
          key={route.path}
          element={<ProtectedRoute currentUser={currentUser} allowedRoles={route.allowedRoles} />}
        >
          <Route path={route.path} element={route.element} />
        </Route>
      ))}
    </Routes>
  );
};

export default AppRoutes;