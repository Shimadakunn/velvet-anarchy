export default function ReturnsPage() {
  const lastUpdated = "October 23, 2025";

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl mb-4">Returns & Exchanges</h1>
          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              We want you to love your Velvet Anarchy jewelry. If you are not
              completely satisfied with your purchase, we are here to help with
              returns and exchanges.
            </p>
          </section>

          {/* Return Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Return Policy</h2>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-gray-800 font-semibold mb-2">
                30-Day Return Window
              </p>
              <p className="text-gray-700 text-sm">
                You have 30 days from the date of delivery to return items for a
                refund or exchange.
              </p>
            </div>

            <h3 className="font-semibold text-lg mb-3">Eligible Returns</h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              To be eligible for a return, items must be:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
              <li>In original condition (unworn and unused)</li>
              <li>In original packaging with all tags attached</li>
              <li>Accompanied by proof of purchase</li>
              <li>Free from any signs of wear, damage, or alterations</li>
            </ul>

            <h3 className="font-semibold text-lg mb-3 mt-4">
              Non-Returnable Items
            </h3>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              The following items cannot be returned:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
              <li>Custom or personalized jewelry</li>
              <li>Earrings (for hygiene reasons)</li>
              <li>Items marked as final sale</li>
              <li>Gift cards</li>
            </ul>
          </section>

          {/* How to Return */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              How to Return an Item
            </h2>
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                  1
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Contact Us</h3>
                  <p className="text-gray-700 text-sm">
                    Email us at{" "}
                    <a
                      href="mailto:returns@vivinana.com"
                      className="text-black font-semibold hover:underline underline-offset-4"
                    >
                      returns@vivinana.com
                    </a>{" "}
                    with your order number and reason for return.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                  2
                </div>
                <div>
                  <h3 className="font-semibold mb-1">
                    Receive Return Authorization
                  </h3>
                  <p className="text-gray-700 text-sm">
                    We&apos;ll send you a Return Authorization (RA) number and
                    return shipping label within 24 hours.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                  3
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Package Your Item</h3>
                  <p className="text-gray-700 text-sm">
                    Securely package your item(s) in the original packaging.
                    Include your RA number inside the package.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 bg-black text-white rounded-full flex items-center justify-center font-semibold">
                  4
                </div>
                <div>
                  <h3 className="font-semibold mb-1">Ship It Back</h3>
                  <p className="text-gray-700 text-sm">
                    Attach the return label and drop off at your nearest carrier
                    location. Keep your tracking number for reference.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Exchanges */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Exchanges</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              We&apos;re happy to exchange items for a different size or style,
              subject to availability. To request an exchange:
            </p>
            <ol className="list-decimal list-inside text-gray-700 text-sm space-y-1 ml-4">
              <li>Follow the return process above</li>
              <li>Indicate in your email that you&apos;d like an exchange</li>
              <li>Specify which item you&apos;d like to receive instead</li>
            </ol>
            <p className="text-gray-700 text-sm leading-relaxed mt-3">
              We&apos;ll ship your exchange item once we receive and inspect
              your return.
            </p>
          </section>

          {/* Refunds */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Refunds</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              Once we receive and inspect your return, we&apos;ll process your
              refund within 5-7 business days. Refunds will be issued to the
              original payment method.
            </p>
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <p className="text-gray-700 text-sm mb-2">
                <span className="font-semibold">Refund Amount:</span> Full
                purchase price of returned items
              </p>
              <p className="text-gray-700 text-sm">
                <span className="font-semibold">Shipping Costs:</span> Original
                shipping fees are non-refundable unless the return is due to our
                error.
              </p>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mt-3">
              Please allow 5-10 business days after processing for the refund to
              appear in your account, depending on your bank or card issuer.
            </p>
          </section>

          {/* Return Shipping */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Return Shipping</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2">Domestic Returns (US)</h3>
                <p className="text-gray-700 text-sm">
                  We provide a prepaid return label for domestic returns. The
                  cost of return shipping ($5.99) will be deducted from your
                  refund unless the return is due to our error or a defective
                  product.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">International Returns</h3>
                <p className="text-gray-700 text-sm">
                  International customers are responsible for return shipping
                  costs. We recommend using a trackable shipping service, as we
                  are not responsible for returns lost in transit.
                </p>
              </div>
            </div>
          </section>

          {/* Damaged or Defective Items */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Damaged or Defective Items
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              If you receive a damaged or defective item, please contact us
              immediately at{" "}
              <a
                href="mailto:support@vivinana.com"
                className="text-black font-semibold hover:underline underline-offset-4"
              >
                support@vivinana.com
              </a>{" "}
              with:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
              <li>Your order number</li>
              <li>Photos of the damaged or defective item</li>
              <li>Description of the issue</li>
            </ul>
            <p className="text-gray-700 text-sm leading-relaxed mt-3">
              We&apos;ll send a replacement or issue a full refund (including
              shipping) at no cost to you.
            </p>
          </section>

          {/* Wrong Item Received */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Wrong Item Received</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you receive the wrong item, please contact us within 7 days of
              delivery. We&apos;ll arrange for the correct item to be sent and
              provide a prepaid label to return the incorrect item at no cost to
              you.
            </p>
          </section>

          {/* Contact */}
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Need Help?</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you have any questions about returns or exchanges, please{" "}
              <a
                href="/contact"
                className="text-black font-semibold hover:underline underline-offset-4"
              >
                contact us
              </a>
              . We&apos;re here to make your return experience as smooth as
              possible.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
