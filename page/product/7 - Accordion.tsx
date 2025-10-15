"use client";
import { useState } from "react";
import { Info, Minus, PlaneTakeoff, Plus, RotateCcw } from "lucide-react";
import { Product } from "@/lib/type";

export default function Accordion({ product }: { product: Product }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const sections = [
    {
      icon: Info,
      title: "Product Details",
      content: product.detail,
    },
    {
      icon: PlaneTakeoff,
      title: "Processing & Shipping",
      content:
        "Add your shipping and processing information here. Include delivery times, shipping methods, and any relevant policies.",
    },
    {
      icon: RotateCcw,
      title: "30 Day Guarantee",
      content:
        "Add your guarantee and return policy information here. Explain the terms and conditions of your guarantee.",
    },
  ];

  return (
    <div className="w-full border-t border-b divide-y">
      {sections.map((section, index) => {
        const Icon = section.icon;
        const isOpen = openIndex === index;

        return (
          <div key={index} className="border-gray-200">
            <button
              onClick={() => toggleSection(index)}
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" strokeWidth={1.8} />
                <span className="">{section.title}</span>
              </div>
              <div className="transition-transform duration-500">
                {isOpen ? (
                  <Minus className="w-4 h-4 flex-shrink-0 rotate-0 transition-transform duration-500" />
                ) : (
                  <Plus className="w-4 h-4 flex-shrink-0 rotate-0 transition-transform duration-500" />
                )}
              </div>
            </button>
            <div
              style={{
                transition: "all 0.35s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              className={`overflow-hidden ${
                isOpen
                  ? "max-h-96 opacity-100 translate-y-0"
                  : "max-h-0 opacity-0 -translate-y-2"
              }`}
            >
              <div className="px-4 pb-4 pt-2 text-sm text-gray-600">
                {section.content}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
