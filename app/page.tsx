import { fetchProductsFromSheet } from '@/lib/gviz'
import ProductCard from '@/components/ProductCard'

export default async function Page() {
  const sheetId = process.env.NEXT_PUBLIC_SHEET_ID!;
  const gid = process.env.NEXT_PUBLIC_SHEET_GID || '0';
  const products = await fetchProductsFromSheet(sheetId, gid);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-semibold">Каталог</h1>
        <span className="text-white/50">· {products.length} товаров</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-5">
        {products.map((p, i) => (
          <ProductCard key={(p.sku || p.name || '') + i} p={p} />
        ))}
      </div>
    </div>
  )
}
