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
    if (!Array.isArray(rows)) return NextResponse.json({ error: 'Invalid rows' }, { status: 400 })

    const sheetId = process.env.NEXT_PUBLIC_SHEET_ID!
    const sheets = google.sheets({ version: 'v4' })
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_CLIENT_EMAIL,
      key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    })
    await auth.authorize()

    // Determine headers from keys union (ordered by appearance)
    const headerSet = new Set<string>()
    rows.forEach(r => Object.keys(r).forEach(k => headerSet.add(k)))
    const headers = Array.from(headerSet)

    // Prepare values (2D array): first row headers, then rows
    const values = [headers, *[rows.map(r => headers.map(h => r[h] ?? ''))][0]]
    // Using Sheet1 by default; adjust if needed
    const range = 'Sheet1!A1:Z'
    await sheets.spreadsheets.values.clear({ auth, spreadsheetId: sheetId, range })
    await sheets.spreadsheets.values.update({
      auth,
      spreadsheetId: sheetId,
      range,
      valueInputOption: 'RAW',
      requestBody: { values }
    })

    return NextResponse.json({ ok: true, headers, count: rows.length })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
