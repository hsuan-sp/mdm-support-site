import generatedData from "./generated-data.json";

/**
 * 這裡不需要 fs, path, gray-matter 或 markdown-it。
 * 所有的解析工作都已經在 build 階段由 scripts/build-data.mjs 完成了。
 * 
 * 這確保了在 Edge Runtime (Cloudflare Pages) 上完全零依賴，
 * 且讀取速度極快（因為資料已經編譯成 JS 物件）。
 */

export async function getQAData(locale: string = "zh-TW") {
  const langKey = locale === "en" ? "en" : "zh";
  // @ts-ignore: 忽略 JSON 尚未生成時的 TS 警告
  return generatedData.qa[langKey] || [];
}

export async function getGlossaryData(locale: string = "zh-TW") {
  const langKey = locale === "en" ? "en" : "zh";
  // @ts-ignore
  return generatedData.glossary[langKey] || [];
}

export async function getChangelogData(locale: string = "zh-TW") {
  const langKey = locale === "en" ? "en" : "zh";
  // @ts-ignore
  return generatedData.changelog[langKey] || [];
}