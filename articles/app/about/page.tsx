import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'About Us | Articles',
  description: 'Learn more about our articles platform and our mission to provide quality content.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-zinc-100 dark:from-zinc-900 dark:to-black">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="mb-8 inline-block text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
        >
          ← Back to home
        </Link>

        <div className="rounded-xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-8" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
            About Us
          </h1>

          <div className="prose prose-zinc dark:prose-invert max-w-none" style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
              <p className="mb-4">
                Welcome to our articles platform, where we strive to provide high-quality, informative content across a diverse range of topics. Our mission is to create a space where knowledge is shared, ideas are explored, and readers can discover valuable insights that enrich their lives.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">What We Cover</h2>
              <p className="mb-4">
                Our platform covers a wide spectrum of topics to cater to diverse interests and needs:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Technology:</strong> Latest trends, tutorials, and insights into the ever-evolving tech world</li>
                <li><strong>Finance:</strong> Financial advice, investment strategies, and economic analysis</li>
                <li><strong>Health:</strong> Wellness tips, medical information, and healthy living guides</li>
                <li><strong>Lifestyle:</strong> Personal development, productivity, and everyday life improvements</li>
                <li><strong>And more:</strong> We continuously expand our content to meet our readers' interests</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Commitment to Quality</h2>
              <p className="mb-4">
                We are committed to delivering content that is:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li><strong>Accurate:</strong> We research thoroughly and fact-check our information</li>
                <li><strong>Original:</strong> Our content is created with unique perspectives and insights</li>
                <li><strong>Valuable:</strong> Every article aims to provide practical value to our readers</li>
                <li><strong>Engaging:</strong> We present information in an accessible and interesting way</li>
                <li><strong>Up-to-date:</strong> We keep our content current and relevant</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Community Engagement</h2>
              <p className="mb-4">
                We believe in the power of community. Our platform encourages readers to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Share their thoughts through comments</li>
                <li>Engage in meaningful discussions</li>
                <li>Learn from diverse perspectives</li>
                <li>Build connections with like-minded readers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Platform</h2>
              <p className="mb-4">
                Built with modern web technologies, our platform provides a seamless reading experience across all devices. We prioritize:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Fast loading times for a smooth experience</li>
                <li>Mobile-friendly design for reading on the go</li>
                <li>Clean, distraction-free layout</li>
                <li>Easy navigation to find content you love</li>
                <li>User privacy and data protection</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Looking Forward</h2>
              <p className="mb-4">
                We are continuously working to improve our platform and expand our content offerings. Our goal is to become your go-to source for reliable, engaging, and valuable information across multiple domains.
              </p>
              <p className="mb-4">
                We value feedback from our community and are always looking for ways to better serve our readers. Your insights help us grow and improve.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Get in Touch</h2>
              <p className="mb-4">
                Have questions, suggestions, or feedback? We'd love to hear from you! Visit our{' '}
                <Link href="/contact" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  contact page
                </Link>{' '}
                to get in touch with us.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Transparency</h2>
              <p className="mb-4">
                We believe in transparency and maintaining trust with our readers:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>We may display advertisements to support our platform</li>
                <li>We respect your privacy and protect your data (see our{' '}
                  <Link href="/privacy" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                    Privacy Policy
                  </Link>)
                </li>
                <li>We follow ethical content creation practices</li>
                <li>We are committed to providing value, not just clicks</li>
              </ul>
            </section>

            <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
              <p className="text-center text-zinc-600 dark:text-zinc-400">
                Thank you for being part of our community!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
