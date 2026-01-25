import { logtoClient } from "@/lib/logto";

/**
 * Logto Auth Handler - Standard Pages Router Implementation
 * 直接導出以解決 404/500 問題並確保 Session 與 Callback 正確對接。
 */
export default logtoClient.handleAuthRoutes();
