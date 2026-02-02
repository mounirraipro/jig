import { Metadata } from 'next';
import ContentPageLayout from '../components/ContentPageLayout';

export const metadata: Metadata = {
  title: 'jigsolitaire | Information for Parents & Guardians',
  description: 'Information for parents and guardians about jigsolitaire. Learn about child safety, privacy, content appropriateness, and healthy gaming habits.',
  keywords: ['parents guide', 'child safety', 'jigsolitaire parents', 'family friendly game', 'kids puzzle game', 'parental guidance'],
  alternates: {
    canonical: 'https://jigsolitaire.online/parents',
  },
  openGraph: {
    title: 'jigsolitaire | Information for Parents & Guardians',
    description: 'Information for parents and guardians about jigsolitaire.',
    images: ['/Jigsolitaire.online_Thmbnail.png'],
  },
};

export default function ParentsPage() {
  return (
    <ContentPageLayout title="Information for Parents & Guardians">
      <div className="prose prose-slate max-w-none">
        <p className="text-xl text-slate-700 mb-8 leading-relaxed">
          Welcome to this information page created especially for parents and guardians. We understand how important it is for families to feel confident and informed about children's online activities.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Platform Overview</h2>
        <p className="mb-6">
          This is a browser-based game that runs directly on the website. This means there is no need to download software, install apps, or create accounts. Children can play instantly using a standard web browser on computers, tablets, and smartphones.
        </p>
        <p className="mb-6">
          Because the game runs entirely in the browser, parents do not need to worry about hidden files, unknown programs, or system changes on family devices.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Child Safety and Privacy</h2>
        <p className="mb-6">
          Child safety is a top priority. The platform has been built in a way that limits risks and avoids unnecessary data collection.
        </p>
        <p className="mb-4">Key safety features:</p>
        <ul className="mb-6 space-y-2">
          <li>No registration or login required</li>
          <li>Children are never asked to provide names, email addresses, phone numbers, or passwords</li>
          <li>No chat features, comment sections, or social tools</li>
          <li>No communication with strangers possible through the game</li>
          <li>No precise location tracking or personal profile collection</li>
        </ul>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">COPPA Compliance</h2>
        <p className="mb-6">
          We follow the principles of the Children's Online Privacy Protection Act (COPPA). We do not knowingly collect personal information from children under the age of 13.
        </p>
        <p className="mb-6">
          Because no accounts or personal details are required, the design naturally limits the collection of sensitive data. This helps keep children protected while playing. Parents who want more details about data handling can review the Privacy Policy.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Content Appropriateness</h2>
        <p className="mb-6">
          The content is created to be suitable for all ages. The game focuses on calm gameplay, simple visuals, and logical thinking. It does not include violence, scary images, strong language, or adult themes. The design is clean and friendly, making it comfortable for younger players.
        </p>
        <p className="mb-6">
          There is no user-generated content, which means children will not see messages, uploads, or comments from other users. We still encourage parents to supervise younger children and explore the game together the first time.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Educational Benefits</h2>
        <p className="mb-6">
          When used in a balanced way, puzzle games can offer educational and developmental benefits for children. Playing can help improve problem-solving skills, as children learn to think ahead, recognize patterns, and make decisions.
        </p>
        <p className="mb-6">
          The game also supports focus and concentration. Completing a puzzle encourages patience and attention to detail. These skills can be helpful in school activities and everyday learning.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Screen Time Guidelines</h2>
        <p className="mb-6">
          While the game is designed to be safe and calm, it is important to balance screen time with other activities. Health experts recommend that young children spend limited time on screens and engage in physical play, reading, and social interaction.
        </p>
        <p className="mb-6">
          For children aged 2 to 5, screen time should be limited to about one hour per day. For older children, parents should set consistent rules that include breaks and offline activities. Online games work best as part of a balanced daily routine.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Healthy Gaming Habits</h2>
        <p className="mb-4">Parents can help children build healthy habits:</p>
        <ul className="mb-6 space-y-2">
          <li>Encourage children to take short breaks every hour</li>
          <li>Make sure they sit comfortably and keep a safe distance from the screen</li>
          <li>Ensure they play in a well-lit room</li>
          <li>Set specific times for playing, such as after homework or chores are completed</li>
        </ul>
        <p className="mb-6">These habits help keep gaming fun and healthy.</p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Parental Controls</h2>
        <p className="mb-6">
          While the game does not include built-in parental control tools, parents can use controls available on browsers and devices. Most web browsers allow parents to block certain websites, limit browsing time, and enable safe search options.
        </p>
        <p className="mb-6">
          Devices such as tablets, smartphones, and computers often include parental control features that help manage how long children can use the internet.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Device and Technical Requirements</h2>
        <p className="mb-6">
          The game works on most modern devices and browsers. It is compatible with Chrome, Firefox, Safari, Edge, and other popular browsers. The game does not require plugins or special software. A stable internet connection is enough to play smoothly.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Reporting Concerns</h2>
        <p className="mb-6">
          If parents or guardians notice anything concerning, we encourage them to contact us. When reporting an issue, it helps to include details such as what happened, when it occurred, and which page was involved. We take all reports seriously and aim to resolve concerns as quickly as possible.
        </p>

        <h2 className="text-2xl font-bold text-slate-900 mt-8 mb-4">Questions and Support</h2>
        <p className="mb-6">
          We value feedback from parents and guardians. Your questions and suggestions help us improve the platform. If you need help or have concerns about child safety, privacy, or content, please contact us through the contact page.
        </p>

        <p className="mb-2"><strong>Email:</strong> <a href="mailto:contact@jigsolitaire.online" className="text-amber-600 hover:text-amber-700 underline">contact@jigsolitaire.online</a></p>

        <div className="mt-8 pt-6 border-t border-slate-200 text-sm text-slate-500">
          <p><strong>HikariTech</strong> (S.a.r.l) - Casablanca, Morocco</p>
          <p>RC 329153 Casablanca | ICE 001706002000045</p>
        </div>
      </div>
    </ContentPageLayout>
  );
}
