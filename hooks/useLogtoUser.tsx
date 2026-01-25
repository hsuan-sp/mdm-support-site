"use client";
import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

interface LogtoUser {
  sub: string;
  email?: string;
  name?: string;
}

interface UserContextType {
  user: LogtoUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (redirectPath?: string) => void;
  signOut: () => void;
  revalidate: () => Promise<void>; // 新增：手動刷新使用者狀態
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<{user: LogtoUser | null, auth: boolean}>({ user: null, auth: false });
  const [isLoading, setIsLoading] = useState(true);
  const hasFetched = useRef(false);

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    try {
      // 確保路徑與你的 API 檔案結構一致 (app/api/logto/user/route.ts)
      const res = await fetch("/api/logto/user", {
        cache: 'no-store', // Next.js 16 強制不快取驗證請求
      }); 
      if (!res.ok) throw new Error("Unauthorized");
      const json = await res.json();
      setData({ user: json.user || null, auth: !!json.isAuthenticated });
    } catch (err) {
      setData({ user: null, auth: false });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchUser();
      hasFetched.current = true;
    }
  }, [fetchUser]);

  const signIn = (redirectPath?: string) => {
    // 💡 關鍵修正：Next.js 16 下，確保拿到的是絕對路徑的 pathname
    // 如果沒傳，則抓當前 window.location.pathname
    const path = redirectPath || window.location.pathname;
    
    // 強制導向到 API Route，這會觸發我們手動拼湊 redirect_uri 的後端邏輯
    const target = `/api/logto/sign-in?redirect=${encodeURIComponent(path)}`;
    window.location.href = target;
  };

  const signOut = () => {
    window.location.href = '/api/logto/sign-out';
  };

  return (
    <UserContext.Provider value={{ 
      user: data.user, 
      isAuthenticated: data.auth,
      isLoading, 
      signIn, 
      signOut,
      revalidate: fetchUser
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) throw new Error("useUser must be used within UserProvider");
  return context;
};