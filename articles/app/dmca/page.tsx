import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'DMCA Policy | Renewz.org',
  description: 'Digital Millennium Copyright Act (DMCA) policy and copyright infringement procedures.',
};

export default function DMCAPage() {
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
            DMCA Copyright Policy
          </h1>

          <div className="prose prose-zinc dark:prose-invert max-w-none" style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mb-6">
              Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Copyright Infringement Notification</h2>
              <p className="mb-4">
                We respect the intellectual property rights of others and expect our users to do the same. In accordance with the Digital Millennium Copyright Act (DMCA), we will respond expeditiously to claims of copyright infringement on our website.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Filing a DMCA Notice</h2>
              <p className="mb-4">
                If you believe that content on our website infringes your copyright, please provide our Copyright Agent with the following information:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>A physical or electronic signature of the copyright owner or authorized representative</li>
                <li>Identification of the copyrighted work claimed to have been infringed</li>
                <li>Identification of the material that is claimed to be infringing with sufficient detail so we can locate it</li>
                <li>Your contact information, including address, telephone number, and email address</li>
                <li>A statement that you have a good faith belief that the disputed use is not authorized by the copyright owner, its agent, or the law</li>
                <li>A statement under penalty of perjury that the above information is accurate and that you are the copyright owner or authorized to act on their behalf</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">How to Contact Our Copyright Agent</h2>
              <p className="mb-4">
                DMCA notices should be sent to our Copyright Agent through our{' '}
                <Link href="/contact" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  contact page
                </Link>
                {' '}with "DMCA Notice" in the subject line.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Counter-Notification</h2>
              <p className="mb-4">
                If you believe your content was removed by mistake or misidentification, you may file a counter-notification with the following information:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Your physical or electronic signature</li>
                <li>Identification of the material that was removed and its location before removal</li>
                <li>A statement under penalty of perjury that you have a good faith belief the material was removed or disabled as a result of mistake or misidentification</li>
                <li>Your name, address, telephone number, and a statement consenting to jurisdiction in your location</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Repeat Infringers</h2>
              <p className="mb-4">
                We will terminate the accounts of users who are repeat infringers of copyrighted material.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">No Guarantee</h2>
              <p className="mb-4">
                Please note that we are not responsible for determining whether content infringes copyright. We will process valid DMCA notices and counter-notices according to the procedures outlined in the DMCA.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">False Claims</h2>
              <p className="mb-4">
                Please be aware that under Section 512(f) of the DMCA, any person who knowingly materially misrepresents that material or activity is infringing may be subject to liability for damages.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
              <p className="mb-4">
                We are committed to:
              </p>
              <ul className="list-disc pl-6 mb-4">
                <li>Responding to valid DMCA notices within a reasonable timeframe</li>
                <li>Removing or disabling access to allegedly infringing material when properly notified</li>
                <li>Notifying the user who posted the material</li>
                <li>Terminating repeat infringers</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Questions</h2>
              <p className="mb-4">
                If you have questions about this DMCA policy, please{' '}
                <Link href="/contact" className="text-blue-600 hover:text-blue-700 dark:text-blue-400">
                  contact us
                </Link>.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
