import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
  isAuthenticated: boolean;
  user: string | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: false,
      user: null,
      login: (username: string, password: string) => {
        const trimmedUser = username.trim();
        const trimmedPassword = password.trim();

        if (!trimmedUser || !trimmedPassword) {
          return false;
        }

        set({
          isAuthenticated: true,
          user: trimmedUser,
        });

        return true;
      },
      logout: () =>
        set({
          isAuthenticated: false,
          user: null,
        }),
    }),
    {
      name: 'findmyspot-auth',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
    }
  )
);


