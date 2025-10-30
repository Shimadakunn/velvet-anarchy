"use client";

import { Facebook, Instagram, Mail, Twitter } from "lucide-react";
import Link from "next/link";
import { DataFetcher } from "./DataFetcher";
import PaymentBadges from "./PaymentBadges";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-gray-300 bg-white mt-auto">
      {/* Global data fetcher - fetches all data once for the entire app */}
      <DataFetcher />

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-Meg tracking-tighter">
              Velvet Anarchy
            </h2>
            <p className="text-sm text-gray-600">
              Where luxury meets rebellion
            </p>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">
              Shop
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/"
                  className="text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  href="/track"
                  className="text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-colors"
                >
                  Track Order
                </Link>
              </li>
              <li>
                <span className="text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-colors cursor-pointer">
                  New Arrivals
                </span>
              </li>
              <li>
                <span className="text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-colors cursor-pointer">
                  Best Sellers
                </span>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy-policy"
                  className="text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms-of-service"
                  className="text-sm text-gray-600 hover:text-black hover:underline underline-offset-4 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div>
            <h3 className="font-semibold text-sm mb-4 uppercase tracking-wider">
              Stay Connected
            </h3>
            <div className="flex gap-4 mb-6">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-black transition-colors"
                aria-label="Twitter"
              >
                <Twitter size={20} />
              </a>
              <a
                href="mailto:contact@velvetanarchy.com"
                className="text-gray-600 hover:text-black transition-colors"
                aria-label="Email"
              >
                <Mail size={20} />
              </a>
            </div>
            <p className="text-xs text-gray-500">
              Subscribe to our newsletter for exclusive drops and updates.
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-gray-500">
            © {currentYear} Velvet Anarchy. All rights reserved.
          </p>
          <div className="">
            <PaymentBadges className="space-x-4" />
          </div>
          <div className="flex gap-4">
            <Link
              href="/shipping-policy"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Shipping Policy
            </Link>
            <Link
              href="/returns"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              Returns
            </Link>
            <Link
              href="/faq"
              className="text-xs text-gray-400 hover:text-gray-600 transition-colors"
            >
              FAQ
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
