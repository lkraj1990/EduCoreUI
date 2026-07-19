export const users = [
  {
    id: 1,
    name: 'Aman Verma',
    email: 'superadmin@educore.com',
    role: 'super-admin',
    password: 'admin123',
    tenant: 'SaaS Platform',
  },
  {
    id: 2,
    name: 'Riya Shah',
    email: 'schooladmin@educore.com',
    role: 'school-admin',
    password: 'admin123',
    tenant: 'Bright Future School',
  },
  {
    id: 3,
    name: 'Nitin Rao',
    email: 'teacher@educore.com',
    role: 'teacher',
    password: 'admin123',
    tenant: 'Bright Future School',
  },
  {
    id: 4,
    name: 'Meera Joshi',
    email: 'student@educore.com',
    role: 'student',
    password: 'admin123',
    tenant: 'Bright Future School',
  },
  {
    id: 5,
    name: 'Karan Patel',
    email: 'parent@educore.com',
    role: 'parent',
    password: 'admin123',
    tenant: 'Bright Future School',
  },
];

export const navItems = [
  { to: '/', label: 'Home' },
  { to: '/login', label: 'Login' },
  { to: '/home', label: 'Home' },
  { to: '/register-school', label: 'Register School' },
  { to: '/forgot-password', label: 'Forgot Password' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/super-admin', label: 'Super Admin' },
  { to: '/plans', label: 'Create Plan' },
  { to: '/tenant-management', label: 'Tenant Mgmt' },
  { to: '/school-registration', label: 'School Registration' },
  { to: '/school-admin', label: 'School Admin' },
  { to: '/students', label: 'Student Mgmt' },
  { to: '/staff', label: 'Staff Mgmt' },
  { to: '/attendance', label: 'Attendance' },
  { to: '/fees', label: 'Fees' },
  { to: '/exams', label: 'Exams' },
  { to: '/reports', label: 'Reports' },
  { to: '/settings', label: 'Settings' },
  { to: '/teacher-portal', label: 'Teacher Portal' },
  { to: '/student-portal', label: 'Student Portal' },
  { to: '/parent-portal', label: 'Parent Portal' },
];

export const tenantRows = [
  {
    name: 'Bright Future School',
    plan: 'Premium',
    status: 'Active',
    domain: 'bright.edu',
    tenantId: '',
    subscriptionId: '',
    planId: '',
    subscriptionStatus: 'Not Linked',
    billingCycle: 'monthly',
    autoRenew: true,
  },
  {
    name: 'Green Valley Academy',
    plan: 'Enterprise',
    status: 'Pending',
    domain: 'greenvalley.edu',
    tenantId: '',
    subscriptionId: '',
    planId: '',
    subscriptionStatus: 'Not Linked',
    billingCycle: 'monthly',
    autoRenew: true,
  },
  {
    name: 'Ocean View High',
    plan: 'Basic',
    status: 'Active',
    domain: 'oceanview.edu',
    tenantId: '',
    subscriptionId: '',
    planId: '',
    subscriptionStatus: 'Not Linked',
    billingCycle: 'monthly',
    autoRenew: true,
  },
];

export const studentRows = [
  { name: 'Aarav Sharma', class: 'Grade 10', guardian: 'Pooja Sharma', status: 'Active' },
  { name: 'Mira Patel', class: 'Grade 9', guardian: 'Ravi Patel', status: 'Promoted' },
  { name: 'Zaid Khan', class: 'Grade 11', guardian: 'Nadia Khan', status: 'Active' },
];

export const staffRows = [
  { name: 'Neha Singh', role: 'Principal', department: 'Management', status: 'Active' },
  { name: 'Rahul Verma', role: 'Teacher', department: 'Science', status: 'Active' },
  { name: 'Kavita Rao', role: 'Accountant', department: 'Finance', status: 'On Leave' },
];

export const feeRows = [
  { student: 'Aarav Sharma', due: '$320', paid: '$320', balance: '$0' },
  { student: 'Mira Patel', due: '$280', paid: '$180', balance: '$100' },
  { student: 'Zaid Khan', due: '$400', paid: '$300', balance: '$100' },
];

export const schoolRegistrationRequests = [
  {
    id: 'north-star-academy',
    school: 'North Star Academy',
    admin: 'Ayesha Khan',
    adminEmail: 'admin@northstar.edu',
    adminMobile: '+91 98111 22334',
    plan: 'Premium',
    status: 'Pending',
    location: 'Gurugram, Haryana',
    strength: 1450,
    board: 'CBSE',
    submittedOn: '08 Jul 2026',
  },
  {
    id: 'lakeside-international',
    school: 'Lakeside International',
    admin: 'Sameer Rao',
    adminEmail: 'admin@lakeside.edu',
    adminMobile: '+91 98222 44556',
    plan: 'Enterprise',
    status: 'Pending',
    location: 'Pune, Maharashtra',
    strength: 2100,
    board: 'ICSE',
    submittedOn: '09 Jul 2026',
  },
];
