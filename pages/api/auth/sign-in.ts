import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 重導向到 Logto sign-in
  const signInUrl = `${process.env.LOGTO_ENDPOINT}/sign-in?client_id=${process.env.LOGTO_APP_ID}&redirect_uri=${encodeURIComponent(process.env.LOGTO_BASE_URL + "/api/auth/callback")}&response_type=code&scope=openid%20profile%20email`;

  res.redirect(307, signInUrl);
}
