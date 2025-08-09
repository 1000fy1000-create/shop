import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get('x-admin-secret') || ''
    if (!process.env.ADMIN_SHARED_SECRET || secret !== process.env.ADMIN_SHARED_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const rows = body.rows as Record<string, any>[]
    if (!Array.isArray(rows)) {
      return NextResponse.json({ error: 'Invalid rows' }, { status: 400 })
    }

    const sheetId = process.env.NEXT_PUBLIC_SHEET_ID!
    if (!sheetId) {
      return NextResponse.json({ error: 'Missing NEXT_PUBLIC_SHEET_ID' }, { status: 500 })
    }

    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
    await auth.authorize()
    const sheets = google.sheets({ version: 'v4', auth })

    // Заголовки — объединение всех ключей
    const headerSet = new Set<string>()
    rows.forEach(r => Object.keys(r).forEach(k => headerSet.add(k)))
    const headers = Array.from(headerSet)

    // ✅ Правильная сборка 2D-массива значений
    const values = [headers, ...rows.map(r => headers.map(h => r[h] ?? ''))]

    // Пишем в Sheet1 c A1
    const range = 'Sheet1!A1:Z'
    await sheets.spreadsheets.values.clear({ spreadsheetId: sheetId, range })
    await sheets.spreadsheets.values.update({
      spreadsheetId: sheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values }
    })

    return NextResponse.json({ ok: true, headers, count: rows.length })
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Unknown error' }, { status: 500 })
  }
}
