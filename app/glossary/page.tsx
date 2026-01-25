import Glossary from "@/components/features/Glossary";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "術語表", // 預設 SEO 標題
};

export default function Page() {
  return <Glossary />;
}