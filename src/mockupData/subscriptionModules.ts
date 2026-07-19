export interface SubscriptionModule {
  id: string;
  title: string;
  summary: string;
  category: string;
}

const moduleCatalog: Record<string, SubscriptionModule> = {
  students: {
    id: 'students',
    title: 'Student Management',
    summary: 'Student profiles, enrollment lifecycle, and class allocation.',
    category: 'Academic Core',
  },
  staff: {
    id: 'staff',
    title: 'Staff Management',
    summary: 'Staff records, role assignment, and department mapping.',
    category: 'Academic Core',
  },
  attendance: {
    id: 'attendance',
    title: 'Attendance Tracking',
    summary: 'Classwise attendance with daily and trend insights.',
    category: 'Academic Core',
  },
  fees: {
    id: 'fees',
    title: 'Fees and Billing',
    summary: 'Fee dues, collections, and balance monitoring.',
    category: 'Finance',
  },
  exams: {
    id: 'exams',
    title: 'Exams and Assessments',
    summary: 'Exam setup, marks entry, and performance snapshots.',
    category: 'Academic Core',
  },
  reports: {
    id: 'reports',
    title: 'Reports and Analytics',
    summary: 'Operational and academic reporting dashboards.',
    category: 'Insights',
  },
  communication: {
    id: 'communication',
    title: 'Communication Center',
    summary: 'Parent and staff notifications over configured channels.',
    category: 'Engagement',
  },
};

const subscriptionPlanModules: Record<string, string[]> = {
  basic: ['students', 'staff', 'attendance', 'fees'],
  premium: ['students', 'staff', 'attendance', 'fees', 'exams', 'reports'],
  enterprise: ['students', 'staff', 'attendance', 'fees', 'exams', 'reports', 'communication'],
};

export const getMockModulesForSubscription = (planNameOrId?: string) => {
  const normalizedPlan = String(planNameOrId || '').trim().toLowerCase();

  const matchedKey = Object.keys(subscriptionPlanModules).find((planKey) => {
    return normalizedPlan.includes(planKey);
  }) || 'basic';

  return subscriptionPlanModules[matchedKey]
    .map((moduleId) => moduleCatalog[moduleId])
    .filter(Boolean);
};
