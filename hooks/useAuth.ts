"use client";
import { useState, useEffect, useCallback, useMemo } from "react";

export function useAuth() {
  const [user, setUser] = useState<string | null>(null);
  const [isGuest, setIsGuest] = useState(true);
  const [isChecking, setIsChecking] = useState(false);

  const isStaticPlatform = useMemo(() => {
    if (typeof window === "undefined") return false;
    return (
      window.location.hostname.endsWith(".github.io") ||
      (window.location.hostname.includes("localhost") === false &&
        window.location.hostname.includes("vercel.app") === false)
    );
  }, []);

  const checkAuth = useCallback(async () => {
    if (isStaticPlatform) {
      setUser("public@superinfo.com.tw");
      setIsGuest(false);
      return;
    }

    setIsChecking(true);
    try {
      const res = await fetch("/api/auth/me");
      if (res.ok) {
        const data = await res.json();
        if (data.email) {
          setUser(data.email);
          setIsGuest(false);
        } else {
          throw new Error("回應中無電子郵件資料");
        }
      } else {
        throw new Error("身分驗證失敗");
      }
    } catch (e) {
      console.log("身分驗證：進入訪客模式");
      setUser("guest@edu.tw");
      setIsGuest(true);
    } finally {
      setIsChecking(false);
    }
  }, [isStaticPlatform]);

  const logout = useCallback(() => {
    if (isStaticPlatform) return;
    if (isGuest) return;
    if (confirm("確定要登出系統嗎？")) {
      window.location.href = "/api/auth/logout";
    }
  }, [isGuest, isStaticPlatform]);

  const username = useMemo(() => {
    if (isStaticPlatform) return "Public Preview";
    if (!user) return "訪客";
    return user.split("@")[0];
  }, [user, isStaticPlatform]);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return {
    user,
    isGuest,
    isChecking,
    isStaticPlatform,
    username,
    checkAuth,
    logout,
  };
}
