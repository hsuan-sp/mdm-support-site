const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '../docs/data');
const guideDir = path.join(__dirname, '../docs/guide');

// Map of TS filename to MD filename
const map = {
    '01-account.ts': '01-account.md',
    '02-enrollment.ts': '02-enrollment.md',
    '03-apps.ts': '03-apps.md',
    '04-classroom.ts': '04-classroom.md',
    '05-digital-learning.ts': '05-digital-learning.md',
    '06-hardware.ts': '06-hardware.md',
    '07-mac.ts': '07-mac.md',
    '08-qa-education.ts': '08-education.md'
};

fs.readdirSync(dataDir).forEach(file => {
    if (!map[file]) return;
    
    // Read TS file
    // Simplified extraction: Look for question: "..." and answer: "..."
    const content = fs.readFileSync(path.join(dataDir, file), 'utf-8');
    
    const questions = [];
    const answers = [];
    
    // Regex is rough but effective for this specific task
    // It captures content between quotes
    const qMatches = content.matchAll(/question:\s*["`'`](.*?)["`'`]/g);
    for (const m of qMatches) questions.push(m[1]);
    
    const aMatches = content.matchAll(/answer:\s*["`'`](.*?)["`'`]/g);
    for (const m of aMatches) answers.push(m[1]);

    const keywords = [...questions, ...answers].join(' ');
    
    // Read and update MD file
    const mdPath = path.join(guideDir, map[file]);
    if (fs.existsSync(mdPath)) {
        let mdContent = fs.readFileSync(mdPath, 'utf-8');
        
        // Remove existing hidden index if any
        mdContent = mdContent.replace(/<!-- SEARCH_INDEX_START -->[\s\S]*<!-- SEARCH_INDEX_END -->/, '');
        
        // Append new hidden index
        const injection = `\n<!-- SEARCH_INDEX_START -->\n<div style="display: none">\n${keywords}\n</div>\n<!-- SEARCH_INDEX_END -->`;
        
        fs.writeFileSync(mdPath, mdContent + injection);
        console.log(`Updated ${map[file]} with search keywords`);
    }
});
