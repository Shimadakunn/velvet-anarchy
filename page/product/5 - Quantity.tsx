import { Minus, Plus } from "lucide-react";
import { Product } from "@/lib/type";
import { trackQuantityChange } from "@/lib/analytics";

interface QuantityProps {
  quantity: number;
  onQuantityChange: (newQuantity: number) => void;
  product?: Product;
}

export default function Quantity({
  quantity,
  onQuantityChange,
  product,
}: QuantityProps) {
  const handleDecrease = () => {
    if (quantity > 1) {
      const newQuantity = quantity - 1;
      onQuantityChange(newQuantity);
      
      // Track quantity change
      if (product) {
        trackQuantityChange({
          productId: product._id,
          productName: product.name,
          oldQuantity: quantity,
          newQuantity,
        });
      }
    }
  };

  const handleIncrease = () => {
    const newQuantity = quantity + 1;
    onQuantityChange(newQuantity);
    
    // Track quantity change
    if (product) {
      trackQuantityChange({
        productId: product._id,
        productName: product.name,
        oldQuantity: quantity,
        newQuantity,
      });
    }
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
