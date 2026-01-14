// Note: This file is a VitePress Data Loader.
// It runs in Node.js at build time, but the file itself is imported by client code.
// To prevent Rollup/Vite from trying to bundle Node.js built-ins for the browser,
// we must avoid top-level imports of 'node:*' modules.

const QA_ORDER = [
    'account',
    'enrollment',
    'apps',
    'classroom',
    'digital-learning',
    'hardware',
    'mac',
    'qa-education'
];

const SOURCE_TITLE_MAP: Record<string, string> = {
    'account': '帳號與伺服器',
    'enrollment': '裝置註冊',
    'apps': 'App 管理',
    'classroom': '課堂管理',
    'digital-learning': '數位精進',
    'hardware': '硬體排除',
    'mac': 'Mac 管理',
    'qa-education': '教育實戰'
};

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
            let value = parts.slice(1).join(':').trim();

            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1).replace(/\\"/g, '"');
            } else if (value.startsWith('[') || value.startsWith('{')) {
                try { value = JSON.parse(value); } catch (e) { }
            } else if (value === 'true') value = true;
            else if (value === 'false') value = false;

            data[key] = value;
        }
    });

    return { data, content: markdownBody };
}

export default {
    watch: ['./items/**/*.md'],
    async load() {
        // Dynamic imports to prevent static analysis issues in client bundle
        const { fileURLToPath } = await import('node:url');
        const path = await import('node:path');
        const fs = await import('node:fs');

        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        const DATA_ROOT = path.resolve(__dirname, 'items');

        const getFiles = (dir: string): string[] => {
            if (!fs.existsSync(dir)) return [];
            return fs.readdirSync(dir)
                .filter(file => file.endsWith('.md'))
                .map(file => path.join(dir, file));
        };

        const loadQAData = async () => {
            const sections = [];

            for (const slug of QA_ORDER) {
                const dir = path.join(DATA_ROOT, 'qa', slug);
                const files = getFiles(dir);
                const items = [];

                for (const filePath of files) {
                    const fileContent = fs.readFileSync(filePath, 'utf-8');
                    const { data, content } = parseFrontmatter(fileContent);

                    items.push({
                        id: data.id,
                        question: data.title,
                        answer: content.trim(),
                        important: Boolean(data.important),
                        tags: Array.isArray(data.tags) ? data.tags : [],
                        category: String(data.category || '')
                    });
                }

                items.sort((a, b) => {
                    const idA = a.id || '';
                    const idB = b.id || '';
                    return idA.localeCompare(idB, undefined, { numeric: true });
                });

                if (items.length > 0) {
                    sections.push({
                        source: SOURCE_TITLE_MAP[slug] || slug,
                        sections: [{
                            title: items[0].category || SOURCE_TITLE_MAP[slug],
                            items: items
                        }]
                    });
                }
            }
            return sections;
        };

        const loadGlossaryData = async () => {
            const dir = path.join(DATA_ROOT, 'glossary');
            const files = getFiles(dir);
            const terms = [];

            for (const filePath of files) {
                const fileContent = fs.readFileSync(filePath, 'utf-8');
                const { data, content } = parseFrontmatter(fileContent);

                const parts = content.split('# 白話文比喻');
                const definition = parts[0].replace('# 術語定義', '').trim();
                const analogy = parts[1] ? parts[1].trim() : '';

                terms.push({
                    term: data.term,
                    definition,
                    analogy,
                    category: String(data.category || ''),
                    tags: Array.isArray(data.tags) ? data.tags : []
                });
            }

            terms.sort((a, b) => {
                const tA = a.term || '';
                const tB = b.term || '';
                return tA.localeCompare(tB);
            });
            return terms;
        };

        const [allQAData, glossaryData] = await Promise.all([
            loadQAData(),
            loadGlossaryData()
        ]);
        return { allQAData, glossaryData };
    }
}
