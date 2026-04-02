import api from "./axios";

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

  logOut: async () => {
    await api.post("/auth/logout", {}, { withCredentials: true });
  },
};
