export default function PrivacyPolicyPage() {
  const lastUpdated = "October 23, 2025";

  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl font-Meg  mb-4">Privacy Policy</h1>
          <p className="text-sm text-gray-500">Last updated: {lastUpdated}</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 space-y-8">
          {/* Introduction */}
          <section>
            <p className="text-gray-700 leading-relaxed">
              At Velvet Anarchy, we take your privacy seriously. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you visit our website and make purchases.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Information We Collect
            </h2>
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Personal Information
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  We collect information that you provide directly to us,
                  including:
                </p>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 mt-2 ml-4">
                  <li>Name and contact information (email, phone, address)</li>
                  <li>
                    Payment information (processed securely through our payment
                    provider)
                  </li>
                  <li>Order history and preferences</li>
                  <li>Account credentials if you create an account</li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-2">
                  Automatically Collected Information
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">
                  When you visit our website, we automatically collect certain
                  information:
                </p>
                <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 mt-2 ml-4">
                  <li>Browser type and device information</li>
                  <li>IP address and location data</li>
                  <li>Pages visited and time spent on our site</li>
                  <li>Referring website addresses</li>
                </ul>
              </div>
            </div>
          </section>

          {/* How We Use Your Information */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              How We Use Your Information
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              We use the information we collect to:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and our products</li>
              <li>Improve our website and customer experience</li>
              <li>Send marketing communications (with your consent)</li>
              <li>Prevent fraud and ensure security</li>
              <li>Comply with legal obligations</li>
            </ul>
          </section>

          {/* Information Sharing */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Information Sharing</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              We do not sell your personal information. We may share your
              information with:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
              <li>Service providers who help us operate our business</li>
              <li>Payment processors to complete transactions</li>
              <li>Shipping companies to deliver your orders</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </section>

          {/* Data Security */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Data Security</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              We implement appropriate technical and organizational measures to
              protect your personal information. However, no method of
              transmission over the internet is 100% secure, and we cannot
              guarantee absolute security.
            </p>
          </section>

          {/* Your Rights */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Your Rights</h2>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              You have the right to:
            </p>
            <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
              <li>Access the personal information we hold about you</li>
              <li>Request correction of inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Opt-out of marketing communications</li>
              <li>Object to processing of your information</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Cookies</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              We use cookies and similar tracking technologies to improve your
              browsing experience and analyze site traffic. You can control
              cookies through your browser settings.
            </p>
          </section>

          {/* Children's Privacy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Children's Privacy</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              Our website is not intended for children under 13 years of age. We
              do not knowingly collect personal information from children under
              13.
            </p>
          </section>

          {/* Changes to Privacy Policy */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">
              Changes to This Privacy Policy
            </h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. We will
              notify you of any changes by posting the new Privacy Policy on
              this page and updating the "Last updated" date.
            </p>
          </section>

          {/* Contact */}
          <section className="pt-8 border-t border-gray-200">
            <h2 className="text-2xl font-semibold mb-4">Contact Us</h2>
            <p className="text-gray-700 text-sm leading-relaxed">
              If you have any questions about this Privacy Policy, please
              contact us at{" "}
              <a
                href="mailto:privacy@velvetanarchy.com"
                className="text-black font-semibold hover:underline underline-offset-4"
              >
                privacy@velvetanarchy.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
