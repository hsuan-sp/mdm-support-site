"use client"
import React, { useState } from 'react'
import { X, Copy, Mail, Check } from 'lucide-react'

interface ReportIssueDialogProps {
  isOpen: boolean
  onClose: () => void
  template: string
  email: string
  t: any
}

const ReportIssueDialog: React.FC<ReportIssueDialogProps> = ({ isOpen, onClose, template, email, t }) => {
  const [copiedEmail, setCopiedEmail] = useState(false)
  const [copiedTemplate, setCopiedTemplate] = useState(false)

  if (!isOpen) return null

  const copyToClipboard = async (text: string, type: 'email' | 'template') => {
    await navigator.clipboard.writeText(text)
    if (type === 'email') {
      setCopiedEmail(true)
      setTimeout(() => setCopiedEmail(false), 2000)
    } else {
      setCopiedTemplate(true)
      setTimeout(() => setCopiedTemplate(false), 2000)
    }
  }

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
      <div 
        className="relative w-full max-w-lg bg-white dark:bg-zinc-900 rounded-[32px] border border-zinc-100 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-4 duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-2xl font-black text-zinc-900 dark:text-white mb-2">{t.dialogTitle || '專業問題回報'}</h3>
              <p className="text-sm font-medium text-zinc-400 dark:text-zinc-500 leading-relaxed">
                {t.dialogDesc || '如無法自動開啟郵件程式，請複製以下資訊並寄送至技術團隊：'}
              </p>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-full transition-colors text-zinc-400">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Email Address</label>
              <div className="flex gap-2 p-1.5 bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl items-center">
                <code className="flex-1 px-3 text-sm font-bold text-zinc-600 dark:text-zinc-300 truncate">{email}</code>
                <button 
                  onClick={() => copyToClipboard(email, 'email')}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${copiedEmail ? 'bg-green-500 text-white' : 'bg-white dark:bg-zinc-800 text-zinc-600 dark:text-zinc-200 hover:bg-zinc-100'}`}
                >
                  {copiedEmail ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  {copiedEmail ? 'Copied' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-zinc-400 uppercase tracking-widest px-1">Report Template</label>
              <div className="relative group">
                <pre className="w-full h-40 overflow-y-auto p-4 bg-zinc-50 dark:bg-black border border-zinc-100 dark:border-zinc-800 rounded-2xl text-[12px] leading-relaxed text-zinc-500 dark:text-zinc-400 font-mono no-scrollbar">
                  {template}
                </pre>
                <div className="absolute bottom-3 right-3">
                  <button 
                    onClick={() => copyToClipboard(template, 'template')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold shadow-lg transition-all ${copiedTemplate ? 'bg-green-500 text-white' : 'bg-blue-600 text-white hover:bg-blue-700'}`}
                  >
                    {copiedTemplate ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    {copiedTemplate ? 'Template Copied' : 'Copy Template'}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button 
              onClick={onClose}
              className="px-8 py-3 bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-200 rounded-2xl text-sm font-bold hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-all"
            >
              {t.close || '關閉'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportIssueDialog
