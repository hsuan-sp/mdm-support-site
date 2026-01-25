import nextra from "nextra";

const withNextra = nextra({
  theme: "nextra-theme-docs",
  themeConfig: "./theme.config.tsx",
});

// 判斷是否正在 GitHub Actions 環境中執行（用於 GitHub Pages 導出）
const isGithubActions = process.env.GITHUB_ACTIONS === "true";

export default withNextra({
  reactStrictMode: true,

  // --- 關鍵相容性設定 ---
  
  // 1. 只有在 GitHub Actions 時才使用 'export'，Cloudflare 部署時不使用
  output: isGithubActions ? "export" : undefined,

  // 2. 靜態導出時，Next.js 內建圖片優化無法使用，必須關閉
  images: {
    unoptimized: isGithubActions,
  },

  // 3. 如果你的 GitHub Pages 網址有子路徑 (例如: username.github.io/my-repo/)
  // 請取消下方註解並填入你的倉庫名稱。如果用自定義網域則不需要。
  basePath: isGithubActions ? '/mdm-docs-superinfo' : '',

  // --- Webpack 安全設定 ---
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        "node:fs": false,
        "node:path": false,
      };
    }
    return config;
  },
});