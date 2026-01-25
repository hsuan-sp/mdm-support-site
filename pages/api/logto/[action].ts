import { handleAuthRoutes } from "@logto/next";
import { logtoConfig } from "@/lib/logto";

/**
 * Logto Auth Handler (v4 Functional Standard)
 * 這是對抗 404 與 500 回調錯誤的最佳實踐。
 */
export default handleAuthRoutes(logtoConfig);
