export const Roles = {
  Guest: 'guest',
  SuperAdmin: 'super-admin',
  SchoolAdmin: 'school-admin',
  Teacher: 'teacher',
  Student: 'student',
  Parent: 'parent',
}

export interface TopHeaderLink {
  DisplayName: string;
  Link: string;
  Roles: string[];
  IsActive: boolean;
}
export interface LinkDetails {
  DisplayName: string;
  Link: string;
}

export interface RoleBasedLinks {
  RoleName: string;
  Links: LinkDetails[];
  IsActive: boolean;
}

export const BaseLinks: RoleBasedLinks[] = [
  {
    RoleName: Roles.Guest,
    IsActive: true,
    Links: [
      { DisplayName: 'Home', Link: '/' },
      { DisplayName: 'Register now', Link: '/register-school' },
      { DisplayName: 'Pricing', Link: '/pricing' },
    ],
  },
  {
    RoleName: Roles.SuperAdmin,
    IsActive: true,
    Links: [
      { DisplayName: 'Home', Link: '/' },
      { DisplayName: 'Dashboard', Link: '/super-admin' },
      { DisplayName: 'Tenants', Link: '/tenant-management' },
      { DisplayName: 'Schools', Link: '/school-registration' },
      { DisplayName: 'Plans', Link: '/plans' },
    ],
  },
  {
    RoleName: Roles.SchoolAdmin,
    IsActive: true,
    Links: [
      { DisplayName: 'Home', Link: '/' },
      { DisplayName: 'Dashboard', Link: '/school-admin' },
      { DisplayName: 'MasterData', Link: '/master-data' },
      { DisplayName: 'Students', Link: '/students' },
      { DisplayName: 'Staff', Link: '/staff' },
      { DisplayName: 'Attendance', Link: '/attendance' },
      { DisplayName: 'Fees', Link: '/fees' },
      { DisplayName: 'Exams', Link: '/exams' },
      { DisplayName: 'Reports', Link: '/reports' },
    ],
  },
  {
    RoleName: Roles.Teacher,
    IsActive: true,
    Links: [
      { DisplayName: 'Home', Link: '/' },
      { DisplayName: 'Teaching Hub', Link: '/teacher-portal' },
      { DisplayName: 'MasterData', Link: '/master-data' },
      { DisplayName: 'Attendance', Link: '/attendance' },
      { DisplayName: 'Exams', Link: '/exams' },
      { DisplayName: 'Reports', Link: '/reports' },
    ],
  },
  {
    RoleName: Roles.Student,
    IsActive: true,
    Links: [
      { DisplayName: 'Home', Link: '/' },
      { DisplayName: 'My Learning', Link: '/student-portal' },
      { DisplayName: 'MasterData', Link: '/master-data' },
      { DisplayName: 'Fees', Link: '/fees' },
      { DisplayName: 'Exams', Link: '/exams' },
      { DisplayName: 'Reports', Link: '/reports' },
    ],
  },
  {
    RoleName: Roles.Parent,
    IsActive: true,
    Links: [
      { DisplayName: 'Home', Link: '/' },
      { DisplayName: 'Parent View', Link: '/parent-portal' },
      { DisplayName: 'MasterData', Link: '/master-data' },
      { DisplayName: 'Fees', Link: '/fees' },
      { DisplayName: 'Reports', Link: '/reports' },
    ],
  },
];