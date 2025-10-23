"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

const faqData: FAQItem[] = [
  // Orders & Payment
  {
    category: "Orders & Payment",
    question: "What payment methods do you accept?",
    answer:
      "We accept all major credit cards (Visa, Mastercard, American Express, Discover), PayPal, Apple Pay, and Google Pay. All payments are processed securely through our encrypted payment gateway.",
  },
  {
    category: "Orders & Payment",
    question: "Can I modify or cancel my order after placing it?",
    answer:
      "Orders can be modified or cancelled within 1 hour of placement. After that, orders enter processing and cannot be changed. Please contact us immediately at support@velvetanarchy.com if you need to make changes.",
  },
  {
    category: "Orders & Payment",
    question: "Do you offer gift wrapping?",
    answer:
      "Yes! We offer complimentary gift wrapping for all orders. Simply select the gift wrapping option at checkout, and we'll include a beautiful gift box with a personalized message card.",
  },
  {
    category: "Orders & Payment",
    question: "Will I receive an order confirmation?",
    answer:
      "Yes, you'll receive an email confirmation immediately after placing your order, and another email with tracking information once your order ships.",
  },

  // Shipping & Delivery
  {
    category: "Shipping & Delivery",
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5-7 business days, Express shipping takes 2-3 business days, and Overnight shipping delivers within 1 business day (orders placed before 12 PM EST). International shipping typically takes 10-21 business days.",
  },
  {
    category: "Shipping & Delivery",
    question: "Do you ship internationally?",
    answer:
      "Yes! We ship to most countries worldwide. International shipping rates and delivery times vary by destination. Customers are responsible for any customs duties or import taxes.",
  },
  {
    category: "Shipping & Delivery",
    question: "How can I track my order?",
    answer:
      "Once your order ships, you'll receive a tracking number via email. You can also track your order on our Track Order page or check your order status in your account dashboard.",
  },
  {
    category: "Shipping & Delivery",
    question: "What if my package is lost or damaged?",
    answer:
      "All packages are insured. If your package is lost or arrives damaged, contact us immediately at support@velvetanarchy.com with your order number and photos if applicable. We'll work with the carrier to resolve the issue and send a replacement or refund.",
  },

  // Returns & Exchanges
  {
    category: "Returns & Exchanges",
    question: "What is your return policy?",
    answer:
      "We offer a 30-day return window from the date of delivery. Items must be in original condition, unworn, with all tags attached. Earrings, custom items, and final sale products cannot be returned. See our Returns page for full details.",
  },
  {
    category: "Returns & Exchanges",
    question: "How do I return an item?",
    answer:
      "Email returns@velvetanarchy.com with your order number and reason for return. We'll send you a Return Authorization number and prepaid shipping label within 24 hours. Package your item securely and ship it back using the provided label.",
  },
  {
    category: "Returns & Exchanges",
    question: "How long does it take to process a refund?",
    answer:
      "Once we receive and inspect your return, we'll process your refund within 5-7 business days. The refund will appear in your account 5-10 business days after processing, depending on your bank or card issuer.",
  },
  {
    category: "Returns & Exchanges",
    question: "Can I exchange an item?",
    answer:
      "Yes! Follow the return process and indicate you'd like an exchange. We'll ship your new item once we receive and inspect your return. Exchanges are subject to availability.",
  },

  // Products
  {
    category: "Products",
    question: "Are your jewelry pieces hypoallergenic?",
    answer:
      "Most of our jewelry is made with hypoallergenic materials, including surgical steel and sterling silver. Product descriptions specify materials used. If you have specific allergies, please check the product details or contact us.",
  },
  {
    category: "Products",
    question: "How do I care for my jewelry?",
    answer:
      "Store jewelry in a cool, dry place away from direct sunlight. Clean gently with a soft cloth. Avoid contact with water, perfumes, lotions, and harsh chemicals. Remove jewelry before swimming, showering, or exercising.",
  },
  {
    category: "Products",
    question: "Do you restock sold-out items?",
    answer:
      "Popular items are restocked regularly, but some limited edition pieces may not return. Sign up for restock notifications on product pages, or follow us on social media for restock announcements.",
  },
  {
    category: "Products",
    question: "Can I request custom or personalized jewelry?",
    answer:
      "We offer select personalization options on certain products. Custom orders may be available for bulk purchases or special requests. Contact us at custom@velvetanarchy.com to discuss your needs.",
  },

  // Account & Security
  {
    category: "Account & Security",
    question: "Do I need an account to make a purchase?",
    answer:
      "No, you can checkout as a guest. However, creating an account lets you track orders, save favorites, view order history, and checkout faster on future purchases.",
  },
  {
    category: "Account & Security",
    question: "Is my payment information secure?",
    answer:
      "Absolutely. We use industry-standard SSL encryption to protect all transactions. We never store your complete payment information on our servers. All payments are processed through secure, PCI-compliant payment gateways.",
  },
  {
    category: "Account & Security",
    question: "How do I reset my password?",
    answer:
      "Click the 'Forgot Password' link on the login page. Enter your email address, and we'll send you a password reset link. If you don't receive the email within a few minutes, check your spam folder.",
  },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const categories = ["All", ...Array.from(new Set(faqData.map((faq) => faq.category)))];

  const filteredFAQs =
    selectedCategory === "All"
      ? faqData
      : faqData.filter((faq) => faq.category === selectedCategory);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-Dirty tracking-tighter mb-4">
            Frequently Asked Questions
          </h1>
          <p className="text-lg text-gray-600">
            Find answers to common questions about our products and services
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFAQs.map((faq, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-sm overflow-hidden"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <div>
                  <p className="text-xs text-gray-500 mb-1">{faq.category}</p>
                  <h3 className="font-semibold text-gray-900">{faq.question}</h3>
                </div>
                <ChevronDown
                  className={`flex-shrink-0 ml-4 text-gray-400 transition-transform ${
                    openIndex === index ? "transform rotate-180" : ""
                  }`}
                  size={20}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 pb-4">
                  <p className="text-gray-700 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Still Have Questions */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-semibold mb-3">Still have questions?</h2>
          <p className="text-gray-600 mb-6">
            Can't find what you're looking for? Our support team is here to help.
          </p>
          <a
            href="/contact"
            className="inline-block bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-medium"
          >
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
