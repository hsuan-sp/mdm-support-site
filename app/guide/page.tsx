import Guide from "@/components/features/Guide";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "實戰指南", // 預設 SEO 標題
};

export default function Page() {
  return <Guide />;
}