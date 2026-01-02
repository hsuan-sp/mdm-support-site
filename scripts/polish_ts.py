#!/usr/bin/env python3
import os
import re

def polish_ts_structure(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Find answer blocks
    pattern = re.compile(r'(answer:\s*`)(.*?)(\n\s*`(?=\s*[,}]))', re.DOTALL)
    
    parts = []
    last_pos = 0
    for match in pattern.finditer(content):
        # Code before answer
        parts.append(format_non_answer(content[last_pos:match.start(1)]))
        # Answer property
        parts.append("    answer: `\n")
        # Body (Left aligned)
        body = match.group(2).strip('\n')
        parts.append("\n".join(line.lstrip() for line in body.split('\n')))
        # Closing backtick
        parts.append("\n    `")
        last_pos = match.end(3)
        
    parts.append(format_non_answer(content[last_pos:]))
    
    final = "".join(parts)
    final = re.sub(r'\n{3,}', '\n\n', final)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(final)

def format_non_answer(code):
    lines = code.split('\n')
    new_lines = []
    for line in lines:
        s = line.strip()
        if not s:
            new_lines.append("")
            continue
        
        # Simple indentation rules
        if s.startswith("import") or s.startswith("export"):
            new_lines.append(s)
        elif s == "[" or s == "];" or s == "];":
            new_lines.append(s)
        elif s == "{" or s == "}," or s == "}":
            # Heuristic for level
            # If it's the root array object, 2 spaces. If it's an item, 4 spaces.
            # But let's just use a fixed 2-space increment.
            # Realistically, in these files:
            # { (section) -> 2
            # items: [ -> 4
            # { (item) -> 6
            # prop: -> 8
            # BUT the user wants them "靠左" (to the left).
            # So let's use MINIMAL indentation.
            if s == "{" : new_lines.append("  {")
            elif s == "}," : new_lines.append("  },")
            else: new_lines.append(s)
        elif s.startswith("title:"):
            new_lines.append(f"    title: {s[6:].strip()}")
        elif s.startswith("items:"):
            new_lines.append("    items: [")
        elif s.startswith("id:") or s.startswith("question:") or s.startswith("important:") or s.startswith("tags:"):
            new_lines.append(f"      {s}")
        elif s == "{":
            new_lines.append("    {")
        elif s == "},":
            new_lines.append("    },")
        else:
            new_lines.append("    " + s)
            
    return "\n".join(new_lines)

def main():
    data_dir = "docs/data"
    files = [f for f in os.listdir(data_dir) if f.endswith(".ts") and f != "all-data.ts" and f != "types.ts"]
    for f in files: polish_ts_structure(os.path.join(data_dir, f))

if __name__ == "__main__":
    main()
