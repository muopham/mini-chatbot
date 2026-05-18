import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { auth } from "../auth";
import type { AuthState } from "@/types/store";
import { useChatStore } from "./useChatStore";
import { useFriendsStore } from "./useFriendsStore";

const clearLocalStorage = () => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth-storage");
  localStorage.removeItem("chat-storage");
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      user: null,
      loading: false,

      setAccessToken: (accessToken) => set({ accessToken }),

      clear: () => {
        set({ accessToken: null, user: null });
        clearLocalStorage();
        useChatStore.getState().reset();
        useFriendsStore.getState().reset();
      },

      signUp: async (email, password, displayName, username) => {
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
      signIn: async (username, password) => {
        try {
          set({ loading: true });

          clearLocalStorage();
          useChatStore.getState().reset();

          const { accessToken } = await auth.signIn(username, password);
          get().setAccessToken(accessToken);

          await get().fetchMe();
          useChatStore.getState().fetchConversation();

          const profile = get().user;
          toast.success(
            "Welcome " + (profile?.displayName ?? username) + " to ChatBot!"
          );
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

      fetchMe: async () => {
        try {
          set({ loading: true });
          const user = await auth.fetchMe();
          set({ user });
        } catch (error) {
          set({ user: null, accessToken: null });
          console.error("Fetch me error:", error);
          toast.error("Failed to fetch user info. Please log in again.");
          throw error;
        } finally {
          set({ loading: false });
        }
      },

      refresh: async () => {
        try {
          set({ loading: true });
          const { user, fetchMe, setAccessToken } = get();
          const accessToken = await auth.refresh();

          setAccessToken(accessToken);

          if (!user) {
            await fetchMe();
          }
        } catch (error) {
          console.error(error);
          toast.error("Session expired. Please log in again.");
          get().clear();
        } finally {
          set({ loading: false });
        }
      },

      updateProfile: async (
        displayName: string,
        bio?: string,
        avatarUrl?: string
      ) => {
        try {
          set({ loading: true });
          const { user } = get();
          if (!user?.id) throw new Error("Not authenticated");

          await auth.updateProfile(user.id, { displayName, bio, avatarUrl });

          await get().fetchMe();

          toast.success("Profile updated!");
        } catch (error) {
          console.error(error);
          toast.error("Failed to update profile.");
          throw error;
        } finally {
          set({ loading: false });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
