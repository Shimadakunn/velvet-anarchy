"use client";

import { useIsMobile } from "@/lib/isMobile";
import { Star } from "lucide-react";
import { Review } from "@/lib/type";
import StorageImage from "@/components/StorageImage";

export default function Reviews({ reviews }: { reviews: Review[] }) {
  const isMobile = useIsMobile();

  if (!reviews || reviews.length === 0) {
    return (
      <div className="mt-8 border-t pt-8">
        <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
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
      <h2 className="text-2xl font-bold mb-4">Customer Reviews</h2>
      <div className="space-y-6">
        {reviews.map((review, index) => (
          <div key={review._id || index} className="">
            <div className="flex items-start gap-4">
              {/* User Image */}
              {review.userImage ? (
                <StorageImage
                  storageId={review.userImage}
                  alt={review.userName}
                  className="w-12 h-12 rounded-full object-cover flex-shrink-0"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-gray-600 font-semibold text-lg">
                    {review.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              {/* Review Content */}
              <div
                className={`flex-1 pb-4 ${index !== reviews.length - 1 ? "border-b" : ""}`}
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
                        <StorageImage
                          key={imgIndex}
                          storageId={imageId}
                          alt={`Review image ${imgIndex + 1}`}
                          className="w-20 h-20 md:w-24 md:h-24 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
