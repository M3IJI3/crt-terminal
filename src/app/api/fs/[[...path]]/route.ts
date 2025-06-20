import { NextResponse, NextRequest } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
import mime from 'mime'

const DATA_ROOT = path.join(process.cwd(), 'src', 'data')
function inside(full: string) {
  const rel = path.relative(DATA_ROOT, full)
  return !rel.startsWith('..') && !path.isAbsolute(rel)
}

export async function GET(request: NextRequest,            // ← 要用 NextRequest 才能拿到 nextUrl
{ params }: any) {
  const rel = (params.path || []).join('/')
  const full = path.join(DATA_ROOT, rel)
  if (!inside(full)) return new NextResponse('Access denied', { status: 403 })

  // 正确解析 URL 上的 raw 参数
  const raw = request.nextUrl.searchParams.get('raw') === '1'

  try {
    const stat = await fs.stat(full)

    if (raw) {
      if (!stat.isFile()) return new NextResponse('Not a file', { status: 400 })
      const data = await fs.readFile(full)
      const type = mime.getType(full) || 'application/octet-stream'
      return new NextResponse(data, {
        headers: { 'Content-Type': type },
      })
    }

    // 非 raw，保持原 JSON 逻辑
    if (stat.isDirectory()) {
      const entries = await fs.readdir(full)
      return NextResponse.json({ type: 'dir', entries })
    } else {
      const content = await fs.readFile(full, 'utf-8')
      return NextResponse.json({ type: 'file', content })
    }

  } catch {
    return new NextResponse('Not found', { status: 404 })
  }
}
