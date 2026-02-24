import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { jwtDecode } from 'jwt-decode';

interface AdminPermissions {
  canVerifyMembers: boolean;
  canVerifyClients: boolean;
  canResetPasswords: boolean;
  canManageContent: boolean;
  canManageEvents: boolean;
  canManageAdmins: boolean;
  canExportData: boolean;
  canAccessReports: boolean;
}

interface AdminUser {
  id: string;
  username: string;
  fullName: string;
  role: string;
  mustChangePassword: boolean;
  permissions: AdminPermissions;
}

interface AdminAuthState {
  admin: AdminUser | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setAuth: (admin: AdminUser, accessToken: string) => void;
  logout: () => void;
  checkAuth: () => void;
  hasPermission: (permission: keyof AdminPermissions) => boolean;
}

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true,

      setAuth: (admin, accessToken) => {
        set({ admin, accessToken, isAuthenticated: true, isLoading: false });
      },

      logout: () => {
        set({
          admin: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
        if (typeof window !== 'undefined') {
          window.location.href = '/admin/login';
        }
      },

      checkAuth: () => {
        const { accessToken } = get();
        if (!accessToken) {
          set({ isLoading: false, isAuthenticated: false });
          return;
        }
        try {
          const decoded: any = jwtDecode(accessToken);
          if (decoded.exp * 1000 < Date.now()) {
            get().logout();
          } else {
            set({ isLoading: false, isAuthenticated: true });
          }
        } catch {
          get().logout();
        }
      },

      hasPermission: (permission) => {
        const { admin } = get();
        if (!admin) return false;
        if (admin.role === 'SUPER_ADMIN') return true;
        return admin.permissions?.[permission] ?? false;
      },
    }),
    {
      name: 'urafd-admin-auth',
      storage: createJSONStorage(() => {
        if (typeof window !== 'undefined') return localStorage;
        return {
          getItem: () => null,
          setItem: () => {},
          removeItem: () => {},
        };
      }),
      partialize: (state) => ({
        admin: state.admin,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);