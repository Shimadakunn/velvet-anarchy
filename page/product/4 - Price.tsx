export default function Price({ price }: { price: number }) {
  return <span className="text-xl font-normal tracking-tight">€{price}</span>;
}
