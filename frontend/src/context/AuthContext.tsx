// src/context/AuthContext.tsx
// Holds the current user's login state app-wide, so any component
// can check "am I logged in / what's my role" without prop-drilling.
// This file exports ONLY the AuthProvider component (Fast Refresh requirement).

import { useState, useEffect, type ReactNode } from "react";
import * as authApi from "../api/auth";
import { AuthContext, type User } from "./authContextValue";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    let cancelled = false;

    if (!token) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronous early-exit guard, no async work needed here
      setLoading(false);
      return;
    }

    authApi
      .getMe()
      .then((res) => {
        if (!cancelled) setUser(res.data);
      })
      .catch(() => {
        if (!cancelled) localStorage.removeItem("access_token");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  
async function loginUser(email: string, password: string) {
  const res = await authApi.login(email, password);
  localStorage.setItem("access_token", res.data.access_token);
  localStorage.setItem("refresh_token", res.data.refresh_token);
  const me = await authApi.getMe();
  setUser(me.data);
  return me.data;  // ADDED
}
  function logoutUser() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}