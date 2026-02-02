import { Metadata } from 'next';
import ContentPageLayout from '../components/ContentPageLayout';
import ContactForm from '../components/ContactForm';

export const metadata: Metadata = {
  title: 'jigsolitaire | Contact Us',
  description: 'Get in touch with HikariTech, the team behind jigsolitaire. We are here to help with any questions, feedback, or support you need.',
  keywords: ['contact jigsolitaire', 'support', 'feedback', 'help', 'customer service'],
  alternates: {
    canonical: 'https://jigsolitaire.online/contact',
  },
  openGraph: {
    title: 'jigsolitaire | Contact Us',
    description: 'Contact the jigsolitaire team for support and feedback.',
    images: ['/Jigsolitaire.online_Thmbnail.png'],
  },
};

export default function ContactPage() {
  return (
    <ContentPageLayout title="Contact Us">
      <div className="space-y-8">
        {/* Introduction */}
        <div className="prose prose-slate max-w-none">
          <p className="text-xl text-slate-700 mb-6">
            Have a question or feedback? We would love to hear from you.
          </p>
        </div>

        {/* Contact Form */}
        <ContactForm />

        {/* What to expect */}
        <div className="prose prose-slate max-w-none">
          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What to Expect</h2>

          <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">General Inquiries</h3>
          <p className="mb-6">
            For general questions about the game, features, or gameplay, feel free to reach out. We typically respond within 48-72 hours.
          </p>

          <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Report a Bug</h3>
          <p className="mb-6">
            Encountered a technical issue? Let us know! Include details about your device and browser to help us resolve it quickly.
          </p>

          <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Suggestions</h3>
          <p className="mb-6">
            Have an idea for a new feature or improvement? We love hearing your suggestions and feedback.
          </p>

          <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Parents & Guardians</h3>
          <p className="mb-6">
            Questions about child safety or privacy? Visit our Parents Guide or contact us directly for assistance.
          </p>

          <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Common Questions</h2>

          <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">How quickly will I receive a response?</h3>
          <p className="mb-6">
            We aim to respond to all inquiries within 48-72 hours during business days. Response times may be longer during weekends and holidays.
          </p>

          <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">What information should I include in my message?</h3>
          <p className="mb-6">
            For technical issues, please include your device type, browser name and version, and a description of the problem. Screenshots are helpful if applicable.
          </p>

          <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Can I request new features?</h3>
          <p className="mb-6">
            Absolutely! While we cannot guarantee implementation of every suggestion, we carefully consider all feedback when planning updates.
          </p>

          <div className="mt-8 pt-6 border-t border-slate-200 text-sm text-slate-500 not-prose">
            <p><strong>HikariTech</strong> (S.a.r.l) - Casablanca, Morocco</p>
            <p>RC 329153 Casablanca | ICE 001706002000045</p>
          </div>
        </div>
      </div>
    </ContentPageLayout>
  );
}
