import { NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function GET() {
  try {
    const sheetId = process.env.NEXT_PUBLIC_SHEET_ID!
    const gid = process.env.NEXT_PUBLIC_SHEET_GID || '0'

    // Use GViz to read rows (no auth needed)
    const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}`
    const res = await fetch(url, { cache: 'no-store' })
    const text = await res.text()
    const start = text.indexOf('{')
    const end = text.lastIndexOf('}')
    const json = JSON.parse(text.slice(start, end+1))
    const cols = json.table?.cols ?? []
    const rows = (json.table?.rows ?? []).filter((r: any) => r && r.c && r.c.some((cell: any) => cell && cell.v != null))
    const headers = cols.map((c: any) => (c.label || c.id || '').trim())

    const data = rows.map((r: any) => {
      const obj: Record<string, any> = {}
      headers.forEach((h: string, idx: number) => {
        obj[h || `col_${idx+1}`] = r.c[idx]?.v ?? ''
      })
      return obj
    })

    return NextResponse.json({ headers, rows: data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
