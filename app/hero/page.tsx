"use client";

import Loading from "@/components/Loading";
import StorageImage from "@/components/StorageImage";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useMutation, useQuery } from "convex/react";
import { Menu, ShoppingCart, Upload, X } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function HeroAdmin() {
  const slides = useQuery(api.hero.getAllSlides);
  const products = useQuery(api.products.list);
  const createSlide = useMutation(api.hero.createSlide);
  const updateSlide = useMutation(api.hero.updateSlide);
  const deleteSlide = useMutation(api.hero.deleteSlide);
  const toggleMobileVisibility = useMutation(api.hero.toggleMobileVisibility);
  const toggleDesktopVisibility = useMutation(api.hero.toggleDesktopVisibility);
  const updateSlideOrders = useMutation(api.hero.updateSlideOrders);
  const generateUploadUrl = useMutation(api.files.generateUploadUrl);

  const [editingId, setEditingId] = useState<Id<"hero"> | null>(null);
  const [formData, setFormData] = useState({
    image: "",
    title: "",
    productId: "",
    showOnMobile: true,
    showOnDesktop: true,
  });
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [previewMode, setPreviewMode] = useState<"mobile" | "desktop">(
    "desktop"
  );

  const resetForm = () => {
    setFormData({
      image: "",
      title: "",
      productId: "",
      showOnMobile: true,
      showOnDesktop: true,
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
        const currentSlide = slides?.find((s) => s._id === editingId);
        await updateSlide({
          id: editingId,
          image: formData.image,
          title: formData.title,
          productId: formData.productId
            ? (formData.productId as Id<"products">)
            : undefined,
          order: currentSlide?.order,
          showOnMobile: formData.showOnMobile,
          showOnDesktop: formData.showOnDesktop,
        });
      } else {
        // Auto-assign order as the last position
        await createSlide({
          image: formData.image,
          title: formData.title,
          productId: formData.productId
            ? (formData.productId as Id<"products">)
            : undefined,
          order: slides ? slides.length : 0,
          showOnMobile: formData.showOnMobile,
          showOnDesktop: formData.showOnDesktop,
        });
      }
      resetForm();
    } catch (error) {
      console.error("Error saving slide:", error);
      alert("Failed to save slide");
    }
  };

  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEdit = (slide: any) => {
    setFormData({
      image: slide.image,
      title: slide.title,
      productId: slide.productId || "",
      showOnMobile: slide.showOnMobile ?? true,
      showOnDesktop: slide.showOnDesktop ?? true,
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

  const handleToggleMobile = async (id: Id<"hero">) => {
    try {
      await toggleMobileVisibility({ id });
    } catch (error) {
      console.error("Error toggling mobile visibility:", error);
      alert("Failed to toggle mobile visibility");
    }
  };

  const handleToggleDesktop = async (id: Id<"hero">) => {
    try {
      await toggleDesktopVisibility({ id });
    } catch (error) {
      console.error("Error toggling desktop visibility:", error);
      alert("Failed to toggle desktop visibility");
    }
  };

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index);
  };

  //eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    return <Loading />;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-2 space-y-4">
      {/* Form Section */}
      <div className="bg-white rounded-lg shadow-md max-w-7xl mx-auto p-4">
        <h2 className="text-xl font-semibold mb-4">
          {editingId ? "Edit Slide" : "Hero Slide Management"}
        </h2>
        <form onSubmit={handleSubmit}>
          {/* Title and Product Link */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Hero Image
              </label>
              {/* Upload Section */}
              <div className="flex flex-row gap-2">
                <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                  <Upload className="w-4 h-4" />
                  <span className="text-sm">Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
                {formData.image && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, image: "" })}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm"
                  >
                    <X className="w-4 h-4" />
                    Remove Image
                  </button>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Discover a Feerique World"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Product Link (Optional)
              </label>
              <select
                value={formData.productId}
                onChange={(e) =>
                  setFormData({ ...formData, productId: e.target.value })
                }
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">No product link</option>
                {products.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Visibility Options */}
          <div className="flex flex-row gap-4 justify-between items-end">
            <div className="mb-4 space-y-2">
              <label className="block text-sm font-medium mb-2">
                Visibility Options
              </label>
              <div className="flex gap-6">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showOnMobile"
                    checked={formData.showOnMobile}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        showOnMobile: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="showOnMobile"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    Show on Mobile
                  </label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="showOnDesktop"
                    checked={formData.showOnDesktop}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        showOnDesktop: e.target.checked,
                      })
                    }
                    className="w-4 h-4 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <label
                    htmlFor="showOnDesktop"
                    className="ml-2 text-sm font-medium text-gray-700"
                  >
                    Show on Desktop
                  </label>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className=" space-x-4">
              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-200 text-gray-700 font-semibold rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition-colors"
              >
                {editingId ? "Update Slide" : "Create Slide"}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Preview Section */}
      {formData.image && (
        <div className="flex-1 ">
          <div className="flex items-center justify-between mb-2">
            <span />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setPreviewMode("mobile")}
                className={`px-3 py-1 rounded-md transition-colors text-xs font-medium ${
                  previewMode === "mobile"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                📱 Mobile
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode("desktop")}
                className={`px-3 py-1 rounded-md transition-colors text-xs font-medium ${
                  previewMode === "desktop"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                🖥️ Desktop
              </button>
            </div>
          </div>

          {/* Preview Container */}
          <div className="relative overflow-hidden bg-gray-100 rounded border-2 border-gray-200 flex justify-center">
            {/* Check if slide should be visible based on preview mode */}
            {(previewMode === "mobile" && formData.showOnMobile) ||
            (previewMode === "desktop" && formData.showOnDesktop) ? (
              <div
                className={`relative ${
                  previewMode === "mobile"
                    ? "w-[375px] h-[110vh]"
                    : "w-full h-[110vh]"
                }`}
              >
                {/* Header Preview */}
                <div className="absolute top-0 left-0 right-0 w-full py-6 z-10">
                  <div className="flex justify-between items-center mx-auto max-w-6xl px-4">
                    {/* Left: Burger Menu */}
                    <button aria-label="Menu" className="cursor-pointer">
                      <Menu
                        size={24}
                        strokeWidth={2.25}
                        className="text-white"
                      />
                    </button>

                    {/* Center: Brand Name */}
                    <h1
                      className={`font-Ghost tracking-tight absolute left-1/2 transform -translate-x-1/2 mb-2 transition-all duration-300 ease-in-out text-white ${
                        previewMode === "mobile"
                          ? "mt-8 text-6xl"
                          : "mt-8 md:mt-12 text-6xl md:text-7xl"
                      }`}
                    >
                      VelvetAnarchy
                    </h1>

                    {/* Right: Shopping Cart */}
                    <button
                      className="relative cursor-pointer"
                      aria-label="Shopping cart"
                    >
                      <ShoppingCart
                        size={24}
                        strokeWidth={2.25}
                        className="text-white"
                      />
                    </button>
                  </div>
                </div>

                <StorageImage
                  storageId={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover object-center"
                />
                {/* Overlay Content - Matching Hero.tsx */}
                <div className="absolute bottom-[20%] left-1/2 -translate-x-1/2 flex flex-col items-center justify-center w-full text-white gap-10">
                  <h2
                    className={`uppercase tracking-tight ${
                      previewMode === "mobile" ? "text-2xl" : "text-5xl"
                    }`}
                  >
                    {formData.title || "Your Title Here"}
                  </h2>
                  <button
                    type="button"
                    className={`font-normal hover:underline underline-offset-4 cursor-pointer ${
                      previewMode === "mobile" ? "text-sm" : "text-base"
                    }`}
                  >
                    Shop Now
                  </button>
                </div>
              </div>
            ) : (
              <div
                className={`relative flex items-center justify-center ${
                  previewMode === "mobile"
                    ? "w-[375px] h-[110vh]"
                    : "w-full h-[110vh]"
                }`}
              >
                <div className="text-center p-8">
                  <div className="text-6xl mb-4">🚫</div>
                  <p className="text-gray-600 font-semibold text-lg">
                    This slide is hidden on{" "}
                    {previewMode === "mobile" ? "Mobile" : "Desktop"}
                  </p>
                  <p className="text-gray-500 text-sm mt-2">
                    Enable &quot;Show on{" "}
                    {previewMode === "mobile" ? "Mobile" : "Desktop"}&quot; to
                    preview
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Slides List */}
      <div className="bg-white rounded-lg shadow-md p-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Existing Slides</h2>
          {slides.length > 0 && (
            <p className="text-sm text-gray-500">
              Drag and drop to reorder slides
            </p>
          )}
        </div>
        {slides.length === 0 ? (
          <p className="text-gray-500">
            No slides yet. Create your first slide!
          </p>
        ) : (
          <div className="space-y-3">
            {slides.map((slide, index) => (
              <div
                key={slide._id}
                draggable
                onDragStart={() => handleDragStart(index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDrop={(e) => handleDrop(e, index)}
                onDragEnd={handleDragEnd}
                className={`bg-gray-50 p-4 rounded-md flex items-center gap-4 cursor-move transition-all hover:bg-gray-100 ${
                  !(slide.showOnMobile ?? true) &&
                  !(slide.showOnDesktop ?? true)
                    ? "opacity-60"
                    : ""
                } ${draggedIndex === index ? "opacity-50 scale-95" : ""}`}
              >
                {/* Drag Handle */}
                <div className="flex flex-col gap-1 text-gray-400 cursor-grab active:cursor-grabbing shrink-0">
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

                <div className="relative w-32 h-20 shrink-0">
                  <Image
                    src={slide.imageUrl}
                    alt={slide.title}
                    fill
                    className="object-cover rounded border-2 border-gray-200"
                  />
                </div>

                <div className="grow min-w-0">
                  <h3 className="font-semibold text-gray-900 truncate">
                    {slide.title}
                  </h3>
                  <p className="text-sm text-gray-600">Order: {slide.order}</p>
                  {slide.product && (
                    <p className="text-sm text-gray-600 truncate">
                      Links to: {slide.product.name}
                    </p>
                  )}
                  <div className="flex gap-1 mt-1">
                    {(slide.showOnMobile ?? true) ? (
                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">
                        📱 Mobile
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded line-through">
                        📱 Mobile
                      </span>
                    )}
                    {(slide.showOnDesktop ?? true) ? (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded">
                        🖥️ Desktop
                      </span>
                    ) : (
                      <span className="text-xs bg-gray-200 text-gray-500 px-2 py-0.5 rounded line-through">
                        🖥️ Desktop
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex gap-2 shrink-0">
                  <button
                    onClick={() => handleToggleMobile(slide._id)}
                    className={`px-3 py-2 rounded-md transition-colors text-xs font-medium ${
                      (slide.showOnMobile ?? true)
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                    title={
                      (slide.showOnMobile ?? true)
                        ? "Hide on Mobile"
                        : "Show on Mobile"
                    }
                  >
                    {(slide.showOnMobile ?? true) ? "📱 Hide" : "📱 Show"}
                  </button>
                  <button
                    onClick={() => handleToggleDesktop(slide._id)}
                    className={`px-3 py-2 rounded-md transition-colors text-xs font-medium ${
                      (slide.showOnDesktop ?? true)
                        ? "bg-yellow-100 text-yellow-700 hover:bg-yellow-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                    title={
                      (slide.showOnDesktop ?? true)
                        ? "Hide on Desktop"
                        : "Show on Desktop"
                    }
                  >
                    {(slide.showOnDesktop ?? true) ? "🖥️ Hide" : "🖥️ Show"}
                  </button>
                  <button
                    onClick={() => handleEdit(slide)}
                    className="bg-blue-100 text-blue-700 px-3 py-2 rounded-md hover:bg-blue-200 transition-colors text-xs font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(slide._id)}
                    className="bg-red-100 text-red-700 px-3 py-2 rounded-md hover:bg-red-200 transition-colors text-xs font-medium"
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
  );
}
