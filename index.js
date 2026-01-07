// 輔助函式：處理 Base64URL 與標準 Base64 解碼
function base64ToBytes(str) {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (b64.length % 4) b64 += '=';
  const binaryString = atob(b64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// 輔助函式：嘗試使用不同的金鑰格式驗證 JWT
async function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [headerB64, payloadB64, signatureB64] = parts;
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    const signature = base64ToBytes(signatureB64);

    // 嘗試 1: 將 Secret 視為 Base64 解碼 (Supabase 預設)
    try {
      const keyBytes = base64ToBytes(secret);
      const key = await crypto.subtle.importKey(
        "raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
      );
      const isValid = await crypto.subtle.verify("HMAC", key, signature, data);
      if (isValid) {
        console.log("[Auth] JWT 驗證成功 (Base64 Mode)");
        return JSON.parse(new TextDecoder().decode(base64ToBytes(payloadB64)));
      }
    } catch (e) { /* 忽略格式錯誤，繼續嘗試下一種 */ }

    // 嘗試 2: 將 Secret 視為純文字 (舊版或自定義)
    try {
      const keyBytes = encoder.encode(secret);
      const key = await crypto.subtle.importKey(
        "raw", keyBytes, { name: "HMAC", hash: "SHA-256" }, false, ["verify"]
      );
      const isValid = await crypto.subtle.verify("HMAC", key, signature, data);
      if (isValid) {
        console.log("[Auth] JWT 驗證成功 (Plain Text Mode)");
        return JSON.parse(new TextDecoder().decode(base64ToBytes(payloadB64)));
      }
    } catch (e) { /* 忽略 */ }

    console.log("[Auth] JWT 簽章驗證失敗 (兩種格式皆無效)");
    return null;
  } catch (err) {
    console.error(`[JWT Error] ${err.message}`);
    return null;
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cookie = request.headers.get("Cookie") || "";
    const supabaseUrl = env.SUPABASE_URL?.replace(/\/$/, "");

    // --- 1. API 路由優先 ---
    if (url.pathname === "/auth/health") {
      try {
        const res = await fetch(`${supabaseUrl}/auth/v1/health`, { headers: { "apikey": env.SUPABASE_ANON_KEY } });
        return new Response(JSON.stringify({ status: res.ok ? "online" : "error" }), { headers: { "Content-Type": "application/json" } });
      } catch (e) { return new Response(JSON.stringify({ status: "offline" }), { status: 200 }); }
    }

    if (url.pathname === "/auth/otp" && request.method === "POST") {
      const { email } = await request.json();
      if (!email.endsWith("@superinfo.com.tw") && !email.endsWith(".edu.tw")) {
        return new Response(JSON.stringify({ error: "禁止登入" }), { status: 403 });
      }
      const redirectTo = `${url.origin}/login`;
      return await fetch(`${supabaseUrl}/auth/v1/otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "apikey": env.SUPABASE_ANON_KEY },
        body: JSON.stringify({ email, create_user: true, data: { redirect_to: redirectTo } })
      });
    }

    if ((url.pathname === "/auth/verify" || url.pathname === "/auth/session") && request.method === "POST") {
      const body = await request.json();
      let access_token, email;

      if (url.pathname === "/auth/session") {
        access_token = body.access_token;
        const user = await verifyJWT(access_token, env.JWT_SECRET);
        email = user ? user.email : null;
      } else {
        const res = await fetch(`${supabaseUrl}/auth/v1/verify`, {
          method: "POST",
          headers: { "Content-Type": "application/json", "apikey": env.SUPABASE_ANON_KEY },
          body: JSON.stringify({ email: body.email, token: body.token, type: "email" })
        });
        const data = await res.json();
        access_token = data.access_token;
        email = body.email;
      }

      if (access_token) {
        if (email) {
          ctx.waitUntil(fetch(`${supabaseUrl}/rest/v1/login_logs`, {
            method: "POST",
            headers: { "Content-Type": "application/json", "apikey": env.SUPABASE_ANON_KEY, "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`, "Prefer": "return=minimal" },
            body: JSON.stringify({ email })
          }));
        }
        return new Response(JSON.stringify({ success: true }), {
          status: 200,
          headers: { "Set-Cookie": `sb-access-token=${access_token}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=31536000` }
        });
      }
      return new Response(JSON.stringify({ error: "驗證失敗" }), { status: 401 });
    }

    // --- 2. 登入狀態檢查 (並記錄詳細除錯資訊) ---
    const tokenMatch = cookie.match(/sb-access-token=([^;]+)/);
    let user = null;
    if (tokenMatch && env.JWT_SECRET) {
       user = await verifyJWT(tokenMatch[1], env.JWT_SECRET);
    }
    const isAuthenticated = !!user;
    
    // 如果有 Token 但驗證失敗，印出 Log 以便除錯 (在 Dashboard 可見)
    if (tokenMatch && !user) {
        console.log("[Auth] Cookie 存在但 JWT 驗證失敗。請檢查 JWT_SECRET 是否正確。");
    }

    // --- 3. 路由重定向 ---
    if (isAuthenticated && url.pathname === "/login") {
      return Response.redirect(`${url.origin}/`, 302);
    }

    const isPublicAsset = url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff2?|json)$/) || url.pathname === "/login.html";
    if (!isAuthenticated && !isPublicAsset && url.pathname !== "/login") {
      return Response.redirect(`${url.origin}/login`, 302);
    }

    // --- 4. 返回資源 ---
    if (url.pathname === "/login") {
      const res = await env.ASSETS.fetch(new Request(new URL("/login.html", request.url)));
      return new Response(res.body, { headers: { "Content-Type": "text/html; charset=utf-8" } });
    }

    return await env.ASSETS.fetch(request);
  },
};
