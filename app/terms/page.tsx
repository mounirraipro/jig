import { Metadata } from 'next';
import ContentPageLayout from '../components/ContentPageLayout';

export const metadata: Metadata = {
  title: 'jigsolitaire | Terms of Service',
  description: 'Read the Terms of Service for jigsolitaire. Understand the rules and conditions for using our free online puzzle game.',
  keywords: ['terms of service', 'jigsolitaire terms', 'user agreement', 'terms and conditions'],
  alternates: {
    canonical: 'https://jigsolitaire.online/terms',
  },
  openGraph: {
    title: 'jigsolitaire | Terms of Service',
    description: 'Terms of Service for jigsolitaire.',
    images: ['/Jigsolitaire.online_Thmbnail.png'],
  },
};

export default function TermsPage() {
  return (
    <ContentPageLayout title="Terms of Service">
      <div className="prose prose-slate max-w-none">
        <p className="text-sm text-slate-500 mb-8">Effective Date: February 2026</p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Agreement to Terms</h2>
        <p className="mb-6">
          By visiting or using this website, you agree to these Terms of Service, our Privacy Policy, and our Cookies Policy.
          Parents and guardians are responsible for reviewing these terms before allowing children to use the site.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Permitted Use</h2>
        <p className="mb-4">The website is provided for personal, non-commercial use only. You may:</p>
        <ul className="mb-6 space-y-2">
          <li>Play the game for entertainment and relaxation</li>
          <li>Access the site from any compatible device</li>
          <li>Share links to the website with others</li>
        </ul>
        <p className="mb-4">You may not:</p>
        <ul className="mb-6 space-y-2">
          <li>Use the site for business, resale, or commercial purposes</li>
          <li>Attempt to earn money through unauthorized use of the site</li>
          <li>Modify, copy, or redistribute website content without permission</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Prohibited Activities</h2>
        <p className="mb-4">To keep the site safe and functional, the following actions are strictly prohibited:</p>
        <ul className="mb-6 space-y-2">
          <li>Attempting to hack, damage, or disrupt the website or servers</li>
          <li>Using bots, scripts, or automated tools to interact with the site</li>
          <li>Uploading viruses, malware, or harmful code</li>
          <li>Accessing restricted areas or unauthorized data</li>
          <li>Any activity that interferes with other users' enjoyment</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Intellectual Property Rights</h2>
        <p className="mb-6">
          All content on this website—including text, graphics, logos, code, and design—is owned by HikariTech or its licensors
          and is protected by intellectual property laws. You may view and use the website for personal enjoyment, but you may not copy, modify, distribute, or commercially
          exploit any content without written permission.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Third-Party Services</h2>
        <p className="mb-6">
          The website may include third-party services such as advertising networks or hosting providers. These services
          are governed by their own terms and privacy policies. HikariTech is not responsible for issues caused by third-party services.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Disclaimer of Warranties</h2>
        <p className="mb-4">
          The website is provided "as is" and "as available" without warranties of any kind. We do not guarantee that the site will:
        </p>
        <ul className="mb-6 space-y-2">
          <li>Always work perfectly or without errors</li>
          <li>Be available at all times without interruption</li>
          <li>Be free from bugs or technical issues</li>
        </ul>
        <p className="mb-6">Occasional maintenance or updates may temporarily interrupt access.</p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Limitation of Liability</h2>
        <p className="mb-4">
          To the maximum extent permitted by law, HikariTech is not liable for damages resulting from use of this website, including:
        </p>
        <ul className="mb-6 space-y-2">
          <li>Lost data, device issues, or interrupted gameplay</li>
          <li>Time spent using the site</li>
          <li>Issues caused by third-party services</li>
        </ul>
        <p className="mb-6">Some jurisdictions do not allow certain liability limitations. In those cases, our liability is limited to the extent allowed by law.</p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">User Conduct</h2>
        <p className="mb-6">
          Even though the site does not include chat or social features, users must behave respectfully and lawfully. Misuse of the
          site or attempts to disrupt functionality may result in access restrictions.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Termination of Access</h2>
        <p className="mb-6">
          HikariTech reserves the right to suspend or terminate access to the site at any time if these Terms of Service are violated,
          or if a user creates security risks or technical problems. Action may be taken without prior notice if necessary to protect
          the site and its users.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Updates to Terms</h2>
        <p className="mb-6">
          These Terms of Service may be updated periodically due to legal changes, website improvements, or new features.
          When updated, the effective date will be revised. Continued use of the site after updates constitutes acceptance of the new terms.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Governing Law</h2>
        <p className="mb-6">
          These Terms of Service are governed by the laws applicable to our jurisdiction in Morocco. We encourage users to contact us first with any concerns.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Severability</h2>
        <p className="mb-6">
          If any provision of these Terms is found invalid or unenforceable, the remaining provisions will continue in full force and effect.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Children and Families</h2>
        <p className="mb-6">
          The site is designed to be family-friendly. Parents and guardians should review these Terms with their children.
          By allowing a child to use the site, parents agree to these terms on the child's behalf.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Contact Information</h2>
        <p className="mb-4">Questions about these Terms of Service? Contact us:</p>
        <p className="mb-2"><strong>Email:</strong> <a href="mailto:contact@jigsolitaire.online" className="text-amber-600 hover:text-amber-700 underline">contact@jigsolitaire.online</a></p>

        <div className="mt-8 pt-6 border-t border-slate-200 text-sm text-slate-500">
          <p><strong>HikariTech</strong> (S.a.r.l) - Casablanca, Morocco</p>
          <p>RC 329153 Casablanca | ICE 001706002000045</p>
        </div>
      </div>
    </ContentPageLayout>
  );
}
