#!/usr/bin/env python3
"""
修復 QA 數據文件中 answer 字段的縮排問題
"""

import re
import glob
import os

def fix_answer_indentation(content):
    """
    修復 answer 模板字串中的前導空格
    """
    # 匹配 answer: ` 到下一個 ` 之間的內容
    def replace_answer(match):
        answer_content = match.group(1)
        
        # 將每一行的前導空格移除（保留故意縮排的內容，但移除模板字串造成的統一縮排）
        lines = answer_content.split('\n')
        
        # 找出最小的前導空格數（忽略空行）
        min_indent = float('inf')
        for line in lines:
            if line.strip():  # 非空行
                # 計算前導空格
                indent = len(line) - len(line.lstrip(' '))
                if indent < min_indent:
                    min_indent = indent
        
        # 如果沒有找到有效的縮排，設為0
        if min_indent == float('inf'):
            min_indent = 0
        
        # 移除每行的最小前導空格
        fixed_lines = []
        for line in lines:
            if line.strip():  # 非空行
                # 移除最小縮排
                fixed_lines.append(line[min_indent:] if len(line) > min_indent else line)
            else:
                # 空行保持為空
                fixed_lines.append('')
        
        return 'answer: `\n' + '\n'.join(fixed_lines) + '\n                `'
    
    # 使用正則表達式替換所有 answer 字段
    pattern = r'answer:\s*`\n(.*?)\n\s*`'
    fixed_content = re.sub(pattern, replace_answer, content, flags=re.DOTALL)
    
    return fixed_content

def main():
    # 找出所有需要修復的文件
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
            print(f'跳過不存在的文件: {filename}')
            continue
        
        print(f'處理文件: {filename}')
        
        # 讀取文件
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # 修復縮排
        fixed_content = fix_answer_indentation(content)
        
        # 寫回文件
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(fixed_content)
        
        print(f'✅ 完成: {filename}')

if __name__ == '__main__':
    main()
