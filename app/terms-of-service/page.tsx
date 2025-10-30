export default function TermsOfServicePage() {
  const lastUpdated = "October 23, 2025";

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-Meg  mb-4">Terms of Service</h1>
          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              Welcome to Velvet Anarchy. By accessing or using our website and
              services, you agree to be bound by these Terms of Service. Please
              read them carefully.
            </p>
          </section>

          {/* Acceptance of Terms */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Acceptance of Terms</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              By using our website, you confirm that you are at least 18 years
              old or have the consent of a parent or guardian. If you do not
              agree to these terms, please do not use our services.
            </p>
          </section>

          {/* Use of Website */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Use of Website</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              You agree to use our website only for lawful purposes. You must
              not:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe on intellectual property rights</li>
              <li>Transmit harmful code or viruses</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>
                Use automated systems to access the website without permission
              </li>
              <li>Engage in fraudulent activities</li>
            </ul>
          </section>

          {/* Products and Orders */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Products and Orders</h2>
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold mb-2">Product Information</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We make every effort to display our products accurately.
                  However, we cannot guarantee that colors and images will
                  appear exactly as they do in person. All products are subject
                  to availability.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Pricing</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  All prices are in USD and are subject to change without
                  notice. We reserve the right to refuse or cancel orders if
                  pricing errors occur.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Order Acceptance</h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  Your receipt of an order confirmation does not signify our
                  acceptance of your order. We reserve the right to refuse or
                  cancel any order for any reason.
                </p>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Payment</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Payment is due at the time of purchase. We accept major credit
              cards and other payment methods as displayed on our website. By
              providing payment information, you represent that you are
              authorized to use the payment method.
            </p>
          </section>

          {/* Shipping and Delivery */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Shipping and Delivery
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Shipping times are estimates and not guaranteed. We are not
              responsible for delays caused by shipping carriers or customs. For
              more information, please see our{" "}
              <a
                href="/shipping-policy"
                className="text-black font-semibold hover:underline underline-offset-4"
              >
                Shipping Policy
              </a>
              .
            </p>
          </section>

          {/* Returns and Refunds */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Returns and Refunds</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              We want you to be satisfied with your purchase. Please review our{" "}
              <a
                href="/returns"
                className="text-black font-semibold hover:underline underline-offset-4"
              >
                Returns Policy
              </a>{" "}
              for information on returns and refunds.
            </p>
          </section>

          {/* Intellectual Property */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Intellectual Property
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              All content on this website, including text, graphics, logos,
              images, and software, is the property of Velvet Anarchy and is
              protected by copyright and trademark laws. You may not reproduce,
              distribute, or create derivative works without our explicit
              permission.
            </p>
          </section>

          {/* Limitation of Liability */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Limitation of Liability
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              To the fullest extent permitted by law, Velvet Anarchy shall not
              be liable for any indirect, incidental, special, consequential, or
              punitive damages resulting from your use of or inability to use
              our website or products.
            </p>
          </section>

          {/* Indemnification */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Indemnification</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              You agree to indemnify and hold harmless Velvet Anarchy from any
              claims, damages, losses, or expenses arising from your use of our
              website or violation of these Terms of Service.
            </p>
          </section>

          {/* Changes to Terms */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Changes to Terms</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              We reserve the right to modify these Terms of Service at any time.
              Changes will be effective immediately upon posting. Your continued
              use of the website constitutes acceptance of the modified terms.
            </p>
          </section>

          {/* Governing Law */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Governing Law</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              These Terms of Service are governed by and construed in accordance
              with the laws of the jurisdiction in which Velvet Anarchy
              operates, without regard to conflict of law principles.
            </p>
          </section>

          {/* Contact */}
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you have any questions about these Terms of Service, please
              contact us at{" "}
              <a
                href="mailto:legal@velvetanarchy.com"
                className="text-black font-semibold hover:underline underline-offset-4"
              >
                legal@velvetanarchy.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
