const SCHOOL_ADMIN_USERS_STORAGE_KEY = 'educore-school-admin-users';

export interface ProvisionedSchoolAdminUser {
  id: number;
  name: string;
  email: string;
  role: 'school-admin';
  password: string;
  tenant: string;
}

const canUseStorage = () => typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';

const readUsers = (): ProvisionedSchoolAdminUser[] => {
  if (!canUseStorage()) {
    return [];
  }

  try {
    const rawValue = window.localStorage.getItem(SCHOOL_ADMIN_USERS_STORAGE_KEY);
    if (!rawValue) {
      return [];
    }

    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeUsers = (users: ProvisionedSchoolAdminUser[]) => {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(SCHOOL_ADMIN_USERS_STORAGE_KEY, JSON.stringify(users));
};

export const schoolAdminProvisioningService = {
  list() {
    return readUsers();
  },
  getByEmail(email: string) {
    return readUsers().find((user) => user.email.toLowerCase() === email.toLowerCase()) || null;
  },
  upsert(payload: Omit<ProvisionedSchoolAdminUser, 'id' | 'role'> & { id?: number }) {
    const users = readUsers();
    const existing = users.find((user) => user.email.toLowerCase() === payload.email.toLowerCase());

    const nextUser: ProvisionedSchoolAdminUser = {
      id: existing?.id || payload.id || Date.now(),
      name: payload.name,
      email: payload.email,
      role: 'school-admin',
      password: payload.password,
      tenant: payload.tenant,
    };

    const nextUsers = users.filter((user) => user.email.toLowerCase() !== payload.email.toLowerCase());
    nextUsers.push(nextUser);
    writeUsers(nextUsers);

    return nextUser;
  },
};
