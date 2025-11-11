"use client";

import { useIsTop } from "@/lib/isTop";
import { cn } from "@/lib/utils";
import { useCartStore } from "@/store/cartStore";
import { Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const isTop = useIsTop(50);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <>
      <header
        className={cn(
          "w-full py-6 top-0 z-50  transition-all duration-300",
          isTop ? "" : "bg-white/70",
          pathname === "/" ? "fixed" : "sticky"
        )}
      >
        {/* <Marquee /> */}
        <div className="flex justify-between items-center mx-auto max-w-6xl px-4">
          {/* Left: Burger Menu */}
          <button
            onClick={() => setIsMenuOpen(true)}
            aria-label="Open menu"
            className="cursor-pointer"
          >
            <Menu
              size={24}
              strokeWidth={2.25}
              className={cn(isTop && pathname === "/" && "text-white")}
            />
          </button>

          {/* Center: Brand Name */}
          <h1
            className={cn(
              " font-Ghost tracking-tight absolute left-1/2 transform -translate-x-1/2 mb-2 transition-all duration-300 ease-in-out text-black text-4xl",
              isTop &&
                (pathname === "/" || pathname.startsWith("/product/")) &&
                "mt-8 md:mt-12 text-6xl md:text-7xl",
              isTop && pathname === "/" && "text-white"
            )}
          >
            <Link href="/">VelvetAnarchy</Link>
          </h1>

          {/* Right: Shopping Cart */}
          <button
            onClick={toggleCart}
            className="relative cursor-pointer"
            aria-label="Shopping cart"
          >
            <ShoppingCart
              size={24}
              strokeWidth={2.25}
              className={cn(
                "cursor-pointer transition-all duration-300 text-black",
                isTop && pathname === "/" && "text-white"
              )}
            />
            {mounted && totalItems > 0 && (
              <span
                className={cn(
                  "absolute -top-2 -right-2 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center bg-black text-white",
                  isTop && pathname === "/" && "bg-white text-black"
                )}
              >
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 transition-opacity bg-black/50"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Slide-in Navigation */}
      <div
        className={`fixed top-0 left-0 h-full w-[80] md:w-[20%] bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-between items-center p-4 border-b border-gray-300 ">
            <h2 className="text-3xl tracking-tight font-Meg uppercase">Menu</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2 cursor-pointer"
              aria-label="Close menu"
            >
              <X size={24} strokeWidth={2.25} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <ul className="flex flex-col gap-4 uppercase tracking-tight font-normal">
              <li
                className={`cursor-pointer hover:underline underline-offset-4 ${pathname === "/" ? "underline" : ""}`}
              >
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li
                className={`cursor-pointer hover:underline underline-offset-4 ${pathname === "/track" ? "underline" : ""}`}
              >
                <Link href="/track" onClick={() => setIsMenuOpen(false)}>
                  Order Tracking
                </Link>
              </li>
              <li
                className={`cursor-pointer hover:underline underline-offset-4 ${pathname === "/about" ? "underline" : ""}`}
              >
                <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
              </li>
              <li
                className={`cursor-pointer hover:underline underline-offset-4 ${pathname === "/contact" ? "underline" : ""}`}
              >
                <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}

function Marquee() {
  return (
    <div className="w-full bg-black text-white text-xs tracking-tight text-center py-1">
      <span className="mx-8">GET 10% OFF ON ORDERS OVER $50</span>
      <span className="mx-8">FREE SHIPPING ON ORDERS OVER $50</span>
    </div>
  );
}
