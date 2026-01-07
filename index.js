export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const cookie = request.headers.get("Cookie") || "";
    
    // 檢查是否已登入
    const isAuthenticated = cookie.includes("sb-access-token");

    console.log(`[Worker] 請求路徑: ${url.pathname}, 登入狀態: ${isAuthenticated}`);

    // --- 1. 絕對放行的白名單 ---
    // API、登入頁、Logo、必要的靜態資產 (CSS/JS)
    const isAuthApi = url.pathname.startsWith("/auth/");
    const isLoginPage = url.pathname === "/login";
    const isPublicAsset = url.pathname.match(/\.(css|js|png|jpg|jpeg|gif|ico|svg|woff2?)$/);
    
    if (isAuthApi || isLoginPage || isPublicAsset) {
      const response = await env.ASSETS.fetch(request);
      const newResponse = new Response(response.body, response);
      newResponse.headers.set("X-MDM-Auth", "Bypassed"); // 標記為資產放行
      return newResponse;
    }

    // --- 2. 驗證碼攔截邏輯 ---
    if (!isAuthenticated) {
      console.log(`[Worker] 未登入，強制導向 /login`);
      return Response.redirect(`${url.origin}/login`, 302);
    }

    // --- 3. 已登入，放行內容 ---
    const response = await env.ASSETS.fetch(request);
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("X-MDM-Auth", "Authenticated"); // 標記為驗證通過
    return newResponse;
  },
};
