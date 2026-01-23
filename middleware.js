export default async function middleware(req) {
  const url = new URL(req.url);
  const { pathname } = url;

  // 1. 定義公開路徑 (不需驗證)
  // 包含靜態內容, login 頁面, 與 auth API
  const isPublicAsset = pathname.match(
    /\.(css|js|png|jpg|jpeg|gif|ico|svg|woff2?|json|jpeg)$/
  );
  const isLoginPage = pathname === "/login" || pathname === "/login.html";
  const isAuthApi =
    pathname.startsWith("/api/auth") || pathname.startsWith("/auth");

  if (isPublicAsset || isLoginPage || isAuthApi) {
    return; // 繼續處理請求 (Next)
  }

  // 2. 檢查驗證令牌 (從 Header 抓取 Cookie)
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.match(/sb-access-token=([^;]+)/)?.[1];

  if (!token) {
    return Response.redirect(new URL("/login", req.url));
  }

  // 3. 驗證 Token 合法性 (向 Supabase 確認)
  try {
    const SB_URL = process.env.SUPABASE_URL.replace(/\/$/, "");
    const SB_ANON = process.env.SUPABASE_ANON_KEY;

    const res = await fetch(`${SB_URL}/auth/v1/user`, {
      headers: { Authorization: `Bearer ${token}`, apikey: SB_ANON },
    });

    if (!res.ok) {
      // Token 無效，清除 Cookie 並導向登入
      const response = Response.redirect(new URL("/login", req.url));
      response.headers.append(
        "Set-Cookie",
        "sb-access-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
      );
      return response;
    }

    return; // 驗證通過，繼續處理
  } catch (e) {
    console.error("Middleware Auth Error:", e);
    return; // 發生網路錯誤時暫時允許通過，避免服務中斷
  }
}

// 設定 Middleware 攔截範圍
export const config = {
  matcher: ["/((?!_next|favicon.ico).*)"],
};
