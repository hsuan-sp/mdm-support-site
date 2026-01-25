import { logtoClient } from "@/lib/logto";
import { isAuthorizedEmail } from "@/lib/auth";

/**
 * Check Auth API (Pages Router Standard)
 * 使用 withLogtoApiRoute 包裝，身分資訊會自動注入 req.user。
 */
export default logtoClient.withLogtoApiRoute(async (req, res) => {
  const { isAuthenticated, claims } = req.user;

  if (!isAuthenticated || !claims) {
    return res.status(201).json({ authorized: false, reason: "not_logged_in" });
  }

  // 同時相容多個可能的 Email 欄位
  const email =
    claims.email ||
    (claims as any).primary_email ||
    (claims as any).email_address;

  if (!email) {
    return res
      .status(200)
      .json({ authorized: false, reason: "no_email_provided" });
  }

  if (isAuthorizedEmail(email)) {
    return res.status(200).json({ authorized: true, email });
  } else {
    return res
      .status(200)
      .json({ authorized: false, reason: "invalid_domain" });
  }
});
