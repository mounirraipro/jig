import { Metadata } from 'next';
import ContentPageLayout from '../components/ContentPageLayout';

export const metadata: Metadata = {
  title: 'jigsolitaire | About Us',
  description: 'Learn about jigsolitaire and HikariTech, the company behind your favorite free online jigsaw puzzle game.',
  keywords: ['about jigsolitaire', 'HikariTech', 'puzzle game', 'free online puzzles'],
  alternates: {
    canonical: 'https://jigsolitaire.online/about',
  },
  openGraph: {
    title: 'jigsolitaire | About Us',
    description: 'Learn about jigsolitaire and HikariTech.',
    images: ['/Jigsolitaire.online_Thmbnail.png'],
  },
};

export default function AboutPage() {
  return (
    <ContentPageLayout title="About Us">
      <div className="prose prose-slate max-w-none">
        <p className="text-xl text-slate-700 mb-8 leading-relaxed">
          Welcome to <strong>jigsolitaire</strong>, a free online jigsaw puzzle game designed for players of all ages.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What is jigsolitaire?</h2>
        <p className="mb-6">
          <strong>jigsolitaire</strong> is a unique online puzzle game that combines classic jigsaw mechanics
          with solitaire-style gameplay. The game runs directly in your web browser and requires no installation or account creation.
        </p>
        <p className="mb-6">
          With over 77 carefully curated puzzle levels, the game offers something for everyone—from beginners to expert puzzle solvers.
          Each puzzle is optimized for smooth performance on desktop computers, tablets, and mobile devices.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Our Mission</h2>
        <p className="mb-6">
          To provide high-quality, browser-based games that are instantly accessible to everyone.
          No downloads, no barriers—just pure entertainment.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Our Vision</h2>
        <p className="mb-6">
          To become a trusted name in family-friendly online gaming, creating experiences that bring joy and relaxation to players around the world.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">What Makes Us Different</h2>
        <ul className="mb-6 space-y-3">
          <li><strong>Instant Play</strong> - No downloads or registration required. Just open and play.</li>
          <li><strong>Family-Friendly</strong> - Safe content suitable for all ages, with privacy protections.</li>
          <li><strong>Mobile Optimized</strong> - Plays perfectly on phones, tablets, and desktop browsers.</li>
          <li><strong>Completely Free</strong> - No hidden costs, premium tiers, or pay-to-win mechanics.</li>
          <li><strong>Auto-Save Progress</strong> - Your progress is saved automatically in your browser.</li>
          <li><strong>Regular Updates</strong> - New puzzles and features added regularly.</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Built with Modern Technology</h2>
        <p className="mb-6">
          We use cutting-edge web technologies to ensure fast loading times, smooth gameplay, and responsive design across all devices.
          The game is built with performance and accessibility in mind.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Privacy & Safety First</h2>
        <p className="mb-6">
          We are committed to protecting user privacy. The game collects minimal data and requires no personal information to play.
          For more details, please review our Privacy Policy.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Get in Touch</h2>
        <p className="mb-4">Have questions or feedback? We would love to hear from you.</p>
        <p className="mb-2"><strong>Email:</strong> <a href="mailto:contact@jigsolitaire.online" className="text-amber-600 hover:text-amber-700 underline">contact@jigsolitaire.online</a></p>

        <div className="mt-8 pt-6 border-t border-slate-200 text-sm text-slate-500">
          <p><strong>HikariTech</strong> (S.a.r.l) - Casablanca, Morocco</p>
          <p>RC 329153 Casablanca | ICE 001706002000045</p>
        </div>
      </div>
    </ContentPageLayout>
  );
}
