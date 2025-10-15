"use client";

import { useState } from "react";
import Carroussel from "@/components/Carroussel";
import Product from "@/page/product";
import {
  Product as ProductType,
  Variant,
  VariantType,
  variantTypes,
} from "@/lib/type";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import StorageImage from "@/components/StorageImage";
import { useStorageUrls } from "@/hooks/useStorageUrls";
import { Trash2 } from "lucide-react";

export default function AddProductPage() {
  const createProduct = useMutation(api.products.create);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [product, setProduct] = useState<ProductType>({
    name: "",
    slug: "",
    detail: "",
    images: [],
    price: 0,
    rating: 0,
    reviews: 0,
    sold: 0,
    stock: 0,
  });

  const [variants, setVariants] = useState<Variant[]>([]);
  const [newVariantType, setNewVariantType] = useState<VariantType>("color");
  const [newVariantValue, setNewVariantValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate slug from name
  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  // Handle file upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        // Generate upload URL from Convex
        const uploadUrl = await generateUploadUrl();

        // Upload the file to Convex storage
        const result = await fetch(uploadUrl, {
          method: "POST",
          headers: { "Content-Type": file.type },
          body: file,
        });

        if (!result.ok) {
          throw new Error(`Failed to upload ${file.name}`);
        }

        const { storageId } = await result.json();
        return storageId;
      });

      const storageIds = await Promise.all(uploadPromises);

      setProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...storageIds],
      }));
    } catch (error) {
      console.error("Error uploading images:", error);
      alert("Failed to upload images. Please try again.");
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
    field: keyof ProductType,
    value: string | number
  ) => {
    setProduct((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };
      // Auto-generate slug when name changes
      if (field === "name" && typeof value === "string") {
        updated.slug = generateSlug(value);
      }
      return updated;
    });
  };

  // Handle product submission
  const handleAddProduct = async () => {
    try {
      setIsSubmitting(true);

      // Validate required fields
      if (!product.name.trim()) {
        alert("Please enter a product name");
        return;
      }

      if (product.images.length === 0) {
        alert("Please add at least one image");
        return;
      }

      // Prepare variants data
      const variantsData = variants.map((v) => ({
        type: v.type,
        value: v.value,
      }));

      // Call the mutation
      const productId = await createProduct({
        name: product.name,
        slug: product.slug,
        detail: product.detail,
        images: product.images,
        price: product.price,
        rating: product.rating,
        reviews: product.reviews,
        sold: product.sold,
        stock: product.stock,
        variants: variantsData,
      });

      alert(`Product added successfully! ID: ${productId}`);

      // Reset form
      setProduct({
        name: "",
        slug: "",
        detail: "",
        images: [],
        price: 0,
        rating: 0,
        reviews: 0,
        sold: 0,
        stock: 0,
      });
      setVariants([]);
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Failed to add product. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Add variant
  const addVariant = () => {
    if (!newVariantValue.trim()) return;

    const newVariant: Variant = {
      type: newVariantType,
      value: newVariantValue,
    };

    setVariants([...variants, newVariant]);
    setNewVariantValue("");
  };

  // Remove variant
  const removeVariant = (type: VariantType, value: string) => {
    setVariants(variants.filter((v) => v.type !== type || v.value !== value));
  };

  // Get URLs for preview
  const previewUrls = useStorageUrls(product.images);

  // Update product with variants for preview
  const productWithVariants = {
    ...product,
    images: previewUrls || product.images,
    variants,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-2">
      <div className="max-w-7xl mx-auto px-4">
        {/* Form Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-4">
          <h2 className="text-xl font-semibold">Product</h2>

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
                      <StorageImage
                        storageId={img}
                        alt={`Preview ${index + 1}`}
                        className="aspect-auto h-20 object-cover rounded"
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
          <div className="mb-4 pt-2 border-t">
            <h3 className="text-lg font-semibold">Variants</h3>

            <div className="flex">
              {/* Add Variant Form */}
              <div className="flex gap-2 mr-4">
                <select
                  value={newVariantType}
                  onChange={(e) =>
                    setNewVariantType(e.target.value as VariantType)
                  }
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {variantTypes.map((type) => (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  value={newVariantValue}
                  onChange={(e) => setNewVariantValue(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && addVariant()}
                  className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              {variants.length > 0 &&
                variants.map((variant) => (
                  <div
                    key={variant.type + variant.value}
                    className="flex items-center justify-between bg-foreground/30 p-2 rounded-md mr-2"
                  >
                    <div>
                      <span className="text-sm text-gray-700">
                        {variant.type}:
                      </span>{" "}
                      {variant.value}
                    </div>
                    <button
                      onClick={() => removeVariant(variant.type, variant.value)}
                      className="text-red-500 hover:text-red-700 transition-colors ml-1"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
            </div>
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

          {/* Add Product Button */}
          <div className="flex justify-end">
            <button
              onClick={handleAddProduct}
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Adding Product..." : "Add Product"}
            </button>
          </div>
        </div>

        {/* Preview Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          {product.images.length > 0 ? (
            previewUrls ? (
              <div className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-1/2">
                  <Carroussel images={previewUrls} />
                </div>
                <div className="w-full md:w-1/2">
                  <Product product={productWithVariants} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-64 bg-gray-100 rounded-md">
                <p className="text-gray-500">Loading preview...</p>
              </div>
            )
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
