import os

def fix_bullets(content):
    lines = content.split('\n')
    new_lines = []
    for line in lines:
        stripped = line.lstrip()
        # If line starts with *** but isn't just a HR
        if stripped.startswith('***') and len(stripped.replace('*', '').strip()) > 0:
            indent = line[:line.find('***')]
            # Replace first instance of *** with * **
            line = indent + '* **' + stripped[3:]
        new_lines.append(line)
    return '\n'.join(new_lines)

def run():
    for root, dirs, files in os.walk("docs/content"):
        for f in files:
            if f.endswith(".md"):
                p = os.path.join(root, f)
                with open(p, 'r', encoding='utf-8') as file:
                    c = file.read()
                fixed = fix_bullets(c)
                if c != fixed:
                    with open(p, 'w', encoding='utf-8') as file:
                        file.write(fixed)

if __name__ == "__main__":
    run()
