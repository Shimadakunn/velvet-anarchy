export default function Price({ price }: { price: number }) {
  return (
    <span className="text-3xl font-extrabold tracking-tighter">
      €{price.toFixed(2)}
    </span>
  );
}
