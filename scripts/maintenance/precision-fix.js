#!/usr/bin/env node

/**
 * Antigravity MDM Formatter Engine - Version 4.3 (Precision Fix)
 * 
 * 任務：針對最後 75 個掃描出的警告進行外科手術。
 * 重點：Emoji 與粗體語法粘連、對稱性修復。
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIRS = [
  path.join(__dirname, '../../docs/content/zh'),
  path.join(__dirname, '../../docs/content/en'),
];

class PrecisionOptimizer {
    static process(content) {
        let res = content;

        // 1. 修復 Emoji 在粗體塊內部的空格問題 (**✅**Text -> **✅** Text)
        res = res.replace(/(\*\*[✅❌⚠️💡]\*\*)\s*([^\s，。？！：；、）\]\x20\*])/g, '$1 $2');
        res = res.replace(/([^\s，。？！：；、（\[\x20\*])\s*(\*\*[✅❌⚠️💡]\*\*)/g, '$1 $2');
        
        // 2. 修復 Emoji 在清單層級的空格 ( * ❌內容 -> * ❌ 內容)
        res = res.replace(/^(\s*)\* ([✅❌⚠️💡])([^\s\*])/gm, '$1* $2 $3');

        // 3. 修理不對稱的星號 (專治 deploy**after* 或 **exclusively*)
        res = res.replace(/([a-zA-Z]+)\*\*([a-zA-Z]+)\*(?!\*)/g, '$1 **$2**');
        res = res.replace(/(?<!\*)\*\*([a-zA-Z]+)\*([\s，。？！：；])/g, '**$1**$2');

        // 4. 重災區修正: ⚠️ 的變體選擇符 (去除 U+FE0F 與多餘空格)
        res = res.replace(/⚠️\s*️/g, '⚠️');
        res = res.replace(/\*\*⚠️\s*/g, '**⚠️ ');

        return res;
    }
}

function main() {
    console.log('🎯 執行 4.3 精準修復計畫...');
    const walk = (d) => {
        fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
            const p = path.join(d, e.name);
            if (e.isDirectory()) walk(p);
            else if (e.name.endsWith('.md')) {
                const raw = fs.readFileSync(p, 'utf-8');
                const { data, content } = matter(raw);
                const optimized = PrecisionOptimizer.process(content);
                const final = matter.stringify(optimized, data);
                if (final.trimEnd() + '\n' !== raw) {
                    fs.writeFileSync(p, final.trimEnd() + '\n');
                    console.log(`✨ Refined: ${path.relative(process.cwd(), p)}`);
                }
            }
        });
    };
    TARGET_DIRS.forEach(walk);
}

main();
