import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'KopiLux — Магазин',
  description: 'Молодёжный магазин с интеграцией Google Sheets',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru">
      <body>
        <div className="pointer-events-none fixed inset-0 opacity-[0.12]" style={{
          backgroundImage: 'radial-gradient(600px 200px at 0% 0%, rgba(34,211,238,0.35), transparent 40%),'+
                           'radial-gradient(800px 200px at 100% 0%, rgba(168,85,247,0.35), transparent 40%),'+
                           'radial-gradient(600px 200px at 100% 100%, rgba(163,230,53,0.35), transparent 40%)'
        }} />
        <header className="sticky top-0 z-40 backdrop-blur bg-black/30 ring-1 ring-white/5">
          <div className="mx-auto max-w-7xl px-4 py-3 flex items-center gap-3">
            <div className="text-lg font-semibold tracking-wide">
              <span className="text-white">Kopi</span>
              <span className="text-cyan-300">Lux</span>
            </div>
          </div>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
        <footer className="border-t border-white/10 mt-10">
          <div className="mx-auto max-w-7xl px-4 py-8 text-sm text-white/50">
            © {new Date().getFullYear()} KopiLux · Данные из Google Sheets
          </div>
        </footer>
      </body>
    </html>
  )
}
