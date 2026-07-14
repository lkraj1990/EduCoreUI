import { createContext, useContext, useMemo, useState } from 'react';
import { users } from '../mockupData/mockupData';
import {
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

  const login = (email, password, token = '') => {
    const user = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password);

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    setCurrentUser(user);
    setStoredUser(user);

    const trimmedToken = token.trim();
    if (trimmedToken) {
      setAuthToken(trimmedToken);
      setAuthTokenState(trimmedToken);
    }

    return { success: true, user };
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
