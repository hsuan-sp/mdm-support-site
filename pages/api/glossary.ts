import type { NextApiRequest, NextApiResponse } from "next";
import { getAuth } from "@clerk/nextjs/server";
import { getGlossaryData } from "@/lib/data";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { userId } = getAuth(req);

  if (!userId) {
    return res
      .status(401)
      .json({ error: "Unauthorized. Please sign in to access this content." });
  }

  const { lang } = req.query;
  const data = await getGlossaryData(lang === "en" ? "en" : "zh");
  res.status(200).json(data);
}
