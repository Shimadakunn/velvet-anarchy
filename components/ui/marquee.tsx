export default function Marquee({ items }: { items: string[] }) {
  return (
    <div className="relative flex w-full overflow-x-hidden bg-black text-white font-bold">
      <div className="animate-marquee whitespace-nowrap py-2">
        {items.map((item, index) => {
          return (
            <span key={index + item} className="mx-8 text-xs">
              {item}
            </span>
          );
        })}
      </div>

      <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-2">
        {items.map((item, index) => {
          return (
            <span key={`${index}-${item}`} className="mx-8 text-xs">
              {item}
            </span>
          );
        })}
      </div>
    </div>
  );
}
