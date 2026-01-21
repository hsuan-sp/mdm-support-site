import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const GLOSSARY_DIR = path.resolve(__dirname, '../docs/data/items-en/glossary');

function formatContent(content) {
    // 1. Separate Frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return content; // Skip malformed files

    let fm = match[1];
    let body = match[2];

    // 2. Normalize Frontmatter
    fm = fm.trim().split('\n').map(line => {
        const p = line.indexOf(':');
        if (p !== -1) {
            const k = line.slice(0, p).trim();
            const v = line.slice(p + 1).trim();
            return `${k}: ${v}`;
        }
        return line;
    }).join('\n');

    // 3. Normalize Body structure
    // Replace all dashes with stars for lists
    body = body.replace(/^(\s*)-\s/gm, '$1* ');
    
    // Normalize headers (ensure ## Term Definition and ## Analogy are correct)
    // We assume the content *has* these sections if it's a glossary item. 
    // If not, we perform general cleanup.
    
    // Split into lines
    let lines = body.split('\n').map(l => l.trimEnd());
    
    // Semantic Structure fix (if headers exist)
    // We want specifically "## Term Definition" and "## Analogy" to be surrounded by empty lines
    // But generalized markdown linting (MD022/MD032) usually covers this.
    // The "exquisite" part is strict section separation.

    let newBody = lines.join('\n');

    // Ensure double newlines around headers
    newBody = newBody
        .replace(/([^\n])\n(##\s)/g, '$1\n\n$2') // Blank line before Header
        .replace(/(##\s.*)\n([^\n])/g, '$1\n\n$2'); // Blank line after Header

    // 4. Tighten Lists (Remove empty lines between list items)
    // Matches: (newline) * text (newline)(newline) * text
    // Replace with: (newline) * text (newline) * text
    // We run this loop until no more changes to catch multi-item lists
    let previousBody;
    do {
        previousBody = newBody;
        newBody = newBody.replace(/(\n\* [^\n]+)\n\n(\* )/g, '$1\n$2');
    } while (newBody !== previousBody);

    // Ensure blank line BEFORE the FIRST list item if it follows text
    newBody = newBody.replace(/([^\n])\n(\* )/g, '$1\n\n$2');

    // Ensure blank line AFTER the LAST list item if it precedes text (not header)
    // Matches: (newline) * text (newline) text
    newBody = newBody.replace(/(\n\* [^\n]+)\n([^\n\*#])/g, '$1\n\n$2');

    // Collapse multiple blank lines to one (max 2 newlines = 1 blank line)
    newBody = newBody.replace(/\n{3,}/g, '\n\n');

    // Trim outer
    newBody = newBody.trim();

    // Reconstruct
    return `---\n${fm}\n---\n\n${newBody}\n`;
}

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    
    let fixedCount = 0;
    
    for (const file of files) {
        if (!file.endsWith('.md')) continue;
        const filePath = path.join(dir, file);
        const original = fs.readFileSync(filePath, 'utf8');
        const formatted = formatContent(original);
        
        if (original !== formatted) {
            fs.writeFileSync(filePath, formatted);
            fixedCount++;
        }
    }
    console.log(`[EN Glossary] Fixed ${fixedCount} files in ${dir}`);
}

processDir(GLOSSARY_DIR);
