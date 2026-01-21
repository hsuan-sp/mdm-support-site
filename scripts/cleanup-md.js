import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_DIRS = [
    path.resolve(__dirname, '../docs/data/items'),
    path.resolve(__dirname, '../docs/data/items-en')
];

/**
 * Core Cleanup Logic
 */
function cleanContent(content) {
    // 1. Separate Frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return content;

    let fm = match[1];
    let body = match[2];

    // 2. Optimize Frontmatter (Normalize key-value spacing)
    fm = fm.split('\n')
        .map(line => {
            const parts = line.split(':');
            if (parts.length >= 2) {
                const key = parts[0].trim();
                const value = parts.slice(1).join(':').trim();
                return `${key}: ${value}`;
            }
            return line;
        })
        .join('\n');

    // 3. Optimize Body
    
    // MD004: Convert all unordered lists from dashes (-) to asterisks (*)
    // Matches start of line (^) with optional indentation (\s*), followed by dash and space.
    // Replaces with same indentation, asterisk, and space.
    body = body.replace(/^(\s*)-\s/gm, '$1* ');

    body = body
        // MD009: Remove trailing spaces from each line
        .split('\n').map(line => line.trimEnd()).join('\n')

        // MD022: Ensure blank line BEFORE headings
        // Matches any non-newline char, specific newline, then header.
        .replace(/([^\n])\n(#{1,6}\s)/g, '$1\n\n$2')
        
        // MD022: Ensure blank line AFTER headings
        // Matches header line, newline, then non-newline/non-header char.
        .replace(/(^#{1,6}\s.*)\n([^\n#])/gm, '$1\n\n$2')

        // MD032: Ensure blank line BEFORE TOP-LEVEL unordered lists
        // Matches non-newline, newline, start of line, asterisk/plus, space.
        .replace(/([^\n])\n(^[*+]\s)/gm, '$1\n\n$2')

        // MD032: Ensure blank line BEFORE TOP-LEVEL ordered lists
        .replace(/([^\n])\n(^\d+\.\s)/gm, '$1\n\n$2')

        // Collapse multiple empty lines into typically one empty line (max 2 newlines)
        .replace(/\n{3,}/g, '\n\n')
        
        .trim();

    return `---\n${fm}\n---\n\n${body}\n`;
}

function processDirectory(dir) {
    if (!fs.existsSync(dir)) return;
    
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            processDirectory(fullPath);
        } else if (entry.name.endsWith('.md')) {
            const original = fs.readFileSync(fullPath, 'utf8');
            const cleaned = cleanContent(original);
            
            if (original !== cleaned) {
                fs.writeFileSync(fullPath, cleaned);
                console.log(`✅ Fixed: ${path.relative(process.cwd(), fullPath)}`);
            }
        }
    }
}

console.log('🚀 Starting Markdown Cleanup...');
TARGET_DIRS.forEach(processDirectory);
console.log('✨ Cleanup Complete!');
