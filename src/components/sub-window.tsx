import React from 'react'

export interface OpenWindow {
  path: string
  mime: string
  data: string
}

export interface SubWindowProps {
  win: OpenWindow
  onClose: () => void
}

export default function SubWindow({ win, onClose }: SubWindowProps) {
  const { path, mime, data } = win
  let body: React.ReactNode

  if (mime.startsWith('text/')) {
    body = <pre className="p-4 whitespace-pre-wrap text-green-200">{data}</pre>
  } else if (mime.startsWith('image/')) {
    body = <img src={data} alt={path} className="max-w-full max-h-full object-contain" />
  } else if (mime === 'application/pdf') {
    body = (
      <iframe
        src={data}
        title={path}
        className="w-full h-full"
      />
    )
  } else if (mime.startsWith('audio/')) {
    body = <audio src={data} controls className="w-full" />
  } else if (mime.startsWith('video/')) {
    body = <video src={data} controls className="w-full max-h-full" />
  } else {
    body = <div className="p-4 text-red-400">Unsupported file type：{mime}</div>
  }

  return (
    <div className="subwindow-overlay">
    {/* 主窗口 */}
    <div className="subwindow">
      {/* 标题栏 */}
      <div className="subwindow__header">
        <span className="title text-glow">{path}</span>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>
      {/* 内容区 */}
      <div className="subwindow__body">
        {body}
      </div>
    </div>
  </div>
  )
}
