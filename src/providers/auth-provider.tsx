'use client';

import { createContext, useContext, useEffect, ReactNode } from 'react';
import { useAuthStore } from '@/store/auth-store';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any;
  isAdmin: boolean;
  isMember: boolean;
  isClient: boolean;
  isVerified: boolean;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  isAdmin: false,
  isMember: false,
  isClient: false,
  isVerified: false,
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const { user, isAuthenticated, isLoading, checkAuth } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        isAdmin: user?.userType === 'ADMIN',
        isMember: user?.userType === 'MEMBER',
        isClient: user?.userType === 'CLIENT',
        isVerified: user?.verificationStatus === 'VERIFIED',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);