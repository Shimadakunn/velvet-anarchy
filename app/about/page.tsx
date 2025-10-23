export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-16">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-Dirty tracking-tighter mb-4">
            VeLvEt AnaRCHy
          </h1>
          <p className="text-lg text-gray-600">
            Where luxury meets rebellion
          </p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-sm p-8 md:p-12 space-y-8">
          {/* Our Story */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Born from a passion for unique, statement-making jewelry, Velvet Anarchy
              represents the perfect fusion of elegance and edge. We believe that jewelry
              is more than just an accessory—it's a form of self-expression, a way to
              showcase your individuality and rebellious spirit.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Every piece in our collection is carefully curated to embody luxury while
              maintaining that unmistakable bold aesthetic that sets you apart from the crowd.
            </p>
          </section>

          {/* Our Vision */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Vision</h2>
            <p className="text-gray-700 leading-relaxed">
              We envision a world where fashion knows no boundaries, where girly meets gritty,
              and where luxury is accessible to those who dare to be different. Velvet Anarchy
              is committed to providing exceptional jewelry that empowers you to express your
              unique style without compromise.
            </p>
          </section>

          {/* Our Values */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-2">Quality First</h3>
                <p className="text-gray-600 text-sm">
                  Every piece is crafted with attention to detail and built to last.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Individual Expression</h3>
                <p className="text-gray-600 text-sm">
                  We celebrate uniqueness and encourage everyone to embrace their personal style.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Customer Care</h3>
                <p className="text-gray-600 text-sm">
                  Your satisfaction is our priority. We're here to make your experience exceptional.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2">Bold Design</h3>
                <p className="text-gray-600 text-sm">
                  We push boundaries and create pieces that make a statement.
                </p>
              </div>
            </div>
          </section>

          {/* Contact CTA */}
          <section className="pt-8 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Have questions? We'd love to hear from you.{" "}
              <a
                href="/contact"
                className="text-black font-semibold hover:underline underline-offset-4"
              >
                Get in touch
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
