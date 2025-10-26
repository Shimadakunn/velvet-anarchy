import { Minus, Plus } from "lucide-react";

interface QuantityProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
}

export default function Quantity({
  quantity,
  onQuantityChange,
}: QuantityProps) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onQuantityChange(quantity - 1);
    }
  };

  const handleIncrease = () => {
    onQuantityChange(quantity + 1);
  };

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">QUANTITY</h3>
      <div className="flex items-center space-x-4">
        <button
          onClick={handleDecrease}
          className="border border-black h-8 w-8 flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
          aria-label="Decrease quantity"
          disabled={quantity <= 1}
        >
          <Minus size={16} strokeWidth={3} />
        </button>
        <span className="text-xl font-bold w-8 text-center">{quantity}</span>
        <button
          onClick={handleIncrease}
          className="border border-black p-2 h-8 w-8 flex items-center justify-center cursor-pointer"
          aria-label="Increase quantity"
        >
          <Plus size={18} strokeWidth={3} />
        </button>
      </div>
    </div>
  );
}
