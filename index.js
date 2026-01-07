export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const SUPABASE_URL = "https://klcskeeqkwkakgzrewtn.supabase.co";
    // 提醒：請務必在 Cloudflare 帳號的 Variables 設定 SUPABASE_ANON_KEY 和 SUPABASE_SECRET_KEY
    const ANON_KEY = env.SUPABASE_ANON_KEY;
    const SECRET_KEY = env.SUPABASE_SECRET_KEY;

    // 1. 處理登入 API 請求
    if (url.pathname === "/auth/send-otp" && request.method === "POST") {
      const { email } = await request.json();
      
      // 【關鍵邏輯】網域過濾
      const domain = email.split('@')[1];
      const isAllowed = domain === 'superinfo.com.tw' || (domain && domain.endsWith('edu.tw'));
      
      if (!isAllowed) {
        return new Response(JSON.stringify({ error: "存取被拒：僅限特定單位郵件登入" }), {
          status: 403,
          headers: { "Content-Type": "application/json" }
        });
      }

      // 呼叫 Supabase 寄送 OTP
      const resp = await fetch(`${SUPABASE_URL}/auth/v1/otp`, {
        method: "POST",
        headers: { "apikey": ANON_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email, create_user: true })
      });
      return resp;
    }

    // 2. 處理驗證 OTP 請求
    if (url.pathname === "/auth/verify-otp" && request.method === "POST") {
      const { email, token } = await request.json();
      const resp = await fetch(`${SUPABASE_URL}/auth/v1/verify`, {
        method: "POST",
        headers: { "apikey": ANON_KEY, "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, type: "otp" })
      });

      const data = await resp.json();
      if (data.access_token) {
        // 【關鍵邏輯】登入成功，記錄到 Supabase 資料庫
        await fetch(`${SUPABASE_URL}/rest/v1/login_logs`, {
          method: "POST",
          headers: {
            "apikey": ANON_KEY,
            "Authorization": `Bearer ${SECRET_KEY}`,
            "Content-Type": "application/json",
            "Prefer": "return=minimal"
          },
          body: JSON.stringify({ email })
        });

        // 回傳帶有 Cookie 的回應，設定 7 天有效路徑
        return new Response(JSON.stringify({ success: true }), {
          headers: {
            "Content-Type": "application/json",
            "Set-Cookie": `sb-access-token=${data.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=604800`
          }
        });
      }
      return new Response(JSON.stringify(data), { status: resp.status });
    }

    // 3. 處理登出
    if (url.pathname === "/auth/logout") {
      return new Response(null, {
        status: 302,
        headers: {
          "Location": "/",
          "Set-Cookie": "sb-access-token=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0"
        }
      });
    }

    // 4. 檢查登入狀態 (Session Check)
    const cookie = request.headers.get("Cookie") || "";
    const tokenMatch = cookie.match(/sb-access-token=([^;]+)/);
    const hasToken = !!tokenMatch;

    // 如果沒有 Token 則顯示登入頁面
    if (!hasToken && url.pathname !== "/login") {
      return await env.ASSETS.fetch(new Request(new URL("/login.html", url.origin)));
    }

    // 5. 其他所有請求：交給 VitePress 靜態檔 (ASSETS)
    return await env.ASSETS.fetch(request);
  },
};
