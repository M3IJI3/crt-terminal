'use client'

import React, { useState, useEffect, useRef } from 'react'
import SubWindow, { OpenWindow } from '@/components/sub-window'

export default function TerminalConsole() {
  const [lines, setLines] = useState<string[]>([])
  const [input, setInput] = useState('')
  const [cwd, setCwd] = useState('/')   // 以 / 代表 data/ 根
  const inputRef = useRef<HTMLInputElement>(null)

  // 当前打开的子窗口（null = 无）
  const [openWin, setOpenWin] = useState<OpenWindow | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [lines])

  const prompt = () => `jiemei@root:${cwd}$`

  // 调用后台列目录或读文件
  async function apiFS(path: string) {
    const res = await fetch(`/api/fs${path}`)
    if (!res.ok) throw new Error('Not found')
    return res.json()
  }

  // 打开文件：拉原始流，包成 Blob URL 或文本存 state
  async function openFile(path: string) {
    const res = await fetch(`/api/fs${path}?raw=1`)
    if (!res.ok) throw new Error(`open: fail to access ${path}`)
    const blob = await res.blob()
    const mime = blob.type || 'application/octet-stream'
    // 文本走 text(), 其他生成 URL
    if (mime.startsWith('text/')) {
      const text = await blob.text()
      setOpenWin({ path, mime, data: text })
    } else {
      const url = URL.createObjectURL(blob)
      setOpenWin({ path, mime, data: url })
    }
  }

  async function run(cmdLine: string) {
    const parts = cmdLine.split(/\s+/).filter(Boolean)
    const cmd = parts[0]
    switch (cmd) {
      case 'help':
        return 'Available: help, clear, pwd, ls, cd, cat, open'
      case 'clear':
        setLines([])
        return null
      case 'pwd':
        return cwd
      case 'ls': {
        try {
          const data = await apiFS(cwd === '/' ? '' : cwd)
          return data.type === 'dir'
            ? data.entries.join('  ')
            : 'ls: not a directory'
        } catch {
          return `ls: cannot access ${cwd}`
        }
      }
      case 'cd': {
        const target = parts[1] || '/'
        let dest = ''
        if (target === '/') dest = '/'
        else if (target === '..') {
          if (cwd !== '/') {
            const segs = cwd.split('/').filter(Boolean)
            segs.pop()
            dest = '/' + segs.join('/')
          } else dest = '/'
        } else {
          dest = cwd === '/' ? `/${target}` : `${cwd}/${target}`
        }
        try {
          const data = await apiFS(dest === '/' ? '' : dest)
          if (data.type === 'dir') {
            setCwd(dest)
            return null
          }
          return `cd: not a directory: ${target}`
        } catch {
          return `cd: no such file or directory: ${target}`
        }
      }
      case 'cat': {
        const file = parts[1]
        if (!file) return 'cat: missing file operand'
        const path = cwd === '/' ? `/${file}` : `${cwd}/${file}`
        try {
          const data = await apiFS(path)
          return data.type === 'file'
            ? data.content
            : `cat: ${file}: Is a directory`
        } catch {
          return `cat: ${file}: No such file`
        }
      }
      case 'open': {
        const file = parts[1]
        if (!file) return 'open: missing file operand'
        const path = cwd === '/' ? `/${file}` : `${cwd}/${file}`
        try {
          await openFile(path)
          return null
        } catch (e: any) {
          return e.message
        }
      }
      default:
        return `Command not found: ${cmd}`
    }
  }

  const handleKeyDown = async (e: React.KeyboardEvent) => {
    if (e.key !== 'Enter') return

    const cmdLine = input.trim()
    if (!cmdLine) return

    // === 特殊处理 clear ===
    if (cmdLine === 'clear') {
      setLines([])      // 直接清空
      setInput('')      // 清空输入框
      return            // 跳过后续 push 逻辑
    }

    // === 其它命令走原逻辑 ===
    const out: string[] = []
    out.push(`${prompt()} ${cmdLine}`)
    const result = await run(cmdLine)
    if (result !== null) out.push(result)
    setLines(prev => [...prev, ...out])
    setInput('')
  }

  return (
    <>
      <div className="text-lg">
        {lines.map((l, i) => (
          <div key={i} className="whitespace-pre-wrap">
            {l}
          </div>
        ))}
        <div className="flex items-center mt-2">
          <span className="mr-2 font-bold">{prompt()}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="type 'help'..."
            className="font-bold flex-1 bg-transparent border-none outline-none caret-[#ffaa00] selection:bg-[#ffaa00]/30 trail-typing"
          />
        </div>
      </div>

      {/* CRT 风子窗口 */}
      {openWin && (
        <SubWindow
          win={openWin}
          onClose={() => {
            // 释放 Blob URL（非文本类型）
            if (!openWin.mime.startsWith('text/')) {
              URL.revokeObjectURL(openWin.data)
            }
            setOpenWin(null)
          }}
        />
      )}
    </>
  )
}
