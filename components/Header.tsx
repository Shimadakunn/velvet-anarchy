"use client";

import { useIsMobile } from "@/lib/isMobile";
import { useCartStore } from "@/store/cartStore";
import { Menu, ShoppingCart, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Marquee from "./ui/marquee";
const items = [
  "BUY 2 OR MORE TO GET 10% OFF",
  "FREE SHIPPING ON ORDERS OVER $50",
  "BUY 2 OR MORE TO GET 10% OFF",
  "FREE SHIPPING ON ORDERS OVER $50",
  "BUY 2 OR MORE TO GET 10% OFF",
  "FREE SHIPPING ON ORDERS OVER $50",
];

export function Header() {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileHeader />;
  else return <DesktopHeader />;
}

function DesktopHeader() {
  const { toggleCart, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <>
      <header className="w-full py-4 border-b border-gray-300 ">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <h1 className="text-4xl font-Meg  mt-2 pb-1 cursor-pointer">
              <Link href="/"> Velvet Anarchy</Link>
            </h1>
            <nav>
              <ul className="flex items-center gap-4">
                <li
                  className={`font-semibold cursor-pointer hover:underline underline-offset-4 ${pathname === "/" ? "underline" : ""}`}
                >
                  <Link href="/">Home</Link>
                </li>
                <li
                  className={`font-semibold cursor-pointer hover:underline underline-offset-4 ${pathname === "/track" ? "underline" : ""}`}
                >
                  <Link href="/track">Order Tracking</Link>
                </li>
                <li
                  className={`font-semibold cursor-pointer hover:underline underline-offset-4 ${pathname === "/about" ? "underline" : ""}`}
                >
                  <Link href="/about">About</Link>
                </li>
                <li
                  className={`font-semibold cursor-pointer hover:underline underline-offset-4 ${pathname === "/contact" ? "underline" : ""}`}
                >
                  <Link href="/contact">Contact</Link>
                </li>
              </ul>
            </nav>
          </div>

          <button
            onClick={toggleCart}
            className="relative cursor-pointer hover:opacity-70 transition-opacity"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={26} strokeWidth={2.25} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>
      <Marquee items={items} />
    </>
  );
}

function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { toggleCart, getTotalItems } = useCartStore();
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = mounted ? getTotalItems() : 0;

  return (
    <>
      <header className="w-full py-4 border-b border-gray-300">
        <div className="flex justify-between items-center px-4">
          {/* Left: Burger Menu */}
          <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
            <Menu size={24} strokeWidth={2.25} />
          </button>

          {/* Center: Brand Name */}
          <h1 className="text-xl font-Meg tracking-tighter mt-2 absolute left-1/2 font-black transform -translate-x-1/2 pb-1">
            <Link href="/">Velvet Anarchy</Link>
          </h1>

          {/* Right: Shopping Cart */}
          <button
            onClick={toggleCart}
            className="relative cursor-pointer"
            aria-label="Shopping cart"
          >
            <ShoppingCart size={24} strokeWidth={2.25} />
            {mounted && totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      <Marquee items={items} />

      {/* Overlay */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-40 transition-opacity"
          onClick={() => setIsMenuOpen(false)}
        />
      )}

      {/* Slide-in Navigation */}
      <div
        className={`fixed top-0 left-0 h-full w-full bg-white z-50 shadow-lg transform transition-transform duration-300 ease-in-out ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Close Button */}
          <div className="flex justify-between items-center p-4 border-b border-gray-300">
            <h2 className="text-3xl font-Meg tracking-tighter mt-2">mEnU</h2>
            <button
              onClick={() => setIsMenuOpen(false)}
              className="p-2"
              aria-label="Close menu"
            >
              <X size={24} strokeWidth={2.25} />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 p-4">
            <ul className="flex flex-col gap-4">
              <li
                className={`text-xl font-semibold cursor-pointer hover:underline underline-offset-4 ${pathname === "/" ? "underline" : ""}`}
              >
                <Link href="/" onClick={() => setIsMenuOpen(false)}>
                  Home
                </Link>
              </li>
              <li
                className={`text-xl font-semibold cursor-pointer hover:underline underline-offset-4 ${pathname === "/track" ? "underline" : ""}`}
              >
                <Link href="/track" onClick={() => setIsMenuOpen(false)}>
                  Order Tracking
                </Link>
              </li>
              <li
                className={`text-xl font-semibold cursor-pointer hover:underline underline-offset-4 ${pathname === "/about" ? "underline" : ""}`}
              >
                <Link href="/about" onClick={() => setIsMenuOpen(false)}>
                  About
                </Link>
              </li>
              <li
                className={`text-xl font-semibold cursor-pointer hover:underline underline-offset-4 ${pathname === "/contact" ? "underline" : ""}`}
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
