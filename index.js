// 輔助函式：處理 Base64URL 與標準 Base64 解碼
function base64ToBytes(str) {
  let b64 = str.replace(/-/g, '+').replace(/_/g, '/');
  // 補足 Base64 必備的等號
  while (b64.length % 4) b64 += '=';
  const binaryString = atob(b64);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// 輔助函式：驗證 JWT 簽章 (專為 Supabase HS256 設計)
async function verifyJWT(token, secret) {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const [headerB64, payloadB64, signatureB64] = parts;
    const encoder = new TextEncoder();
    const data = encoder.encode(`${headerB64}.${payloadB64}`);
    
    // 重要：Supabase 的 JWT Secret 通常是 Base64 編碼的，必須解碼為原始 Bytes
    let keyBytes;
    try {
      keyBytes = base64ToBytes(secret);
    } catch (e) {
      keyBytes = encoder.encode(secret); // 如果不是 Base64 格式，回退到純文字編碼
    }

    const key = await crypto.subtle.importKey(
      "raw", keyBytes,
      { name: "HMAC", hash: "SHA-256" },
      false, ["verify"]
    );

    const signature = base64ToBytes(signatureB64);
    const isValid = await crypto.subtle.verify("HMAC", key, signature, data);
    
    if (!isValid) {
      console.log("[Auth] JWT 簽章驗證無效 (可能是 Secret 不匹配)");
      return null;
    }

    const payload = JSON.parse(new TextDecoder().decode(base64ToBytes(payloadB64)));
    if (payload.exp && Math.floor(Date.now() / 1000) > payload.exp) {
      console.log("[Auth] JWT 已過期");
      return null;
    }

    return payload;
  } catch (err) {
    console.error(`[JWT Error] ${err.message}`);
    return null;
  }
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cookie = request.headers.get("Cookie") || "";
    
    // 精簡 URL (移除斜槓)
    const supabaseUrl = env.SUPABASE_URL?.replace(/\/$/, "");

    // --- 1. API 路由優先 ---
    
    // 健康檢查
    if (url.pathname === "/auth/health") {
      try {
        const res = await fetch(`${supabaseUrl}/auth/v1/health`, { headers: { "apikey": env.SUPABASE_ANON_KEY } });
        return new Response(JSON.stringify({ status: res.ok ? "online" : "error" }), { headers: { "Content-Type": "application/json" } });
      } catch (e) { return new Response(JSON.stringify({ status: "offline" }), { status: 200 }); }
    }

    // 發送 OTP
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

    // 驗證 / Session
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
            headers: { 
              "Content-Type": "application/json", 
              "apikey": env.SUPABASE_ANON_KEY, 
              "Authorization": `Bearer ${env.SUPABASE_SERVICE_ROLE_KEY}`,
              "Prefer": "return=minimal"
            },
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

    // --- 2. 登入狀態檢查 ---
    const tokenMatch = cookie.match(/sb-access-token=([^;]+)/);
    let user = null;
    if (tokenMatch && env.JWT_SECRET) {
       user = await verifyJWT(tokenMatch[1], env.JWT_SECRET);
    }
    const isAuthenticated = !!user;

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
