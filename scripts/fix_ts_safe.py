#!/usr/bin/env python3
import os
import re

def fix_indentation(filepath):
    print(f"Fixing {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find all answer: ` ... ` blocks
    # We use a greedy match but with a lookahead to ensure we find the REAL end
    # In these files, the end is always \n followed by some spaces and then ` followed by , or }
    # Pattern explanation:
    # (answer:\s*`) - Group 1: start
    # (.*?) - Group 2: content (non-greedy)
    # (\n\s*`(?=\s*[,}])) - Group 3: end (lookahead for , or })
    
    pattern = re.compile(r'(answer:\s*`)(.*?)(\n\s*`(?=\s*[,}]))', re.DOTALL)
    
    def replacer(match):
        start = match.group(1)
        body = match.group(2)
        end = match.group(3)
        
        # Dedent the body
        lines = body.split('\n')
        if not lines:
            return start + body + end
            
        # Find the minimum indentation of non-empty lines
        min_indent = 999
        for line in lines:
            if line.strip():
                indent = len(line) - len(line.lstrip())
                if indent < min_indent:
                    min_indent = indent
        
        if min_indent == 999:
            min_indent = 0
            
        fixed_lines = []
        for line in lines:
            if line.strip():
                fixed_lines.append(line[min_indent:])
            else:
                fixed_lines.append("")
                
        return start + "\n" + "\n".join(fixed_lines) + end

    new_content = pattern.sub(replacer, content)
    
    # Also fix the rest of the file layout: ensure standard 2-space indentation for properties
    # This is optional but requested/helpful
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(new_content)

def main():
    data_dir = "docs/data"
    files = [f for f in os.listdir(data_dir) if f.endswith(".ts") and f != "all-data.ts" and f != "types.ts"]
    for f in files:
        fix_indentation(os.path.join(data_dir, f))
    print("All files processed.")

if __name__ == "__main__":
    main()
