export default function Price({ value }: { value?: number | string }) {
  if (value == null || value === '') return <span className="opacity-70">Цена по запросу</span>;
  const num = typeof value === 'number' ? value : Number(String(value).replace(/\s/g, '').replace(',', '.'));
  if (Number.isNaN(num)) return <span>{String(value)}</span>;
  const formatted = new Intl.NumberFormat(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 2 }).format(num);
  return <span>{formatted} zł</span>;
}
