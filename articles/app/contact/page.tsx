import { Metadata } from 'next';
import Link from 'next/link';
import ContactForm from './ContactForm';

export const metadata: Metadata = {
  title: 'Contact Us | Articles',
  description: 'Get in touch with us. We\'d love to hear from you!',
};

export default function ContactPage() {
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
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50 mb-4" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
            Contact Us
          </h1>
          
          <p className="text-zinc-600 dark:text-zinc-400 mb-8" style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
            Have a question, suggestion, or feedback? We'd love to hear from you. Fill out the form below and we'll get back to you as soon as possible.
          </p>

          <ContactForm />

          <div className="mt-12 pt-8 border-t border-zinc-200 dark:border-zinc-800">
            <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-50 mb-4" style={{ fontFamily: '"Playfair Display", Georgia, serif' }}>
              Other Ways to Reach Us
            </h2>
            <div className="space-y-4 text-zinc-600 dark:text-zinc-400" style={{ fontFamily: '"Inter", system-ui, sans-serif' }}>
              <p>
                <strong className="text-zinc-900 dark:text-zinc-50">General Inquiries:</strong> Use the contact form above
              </p>
              <p>
                <strong className="text-zinc-900 dark:text-zinc-50">Business Partnerships:</strong> Use the contact form and select "Business/Partnership" as the subject
              </p>
              <p>
                <strong className="text-zinc-900 dark:text-zinc-50">Technical Issues:</strong> Use the contact form and select "Technical Issue" as the subject
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
