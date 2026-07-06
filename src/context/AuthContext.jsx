import { createContext, useContext, useMemo, useState } from 'react';
import { users } from '../mockupData/mockupData';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    if (typeof window === 'undefined') {
      return null;
    }

    const savedUser = window.localStorage.getItem('educore-user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (email, password) => {
    const user = users.find((entry) => entry.email.toLowerCase() === email.toLowerCase() && entry.password === password);

    if (!user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    setCurrentUser(user);
    window.localStorage.setItem('educore-user', JSON.stringify(user));
    return { success: true, user };
  };

  const logout = () => {
    setCurrentUser(null);
    window.localStorage.removeItem('educore-user');
  };

  const value = useMemo(() => ({ currentUser, login, logout }), [currentUser]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
