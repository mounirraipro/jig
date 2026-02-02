import { Metadata } from 'next';
import ContentPageLayout from '../components/ContentPageLayout';

export const metadata: Metadata = {
  title: 'jigsolitaire | Cookies Policy',
  description: 'Learn about how jigsolitaire uses cookies and similar technologies. Understand your options for managing cookies while playing our free online puzzle game.',
  keywords: ['cookies policy', 'jigsolitaire cookies', 'website cookies', 'privacy', 'browser cookies'],
  alternates: {
    canonical: 'https://jigsolitaire.online/cookies',
  },
  openGraph: {
    title: 'jigsolitaire | Cookies Policy',
    description: 'Learn about how jigsolitaire uses cookies.',
    images: ['/Jigsolitaire.online_Thmbnail.png'],
  },
};

export default function CookiesPage() {
  return (
    <ContentPageLayout title="Cookies Policy">
      <div className="prose prose-slate max-w-none">
        <p className="text-sm text-slate-500 mb-8">Last Updated: February 2026</p>

        <p className="mb-6">
          This Cookies Policy explains how we use cookies and similar technologies to make the website work properly and provide a pleasant experience for all users.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What Are Cookies?</h2>
        <p className="mb-6">
          Cookies are small text files that websites place on your device when you visit them. These files help the website remember certain information and function correctly. Cookies do not contain harmful programs and cannot access personal files on your device.
        </p>
        <p className="mb-6">
          The main purpose of cookies is to ensure smooth gameplay, fast loading times, and a stable browsing experience.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Types of Cookies We Use</h2>

        <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Session Cookies</h3>
        <p className="mb-6">
          These cookies are temporary and are deleted when you close your browser. They help the website remember your actions during a single visit.
        </p>

        <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Persistent Cookies</h3>
        <p className="mb-6">
          These cookies remain on your device for a set period. We use them to remember basic preferences between visits, such as language or layout settings.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Strictly Necessary Cookies</h2>
        <p className="mb-6">
          Strictly necessary cookies are essential for the website to work correctly. Without these cookies, the website may not function as intended. These cookies help with basic tasks such as maintaining game sessions, ensuring security, and managing server load.
        </p>
        <p className="mb-6">
          Because these cookies are required for basic operation, they cannot be disabled directly through our website. However, you can control them through browser settings, which may affect gameplay.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Performance and Analytics Cookies</h2>
        <p className="mb-6">
          Performance and analytics cookies help us understand how visitors use the website. This information is collected in an anonymous and grouped way. These cookies show us which pages are visited most, how long players stay, and whether any errors occur during gameplay.
        </p>
        <p className="mb-6">
          Analytics data helps us improve loading speed, fix bugs, and make the experience more enjoyable for everyone. We may use trusted tools such as Google Analytics to collect this information.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Functionality Cookies</h2>
        <p className="mb-6">
          Functionality cookies allow the website to remember choices you make. These cookies help create a smoother and more personalized experience. For example, we may remember your preferred language, screen layout, or basic display settings.
        </p>
        <p className="mb-6">
          These cookies do not track personal identity and are only used to improve comfort and usability.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Advertising Cookies</h2>
        <p className="mb-6">
          We use advertising cookies through <strong>Google AdSense</strong> to display relevant advertisements and support our free service. Google AdSense uses cookies to show you ads based on your interests and previous visits to websites.
        </p>
        <p className="mb-6">
          When you first visit, you will see a cookie consent banner where you can accept or decline advertising cookies. If you decline, ads may still appear but will not be personalized based on your browsing activity.
        </p>
        <p className="mb-6">
          You can manage your Google ad preferences at any time by visiting{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">
            Google Ads Settings
          </a>.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Third-Party Cookies</h2>
        <p className="mb-6">
          We may work with trusted third-party services to help run the website efficiently. These services may place their own cookies. Examples include analytics providers, hosting services, or content delivery networks that help the site load quickly and reliably.
        </p>
        <p className="mb-6">
          Third-party cookies are managed by external companies and follow their own privacy and cookies policies.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How to Manage Cookies</h2>
        <p className="mb-6">
          You are always in control of cookies. Most web browsers allow you to manage cookie settings easily. You can choose to block cookies, allow only certain cookies, delete existing cookies, or receive alerts before cookies are stored.
        </p>
        <p className="mb-6">
          Popular browsers such as Chrome, Firefox, Safari, Edge, and Opera provide clear instructions in their help sections. Please remember that disabling cookies may affect how the website works.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Effect of Disabling Cookies</h2>
        <p className="mb-6">
          If you choose to disable cookies, the site will still be accessible, but some features may not work as smoothly. You may experience slower loading times, lost preferences, or repeated settings requests.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Children and Cookies</h2>
        <p className="mb-6">
          The site is designed to be safe for children. Cookies used do not collect personal information from children. No registration or personal details are required to play, which helps protect young users. Parents can manage cookie settings through the browser to control how cookies work.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Updates to This Policy</h2>
        <p className="mb-6">
          This Cookies Policy may be updated from time to time due to legal, technical, or operational changes. When updates occur, the "Last Updated" date will be changed. We encourage users to review this policy regularly to stay informed.
        </p>

        <div className="mt-8 pt-6 border-t border-slate-200 text-sm text-slate-500">
          <p><strong>HikariTech</strong> (S.a.r.l) - Casablanca, Morocco</p>
          <p>RC 329153 Casablanca | ICE 001706002000045</p>
        </div>
      </div>
    </ContentPageLayout>
  );
}
