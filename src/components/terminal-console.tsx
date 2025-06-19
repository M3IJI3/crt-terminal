'use client'

import { useState, useEffect, useRef } from 'react'

export default function TerminalConsole() {
    const [lines, setLines] = useState<string[]>([])
    const [input, setInput] = useState('')
    const inputRef = useRef<HTMLInputElement>(null)

    // 每次输出后自动聚焦
    useEffect(() => {
        inputRef.current?.focus()
    }, [lines])

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            const cmd = input.trim()
            if (cmd === 'clear') {
                setLines([])
            } else {
                setLines(prev => [
                    ...prev,
                    `jiemei@root:~$ ${cmd}`,
                    cmd === 'help'
                        ? 'Available commands: help, about, clear'
                        : cmd === 'about'
                            ? 'Version 0.0.1\nCreated by Jie Mei.'
                            : `Command not found: ${cmd}`,
                ])
            }
            setInput('')
        }
    }

    return (
        <div className="text-lg">
            {/* 历史命令和响应 */}
            {lines.map((line, i) => (
                <div key={i} className="whitespace-pre-wrap trail-typing">
                    {line}
                </div>
            ))}

            {/* 输入行 */}
            <div className="flex items-center mt-2">
                <span className="mr-2 font-bold">jiemei@root:~$</span>
                <input
                    ref={inputRef}
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="type 'help'..."
                    className="
            font-bold
            flex-1
            bg-transparent
            border-none
            outline-none
            caret-[#ffaa00]
            selection:bg-[#ffaa00]/30
            trail-typing
          "
                />
            </div>
        </div>
    )
}
