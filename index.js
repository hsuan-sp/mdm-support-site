export default {
  async fetch(request, env, ctx) {
    // 這裡就是您未來可以寫驗證機制的地方
    return await env.ASSETS.fetch(request);
  },
};
