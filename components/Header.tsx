"use client";

import Link from "next/link";
import { ShoppingCart, Menu, X } from "lucide-react";
import { useState } from "react";
import { useIsMobile } from "@/lib/isMobile";

export function Header() {
  const isMobile = useIsMobile();
  if (isMobile) return <MobileHeader />;
  else return <DesktopHeader />;
}

function DesktopHeader() {
  return (
    <header className="w-full py-4 border-b border-gray-300 ">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <h1 className="text-4xl font-Dirty mt-2 tracking-tighter cursor-pointer">
            <Link href="/">VeLvEt AnaRCHy</Link>
          </h1>
          <nav>
            <ul className="flex items-center gap-4">
              <li className=" font-semibold cursor-pointer hover:underline underline-offset-4">
                <Link href="/">Home</Link>
              </li>
              <li className="font-semibold cursor-pointer hover:underline underline-offset-4">
                Shop
              </li>
              <li className="font-semibold cursor-pointer hover:underline underline-offset-4">
                About
              </li>
              <li className="font-semibold cursor-pointer hover:underline underline-offset-4">
                Contact
              </li>
            </ul>
          </nav>
        </div>

        <ShoppingCart size={26} strokeWidth={2.25} />
      </div>
    </header>
  );
}

function MobileHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="w-full py-4 border-b border-gray-300">
        <div className="flex justify-between items-center px-4">
          {/* Left: Burger Menu */}
          <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
            <Menu size={24} strokeWidth={2.25} />
          </button>

          {/* Center: Brand Name */}
          <h1 className="text-2xl font-Dirty mt-2 tracking-tighter absolute left-1/2 transform -translate-x-1/2">
            VeLvEt AnaRCHy
          </h1>

          {/* Right: Shopping Cart */}
          <ShoppingCart size={24} strokeWidth={2.25} />
        </div>
      </header>

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
            <h2 className="text-3xl font-Dirty tracking-tighter mt-2">mEnU</h2>
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
              <li className="text-xl font-semibold cursor-pointer hover:underline underline-offset-4">
                Home
              </li>
              <li className="text-xl font-semibold cursor-pointer hover:underline underline-offset-4">
                Shop
              </li>
              <li className="text-xl font-semibold cursor-pointer hover:underline underline-offset-4">
                About
              </li>
              <li className="text-xl font-semibold cursor-pointer hover:underline underline-offset-4">
                Contact
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </>
  );
}
