import { logtoClient } from "@/lib/logto";
import { getQAData } from "@/lib/data";
import { isAuthorizedEmail } from "@/lib/auth";

/**
 * Guide API Handler (Pages Router)
 */
export default logtoClient.withLogtoApiRoute(async (req, res) => {
  const { isAuthenticated, claims } = req.user;

  if (!isAuthenticated || !claims) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const email = claims.email || (claims as any).primary_email;
  if (!isAuthorizedEmail(email)) {
    return res.status(403).json({ error: "Forbidden domain" });
  }

  try {
    const { lang } = req.query;
    const data = await getQAData(lang === "en" ? "en" : "zh");

    res.setHeader("Cache-Control", "no-store, max-age=0");
    res.status(200).json(data);
  } catch (error) {
    console.error("[API Guide Error]", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});
