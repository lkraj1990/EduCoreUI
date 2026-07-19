import { createContext, useContext, useMemo, useState } from 'react';
import { schoolAdminProvisioningService } from '../services/schoolAdminProvisioningService';
import {
  authService,
  clearAuthToken,
  clearStoredUser,
  getAuthToken,
  getStoredUser,
  setAuthToken,
  setStoredUser,
} from '../services';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => getStoredUser());
  const [authToken, setAuthTokenState] = useState(() => getAuthToken());

  const login = async (username, password) => {
    try {
      const { token, user } = await authService.login({ username, password });

      setCurrentUser(user);
      setStoredUser(user);
      setAuthToken(token);
      setAuthTokenState(token);

      return { success: true, user };
    } catch (error) {
      const provisionedUsers = schoolAdminProvisioningService.list();
      const provisionedUser = provisionedUsers.find((entry) => {
        const matchesEmail = entry.email.toLowerCase() === String(username || '').toLowerCase();
        return matchesEmail && entry.password === password;
      });

      if (provisionedUser) {
        setCurrentUser(provisionedUser);
        setStoredUser(provisionedUser);

        return { success: true, user: provisionedUser };
      }

      const errorMessage = error instanceof Error ? error.message : 'Invalid username or password.';
      return { success: false, error: errorMessage };
    }
  };

  const updateAuthToken = (token) => {
    const trimmedToken = token.trim();
    setAuthToken(trimmedToken);
    setAuthTokenState(trimmedToken);
  };

  const logout = () => {
    setCurrentUser(null);
    setAuthTokenState('');
    clearStoredUser();
    clearAuthToken();
  };

  const value = useMemo(() => ({ currentUser, authToken, login, logout, setAuthToken: updateAuthToken }), [authToken, currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
}
