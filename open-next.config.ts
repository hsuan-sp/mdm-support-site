import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config: OpenNextConfig = {
    default: {
        override: {
            // 使用 cloudflare-node 配合 wrangler 的 nodejs_compat 標記
            wrapper: "cloudflare-node",
            converter: "edge",
            // 確保外部請求能透過標準 fetch 轉發
            proxyExternalRequest: "fetch",
            // Cloudflare 核心不支援 AWS 專屬快取，必須明確設為 dummy
            incrementalCache: "dummy",
            tagCache: "dummy",
            queue: "dummy",
        },
    },

    // 2026 年建議：顯式排除 Node 內建模組，防止編譯器抓錯環境
    edgeExternals: ["node:crypto", "node:buffer"],

    middleware: {
        external: true,
        override: {
            // Middleware 必須使用 cloudflare-edge 才能在請求進入前觸發
            wrapper: "cloudflare-edge",
            converter: "edge",
            proxyExternalRequest: "fetch",
            incrementalCache: "dummy",
            tagCache: "dummy",
            queue: "dummy",
        },
    },
};

export default config;