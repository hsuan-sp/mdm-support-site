"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { isAuthorizedEmail } from "@/lib/auth";

interface LogtoUser {
  sub: string;
  username?: string;
  primaryEmail?: string;
  name?: string;
}

export function useUser() {
  const [user, setUser] = useState<LogtoUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/logto/user");
      if (res.ok) {
        const userData = await res.json();

        // 1. 偵錯日誌
        console.log("[Auth Hook Debug] User metadata received");

        // 2. 判定是否登入
        const isSignedIn = userData.isAuthenticated || !!userData.sub || !!userData.claims?.sub;

        if (isSignedIn) {
          // 3. 提取 Email
          const email = userData.claims?.email || userData.primaryEmail || userData.email || "";

          // 4. 只負責檢查並設定 User 狀態，不負責 router.push 跳轉
          if (isAuthorizedEmail(email)) {
            setUser(userData);
          } else {
            console.warn("[Auth Hook] 網域不符:", email);
            setUser(null);
          }
        } else {
          setUser(null);
        }
      } else {
        setUser(null);
      }
    } catch (error) {
      // 避免 NetworkError 噴出紅字錯誤
      if (error instanceof Error && error.name === 'AbortError') {
        console.log("[Auth Hook] Fetch aborted due to navigation.");
      } else {
        console.error("[Auth Hook] Check failed:", error);
      }
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = useCallback(async () => {
    window.location.href = "/api/logto/sign-in";
  }, []);

  const signOut = useCallback(async () => {
    window.location.href = "/api/logto/sign-out";
  }, []);

  return {
    user,
    isLoading,
    isSignedIn: !!user,
    signIn,
    signOut,
  };
}

export function useAuth() {
  const { user, isLoading } = useUser();

  return {
    userId: user?.sub || null,
    isLoaded: !isLoading,
    isSignedIn: !!user,
  };
}
