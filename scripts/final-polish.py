#!/usr/bin/env python3
"""
最後的微調：確保 .ts 文件中的屬性對齊一致。
"""

import os
import re

def final_polish(content):
    lines = content.split('\n')
    new_lines = []
    
    in_answer = False
    for line in lines:
        # 開始 answer 模板字串
        if 'answer: `' in line:
            in_answer = True
            new_lines.append(line)
            continue
        
        # 結束 answer 模板字串
        if in_answer and '`' in line and line.strip().endswith('`') or (in_answer and line.strip() == '`'):
            in_answer = False
            # 對齊結束的引號
            new_lines.append('      `')
            continue
            
        if in_answer:
            new_lines.append(line)
        else:
            # 屬性對齊：將所有位於 items 內部的屬性對齊到 6 個空格，對象括號對齊到 4 個空格
            stripped = line.strip()
            if not stripped:
                new_lines.append('')
                continue
                
            # 處理物件標籤
            if stripped == '{' and 'items:' not in line:
                new_lines.append('    {')
            elif stripped == '},' or stripped == '}':
                new_lines.append('    },' if stripped == '},' else '    }')
            elif stripped.startswith(('id:', 'question:', 'tags:', 'important:', 'answer:')):
                new_lines.append('      ' + stripped)
            elif stripped.startswith('title:'):
                new_lines.append('  ' + stripped)
            elif stripped.startswith('items: ['):
                new_lines.append('  items: [')
            else:
                new_lines.append(line)
                
    return '\n'.join(new_lines)

def main():
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'docs', 'data')
    qa_files = [
        '01-account.ts', '02-enrollment.ts', '03-apps.ts', '04-classroom.ts',
        '05-digital-learning.ts', '06-hardware.ts', '07-mac.ts', '08-qa-education.ts'
    ]
    
    for filename in qa_files:
        filepath = os.path.join(data_dir, filename)
        if not os.path.exists(filepath): continue
        with open(filepath, 'r', encoding='utf-8') as f: content = f.read()
        
        # 先做一次基本的縮排清理
        content = '\n'.join(line.rstrip() for line in content.split('\n'))
        # 進行最後的對齊微調
        fixed = final_polish(content)
        
        with open(filepath, 'w', encoding='utf-8') as f: f.write(fixed)
        print(f'Done: {filename}')

if __name__ == '__main__':
    main()
