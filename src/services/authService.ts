import { ApiError, apiClient } from './apiClient';

type LoginPayload = {
  username: string;
  password: string;
};

type AuthUser = {
  id: string | number;
  name: string;
  email: string;
  role: string;
  tenant: string;
};

type AuthLoginResult = {
  token: string;
  user: AuthUser;
};

const loginPaths = [
  import.meta.env.VITE_AUTH_LOGIN_PATH || '/user-auth/login',
];

const decodeJwtPayload = (token: string) => {
  try {
    const parts = token.split('.');
    if (parts.length < 2) {
      return null;
    }

    const normalized = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const padded = normalized + '='.repeat((4 - (normalized.length % 4 || 4)) % 4);
    const payload = atob(padded);
    return JSON.parse(payload);
  } catch {
    return null;
  }
};

const pickFirstValue = (sources: Array<any>, keys: string[]) => {
  for (const source of sources) {
    if (!source || typeof source !== 'object') {
      continue;
    }

    for (const key of keys) {
      const value = source[key];
      if (value !== undefined && value !== null && String(value).trim() !== '') {
        return value;
      }
    }
  }

  return '';
};

const normalizeRole = (roleValue: string) => {
  const normalizedRole = String(roleValue || '').trim().toLowerCase();

  if (['super-admin', 'superadmin', 'super_admin'].includes(normalizedRole)) {
    return 'super-admin';
  }

  if (['school-admin', 'schooladmin', 'school_admin'].includes(normalizedRole)) {
    return 'school-admin';
  }

  if (['teacher', 'student', 'parent'].includes(normalizedRole)) {
    return normalizedRole;
  }

  return 'school-admin';
};

const normalizeAuthResponse = (response: any, loginIdentifier: string): AuthLoginResult => {
  const normalizedRawResponse = typeof response === 'string'
    ? (() => {
      try {
        return JSON.parse(response);
      } catch {
        return response;
      }
    })()
    : response;

  if (typeof normalizedRawResponse === 'string' && normalizedRawResponse.trim()) {
    const rawToken = normalizedRawResponse.trim();
    return {
      token: rawToken,
      user: {
        id: loginIdentifier,
        name: loginIdentifier,
        email: loginIdentifier,
        role: 'school-admin',
        tenant: 'EduCore',
      },
    };
  }

  const responseData = normalizedRawResponse?.data || normalizedRawResponse?.result || normalizedRawResponse;
  const userRecord = responseData?.user || responseData?.profile || responseData;

  const token = String(
    pickFirstValue([
      responseData,
      response,
      userRecord,
    ], ['accessToken', 'token', 'jwt', 'jwtToken']) || '',
  ).trim();

  if (!token) {
    throw new Error('Login succeeded but token was not returned by API.');
  }

  const jwtPayload = decodeJwtPayload(token) || {};
  const role = normalizeRole(String(
    pickFirstValue([
      userRecord,
      responseData,
      jwtPayload,
    ], ['role', 'userRole', 'roles', 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role']) || '',
  ));

  const email = String(
    pickFirstValue([
      userRecord,
      responseData,
      jwtPayload,
    ], ['email', 'userEmail', 'upn', 'unique_name', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress']) ||
      loginIdentifier ||
      '',
  ).trim();

  const id = String(
    pickFirstValue([
      userRecord,
      responseData,
      jwtPayload,
    ], ['id', 'userId', 'sub', 'nameid', 'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']) || email,
  );

  const name = String(
    pickFirstValue([
      userRecord,
      responseData,
      jwtPayload,
    ], ['name', 'fullName', 'displayName', 'given_name']) || email,
  ).trim();

  const tenant = String(
    pickFirstValue([
      userRecord,
      responseData,
      jwtPayload,
    ], ['tenant', 'tenantName', 'schoolName', 'org']) || 'EduCore',
  );

  return {
    token,
    user: {
      id,
      name,
      email,
      role,
      tenant,
    },
  };
};

export const authService = {
  async login(payload: LoginPayload) {
    const requestBody = {
      username: payload.username,
      password: payload.password,
    };

    let lastError: unknown = null;

    for (const path of loginPaths) {
      try {
        const response = await apiClient.post(path, requestBody, {
          withoutAuth: true,
          headers: {
            accept: 'text/plain',
          },
        });
        return normalizeAuthResponse(response, payload.username);
      } catch (error) {
        lastError = error;
        if (error instanceof ApiError && [404, 405].includes(error.status) && import.meta.env.VITE_AUTH_LOGIN_PATH) {
          continue;
        }

        throw error;
      }
    }

    throw lastError || new Error('Unable to reach login endpoint.');
  },
};
