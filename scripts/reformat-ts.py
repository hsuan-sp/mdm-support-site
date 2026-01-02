#!/usr/bin/env python3
"""
重新格式化 QA 數據文件，統一縮排並保持內容正確
"""

import re
import os

def reformat_ts_file(content):
    # 1. 移除每行末尾的空白
    content = '\n'.join(line.rstrip() for line in content.split('\n'))
    
    # 2. 修復 answer 字段以外的基礎縮排
    # 這裡我們採取簡單的方法：將大括號、中括號等進行基本的縮排修復
    # 但為了不破壞 answer 模板字串，我們需要分段處理
    
    parts = []
    last_pos = 0
    # 找尋 answer: `...` 的範圍
    for match in re.finditer(r'(answer:\s*`)(.*?)(\n\s*`)', content, re.DOTALL):
        # 處理模板字串之前的代碼
        pre_content = content[last_pos:match.start(1)]
        parts.append(format_code_block(pre_content))
        
        # 保持 answer 的開頭標籤
        parts.append('        answer: `\n')
        
        # 處理 answer 內部內容：確保完全左對齊
        answer_body = match.group(2).strip('\n')
        lines = [line.lstrip() for line in answer_body.split('\n')]
        parts.append('\n'.join(lines))
        
        # 保持 answer 的結尾標籤
        parts.append('\n`')
        
        last_pos = match.end(3)
    
    # 處理剩餘的最後一段代碼
    parts.append(format_code_block(content[last_pos:]))
    
    return ''.join(parts)

def format_code_block(code):
    # 簡單的縮排修復：
    # 將常見的 4/8/12/16 縮排改為 2/4/6/8
    # 這裡使用正則簡單粗暴地處理
    lines = code.split('\n')
    new_lines = []
    for line in lines:
        if not line.strip():
            new_lines.append('')
            continue
            
        # 計算前導空格
        leading_spaces = len(line) - len(line.lstrip(' '))
        
        # 這是非常大概的估計，假設原本是 4 縮排
        if leading_spaces > 0:
            target_spaces = (leading_spaces // 4) * 2
            # 修正一些奇數縮排
            if leading_spaces % 4 >= 2:
                target_spaces += 2
            new_line = ' ' * target_spaces + line.lstrip(' ')
            new_lines.append(new_line)
        else:
            new_lines.append(line)
            
    return '\n'.join(new_lines)

def main():
    data_dir = os.path.join(os.path.dirname(__file__), '..', 'docs', 'data')
    qa_files = [
        '01-account.ts',
        '02-enrollment.ts',
        '03-apps.ts',
        '04-classroom.ts',
        '05-digital-learning.ts',
        '06-hardware.ts',
        '07-mac.ts',
        '08-qa-education.ts'
    ]
    
    for filename in qa_files:
        filepath = os.path.join(data_dir, filename)
        if not os.path.exists(filepath):
            continue
        
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        fixed_content = reformat_ts_file(content)
        
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print(f'✅ 格式化完成: {filename}')

if __name__ == '__main__':
    main()
