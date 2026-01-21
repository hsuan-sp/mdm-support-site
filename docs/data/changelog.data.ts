import MarkdownIt from "markdown-it";

const md = new MarkdownIt({
    html: true,
    linkify: true,
    typographer: true,
    breaks: true
});

function renderMarkdown(text: string) {
    if (!text) return "";
    const processed = text
        .replace(/([^\n])\n(\s*[-*+])/g, '$1\n\n$2')
        .replace(/([^\n])\n(\s*\d+\.)/g, '$1\n\n$2');
    return md.render(processed);
}

function parseFrontmatter(content: string) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
        return { data: {}, content: content };
    }

    const rawFm = match[1];
    const markdownBody = match[2];
    const data: Record<string, any> = {};

    rawFm.split('\n').forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
            const key = parts[0].trim();
            let value: any = parts.slice(1).join(':').trim();

            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1).replace(/\\"/g, '"');
            }
            data[key] = value;
        }
    });

    return { data, content: markdownBody };
}

export default {
    watch: ['./logs/items/*.md', './logs/items-en/*.md'],
    async load() {
        const { fileURLToPath } = await import('node:url');
        const path = await import('node:path');
        const fs = await import('node:fs');

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const ZH_ROOT = path.resolve(__dirname, 'logs/items');
        const EN_ROOT = path.resolve(__dirname, 'logs/items-en');

        const getFiles = (dir: string): string[] => {
            if (!fs.existsSync(dir)) return [];
            return fs.readdirSync(dir)
                .filter(file => file.endsWith('.md'))
                .map(file => path.join(dir, file));
        };

        const loadLogs = (dir: string) => {
            const files = getFiles(dir);
            const items = [];

            for (const filePath of files) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const { data, content } = parseFrontmatter(fileContent);

                items.push({
                    version: String(data.version || ''),
                    date: String(data.date || ''),
                    type: String(data.type || 'patch'),
                    content: renderMarkdown(content.trim())
                });
            }

            // Sort by version (SemVer mostly works with localeCompare for simple cases, or date)
            // Let's sort by date descending
            items.sort((a, b) => b.date.localeCompare(a.date) || b.version.localeCompare(a.version, undefined, { numeric: true }));
            return items;
        };

        return {
            zh: loadLogs(ZH_ROOT),
            en: loadLogs(EN_ROOT)
        };
    }
}
