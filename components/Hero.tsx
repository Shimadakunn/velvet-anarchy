"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

type HeroSlide = {
  _id: string;
  imageUrl: string;
  title: string;
  product: {
    slug: string;
    name: string;
  } | null;
};

type HeroProps = {
  slides: HeroSlide[];
};

export default function Hero({ slides }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  const nextSlide = useCallback(() => {
    if (!slides || slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides]);

  const prevSlide = useCallback(() => {
    if (!slides || slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, [slides]);

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index);
  }, []);

  // Trigger animation on slide change
  useEffect(() => {
    setShouldAnimate(false);
    const timer = setTimeout(() => setShouldAnimate(true), 50);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds

    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  // If no slides, show nothing or a placeholder
  if (slides.length === 0) {
    return null;
  }

  return (
    <section
      className="w-full relative group"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      <div className="w-full h-[75vh] relative overflow-hidden">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide._id}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={slide.imageUrl}
              alt={slide.title}
              width={1920}
              height={600}
              className="w-full h-full object-cover object-center"
              priority={index === 0}
            />

            {/* Overlay Content */}
            <div className="absolute bottom-14 left-1/2 -translate-x-1/2 flex flex-col items-center justify-center w-full text-white [-webkit-text-stroke:_2px_black] [paint-order:_stroke_fill]">
              {/* [-webkit-text-stroke:_2px_black] [paint-order:_stroke_fill] */}
              <h2 className="font-Meg text-2xl md:text-5xl ">{slide.title}</h2>
              {slide.product ? (
                <Link
                  href={`/product/${slide.product.slug}`}
                  className=" font-medium text-sm md:text-lg border-b"
                >
                  SHOP NOW
                </Link>
              ) : (
                <button className=" font-medium text-sm md:text-lg border-b ">
                  SHOP NOW
                </button>
              )}
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white/60 p-2 md:p-3 rounded-full transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
          aria-label="Previous slide"
        >
          <svg
            className="w-4 h-4 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={nextSlide}
          className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white/60 p-2 md:p-3 rounded-full transition-all duration-300 opacity-100 md:opacity-0 md:group-hover:opacity-100 z-10"
          aria-label="Next slide"
        >
          <svg
            className="w-4 h-4 md:w-6 md:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>

        {/* Dot Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10 w-full md:w-[40vw] px-4">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="relative w-full h-[2px] bg-white/50 hover:bg-white/75 overflow-hidden transition-colors duration-300"
              aria-label={`Go to slide ${index + 1}`}
            >
              <span
                className={`absolute left-0 top-0 h-full bg-white ${
                  index === currentSlide && shouldAnimate
                    ? "w-full transition-[width] ease-linear duration-[5000ms]"
                    : "w-0"
                }`}
              />
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
