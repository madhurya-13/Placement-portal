// src/context/authContextValue.ts
// The raw context object lives here — separated from AuthContext.tsx
// so that file can export ONLY the AuthProvider component (required
// for Vite's Fast Refresh to work cleanly).

import { createContext } from "react";

export interface User {
  id: number;
  email: string;
  role: string;
}

export interface AuthContextType {
  user: User | null;
  loading: boolean;
  loginUser: (email: string, password: string) => Promise<User>;
  logoutUser: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);