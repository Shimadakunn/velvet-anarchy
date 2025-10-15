"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

export default function Carroussel({ images }: { images: string[] }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const goToSlide = (index: number) => {
    setDirection(index > currentIndex ? "right" : "left");
    setCurrentIndex(index);
  };

  const goToPrevious = () => {
    if (currentIndex === 0) return;
    setDirection("left");
    setCurrentIndex(currentIndex - 1);
  };

  const goToNext = () => {
    if (currentIndex === images.length - 1) return;
    setDirection("right");
    setCurrentIndex(currentIndex + 1);
  };

  const checkScrollability = () => {
    if (thumbnailContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } =
        thumbnailContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 1);
    }
  };

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = 200;
      thumbnailContainerRef.current.scrollBy({
        left: direction === "right" ? scrollAmount : -scrollAmount,
        behavior: "smooth",
      });
      // Check scrollability after scroll completes
      setTimeout(checkScrollability, 300);
    }
  };

  // Check scrollability on mount and resize
  useEffect(() => {
    checkScrollability();
    const handleResize = () => checkScrollability();
    window.addEventListener("resize", handleResize);

    const container = thumbnailContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollability);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (container) {
        container.removeEventListener("scroll", checkScrollability);
      }
    };
  }, []);

  // Auto-scroll to active thumbnail
  useEffect(() => {
    if (thumbnailRefs.current[currentIndex] && thumbnailContainerRef.current) {
      const thumbnail = thumbnailRefs.current[currentIndex];
      const container = thumbnailContainerRef.current;

      if (thumbnail) {
        const thumbnailLeft = thumbnail.offsetLeft;
        const thumbnailWidth = thumbnail.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollLeft = container.scrollLeft;

        // Calculate if thumbnail is out of view
        const thumbnailRight = thumbnailLeft + thumbnailWidth;
        const visibleLeft = scrollLeft;
        const visibleRight = scrollLeft + containerWidth;

        if (thumbnailLeft < visibleLeft) {
          // Scroll left to show thumbnail
          container.scrollTo({
            left: thumbnailLeft - 20,
            behavior: "smooth",
          });
        } else if (thumbnailRight > visibleRight) {
          // Scroll right to show thumbnail
          container.scrollTo({
            left: thumbnailRight - containerWidth + 20,
            behavior: "smooth",
          });
        }
        // Check scrollability after auto-scroll
        setTimeout(checkScrollability, 300);
      }
    }
  }, [currentIndex]);

  return (
    <div className="w-full">
      <div className="flex ">
        {/* Navigation Prev Arrows */}
        <button
          onClick={goToPrevious}
          disabled={currentIndex === 0}
          className="p-2"
          aria-label="Previous slide"
        >
          <ArrowIcon size={4} direction="left" disabled={currentIndex === 0} />
        </button>

        {/* Main Image Container */}
        <div className="relative flex-1 aspect-[3/4] overflow-hidden">
          {images.map((image, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-all duration-500 ease-in-out ${
                index === currentIndex
                  ? "opacity-100 translate-x-0"
                  : direction === "right"
                    ? index < currentIndex
                      ? "opacity-0 -translate-x-full"
                      : "opacity-0 translate-x-full"
                    : index < currentIndex
                      ? "opacity-0 -translate-x-full"
                      : "opacity-0 translate-x-full"
              }`}
            >
              <Image
                src={image}
                alt={`Slide ${index + 1}`}
                fill
                className="object-cover"
                priority={index === 0}
              />
            </div>
          ))}
        </div>

        {/* Navigation Next Arrows */}
        <button
          onClick={goToNext}
          disabled={currentIndex === images.length - 1}
          className="p-2"
          aria-label="Next slide"
        >
          <ArrowIcon
            size={4}
            direction="right"
            disabled={currentIndex === images.length - 1}
          />
        </button>
      </div>

      {/* Dot Indicators - Mobile Only */}
      <div className="flex md:hidden justify-center gap-3 mt-4">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`transition-all duration-300 rounded-full focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 ${
              index === currentIndex
                ? "w-2 h-2 bg-gray-800 scale-[1.2]"
                : "w-2 h-2 bg-gray-300 hover:bg-gray-400"
            }`}
            aria-label={`Go to slide ${index + 1}`}
            aria-current={index === currentIndex}
          />
        ))}
      </div>

      {/* Thumbnail Preview Slider - Desktop Only */}
      <div className="items-center justify-center hidden md:flex mt-4">
        {/* Scroll Left Arrow */}
        <button
          onClick={() => scrollThumbnails("left")}
          disabled={!canScrollLeft}
          className="p-1.5"
          aria-label="Scroll thumbnails left"
        >
          <ArrowIcon size={2} direction="left" disabled={!canScrollLeft} />
        </button>

        {/* Scrollable Container */}
        <div
          ref={thumbnailContainerRef}
          className="flex gap-2 overflow-x-auto scrollbar-hide p-1 scroll-smooth"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {images.map((image, index) => (
            <button
              key={index}
              ref={(el) => {
                thumbnailRefs.current[index] = el;
              }}
              onClick={() => goToSlide(index)}
              className={`relative flex-shrink-0 w-16 h-16 overflow-hidden transition-all duration-300  ${
                index === currentIndex
                  ? "ring-1 ring-gray-800 opacity-100"
                  : "hover:opacity-60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
              aria-current={index === currentIndex}
            >
              <Image
                src={image}
                alt={`Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>

        {/* Scroll Right Arrow */}
        <button
          onClick={() => scrollThumbnails("right")}
          disabled={!canScrollRight}
          className="p-1.5"
          aria-label="Scroll thumbnails right"
        >
          <ArrowIcon size={2} direction="right" disabled={!canScrollRight} />
        </button>
      </div>
    </div>
  );
}

function ArrowIcon({
  size,
  direction,
  className,
  disabled,
  strokeWidth = 1,
}: {
  size: number;
  direction: "left" | "right";
  className?: string;
  disabled?: boolean;
  strokeWidth?: number;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 40 40"
      className={`w-${size} h-${size} fill-foreground/70 hover:fill-foreground ${
        disabled ? "cursor-not-allowed fill-gray-300" : "cursor-pointer"
      } ${direction === "left" ? "rotate-180" : ""} ${className}`}
      focusable="false"
      strokeWidth={strokeWidth}
    >
      <path d="m15.5 0.932-4.3 4.38 14.5 14.6-14.5 14.5 4.3 4.4 14.6-14.6 4.4-4.3-4.4-4.4-14.6-14.6z"></path>
    </svg>
  );
}
