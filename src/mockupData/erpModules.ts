export interface ErpModule {
  id: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  highlights: string[];
  image: string;
}

export const erpModules: ErpModule[] = [
  {
    id: 'admissions-registration',
    title: 'Admissions and Registration',
    shortDescription: 'Digitize lead capture, enquiry tracking, and student onboarding.',
    longDescription: 'Manage the full admission journey from first enquiry to confirmed registration with approval checkpoints, document tracking, and automated communication templates.',
    highlights: ['Online enquiry workflow', 'Application to admission conversion pipeline', 'Document and compliance tracking'],
    image: '/images/modules/AdmissionButton.png',
  },
  {
    id: 'student-lifecycle',
    title: 'Student Lifecycle Management',
    shortDescription: 'Maintain one source of truth for student profile and progression.',
    longDescription: 'Track student records across grade movement, academic history, transport, health references, and family context so teams stay aligned end to end.',
    highlights: ['Central student profile', 'Promotion and progression controls', 'Academic and profile history'],
    image: '/images/modules/StudentRecordsButton.png',
  },
  {
    id: 'staff-management',
    title: 'Staff Management',
    shortDescription: 'Manage staff records, assignments, and workforce operations.',
    longDescription: 'Maintain complete staff profiles, role assignments, and workload accountability to keep school administration aligned and efficient.',
    highlights: ['Centralized staff records', 'Role and responsibility mapping', 'Workforce operational tracking'],
    image: '/images/modules/StaffManagementButton.png',
  },
  {
    id: 'timetable-operations',
    title: 'Timetable Operations',
    shortDescription: 'Plan and publish class timetables without schedule conflicts.',
    longDescription: 'Design, publish, and update timetable plans with substitution handling so daily classroom schedules remain predictable and optimized.',
    highlights: ['Timetable planning and publishing', 'Conflict-free schedule setup', 'Substitution management workflow'],
    image: '/images/modules/TimeTableButton.png',
  },
  {
    id: 'attendance-intelligence',
    title: 'Attendance Intelligence',
    shortDescription: 'Capture attendance quickly and surface actionable absentee trends.',
    longDescription: 'Record attendance by class and period, monitor irregular patterns, and trigger parent communication for at-risk attendance behavior.',
    highlights: ['Class and period attendance', 'Absence trend monitoring', 'Automated parent notifications'],
    image: '/images/modules/AttendanceButton.png',
  },
  {
    id: 'fees-billing-subscriptions',
    title: 'Fees, Billing, and Receipt Generation',
    shortDescription: 'Control fee structure, collections, and SaaS subscription alignment.',
    longDescription: 'Define fee plans, apply concessions, track overdue amounts, and align tenant subscription operations with school billing lifecycle needs.',
    highlights: ['Fee plan and installment setup', 'Collection and due monitoring', 'Subscription-aware tenant billing'],
    image: '/images/modules/FeesBillingButton.png',
  },
  {
    id: 'exams-reporting-analytics',
    title: 'Exams, Reporting, and Analytics',
    shortDescription: 'Plan assessments and convert marks into measurable insights.',
    longDescription: 'Manage exam schedules, capture marks, publish report cards, and present leadership analytics for academic improvement decisions.',
    highlights: ['Exam and assessment planning', 'Result publication workflow', 'Performance dashboards'],
    image: '/images/modules/ExaminationButton.png',
  },
  {
    id: 'portals',
    title: 'Parent, Teacher, and Student Portals',
    shortDescription: 'Give each stakeholder role-based access to daily school information.',
    longDescription: 'Provide personalized portal experiences for teachers, students, and parents with secure role-based visibility and contextual actions.',
    highlights: ['Role-specific portal experience', 'Communication and update visibility', 'Self-service access for stakeholders'],
    image: '/images/modules/AccountsButton.png',
  },
  {
    id: 'branding-tenant-control',
    title: 'White-label Branding and Tenant Control',
    shortDescription: 'Enable multi-tenant governance with school-specific brand identity.',
    longDescription: 'Configure school branding, tenant settings, and environment-level controls to run EduCore as a scalable subscription-based ERP platform.',
    highlights: ['Tenant branding controls', 'Multi-tenant governance', 'Platform-level configuration management'],
    image: '/images/modules/ReportsButton.png',
  },
];
