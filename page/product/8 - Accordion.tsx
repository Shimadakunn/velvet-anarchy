"use client";
import { Product } from "@/lib/type";
import { Info, Minus, PlaneTakeoff, Plus, RotateCcw } from "lucide-react";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Accordion({ product }: { product: Product }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleSection = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const sections = [
    {
      icon: Info,
      title: "DETAILS",
      content: product.detail,
    },
    {
      icon: PlaneTakeoff,
      title: "PROCESSING & SHIPPING",
      content:
        "Orders are processed and dispatched within **2-4 business days**. \n Once dispatched, delivery takes **7-14 business days**. \n All shipments are tracked.",
    },
    {
      icon: RotateCcw,
      title: "30 DAY GUARANTEE",
      content:
        "If your product is damaged, send us an email within **7 business days** and we will issue a refund. \n Please note that due to limited stock, all items are final sale and cannot be exchanged once they are shipped/delivered.",
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
              className="w-full px-4 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" strokeWidth={1.8} />
                <span className="text-sm">{section.title.toUpperCase()}</span>
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
              <div className="px-4 pb-4 pt-2 text-sm text-gray-600 prose prose-sm max-w-none prose-p:my-2 prose-ul:my-2 prose-li:my-1 prose-strong:font-semibold prose-ul:list-disc prose-ul:pl-4">
                <ReactMarkdown
                  components={{
                    p: ({ children }) => (
                      <p className="mb-2 whitespace-pre-wrap">{children}</p>
                    ),
                    ul: ({ children }) => (
                      <ul className="list-disc pl-5 my-2 space-y-1">
                        {children}
                      </ul>
                    ),
                    li: ({ children }) => <li className="ml-0">{children}</li>,
                    strong: ({ children }) => (
                      <strong className="font-semibold text-gray-900">
                        {children}
                      </strong>
                    ),
                    br: () => <br />,
                  }}
                >
                  {section.content}
                </ReactMarkdown>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
