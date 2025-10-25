"use client";

import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import StorageImage from "@/components/StorageImage";
import Image from "next/image";

export default function HeroAdmin() {
  const slides = useQuery(api.hero.getAllSlides);
  const products = useQuery(api.products.list);
  const createSlide = useMutation(api.hero.createSlide);
  const updateSlide = useMutation(api.hero.updateSlide);
  const deleteSlide = useMutation(api.hero.deleteSlide);
  const toggleSlideActive = useMutation(api.hero.toggleSlideActive);
  const updateSlideOrders = useMutation(api.hero.updateSlideOrders);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [editingId, setEditingId] = useState<Id<"hero"> | null>(null);
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    productId: "",
    isActive: true,
  });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const resetForm = () => {
    setFormData({
      image: "",
      title: "",
      productId: "",
      isActive: true,
    });
    setEditingId(null);
  };

  // Handle image upload
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
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
      setFormData({ ...formData, image: storageId });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.image) {
      alert("Please upload an image");
      return;
    }

    if (!formData.title.trim()) {
      alert("Please enter a title");
      return;
    }

    try {
      if (editingId) {
        // Find the current slide to keep its order
        const currentSlide = slides?.find(s => s._id === editingId);
        await updateSlide({
          id: editingId,
          image: formData.image,
          title: formData.title,
          productId: formData.productId ? (formData.productId as Id<"products">) : undefined,
          order: currentSlide?.order,
          isActive: formData.isActive,
        });
      } else {
        // Auto-assign order as the last position
        await createSlide({
          image: formData.image,
          title: formData.title,
          productId: formData.productId ? (formData.productId as Id<"products">) : undefined,
          order: slides ? slides.length : 0,
          isActive: formData.isActive,
        });
      }
      resetForm();
    } catch (error) {
      console.error("Error saving slide:", error);
      alert("Failed to save slide");
    }
  };

  const handleEdit = (slide: any) => {
    setFormData({
      image: slide.image,
      title: slide.title,
      productId: slide.productId || "",
      isActive: slide.isActive,
    });
    setEditingId(slide._id);
  };

  const handleDelete = async (id: Id<"hero">) => {
    if (confirm("Are you sure you want to delete this slide?")) {
      try {
        await deleteSlide({ id });
      } catch (error) {
        console.error("Error deleting slide:", error);
        alert("Failed to delete slide");
      }
    }
  };

  const handleToggleActive = async (id: Id<"hero">) => {
    try {
      await toggleSlideActive({ id });
    } catch (error) {
      console.error("Error toggling slide:", error);
      alert("Failed to toggle slide");
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();

    if (draggedIndex === null || !slides || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      return;
    }

    // Reorder the slides array
    const reorderedSlides = [...slides];
    const [draggedSlide] = reorderedSlides.splice(draggedIndex, 1);
    reorderedSlides.splice(dropIndex, 0, draggedSlide);

    // Update orders for all slides
    const updates = reorderedSlides.map((slide, index) => ({
      id: slide._id,
      order: index,
    }));

    try {
      await updateSlideOrders({ updates });
      setDraggedIndex(null);
    } catch (error) {
      console.error("Error reordering slides:", error);
      alert("Failed to reorder slides");
      setDraggedIndex(null);
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  if (slides === undefined || products === undefined) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Hero Slide Management</h1>
        </div>

        {/* Create/Edit Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4">
            {editingId ? "Edit Slide" : "Create New Slide"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hero Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
              />
              {formData.image && (
                <div className="mt-3 relative inline-block">
                  <StorageImage
                    storageId={formData.image}
                    alt="Hero preview"
                    className="w-full max-w-md h-48 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600"
                  >
                    &times;
                  </button>
                </div>
              )}
            </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                  placeholder="Discover a Feerique World"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Link (Optional)
                </label>
                <select
                  value={formData.productId}
                  onChange={(e) => setFormData({ ...formData, productId: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">No product link</option>
                  {products.map((product) => (
                    <option key={product._id} value={product._id}>
                      {product.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black"
                />
                <label htmlFor="isActive" className="ml-2 text-sm font-medium text-gray-700">
                  Active
                </label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors"
                >
                  {editingId ? "Update Slide" : "Create Slide"}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  {editingId ? "Cancel" : "Clear Form"}
                </button>
              </div>
            </form>
          </div>

        {/* Slides List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Existing Slides</h2>
            {slides.length > 0 && (
              <p className="text-sm text-gray-500">
                Drag and drop to reorder slides
              </p>
            )}
          </div>
          {slides.length === 0 ? (
            <p className="text-gray-500">No slides yet. Create your first slide!</p>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {slides.map((slide, index) => (
                <div
                  key={slide._id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`bg-white p-4 rounded-lg shadow-md flex items-center gap-4 cursor-move transition-all ${
                    !slide.isActive ? "opacity-60" : ""
                  } ${draggedIndex === index ? "opacity-50 scale-95" : ""}`}
                >
                  {/* Drag Handle */}
                  <div className="flex flex-col gap-1 text-gray-400 cursor-grab active:cursor-grabbing">
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                    <div className="flex gap-1">
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                      <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                    </div>
                  </div>

                  <div className="relative w-32 h-20 flex-shrink-0">
                    <Image
                      src={slide.imageUrl}
                      alt={slide.title}
                      fill
                      className="object-cover rounded"
                    />
                  </div>

                  <div className="flex-grow">
                    <h3 className="font-semibold text-gray-900">{slide.title}</h3>
                    <p className="text-sm text-gray-600">Order: {slide.order}</p>
                    {slide.product && (
                      <p className="text-sm text-gray-600">
                        Links to: {slide.product.name}
                      </p>
                    )}
                    <p className="text-xs text-gray-500">
                      Status: {slide.isActive ? "Active" : "Inactive"}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleToggleActive(slide._id)}
                      className={`px-4 py-2 rounded-lg transition-colors ${
                        slide.isActive
                          ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                          : "bg-green-100 text-green-700 hover:bg-green-200"
                      }`}
                    >
                      {slide.isActive ? "Deactivate" : "Activate"}
                    </button>
                    <button
                      onClick={() => handleEdit(slide)}
                      className="bg-blue-100 text-blue-700 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(slide._id)}
                      className="bg-red-100 text-red-700 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
