"use client";

import { useState } from "react";
import Carroussel from "@/components/Carroussel";
import Product from "@/page/product";
import Image from "next/image";

type VariantType = "size" | "color";

interface Variant {
  id: number;
  productId: number;
  type: VariantType;
  value: string;
}

interface ProductData {
  id: number;
  name: string;
  detail: string;
  images: string[];
  price: number;
  rating: number;
  reviews: number;
  sold: number;
  stock: number;
  variants: Variant[];
}

export default function AddProductPage() {
  const [product, setProduct] = useState<ProductData>({
    id: 1,
    name: "",
    detail: "",
    images: [],
    price: 0,
    rating: 0,
    reviews: 0,
    sold: 0,
    stock: 0,
    variants: [],
  });

  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariantType, setNewVariantType] = useState<VariantType>("color");
  const [newVariantValue, setNewVariantValue] = useState("");

  // Handle file upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [];
      Array.from(files).forEach((file) => {
        const objectUrl = URL.createObjectURL(file);
        newImages.push(objectUrl);
      });
      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...newImages],
      }));
    }
  };

  // Remove image
  const removeImage = (index: number) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Handle product field changes
  const handleFieldChange = (
    field: keyof ProductData,
    value: string | number
  ) => {
    setProduct((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Add variant
  const addVariant = () => {
    if (!newVariantValue.trim()) return;

    const newVariant: Variant = {
      id: variants.length + 1,
      productId: product.id,
      type: newVariantType,
      value: newVariantValue,
    };

    setVariants([...variants, newVariant]);
    setNewVariantValue("");
  };

  // Remove variant
  const removeVariant = (id: number) => {
    setVariants(variants.filter((v) => v.id !== id));
  };

  // Update product with variants for preview
  const productWithVariants = {
    ...product,
    variants,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-2">
      <div className="max-w-7xl mx-auto px-4">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-xl font-semibold mb-2">Product Information</h2>

          {/* Product Name and Detail */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Name{" "}
                <span
                  className="text-blue-500"
                  onClick={() =>
                    window.open(
                      "https://dirtylinestudio.com/product/dirtyline-36daysoftype-2022/",
                      "_blank"
                    )
                  }
                >
                  click here for police formatting
                </span>
              </label>
              <input
                type="text"
                value={product.name}
                onChange={(e) => handleFieldChange("name", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product name"
              />
            </div>
            {/* Product Detail */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Detail
              </label>
              <textarea
                value={product.detail}
                onChange={(e) => handleFieldChange("detail", e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter product detail"
              />
            </div>
          </div>

          {/* Rating, Reviews, Sold, Stock in a row */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-5 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Price</label>
              <input
                type="number"
                value={product.price || ""}
                onChange={(e) =>
                  handleFieldChange("price", parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Star Rating (Max 5)
              </label>
              <input
                type="number"
                value={product.rating || ""}
                onChange={(e) =>
                  handleFieldChange("rating", parseFloat(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0.0"
                min="0"
                max="5"
                step="0.1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Number of Reviews
              </label>
              <input
                type="number"
                value={product.reviews || ""}
                onChange={(e) =>
                  handleFieldChange("reviews", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Number Sold
              </label>
              <input
                type="number"
                value={product.sold || ""}
                onChange={(e) =>
                  handleFieldChange("sold", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Number in Stock
              </label>
              <input
                type="number"
                value={product.stock || ""}
                onChange={(e) =>
                  handleFieldChange("stock", parseInt(e.target.value) || 0)
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          {/* Image Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Images</label>
            <div className="flex items-start gap-4">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageUpload}
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {product.images.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {product.images.map((img, index) => (
                    <div key={index} className="relative">
                      <img
                        src={img}
                        alt={`Preview ${index + 1}`}
                        className="aspect-auto h-20 object-cover"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 bg-red-500 text-white rounded-full flex w-5 h-5 items-center justify-center pb-[2px]"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Variants Section */}
          <div className="mb-4 pt-4 border-t">
            <h3 className="text-lg font-semibold mb-4">Variants</h3>

            {/* Add Variant Form */}
            <div className="flex gap-2 mb-4">
              <select
                value={newVariantType}
                onChange={(e) =>
                  setNewVariantType(e.target.value as VariantType)
                }
                className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="color">Color</option>
                <option value="size">Size</option>
              </select>
              <input
                type="text"
                value={newVariantValue}
                onChange={(e) => setNewVariantValue(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addVariant()}
                className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter variant value"
              />
              <button
                onClick={addVariant}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
              >
                Add
              </button>
            </div>

            {/* Variants List */}
            {variants.length > 0 && (
              <div className="space-y-2">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="flex items-center justify-between bg-gray-50 p-3 rounded-md"
                  >
                    <div>
                      <span className="font-medium capitalize">
                        {variant.type}:
                      </span>{" "}
                      {variant.value}
                    </div>
                    <button
                      onClick={() => removeVariant(variant.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Display Generated Objects */}
          {/* <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-semibold mb-3">Generated Objects</h3>
            <div className="bg-gray-100 rounded-md p-4 overflow-x-auto">
              <pre className="text-xs">
                {JSON.stringify(
                  { product: productWithVariants, variants },
                  null,
                  2
                )}
              </pre>
            </div>
          </div> */}
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {product.images.length > 0 ? (
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/2">
                <Carroussel images={product.images} />
              </div>
              <div className="w-full md:w-1/2">
                <Product product={productWithVariants} />
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
              <p className="text-gray-500">
                Upload images to see product preview
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
