import api from "./axios";
import type { User } from "@/types/user";

export const auth = {
  signUp: async (
    email: string,
    password: string,
    displayName: string,
    username: string
  ) => {
    const response = await api.post(
      "/auth/register",
      {
        email,
        password,
        displayName,
        username,
      },
      { withCredentials: true }
    );
    return response.data;
  },

  signIn: async (username: string, password: string) => {
    const response = await api.post(
      "/auth/login",
      { username, password },
      { withCredentials: true }
    );
    return response.data;
  },

  refresh: async () => {
    const res = await api.post("/auth/refresh", { withCredentials: true });
    return res.data.accessToken;
  },

  fetchMe: async () => {
    const res = await api.get("/auth/me", { withCredentials: true });
    return res.data;
  },

  logOut: async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
  },
};
