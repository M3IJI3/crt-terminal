'use client'

import { useRouter } from 'next/navigation'
import DonutAsciiPure from "@/components/ascii-donut";
import CRTWindow from "@/components/crt-window";
import TerminalConsole from "@/components/terminal-console";

export default function Home() {
  const router = useRouter()
  return (
    <>
      <CRTWindow title="Welcome !">
        {/* <TerminalConsole /> */}
        <div className="flex flex-col items-center justify-center flex-1 space-y-6">
          <DonutAsciiPure />
          <div className="w-2/3 max-w-lg p-4 text-center text-glow text-base">
            <div className="font-bold text-3xl">Welcome to DonutOS</div>
            <br />v0.0.1 
            <br/>Created by y0semite 
          </div>
          {/* 按钮组：左右分布 */}
        <div className="flex justify-between w-2/3 max-w-lg px-20">
          {/* 退出 按钮 */}
          <button
            onClick={() => window.close()}
            className="
              px-3 py-1
              text-glow
              hover:!text-[#0f0c07]
              hover:bg-[#ffaa00] hover:text-[#0f0c07]
              hover:shadow-[0_0_8px_rgba(255,170,0,0.6),0_0_16px_rgba(255,170,0,0.4)]
              transition-colors
            "
          >
            Exit
          </button>

          {/* 进入 按钮 */}
          <button
            onClick={() => window.location.href = '/next'}  // 或者 router.push('/next')
            className="
              px-3 py-1
              text-glow
              hover:!text-[#0f0c07]
              hover:bg-[#ffaa00] hover:text-[#0f0c07]
              hover:shadow-[0_0_8px_rgba(255,170,0,0.6),0_0_16px_rgba(255,170,0,0.4)]
              transition-colors
            "
          >
            Enter &gt;&gt;
          </button>
        </div>
        </div>
      </CRTWindow>
    </>
  );
}
