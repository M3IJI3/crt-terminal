'use client'

import CRTWindow from '@/components/crt-window'
import TerminalConsole from '@/components/terminal-console'

export default function Main() {
  return (
    <CRTWindow title="Home">
      <TerminalConsole />
    </CRTWindow>
  )
}