import os
import re

def aggressive_unmash(content):
    # Fix 1: Flatten split bold items that should be one list item
    # Case:
    # * **Text
    # **More Text
    # -> * **Text More Text**
    
    lines = content.split('\n')
    new_lines = []
    i = 0
    while i < len(lines):
        line = lines[i]
        stripped = line.lstrip()
        
        # If line starts with * ** and doesn't close on the same line
        # OR if it was already messed up by my previous runs
        if stripped.startswith('* **') and not stripped[4:].strip().endswith('**'):
            # Check next line
            if i+1 < len(lines) and lines[i+1].lstrip().startswith('**'):
                # Combine them
                combined = stripped.strip() + " " + lines[i+1].lstrip()[2:].strip()
                if not combined.endswith('**'): combined += '**'
                new_lines.append(line[:line.find('*')] + combined)
                i += 2
                continue
        
        # If line starts with solitary ** but previous line was Answer or a bullet
        if stripped.startswith('**') and not stripped.endswith('**') and i > 0:
             # Likely a broken continuation
             pass
             
        new_lines.append(line)
        i += 1
    content = '\n'.join(new_lines)
    
    # Fix 2: Convert ANY remaining *** at start of line to * **
    content = re.sub(r'^(\s*)\*\*\*([^*]+)\*\*', r'\1* **\2**', content, flags=re.MULTILINE)
    content = re.sub(r'^(\s*)\*\*\*([^*]+)', r'\1* **\2**', content, flags=re.MULTILINE)
    
    # Fix 3: Ensure space after bullet
    content = re.sub(r'^(\s*)\*([^*])', r'\1* \2', content, flags=re.MULTILINE)
    
    # Fix 4: Answer followed by content
    content = re.sub(r'## Answer\s*((\*|\-|[a-zA-Z]))', r'## Answer\n\n\1', content)
    
    return content

def master_fix(content, is_zh=True):
    content = aggressive_unmash(content)
    
    # Space between CJK and Eng/Num
    content = re.sub(r'([a-zA-Z0-9])([\u4e00-\u9fff])', r'\1 \2', content)
    content = re.sub(r'([\u4e00-\u9fff])([a-zA-Z0-9])', r'\1 \2', content)
    
    if is_zh:
        punc_map = {',': '，', '.': '。', '!': '！', '?': '？', ':': '：', ';': '；', '(': '（', ')': '）'}
        # Punctuation conversion adjacent to CJK
        for h, f in punc_map.items():
            content = re.sub(f'([\u4e00-\u9fff])\\{h}', f'\\1{f}', content)
            content = re.sub(f'\\{h}([\u4e00-\u9fff])', f'{f}\\1', content)
            
    content = re.sub(r'\n{3,}', r'\n\n', content)
    return content.strip() + "\n"

def process():
    path = "docs/content"
    for root, dirs, files in os.walk(path):
        is_zh = "/zh/" in root
        for f in files:
            if f.endswith(".md"):
                p = os.path.join(root, f)
                with open(p, 'r', encoding='utf-8') as file:
                    c = file.read()
                fixed = master_fix(c, is_zh)
                if c != fixed:
                    with open(p, 'w', encoding='utf-8') as file:
                        file.write(fixed)

if __name__ == "__main__":
    process()
