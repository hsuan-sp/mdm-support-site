import type { OpenNextConfig } from '@opennextjs/cloudflare';

const config = {
    default: {
        // 🔥 關鍵：強制 esbuild 將 jose 視為外部套件
        buildOptions: {
            external: ["jose", "node:crypto", "node:buffer"],
        },
        override: {
            wrapper: "cloudflare-node",
            converter: "edge",
            proxyExternalRequest: "fetch",
            incrementalCache: "dummy",
            tagCache: "dummy",
            queue: "dummy",
        },
    },
    // 這裡也要留著，針對 Middleware
    edgeExternals: ["node:crypto", "node:buffer", "jose"],
    middleware: {
        external: true,
        override: {
            wrapper: "cloudflare-edge",
            converter: "edge",
            proxyExternalRequest: "fetch",
            incrementalCache: "dummy",
            tagCache: "dummy",
            queue: "dummy",
        },
    },
};

// 使用 as any 繞過 TS 對於 buildOptions 可能存在的型別報錯
export default config as any as OpenNextConfig;