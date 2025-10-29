import StorageImage from "@/components/StorageImage";
import { Product } from "@/lib/type";
import { X } from "lucide-react";
import { useState } from "react";

export default function Guide({ product }: { product: Product }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!product.sizeGuide) {
    return null;
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="font-light underline text-xs mb-2 cursor-pointer"
      >
        Size Guide
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal Content */}
          <div className="relative border w-[50vw] max-w-4xl max-h-[90vh] overflow-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 cursor-pointer hover:text-gray-500 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <StorageImage
              storageId={product.sizeGuide}
              alt="Size Guide"
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </>
  );
}
