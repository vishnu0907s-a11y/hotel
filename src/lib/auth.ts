// Admin Authentication & Session Management

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: "admin" | "manager" | "sommelier";
}

const ADMIN_STORAGE_KEY = "aurelia_admin_session";

export const AuthService = {
  getStoredSession(): AdminUser | null {
    if (typeof window === "undefined") return null;
    try {
      const data = window.localStorage.getItem(ADMIN_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  setSession(user: AdminUser): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(user));
    } catch (err) {
      console.error("Failed to persist session", err);
    }
  },

  clearSession(): void {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.removeItem(ADMIN_STORAGE_KEY);
    } catch (err) {
      console.error("Failed to clear session", err);
    }
  },

  isAuthenticated(): boolean {
    return Boolean(this.getStoredSession());
  },
};

