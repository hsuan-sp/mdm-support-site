"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { isAuthorizedEmail } from "@/lib/auth";

interface LogtoUser {
  sub: string;
  email: string;
  isAuthenticated: boolean;
}

interface UserContextType {
  user: LogtoUser | null;
  isLoading: boolean;
  isSignedIn: boolean;
  isAuthorized: boolean;
  signIn: () => void;
  signOut: () => void;
  recheck: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<LogtoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  const checkAuth = useCallback(async () => {
    try {
      const res = await fetch("/api/logto/user", { cache: 'no-store' });
      if (res.ok) {
        const userData = await res.json();
        if (userData.isAuthenticated && userData.email) {
          setUser(userData);
        } else {
          setUser(null);
        }
      }
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      checkAuth();
      hasFetched.current = true;
    }
  }, [checkAuth]);

  const signIn = () => (window.location.href = "/api/logto/sign-in");
  const signOut = () => (window.location.href = "/api/logto/sign-out");

  const value = {
    user,
    isLoading,
    isSignedIn: !!user?.isAuthenticated,
    isAuthorized: user ? isAuthorizedEmail(user.email) : false,
    signIn,
    signOut,
    recheck: checkAuth,
  };

  return <UserContext.Provider value={ value }> { children } </UserContext.Provider>;
};

// 匯出 Hook 供組件使用
export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}