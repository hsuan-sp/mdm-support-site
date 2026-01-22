#!/usr/bin/env node

/**
 * Antigravity MDM Formatter Engine - Industrial Level
 * Version: 2026.1.1 (Final Stability Pack)
 * 
 * DESIGN PHILOSOPHY:
 * 1. Zero-collateral damage: Do NOT touch URLs, Domains, or Email addresses.
 * 2. Perfect Typography: Enforce pangu-spacing AND tighten syntax markers.
 * 3. Absolute Idempotency: Running it 1 or 100 times results in the same bit-level output.
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

// --- 🌐 全球頂尖 MDM 專業術語庫 (150+ Terms) ---
const PROPER_NOUNS = {
  // Apple Products & Platforms
  'apple': 'Apple', 'ipad': 'iPad', 'iphone': 'iPhone', 'ipod': 'iPod', 'macbook pro': 'MacBook Pro',
  'macbook air': 'MacBook Air', 'imac': 'iMac', 'mac mini': 'Mac mini', 'mac pro': 'Mac Pro',
  'mac studio': 'Mac Studio', 'apple watch': 'Apple Watch', 'apple tv': 'Apple TV',
  'apple pencil': 'Apple Pencil', 'apple vision pro': 'Apple Vision Pro', 'airpods': 'AirPods',
  'airtag': 'AirTag', 'ios': 'iOS', 'ipados': 'iPadOS', 'macos': 'macOS', 'watchos': 'watchOS',
  'tvos': 'tvOS', 'visionos': 'visionOS', 'icloud': 'iCloud', 'app store': 'App Store',
  'apple id': 'Apple ID', 'apple account': 'Apple Account', 'apple pay': 'Apple Pay',
  'facetime': 'FaceTime', 'imessage': 'iMessage', 'siri': 'Siri', 'airdrop': 'AirDrop',
  'airplay': 'AirPlay', 'airprint': 'AirPrint', 'finder': 'Finder', 'safari': 'Safari',
  'xcode': 'Xcode', 'swiftui': 'SwiftUI', 'filevault': 'FileVault', 'gatekeeper': 'Gatekeeper',
  'testflight': 'TestFlight', 'applecare': 'AppleCare+', 'apple classroom': 'Apple Classroom',
  'apple school manager': 'Apple School Manager', 'apple business manager': 'Apple Business Manager',
  'apple configurator': 'Apple Configurator', 'apple music': 'Apple Music', 
  
  // Apple Intelligence (2025-2026)
  'apple intelligence': 'Apple Intelligence', 'writing tools': 'Writing Tools',
  'image playground': 'Image Playground', 'genmoji': 'Genmoji', 'private cloud compute': 'Private Cloud Compute',
  
  // MDM Technologies
  'mdm': 'MDM', 'mam': 'MAM', 'uem': 'UEM', 'asm': 'ASM', 'abm': 'ABM', 'ade': 'ADE',
  'dep': 'DEP', 'vpp': 'VPP', 'apns': 'APNs', 'jamf': 'Jamf', 'jamf pro': 'Jamf Pro',
  'jamf school': 'Jamf School', 'jamf now': 'Jamf Now', 'jamf connect': 'Jamf Connect',
  'jamf protect': 'Jamf Protect', 'prestage': 'PreStage', 'self service': 'Self Service',
  'platform sso': 'Platform SSO', 'psso': 'PSSO', 'laps': 'LAPS', 'ddm': 'DDM', 
  'managed open in': 'Managed Open In', 'managed apple account': 'Managed Apple Account',
  'return to service': 'Return to Service', 'rts': 'Return to Service',
  'bootstrap token': 'Bootstrap Token', 'activation lock': 'Activation Lock', 
  'lost mode': 'Lost Mode', 'single app mode': 'Single App Mode', 
  'shared ipad': 'Shared iPad', 'declarative': 'Declarative',
  
  // IT & Networking
  'wi-fi': 'Wi-Fi', 'wifi': 'Wi-Fi', 'ethernet': 'Ethernet', 'bluetooth': 'Bluetooth',
  'usb-c': 'USB-C', 'usbc': 'USB-C', 'lightning': 'Lightning', 'thunderbolt': 'Thunderbolt',
  'hdmi': 'HDMI', 'api': 'API', 'sdk': 'SDK', 'xml': 'XML', 'json': 'JSON', 'csv': 'CSV',
  'http': 'HTTP', 'https': 'HTTPS', 'ssl': 'SSL', 'tls': 'TLS', 'vpn': 'VPN', 'dns': 'DNS',
  'dhcp': 'DHCP', 'ssh': 'SSH', 'sftp': 'SFTP', 'ldap': 'LDAP', 'saml': 'SAML', 'oidc': 'OIDC',
  'scim': 'SCIM', '802.1x': '802.1X', 'wpa3': 'WPA3', 'radius': 'RADIUS', 'ssid': 'SSID',
  
  // Hardware & Security
  't2 chip': 'T2 Chip', 'm1': 'M1', 'm2': 'M2', 'm3': 'M3', 'm4': 'M4', 'm5': 'M5',
  'cpu': 'CPU', 'gpu': 'GPU', 'npu': 'NPU', 'ram': 'RAM', 'ssd': 'SSD', 'usb': 'USB',
  'uuid': 'UUID', 'udid': 'UDID', 'imei': 'IMEI', 'iccid': 'ICCID', 'sha256': 'SHA-256',
  'aes': 'AES', 'rsa': 'RSA', 'csr': 'CSR', 'ca': 'CA', 'pki': 'PKI', 'scep': 'SCEP', 'acme': 'ACME'
};

const STATS = { total: 0, modified: 0, errors: 0 };

// --- 🛠️ 專業級字體引擎 ---
class TypographyEngine {
    static hasCJK(text) {
        return /[\u4e00-\u9fa5]/.test(text);
    }

    /**
     * URL 與 域名保護檢測
     */
    static isPartOfURLOrEmail(text, offset) {
        // 檢查前置字元：如果是 :// 或 @ 或 . (域名中)
        const prefix = text.slice(Math.max(0, offset - 10), offset);
        const suffix = text.slice(offset, offset + 10);
        
        if (prefix.includes('://') || suffix.startsWith('://')) return true; // 協議保護
        if (prefix.includes('@') || suffix.includes('@')) return true; // Email 保護
        if (/^[a-zA-Z0-9]\.[a-zA-Z0-9]/.test(suffix)) return true; // 域名保護 (如 apple.com)
        
        return false;
    }

    /**
     * 專有名詞校正 (含 URL 防火牆)
     */
    static normalizeProperNouns(text) {
        let result = text;
        Object.entries(PROPER_NOUNS).forEach(([lower, correct]) => {
            const regex = new RegExp(`(?<![a-zA-Z0-9])${lower}(?![a-zA-Z0-9])`, 'gi');
            result = result.replace(regex, (match, offset) => {
                if (this.isPartOfURLOrEmail(text, offset)) return match;
                return correct;
            });
        });
        return result;
    }

    /**
     * 盤古規則 (中英間距)
     */
    static applyPangu(text) {
        if (!this.hasCJK(text)) return text;
        let content = text;
        content = content.replace(/([\u4e00-\u9fa5])([a-zA-Z0-9])/g, '$1 $2');
        content = content.replace(/([a-zA-Z0-9])([\u4e00-\u9fa5])/g, '$1 $2');
        content = content.replace(/([\u4e00-\u9fa5])([`\*\_\~\$])/g, '$1 $2');
        content = content.replace(/([`\*\_\~\$])([\u4e00-\u9fa5])/g, '$1 $2');
        return content;
    }

    /**
     * 極致語法壓縮 (解決 *** 與 粗體內部空格問題)
     */
    static tightenSyntax(text) {
        let result = text;
        
        // 1. 修復清單符號與粗體粘連: *** Text ** -> * **Text**
        result = result.replace(/^(\s*)\*{3}\s*(.+?)\s*\*{2}/g, '$1* **$2**');
        
        // 2. 移除粗體內部空格: ** text ** -> **text**
        result = result.replace(/(\*{2})\s*([^\n]+?)\s*(\1)/g, '$1$2$3');
        
        // 3. 移除斜體內部空格: * text * -> *text*
        result = result.replace(/(?<!\*)\*\s*([^\n\*]+?)\s*\*(?!\*)/g, '*$1*');
        
        // 4. 代碼內部空格: ` code ` -> `code`
        result = result.replace(/(`)\s*([^\n]+?)\s*\1/g, '$1$2$1');
        
        // 5. 修正 (Text)[URL] -> [Text](URL)
        result = result.replace(/\(([^\)]+)\)\[([^\]]+)\]/g, '[$1]($2)');

        // 6. 修正標題與內容間距
        result = result.replace(/^#+([^#\s])/, (m) => m[0] + ' ' + m[1]);

        return result;
    }
}

// --- 🏗️ Markdown 格式化處理器 ---
class MarkdownFormatter {
    constructor(filePath) {
        this.filePath = filePath;
        this.lang = filePath.includes('/en/') ? 'en' : 'zh';
        this.rawContent = fs.readFileSync(filePath, 'utf-8');
        this.processedLines = [];
        this.state = { inCodeBlock: false, currentListIndex: 0 };
    }

    format() {
        const file = matter(this.rawContent);
        let { data: frontmatter, content } = file;

        // 1. 穩定化 Frontmatter
        const sortedFM = {};
        Object.keys(frontmatter).sort().forEach(k => sortedFM[k] = frontmatter[k]);

        // 2. 物理隔離保護 (Physical Isolation) 與強力回滾修復
        let protectedContent = content.trimStart();
        
        // 【緊急修復】補償先前工具產生的誤殺，在進入保護區前先轉回小寫
        protectedContent = protectedContent.replace(/HTTPS:\/\//gi, 'https://');
        protectedContent = protectedContent.replace(/HTTP:\/\//gi, 'http://');
        protectedContent = protectedContent.replace(/iforgot\.Apple\.com/gi, 'iforgot.apple.com');
        protectedContent = protectedContent.replace(/identity\.Apple\.com/gi, 'identity.apple.com');
        
        const placeholders = [];
        // 保護 Markdown [text](url) 連結、<url> 以及 裸網址
        const urlRegex = /(\[.*?\]\(.*?\)|<https?:\/\/[^>]+>|https?:\/\/[^\s\)\>\]]+|mailto:[^\s\)\>\]]+)/g;
        protectedContent = protectedContent.replace(urlRegex, (match) => {
            const id = `__ANTIGRAVITY_URL_${placeholders.length}__`;
            placeholders.push(match);
            return id;
        });

        const lines = protectedContent.split('\n');
        for (let line of lines) {
            this.processLine(line);
        }

        // 3. 組合與還原
        let result = this.processedLines.join('\n');
        
        // 還原受保護的 URL
        placeholders.forEach((original, index) => {
            const id = `__ANTIGRAVITY_URL_${index}__`;
            result = result.replace(id, original);
        });

        result = result.replace(/\n{3,}/g, '\n\n'); 
        result = result.split('\n').map(l => l.trimEnd()).join('\n');
        result = result.trimEnd() + '\n';

        const finalOutput = matter.stringify(result, sortedFM);
        const normalized = finalOutput.trimEnd() + '\n';

        if (normalized === this.rawContent) return false;

        fs.writeFileSync(this.filePath, normalized, 'utf-8');
        return true;
    }

    processLine(line) {
        const prev = this.processedLines.length > 0 ? this.processedLines[this.processedLines.length - 1] : null;

        // A. 代碼塊保護
        if (line.trim().startsWith('```')) {
            this.state.inCodeBlock = !this.state.inCodeBlock;
            if (this.state.inCodeBlock && prev && prev.trim() !== '') this.processedLines.push('');
            this.processedLines.push(line);
            if (!this.state.inCodeBlock) this.processedLines.push('');
            return;
        }
        if (this.state.inCodeBlock) {
            this.processedLines.push(line);
            return;
        }

        // B. 排版優化 (此時 URL 已被佔位符替代，可放心修正文字)
        let p = line;
        p = TypographyEngine.normalizeProperNouns(p);
        if (TypographyEngine.hasCJK(p)) p = TypographyEngine.applyPangu(p);
        p = TypographyEngine.tightenSyntax(p);

        // C. 結構識別：標題
        const hMatch = p.match(/^(#{1,6}) (.*)/);
        if (hMatch) {
            this.state.currentListIndex = 0;
            const level = hMatch[1].length;
            const finalLevel = (level === 1 || level >= 3) ? 2 : level;
            if (prev && prev.trim() !== '' && prev.trim() !== '>') {
                this.processedLines.push(p.startsWith('>') ? '>' : '');
            }
            this.processedLines.push(`${'#'.repeat(finalLevel)} ${hMatch[2].trim()}`);
            this.processedLines.push(p.startsWith('>') ? '>' : '');
            return;
        }

        // D. 結構識別：列表系統 (含塊狀引用)
        let bq = '';
        let lb = p;
        const bqM = p.match(/^((?:>\s*)+)(.*)$/);
        if (bqM) { bq = bqM[1].replace(/ {2,}/g, ' '); lb = bqM[2]; }

        const lMatch = lb.match(/^(\s*)([*+-]|(\d+)\.) (.*)$/);
        if (lMatch) {
            this.handleList(bq, lMatch, prev);
            return;
        }

        // E. 重置語境：頂格文字
        if (p.trim() !== '' && p.trim() !== '>' && !p.startsWith(' ') && !p.startsWith('>')) {
            this.state.currentListIndex = 0;
        }

        // F. 表格優化
        if (p.trim().startsWith('|') && p.includes('|')) {
            p = p.replace(/([^ |])\|/g, '$1 |');
            p = p.replace(/\|([^ |:-])/g, '| $1');
        }

        this.processedLines.push(p);
    }

    handleList(bq, m, prev) {
        let ind = m[1];
        const isOrd = !!m[3];
        const rest = m[4];
        let content = '';

        if (isOrd && ind.length === 0) {
            this.state.currentListIndex++;
            content = `${this.state.currentListIndex}. ${rest}`;
        } else if (!isOrd) {
            content = `* ${rest}`;
        } else {
            content = `${m[2]} ${rest}`;
        }

        const isPL = prev && prev.match(/^(?:(?:>\s*)+)?(\s*)([*+-]|\d+\.) /);
        const isPH = prev && prev.match(/^(?:(?:>\s*)+)?#{1,6} /);
        const isPE = !prev || prev.trim() === '' || prev.trim() === '>';

        if (!isPL && !isPH && !isPE) this.processedLines.push(bq.trim());
        if (ind.length > 0) ind = '  '.repeat(Math.ceil(ind.length / 2));

        this.processedLines.push(bq + ind + content);
    }
}

// --- 🚀 開始執行 ---
async function main() {
    console.log('\x1b[35m%s\x1b[0m', '🛡️  Antigravity Former 2.0 - Final Stability Engagement');
    const files = [];
    const walk = (d) => {
        if (!fs.existsSync(d)) return;
        fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
            const p = path.join(d, e.name);
            if (e.isDirectory()) walk(p);
            else if (e.name.endsWith('.md')) files.push(p);
        });
    };
    TARGET_DIRS.forEach(walk);
    STATS.total = files.length;

    files.forEach(f => {
        try {
            if (new MarkdownFormatter(f).format()) STATS.modified++;
        } catch (e) {
            console.error(`❌ ${f}:`, e.message);
            STATS.errors++;
        }
    });

    console.log('--------------------------------------------------');
    console.log(`📊 Scanned: ${STATS.total} | Modified: ${STATS.modified} | Perfect: ${STATS.total - STATS.modified}`);
    console.log('\x1b[32m%s\x1b[0m', '✨ Codebase optimized with zero-collateral damage policy.');
}
main();
