import { useEffect, useState } from "react";

/**
 * Custom hook to detect if the user is at the top of the page
 * @param threshold - Number of pixels from top to be considered "at top" (default: 10)
 * @returns boolean indicating if user is at top of page
 */
export function useIsTop(threshold: number = 20): boolean {
  const [isTop, setIsTop] = useState(true);

  useEffect(() => {
    // Check initial position
    const checkScroll = () => {
      const scrollPosition = window.scrollY || window.pageYOffset;
      setIsTop(scrollPosition <= threshold);
    };

    // Initial check
    checkScroll();

    // Throttle function to limit how often we update state
    let timeoutId: NodeJS.Timeout | null = null;
    const handleScroll = () => {
      if (timeoutId) return;

      timeoutId = setTimeout(() => {
        checkScroll();
        timeoutId = null;
      }, 100); // Update every 100ms max
    };

    // Add scroll listener
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [threshold]);

  return isTop;
}

// Alternative: Simple utility function (non-hook)
export function checkIsTop(threshold: number = 10): boolean {
  if (typeof window === "undefined") return true;
  return (window.scrollY || window.pageYOffset) <= threshold;
}
