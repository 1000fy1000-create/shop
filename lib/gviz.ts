export type Product = {
  name: string;
  price?: number | string;
  image?: string;
  category?: string;
  description?: string;
  url?: string;
  sku?: string;
};

const headerAliases: Record<string, string[]> = {
  name: ["name","title","название","товар","продукт","nazwa","tytuł"],
  price: ["price","цена","стоимость","cena","koszt"],
  image: ["image","img","photo","фото","картинка","zdjęcie","obraz"],
  category: ["category","категория","kategoria"],
  description: ["description","описание","opis"],
  url: ["url","link","ссылка","href"],
  sku: ["sku","арт","артикул","код","id"]
};

const norm = (s: string) => (s || '').trim().toLowerCase();

function mapHeaders(cols: any[]) {
  const map: Record<string, number|undefined> = {};
  cols.forEach((c, idx) => {
    const label = norm(c.label || c.id || '');
    for (const key of Object.keys(headerAliases)) {
      if (headerAliases[key].some(a => label.includes(a))) {
        if (map[key] == null) map[key] = idx;
      }
    }
  });
  return map;
}

function rowToObject(row: any, cols: any[], map: Record<string, number|undefined>): Product {
  const get = (idx: number|undefined) => (idx != null && row.c[idx] ? row.c[idx].v : undefined);
  const o: Product = {
    name: get(map.name) ?? get(0) ?? 'Товар',
    price: get(map.price),
    image: get(map.image),
    category: get(map.category) ?? 'Без категории',
    description: get(map.description),
    url: get(map.url),
    sku: get(map.sku)
  };
  if (typeof o.price === 'string') {
    const p = o.price.replace(/\s/g, '').replace(',', '.');
    const n = Number(p);
    if (!Number.isNaN(n)) (o as any).price = n;
  }
  return o;
}

export async function fetchProductsFromSheet(sheetId: string, gid: string): Promise<Product[]> {
  const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq?tqx=out:json&gid=${gid}`;
  const res = await fetch(url, { cache: 'no-store' });
  const text = await res.text();
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start === -1 || end === -1) throw new Error('GViz: invalid payload');
  const json = JSON.parse(text.slice(start, end + 1));
  const cols = json.table?.cols ?? [];
  const map = mapHeaders(cols);
  const rows = (json.table?.rows ?? []).filter((r: any) => r && r.c && r.c.some((cell: any) => cell && cell.v != null));
  return rows.map((r: any) => rowToObject(r, cols, map));
}
