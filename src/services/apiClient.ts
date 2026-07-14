import { API_BASE_URL } from './apiConfig';
import { getAuthToken } from './authStorage';

const buildUrl = (path, query) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = new URL(`${API_BASE_URL}${normalizedPath}`);

  if (query) {
    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.set(key, String(value));
      }
    });
  }

  return url.toString();
};

const parseResponse = async (response) => {
  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type') || '';
  if (contentType.includes('application/json') || contentType.includes('text/json')) {
    return response.json();
  }

  return response.text();
};

export class ApiError extends Error {
  constructor(message, status, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export const apiClient = {
  async request(path, options = {}) {
    const { query, body, headers, withoutAuth = false, ...rest } = options;
    const authToken = withoutAuth ? '' : getAuthToken();
    const requestHeaders = {
      Accept: 'application/json',
      ...(body ? { 'Content-Type': 'application/json' } : {}),
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...headers,
    };

    const response = await fetch(buildUrl(path, query), {
      ...rest,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    const data = await parseResponse(response);

    if (!response.ok) {
      const message = typeof data === 'string' && data ? data : `Request failed with status ${response.status}`;
      throw new ApiError(message, response.status, data);
    }

    return data;
  },
  get(path, options) {
    return this.request(path, { ...options, method: 'GET' });
  },
  post(path, body, options) {
    return this.request(path, { ...options, method: 'POST', body });
  },
  put(path, body, options) {
    return this.request(path, { ...options, method: 'PUT', body });
  },
  patch(path, body, options) {
    return this.request(path, { ...options, method: 'PATCH', body });
  },
};
