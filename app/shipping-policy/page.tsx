export default function ShippingPolicyPage() {
  const lastUpdated = "October 23, 2025";

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-Dirty tracking-tighter mb-4">
            Shipping Policy
          </h1>
          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              At Velvet Anarchy, we're committed to delivering your jewelry safely and
              promptly. This Shipping Policy outlines our shipping methods, costs, and
              delivery times.
            </p>
          </section>

          {/* Processing Time */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Processing Time</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              All orders are processed within 1-3 business days (excluding weekends and
              holidays) after receiving your order confirmation email. You will receive
              another notification when your order has shipped.
            </p>
            <p className="text-gray-700 text-sm leading-relaxed">
              During peak seasons or promotional periods, processing times may be
              extended. We'll notify you of any delays.
            </p>
          </section>

          {/* Shipping Methods and Rates */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Shipping Methods and Rates
            </h2>
            <div className="space-y-4">
              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Standard Shipping</h3>
                <p className="text-gray-700 text-sm mb-2">
                  <span className="font-medium">Cost:</span> $5.99 (Free on orders over
                  $50)
                </p>
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">Delivery:</span> 5-7 business days
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Express Shipping</h3>
                <p className="text-gray-700 text-sm mb-2">
                  <span className="font-medium">Cost:</span> $12.99
                </p>
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">Delivery:</span> 2-3 business days
                </p>
              </div>

              <div className="border border-gray-200 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Overnight Shipping</h3>
                <p className="text-gray-700 text-sm mb-2">
                  <span className="font-medium">Cost:</span> $24.99
                </p>
                <p className="text-gray-700 text-sm">
                  <span className="font-medium">Delivery:</span> 1 business day
                </p>
                <p className="text-gray-700 text-xs text-gray-500 mt-2">
                  Must be ordered before 12 PM EST for next-day delivery
                </p>
              </div>
            </div>
          </section>

          {/* International Shipping */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">International Shipping</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              We currently ship to most countries worldwide. International shipping rates
              and delivery times vary by destination.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 text-sm mb-2">
                <span className="font-medium">International Standard:</span> $15.99 -
                $29.99
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-medium">Delivery:</span> 10-21 business days
              </p>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mt-3">
              <span className="font-semibold">Note:</span> International customers are
              responsible for any customs duties, taxes, or fees imposed by their
              country.
            </p>
          </section>

          {/* Order Tracking */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Order Tracking</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              Once your order ships, you'll receive a shipping confirmation email with
              your tracking number. You can track your order at any time by:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
              <li>Visiting our Track Order page</li>
              <li>Using the tracking link in your shipping confirmation email</li>
              <li>Checking your order status in your account</li>
            </ul>
            <p className="text-gray-700 text-sm leading-relaxed mt-3">
              Please allow 24 hours after shipment for tracking information to become
              available.
            </p>
          </section>

          {/* Shipping Restrictions */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Shipping Restrictions</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              We currently do not ship to:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
              <li>P.O. Boxes (Express and Overnight shipping only)</li>
              <li>Military APO/FPO addresses (Standard shipping available)</li>
            </ul>
          </section>

          {/* Lost or Damaged Packages */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Lost or Damaged Packages</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              If your package is lost or arrives damaged:
            </p>
            <ol className="list-decimal list-inside text-gray-700 text-sm space-y-2 ml-4">
              <li>
                Contact us immediately at{" "}
                <a
                  href="mailto:support@velvetanarchy.com"
                  className="text-black font-semibold hover:underline underline-offset-4"
                >
                  support@velvetanarchy.com
                </a>
              </li>
              <li>Provide your order number and photos if the package is damaged</li>
              <li>
                We'll work with the carrier to resolve the issue and send a replacement
                or refund
              </li>
            </ol>
            <p className="text-gray-700 text-sm leading-relaxed mt-3">
              All packages are insured against loss or damage during transit.
            </p>
          </section>

          {/* Address Changes */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Address Changes</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Please ensure your shipping address is correct before completing your order.
              Once an order has shipped, we cannot change the delivery address. If you
              need to change your address, contact us immediately at{" "}
              <a
                href="mailto:support@velvetanarchy.com"
                className="text-black font-semibold hover:underline underline-offset-4"
              >
                support@velvetanarchy.com
              </a>
              . We'll do our best to help, but we cannot guarantee address changes after
              shipment.
            </p>
          </section>

          {/* Holiday Shipping */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Holiday Shipping</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              During major holidays, shipping carriers may experience delays. We recommend
              ordering early to ensure delivery by your desired date. Holiday shipping
              deadlines will be posted on our website and social media.
            </p>
          </section>

          {/* Contact */}
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Questions?</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you have any questions about shipping, please{" "}
              <a
                href="/contact"
                className="text-black font-semibold hover:underline underline-offset-4"
              >
                contact us
              </a>{" "}
              or check our{" "}
              <a
                href="/faq"
                className="text-black font-semibold hover:underline underline-offset-4"
              >
                FAQ page
              </a>
              .
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
