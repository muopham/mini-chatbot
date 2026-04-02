import { create } from "zustand";
import { toast } from "sonner";
import { auth } from "../auth";
import type { AuthState } from "@/types/store";

const ACCESS_TOKEN_COOKIE = "accessToken";

const setAccessTokenCookie = (token: string) => {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=${encodeURIComponent(token)}; path=/; SameSite=Lax`;
};

const clearAccessTokenCookie = () => {
  document.cookie = `${ACCESS_TOKEN_COOKIE}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: null,
  user: null,
  loading: false,
  clear: () => {
    clearAccessTokenCookie();
    set({ accessToken: null, user: null });
  },

  signUp: async (
    email: string,
    password: string,
    displayName: string,
    username: string
  ) => {
    try {
      set({ loading: true });

      await auth.signUp(email, password, displayName, username);
      toast.success("Account created successfully! Please log in.");
    } catch (error) {
      console.error("Signup error:", error);
      toast.error("Failed to create account. Please try again.");
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  signIn: async (username: string, password: string) => {
    try {
      set({ loading: true });

      const { accessToken, user } = await auth.signIn(username, password);
      setAccessTokenCookie(accessToken);
      set({ accessToken, user });

      toast.success("Welcome " + user.displayName + " to ChatBot!");
    } catch (error) {
      console.error("Signin error:", error);
      toast.error(
        "Failed to login. Please check your credentials and try again."
      );
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logOut: async () => {
    try {
      await auth.logOut();
      get().clear();
      toast.success("You have been logged out.");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
      throw error;
    }
  },
}));
