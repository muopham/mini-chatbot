import type { User } from "./user";

export interface AuthState {
  accessToken: string | null;
  user: User | null;
  loading: boolean;

  setAccessToken: (accessToken: string | null) => void;
  clear: () => void;
  signUp: (
    email: string,
    password: string,
    displayName: string,
    username: string
  ) => Promise<void>;
  signIn: (username: string, password: string) => Promise<void>;
  logOut: () => Promise<void>;
  fetchMe: () => Promise<void>;
  refresh: () => Promise<void>;
}
