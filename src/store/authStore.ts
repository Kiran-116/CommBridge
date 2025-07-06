import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
}

interface AuthActions {
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updates: Partial<User>) => void;
  setLoading: (loading: boolean) => void;
  refreshToken: () => Promise<void>;
}

type AuthStore = AuthState & AuthActions;

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      // Initial state - with demo user for development
      user: {
        id: "demo-user-1",
        email: "demo@commbridge.com",
        username: "demo_user",
        firstName: "Alex",
        lastName: "Johnson",
        avatar: "",
        level: "intermediate" as const,
        joinDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        lastActive: new Date(),
        preferences: {
          theme: "system" as const,
          language: "en",
          notifications: {
            email: true,
            push: true,
            reminders: true,
          },
          voice: {
            speed: 1.0,
            pitch: 1.0,
            volume: 0.8,
          },
          privacy: {
            shareProgress: true,
            allowRecordings: true,
          },
        },
        stats: {
          totalStudyTime: 1250, // in minutes
          wordsLearned: 89,
          conversationsCompleted: 23,
          streakDays: 4,
          level: "intermediate" as const,
          xp: 1850,
          badges: [],
        },
      },
      isAuthenticated: true,
      isLoading: false,
      token: "demo-token",

      // Actions
      login: (user: User, token: string) => {
        set({
          user,
          token,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
        });
        // Clear any stored data
        localStorage.removeItem("auth-storage");
      },

      updateUser: (updates: Partial<User>) => {
        const { user } = get();
        if (user) {
          set({
            user: { ...user, ...updates },
          });
        }
      },

      setLoading: (loading: boolean) => {
        set({ isLoading: loading });
      },

      refreshToken: async () => {
        const { token } = get();
        if (!token) return;

        try {
          // This would typically make an API call to refresh the token
          // For now, we'll just simulate it
          set({ isLoading: false });
        } catch (error) {
          console.error("Token refresh failed:", error);
          get().logout();
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
