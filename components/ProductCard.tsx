'use client'
import Image from 'next/image'
import Price from './Price'
import type { Product } from '@/lib/gviz'

export default function ProductCard({ p }: { p: Product }) {
  const img = p.image && String(p.image).startsWith('http') ? p.image : undefined;
  const orderHref = `https://t.me/${process.env.NEXT_PUBLIC_TELEGRAM_TARGET}?start=ORDER_${encodeURIComponent(p.sku || p.name)}`;
  const shareHref = `https://t.me/share/url?url=${encodeURIComponent(p.url || '')}&text=${encodeURIComponent(p.name)}`;

  return (
    <div className="group relative rounded-2xl bg-neutral-900/60 ring-1 ring-white/5 hover:ring-cyan-400/30 transition-all overflow-hidden shadow-[0_0_0_rgba(0,0,0,0)] hover:shadow-[0_0_60px_rgba(34,211,238,0.15)]">
      <div className="aspect-[4/3] bg-neutral-800 overflow-hidden">
        {img ? (
          /* eslint-disable @next/next/no-img-element */
          <img src={img} alt={p.name} className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="h-full w-full bg-[radial-gradient(circle_at_30%_20%,rgba(168,85,247,0.25),transparent_40%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.25),transparent_40%),radial-gradient(circle_at_0%_80%,rgba(163,230,53,0.25),transparent_40%)]" />
        )}
      </div>
      <div className="p-4 flex flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold text-white/90 leading-tight line-clamp-2">{p.name}</h3>
          {p.category && <span className="px-2 py-0.5 text-xs rounded-full bg-gradient-to-r from-fuchsia-500/30 via-cyan-500/30 to-lime-400/30 text-cyan-200 ring-1 ring-cyan-500/30 shadow-[0_0_20px_rgba(34,211,238,0.35)]">{p.category}</span>}
        </div>
        {p.description && <p className="text-sm text-white/60 line-clamp-2">{p.description}</p>}
        <div className="flex items-center justify-between pt-1">
          <div className="text-lg font-medium text-white"><Price value={p.price} /></div>
          {p.sku && <span className="text-xs text-white/40">#{p.sku}</span>}
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2">
          <a href={orderHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl px-3 py-2 bg-cyan-500/20 text-cyan-200 ring-1 ring-cyan-400/30 hover:bg-cyan-500/30 transition">
            Заказать
          </a>
          <a href={shareHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-xl px-3 py-2 bg-neutral-800 text-white/80 ring-1 ring-white/10 hover:bg-neutral-700 transition">
            Поделиться
          </a>
        </div>
      </div>
    </div>
  )
}
