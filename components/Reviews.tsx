"use client";

import { useIsMobile } from "@/lib/isMobile";
import { Plus, Star, MessagesSquare, X } from "lucide-react";
import { Review } from "@/lib/type";
import StorageImage from "@/components/StorageImage";
import AddReviewDialog from "@/components/AddReviewDialog";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";

export default function Reviews({
  reviews,
  productId,
  productName,
}: {
  reviews: Review[];
  productId: Id<"products">;
  productName?: string;
}) {
  const isMobile = useIsMobile();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-8 border-t pt-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl">REVIEWS</h2>
          <AddReviewDialog productId={productId} productName={productName}>
            <button className="cursor-pointer border-b text-sm text-gray-500">
              <Plus className="w-4 h-4 inline-block mr-1 mb-1" />
              Add review
            </button>
          </AddReviewDialog>
        </div>
        <p className="text-gray-500">No reviews yet. Be the first to review!</p>
      </div>
    );
  }

  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    const starSize = isMobile ? 4 : 5;

    return (
      <div className="flex items-center">
        <span className="mr-2 font-bold">{rating}/5</span>
        {[...Array(fullStars)].map((_, i) => (
          <Star
            key={`full-${i}`}
            className={`w-${starSize} h-${starSize} fill-black text-black`}
          />
        ))}
        {hasHalfStar && (
          <div className={`relative w-${starSize} h-${starSize}`}>
            <Star
              className={`w-${starSize} h-${starSize} text-black absolute`}
            />
            <div className="overflow-hidden absolute w-1/2">
              <Star
                className={`w-${starSize} h-${starSize} fill-black text-black`}
              />
            </div>
          </div>
        )}
        {[...Array(emptyStars)].map((_, i) => (
          <Star
            key={`empty-${i}`}
            className={`w-${starSize} h-${starSize} text-black`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="border-y py-4">
      <div className="flex justify-between mb-4 text-sm text-gray-500">
        <h2 className="">
          <MessagesSquare className="w-4 h-4 inline-block mr-1" />
          CUSTOMER REVIEWS
        </h2>
        <AddReviewDialog productId={productId} productName={productName}>
          <button className="cursor-pointer border-b">
            <Plus className="w-4 h-4 inline-block mr-1 mb-1" />
            Add review
          </button>
        </AddReviewDialog>
      </div>

      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={review._id || index} className="">
            <div className="flex items-start gap-4">
              {/* User Image */}
              {review.userImage ? (
                <StorageImage
                  storageId={review.userImage}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full object-cover shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shrink-0">
                  <span className="text-gray-600 font-semibold text-lg">
                    {review.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Review Content */}
              <div
                className={`flex-1 pb-4 ${
                  index !== reviews.length - 1 ? "border-b" : ""
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{review.userName}</h3>
                    <p className="text-xs text-gray-500 -translate-y-[4px]">
                      {review.date}
                    </p>
                  </div>
                  {renderStars(review.rating)}
                </div>
                <div className="flex items-start justify-between">
                  <p className="text-gray-700">{review.comment}</p>
                  {/* Review Images - Customer's product photos */}
                  {review.reviewImages && review.reviewImages.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {review.reviewImages.map((imageId, imgIndex) => (
                        <button
                          key={imgIndex}
                          onClick={() => setSelectedImage(imageId)}
                          className="cursor-pointer hover:opacity-80 transition-opacity"
                        >
                          <StorageImage
                            storageId={imageId}
                            alt={`Review image ${imgIndex + 1}`}
                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded border"
                          />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          />

          {/* Modal Content */}
          <div className="relative border w-[90vw] md:w-[70vw] max-w-4xl max-h-[90vh] overflow-auto bg-white">
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 cursor-pointer hover:text-gray-500 transition-colors z-10 bg-white rounded-full p-1"
            >
              <X className="w-5 h-5" />
            </button>

            <StorageImage
              storageId={selectedImage}
              alt="Review image"
              className="w-full h-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
}
