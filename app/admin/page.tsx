'use client'
import { useEffect, useState } from 'react'

type Row = {
  name: string
  price?: number | string
  image?: string
  category?: string
  description?: string
  url?: string
  sku?: string
}

export default function AdminPage() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [secret, setSecret] = useState('')

  async function load() {
    try {
      setLoading(true)
      const res = await fetch('/api/admin/list', { cache: 'no-store' })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Ошибка загрузки')
      setRows(data.rows || [])
      setError(null)
    } catch (e:any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [])

  async function saveAll() {
    const res = await fetch('/api/admin/bulk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-admin-secret': secret },
      body: JSON.stringify({ rows })
    })
    const j = await res.json()
    if (!res.ok) alert(j.error || 'Ошибка сохранения')
    else alert('Сохранено!')
  }

  function addRow() {
    setRows(r => [{ name: 'Новый товар', price: '', category: '', sku: '', image: '', description: '' }, ...r])
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Админ-панель</h1>
      <div className="mb-4 text-sm text-white/60">
        Эта панель редактирует Google Sheet напрямую. Установи переменные окружения сервис-аккаунта и дай ему доступ «Редактор» к таблице.
      </div>
      <div className="mb-4 flex items-center gap-2">
        <input type="password" placeholder="ADMIN_SHARED_SECRET" value={secret} onChange={e=>setSecret(e.target.value)} className="rounded-xl bg-neutral-900 px-3 py-2 ring-1 ring-white/10"/>
        <button onClick={saveAll} className="rounded-xl px-3 py-2 bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/30">Сохранить все</button>
        <button onClick={addRow} className="rounded-xl px-3 py-2 bg-neutral-800 ring-1 ring-white/10">Добавить товар</button>
        <button onClick={load} className="rounded-xl px-3 py-2 bg-neutral-800 ring-1 ring-white/10">Обновить</button>
      </div>
      {loading && <div>Загрузка…</div>}
      {error && <div className="text-red-400">{error}</div>}
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="text-white/70">
              <tr>
                {['name','price','category','sku','image','description','url'].map(h=>(
                  <th key={h} className="text-left px-2 py-2 border-b border-white/10">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i)=>(
                <tr key={i} className="border-b border-white/5">
                  {Object.entries(r).map(([k,v], j)=>(
                    <td key={k} className="px-2 py-1">
                      <input
                        className="w-full bg-neutral-900 rounded-lg px-2 py-1 ring-1 ring-white/10"
                        value={String(v ?? '')}
                        onChange={e=>setRows(rs=>{
                          const copy=[...rs]; (copy[i] as any)[k]=e.target.value; return copy;
                        })}
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
