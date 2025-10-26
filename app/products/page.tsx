"use client";

import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { Product } from "@/lib/type";
import StorageImage from "@/components/StorageImage";
import ProductCard from "@/components/ProductCard";
import {
  GripVertical,
  Star,
  Flame,
  Edit,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";

export default function ProductsAdminPage() {
  const products = useQuery(api.products.list);
  const activeProducts = useQuery(api.products.listActive);
  const updateOrder = useMutation(api.products.updateOrder);
  const updateMostPopular = useMutation(api.products.updateMostPopular);
  const updateTrending = useMutation(api.products.updateTrending);
  const toggleActive = useMutation(api.products.toggleActive);
  const deleteProduct = useMutation(api.products.deleteProduct);

  const [orderedProducts, setOrderedProducts] = useState<Product[]>([]);
  const [draggedItem, setDraggedItem] = useState<number | null>(null);

  // Initialize ordered products from query
  useEffect(() => {
    if (products) {
      setOrderedProducts(products);
    }
  }, [products]);

  const handleDragStart = (index: number) => {
    setDraggedItem(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItem === null || draggedItem === index) return;

    const items = [...orderedProducts];
    const draggedProduct = items[draggedItem];
    items.splice(draggedItem, 1);
    items.splice(index, 0, draggedProduct);

    setOrderedProducts(items);
    setDraggedItem(index);
  };

  const handleDragEnd = async () => {
    setDraggedItem(null);

    // Auto-save the new order
    try {
      for (let i = 0; i < orderedProducts.length; i++) {
        await updateOrder({
          id: orderedProducts[i]._id as Id<"products">,
          order: i,
        });
      }
    } catch (error) {
      console.error("Error saving product order:", error);
    }
  };

  const handleMostPopularChange = async (productId: string, value: boolean) => {
    try {
      await updateMostPopular({
        id: productId as Id<"products">,
        mostPopular: value,
      });
      // Update local state
      setOrderedProducts((prev) =>
        prev.map((p) =>
          p._id === productId
            ? { ...p, mostPopular: value }
            : { ...p, mostPopular: false }
        )
      );
    } catch (error) {
      console.error("Error updating most popular:", error);
      alert("Failed to update most popular. Please try again.");
    }
  };

  const handleTrendingChange = async (productId: string, value: boolean) => {
    try {
      await updateTrending({
        id: productId as Id<"products">,
        trending: value,
      });
      // Update local state
      setOrderedProducts((prev) =>
        prev.map((p) => (p._id === productId ? { ...p, trending: value } : p))
      );
    } catch (error) {
      console.error("Error updating trending:", error);
      alert("Failed to update trending. Please try again.");
    }
  };

  const handleToggleActive = async (
    productId: string,
    currentState: boolean
  ) => {
    try {
      const newState = !currentState;
      await toggleActive({
        id: productId as Id<"products">,
        isActive: newState,
      });
      // Update local state
      setOrderedProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, isActive: newState } : p
        )
      );
    } catch (error) {
      console.error("Error toggling active state:", error);
      alert("Failed to toggle active state. Please try again.");
    }
  };

  const handleEdit = (productSlug: string) => {
    // Navigate to edit page
    window.location.href = `/modify/${productSlug}`;
  };

  const handleDelete = async (productId: string, productName: string) => {
    if (
      !confirm(
        `Are you sure you want to delete "${productName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      await deleteProduct({
        id: productId as Id<"products">,
      });
      // Update local state
      setOrderedProducts((prev) => prev.filter((p) => p._id !== productId));
      alert("Product deleted successfully!");
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product. Please try again.");
    }
  };

  if (products === undefined || activeProducts === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading products...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Product Management Section */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold">Manage Products</h1>
          </div>

          <p className="text-gray-600 mb-4">
            Drag and drop products to reorder them. Changes are saved
            automatically.
          </p>

          {orderedProducts.length === 0 ? (
            <p className="text-gray-500">No products available.</p>
          ) : (
            <div className="space-y-2">
              {orderedProducts.map((product, index) => (
                <div
                  key={product._id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`flex items-center gap-4 p-4 bg-gray-50 rounded-lg border-2 transition-all cursor-move ${
                    draggedItem === index
                      ? "border-blue-500 opacity-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 text-gray-400">
                    <GripVertical className="w-6 h-6" />
                  </div>

                  {/* Order Number */}
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-semibold">
                    {index + 1}
                  </div>

                  {/* Product Image */}
                  <div className="flex-shrink-0 w-16 h-16 bg-white rounded-md overflow-hidden">
                    {product.images.length > 0 ? (
                      <StorageImage
                        storageId={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-300 text-xs">No Image</span>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {product.price.toFixed(2)} € • {product.stock} in stock
                    </p>
                  </div>

                  {/* Checkboxes Container */}
                  <div className="flex-shrink-0 flex flex-col gap-2">
                    {/* Most Popular Checkbox */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`popular-${product._id}`}
                        checked={product.mostPopular || false}
                        onChange={(e) =>
                          handleMostPopularChange(
                            product._id as string,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-yellow-600 rounded focus:ring-yellow-500"
                      />
                      <label
                        htmlFor={`popular-${product._id}`}
                        className="text-sm font-medium text-gray-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Star className="w-4 h-4 text-yellow-500" />
                        Popular
                      </label>
                    </div>

                    {/* Trending Checkbox */}
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id={`trending-${product._id}`}
                        checked={product.trending || false}
                        onChange={(e) =>
                          handleTrendingChange(
                            product._id as string,
                            e.target.checked
                          )
                        }
                        className="w-4 h-4 text-pink-600 rounded focus:ring-pink-500"
                      />
                      <label
                        htmlFor={`trending-${product._id}`}
                        className="text-sm font-medium text-gray-700 flex items-center gap-1 cursor-pointer"
                      >
                        <Flame className="w-4 h-4 text-pink-500" />
                        Trending
                      </label>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex-shrink-0 flex gap-2">
                    {/* Toggle Active/Deactivate */}
                    <button
                      onClick={() =>
                        handleToggleActive(
                          product._id as string,
                          product.isActive ?? true
                        )
                      }
                      className={`p-2 rounded-md transition-colors ${
                        product.isActive === false
                          ? "bg-gray-200 text-gray-600 hover:bg-gray-300"
                          : "bg-green-100 text-green-600 hover:bg-green-200"
                      }`}
                      title={
                        product.isActive === false
                          ? "Activate product"
                          : "Deactivate product"
                      }
                    >
                      {product.isActive === false ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => handleEdit(product.slug)}
                      className="p-2 bg-blue-100 text-blue-600 rounded-md hover:bg-blue-200 transition-colors"
                      title="Edit product"
                    >
                      <Edit className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() =>
                        handleDelete(product._id as string, product.name)
                      }
                      className="p-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
                      title="Delete product"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Homepage Preview Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-8">
          {/* Preview Products Grid */}
          <div className="bg-gray-50 rounded-lg p-6">
            {activeProducts === undefined ? (
              <p className="text-gray-500">Loading preview...</p>
            ) : activeProducts.length === 0 ? (
              <p className="text-gray-500">No active products to display.</p>
            ) : activeProducts.length < 4 ? (
              <div className="flex flex-wrap justify-center gap-8">
                {activeProducts.map((product) => (
                  <div key={product._id} className="w-64">
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 justify-items-center">
                {activeProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
