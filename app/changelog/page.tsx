import Changelog from "@/components/features/Changelog";
import { getChangelogData } from "@/lib/data";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "更新日誌",
};

export default async function Page() {
  // 在伺服器端抓取資料
  const zhLogs = await getChangelogData("zh");
  const enLogs = await getChangelogData("en");

  return <Changelog zhLogs={zhLogs} enLogs={enLogs} />;
}