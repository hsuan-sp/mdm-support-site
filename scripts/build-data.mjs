// scripts/build-data.mjs
import fs from 'node:fs';
import path from 'node:path';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

// 初始化 Markdown 解析器
const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: false,
});

// --- 輔助函式 (原本的 enhanceTypography) ---
function enhanceTypography(text) {
  if (!text) return "";
  return text
    .split("\n")
    .map((line) => {
      const trimmed = line.trim();
      if (
        trimmed.startsWith("|") || trimmed.startsWith("#") || trimmed.startsWith(">") ||
        trimmed.startsWith("- ") || trimmed.startsWith("* ") || /^\d+\. /.test(trimmed) ||
        trimmed.startsWith("**") || trimmed.startsWith("___") || trimmed.startsWith("```")
      ) {
        return line;
      }
      return line
        .replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, "$1 $2")
        .replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, "$1 $2")
        .replace(/([\u4e00-\u9fa5]),/g, "$1，")
        .replace(/([\u4e00-\u9fa5]):/g, "$1：")
        .replace(/([\u4e00-\u9fa5]);/g, "$1；")
        .replace(/([\u4e00-\u9fa5])!/g, "$1！")
        .replace(/([\u4e00-\u9fa5])\?/g, "$1？")
        .replace(/\.\.\./g, "…")
        .replace(/--/g, "—")
        .replace(/([\u4e00-\u9fa5])"/g, "$1”")
        .replace(/"([\u4e00-\u9fa5])/g, "“$1");
    })
    .join("\n");
}

function renderMarkdown(text) {
  if (!text) return "";
  return md.render(enhanceTypography(text));
}

// --- 設定路徑 ---
const CWD = process.cwd();
const OUTPUT_FILE = path.join(CWD, 'lib', 'generated-data.json');

// 定義資料夾結構 (對應你的 md_data/zh 和 md_data/en)
const LOCALES = ['zh', 'en'];

// 定義 QA 的順序與標題映射
const QA_ORDER = [
  "account", "enrollment", "apps", "classroom", "digital-learning",
  "hardware", "mac", "qa-education"
];

const SOURCE_TITLE_MAP = {
  zh: {
    account: "帳號與伺服器", enrollment: "裝置註冊", apps: "App 管理",
    classroom: "課堂管理", "digital-learning": "數位精進", hardware: "硬體排除",
    mac: "Mac 管理", "qa-education": "教育實戰",
  },
  en: {
    account: "Account & Server Management", enrollment: "Enrollment & Device Setup",
    apps: "App & Content Distribution", classroom: "Apple Classroom & Teaching Tools",
    "digital-learning": "Campus Digital Initiatives", hardware: "Hardware & Maintenance",
    mac: "Advanced Mac Management", "qa-education": "Education Scenarios & FAQ",
  }
};

// --- 主邏輯 ---
const allData = {
  qa: { zh: [], en: [] },
  glossary: { zh: [], en: [] },
  changelog: { zh: [], en: [] }
};

function generate() {
  console.log('🚀 開始生成靜態資料 JSON...');

  LOCALES.forEach(locale => {
    // 判斷根目錄: md_data/zh 或 md_data/en
    const rootDir = path.join(CWD, 'md_data', locale === 'en' ? 'en' : 'zh');
    const changelogDir = path.join(CWD, 'data/changelog', locale === 'en' ? 'en' : 'zh');
    
    // 1. 處理 Glossary
    const glossaryDir = path.join(rootDir, 'glossary');
    if (fs.existsSync(glossaryDir)) {
      const files = fs.readdirSync(glossaryDir).filter(f => f.endsWith('.md'));
      const terms = files.map(file => {
        const content = fs.readFileSync(path.join(glossaryDir, file), 'utf-8');
        const { data, content: mdBody } = matter(content);
        
        // 處理分割邏輯
        const analogyMarker = locale === 'zh' ? "## 白話文比喻" : "## Analogy";
        const definitionMarker = locale === 'zh' ? "## 術語定義" : "## Term Definition";
        const parts = mdBody.split(analogyMarker);
        const definition = parts[0].replace(definitionMarker, "").trim();
        const analogy = parts[1] ? parts[1].trim() : "";

        return {
          term: String(data.term || path.basename(file, ".md")),
          definition: renderMarkdown(definition),
          analogy: renderMarkdown(analogy),
          category: data.category || [],
          tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
        };
      }).sort((a, b) => a.term.localeCompare(b.term));
      
      allData.glossary[locale] = terms;
    }

    // 2. 處理 QA
    const qaSections = [];
    QA_ORDER.forEach(slug => {
      const dir = path.join(rootDir, 'qa', slug);
      if (fs.existsSync(dir)) {
        const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
        const items = files.map(file => {
          const content = fs.readFileSync(path.join(dir, file), 'utf-8');
          const { data, content: mdBody } = matter(content);
          return {
            id: String(data.id || path.basename(file, ".md")),
            question: String(data.title || path.basename(file, ".md")),
            answer: renderMarkdown(mdBody.trim()),
            important: Boolean(data.important),
            tags: Array.isArray(data.tags) ? data.tags : (data.tags ? [data.tags] : []),
            category: data.category || SOURCE_TITLE_MAP[locale][slug],
          };
        });

        items.sort((a, b) => (a.id || "").localeCompare(b.id || "", undefined, { numeric: true }));
        
        if (items.length > 0) {
          qaSections.push({
            source: SOURCE_TITLE_MAP[locale][slug] || slug,
            sections: [{ title: items[0].category, items: items }]
          });
        }
      }
    });
    allData.qa[locale] = qaSections;

    // 3. 處理 Changelog
    if (fs.existsSync(changelogDir)) {
      const files = fs.readdirSync(changelogDir).filter(f => f.endsWith('.md'));
      const logs = files.map(file => {
        const content = fs.readFileSync(path.join(changelogDir, file), 'utf-8');
        const { data, content: mdBody } = matter(content);
        return {
          version: String(data.version || path.basename(file, ".md")),
          date: String(data.date || new Date().toISOString().split("T")[0]),
          type: String(data.type || "patch"),
          content: renderMarkdown(mdBody.trim()),
        };
      }).sort((a, b) => b.date.localeCompare(a.date));
      allData.changelog[locale] = logs;
    }
  });

  // 寫入 JSON 檔案
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allData, null, 2));
  console.log(`✅ 資料已生成於: ${OUTPUT_FILE}`);
}

generate();