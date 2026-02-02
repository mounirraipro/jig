import { Metadata } from 'next';
import ContentPageLayout from '../components/ContentPageLayout';

export const metadata: Metadata = {
  title: 'jigsolitaire | Privacy Policy',
  description: 'Read the Privacy Policy for jigsolitaire by HikariTech. Learn how we collect, use, and protect your information.',
  keywords: ['privacy policy', 'jigsolitaire privacy', 'data protection', 'user privacy'],
  alternates: {
    canonical: 'https://jigsolitaire.online/privacy-policy',
  },
  openGraph: {
    title: 'jigsolitaire | Privacy Policy',
    description: 'Privacy Policy for jigsolitaire.',
    images: ['/Jigsolitaire.online_Thmbnail.png'],
  },
};

export default function PrivacyPage() {
  return (
    <ContentPageLayout title="Privacy Policy">
      <div className="prose prose-slate max-w-none">
        <p className="text-sm text-slate-500 mb-8">Last updated: February 2026</p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Information We Collect</h2>
        <p className="mb-4">
          We collect minimal information to ensure the website functions correctly. When you visit the site, certain technical data
          may be collected automatically:
        </p>
        <ul className="mb-6 space-y-2">
          <li>IP address and general location (country/region)</li>
          <li>Browser type and version</li>
          <li>Device type and operating system</li>
          <li>Screen resolution and viewport size</li>
          <li>Pages visited and time spent on site</li>
        </ul>
        <p className="mb-6">
          No account creation or personal information is required to play the game. We do not collect names, email addresses,
          or passwords unless you voluntarily provide them through our contact form.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">How We Use Your Information</h2>
        <p className="mb-4">Collected data is used solely to:</p>
        <ul className="mb-6 space-y-2">
          <li>Ensure the website loads correctly and functions properly</li>
          <li>Optimize performance across different devices and browsers</li>
          <li>Understand website usage patterns to improve user experience</li>
          <li>Detect and prevent abuse, technical issues, or security threats</li>
        </ul>
        <p className="mb-6">We do not sell, rent, or trade your information to third parties.</p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Cookies and Local Storage</h2>
        <p className="mb-4">
          The site uses cookies and browser local storage to enhance your experience. Cookies help us remember your preferences
          and measure website performance. When you first visit, a cookie consent banner will appear allowing you to accept or
          decline non-essential cookies.
        </p>
        <p className="mb-4">Essential cookies and local storage are used to:</p>
        <ul className="mb-6 space-y-2">
          <li>Save your game progress and preferences</li>
          <li>Remember your cookie consent choices</li>
          <li>Track puzzle completion and stars earned</li>
        </ul>
        <p className="mb-6">
          You can disable cookies through your browser settings, though this may affect website functionality.
          For more details, see our <a href="/cookies" className="text-amber-600 hover:text-amber-700 underline">Cookies Policy</a>.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Third-Party Services</h2>
        <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Google AdSense</h3>
        <p className="mb-4">
          We use Google AdSense to display advertisements. AdSense may collect information such as your IP address, browser type,
          and device information to show relevant ads. AdSense uses cookies to personalize advertising based on your browsing activity.
        </p>
        <p className="mb-6">
          You can opt out of personalized advertising by visiting{' '}
          <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">
            Google Ads Settings
          </a>.
          Learn more at{' '}
          <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer" className="text-amber-600 hover:text-amber-700 underline">
            Google's Privacy Policy
          </a>.
        </p>

        <h3 className="text-xl font-semibold text-slate-800 mt-6 mb-3">Hosting and Content Delivery</h3>
        <p className="mb-6">
          We use trusted hosting providers and content delivery networks to ensure fast, reliable service. These services may
          collect technical information similar to what we collect.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Data Security</h2>
        <p className="mb-6">
          We implement reasonable security measures to protect information from unauthorized access or misuse. These include
          secure servers, restricted access controls, and regular monitoring. However, no internet transmission can be 100% secure.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Data Retention</h2>
        <p className="mb-6">
          Technical data is stored only as long as necessary for performance, security, or legal compliance. We regularly
          delete or anonymize data that is no longer needed.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Your Rights</h2>
        <p className="mb-4">Depending on your location, you may have rights to:</p>
        <ul className="mb-6 space-y-2">
          <li>Access information we hold about you</li>
          <li>Request correction or deletion of your data</li>
          <li>Object to certain data processing activities</li>
          <li>Withdraw consent for optional cookies</li>
        </ul>
        <p className="mb-6">
          To exercise these rights, contact us through our{' '}
          <a href="/contact" className="text-amber-600 hover:text-amber-700 underline">contact page</a>.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Children's Privacy</h2>
        <p className="mb-6">
          The site is family-friendly and safe for children. We do not knowingly collect personal information from children under 13.
          No registration is required to play. If you believe a child has shared information with us, please contact us immediately.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">International Data Processing</h2>
        <p className="mb-6">
          Data may be processed on servers in different countries. Data protection laws vary by location. By using this site,
          you consent to international data processing as described in this policy.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Changes to This Policy</h2>
        <p className="mb-6">
          This policy may be updated periodically to reflect changes in laws, technology, or operations. The "Last updated"
          date will be revised when changes are made. Continued use of the site constitutes acceptance of updates.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Contact Us</h2>
        <p className="mb-4">If you have questions about this Privacy Policy or your data, please contact:</p>
        <p className="mb-2"><strong>Email:</strong> <a href="mailto:contact@jigsolitaire.online" className="text-amber-600 hover:text-amber-700 underline">contact@jigsolitaire.online</a></p>

        <div className="mt-8 pt-6 border-t border-slate-200 text-sm text-slate-500">
          <p><strong>HikariTech</strong> (S.a.r.l) - Casablanca, Morocco</p>
          <p>RC 329153 Casablanca | ICE 001706002000045</p>
        </div>
      </div>
    </ContentPageLayout>
  );
}
