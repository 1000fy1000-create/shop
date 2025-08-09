import { google } from 'googleapis';

export async function getSheetsClient() {
  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  await auth.authorize();
  return google.sheets({ version: 'v4', auth });
}

export function rangeA1(sheetName: string, startRow=1, endRow=0, startCol='A', endCol='Z') {
  const rows = endRow > 0 ? `${startRow}:${endRow}` : `${startRow}:`;
  return `${sheetName}!${startCol}${rows}${endCol}`;
}
