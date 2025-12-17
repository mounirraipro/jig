import { Metadata } from 'next';
import ContentPageLayout from '../components/ContentPageLayout';

export const metadata: Metadata = {
  title: 'Contact Us | JigSolitaire - Free Online Puzzle Game',
  description: 'Contact the JigSolitaire team for support, feedback, or inquiries. We are here to help you with any questions about our free online puzzle game.',
  keywords: ['contact jigsolitaire', 'support', 'feedback', 'help', 'customer service', 'puzzle game support'],
  alternates: {
    canonical: 'https://jigsolitaire.online/contact',
  },
  openGraph: {
    title: 'Contact Us | JigSolitaire',
    description: 'Contact the JigSolitaire team for support, feedback, or inquiries.',
    images: ['/Jigsolitaire.online_Thmbnail.png'],
  },
};

export default function ContactPage() {
  return (
    <ContentPageLayout title="Contact Us">
      <h2>Contact Us for JigSolitaire</h2>

      <p>Welcome to the official Contact Us page for <strong>JigSolitaire</strong> at <strong>jigsolitaire.online</strong>. We believe that open and friendly communication is very important. Whether you are a player, a parent, a guardian, or simply a visitor, this page explains how you can contact us and what kind of help we can provide related to <strong>JigSolitaire</strong>.</p>

      <p><strong>JigSolitaire</strong> is built to be simple, safe, and enjoyable for everyone, including children. If you have questions, ideas, concerns, or technical issues, we are always happy to hear from you. This page will guide you step by step on how to reach us and what information to include.</p>

      <h2>General Inquiries About JigSolitaire</h2>

      <p>If you have general questions about <strong>JigSolitaire</strong>, the website <strong>jigsolitaire.online</strong>, or how the game works, you can contact us directly by email.</p>

      <p><strong>Email:</strong> contact@jigsolitaire.online</p>

      <p>General inquiries may include questions about gameplay access, browser compatibility, website navigation, or general feedback about your experience with <strong>JigSolitaire</strong>.</p>

      <p>When contacting us about <strong>JigSolitaire</strong>, please use a clear subject line and explain your question in simple words. This helps us understand your message quickly and respond more effectively.</p>

      <h2>How to Contact JigSolitaire Effectively</h2>

      <p>To help us assist you better with <strong>JigSolitaire</strong>, please include the following information in your message when possible.</p>

      <p>Start with a clear subject line that mentions <strong>JigSolitaire</strong> and the reason for your message.</p>

      <p>Describe your question or issue in detail. The more information you provide, the easier it is for us to help.</p>

      <p>If your message is about a technical issue on <strong>JigSolitaire</strong>, include the type of device and browser you are using.</p>

      <p>If you see an error message while playing <strong>JigSolitaire</strong>, please include the exact text if possible.</p>

      <h2>Technical Support for JigSolitaire</h2>

      <p>If you experience technical problems while playing <strong>JigSolitaire</strong>, we recommend trying a few simple steps before contacting us.</p>

      <p>First, refresh the page and try opening <strong>JigSolitaire</strong> again.</p>

      <p>Clear your browser cache and cookies, then reload <strong>jigsolitaire.online</strong>.</p>

      <p>Try using a different browser to see if the issue continues.</p>

      <p>Make sure your browser is updated to the latest version.</p>

      <p>Check your internet connection to ensure it is stable.</p>

      <p>If the problem continues after these steps, please email us at contact@jigsolitaire.online with detailed information about the issue.</p>

      <h2>Bug Reports and Errors on JigSolitaire</h2>

      <p>If you find a bug or error on <strong>JigSolitaire</strong>, we truly appreciate you letting us know. Bug reports help us improve the game and keep it running smoothly for everyone.</p>

      <p>When reporting a bug on <strong>JigSolitaire</strong>, please explain what happened, what you were doing when the issue occurred, and whether the problem happens every time or only sometimes.</p>

      <p>If possible, include the device type, operating system, and browser name.</p>

      <p>Your reports help make <strong>JigSolitaire</strong> better for all players.</p>

      <h2>Feedback and Suggestions for JigSolitaire</h2>

      <p>We love hearing feedback about <strong>JigSolitaire</strong>. Your thoughts help guide future improvements and updates.</p>

      <p>If you have suggestions for making <strong>JigSolitaire</strong> more fun, easier to use, or more enjoyable, feel free to share them with us.</p>

      <p>While we cannot promise that every suggestion will be added, every message is read and carefully considered.</p>

      <p>Your feedback helps shape the future of <strong>JigSolitaire</strong>.</p>

      <h2>Parents and Guardians Contacting JigSolitaire</h2>

      <p>Parents and guardians are always welcome to contact us regarding <strong>JigSolitaire</strong>.</p>

      <p>If you have questions about child safety, privacy, content suitability, or screen time related to <strong>JigSolitaire</strong>, please do not hesitate to reach out.</p>

      <p>We understand how important trust is when children play online games, and we take all parent and guardian concerns seriously.</p>

      <p>Messages from parents about <strong>JigSolitaire</strong> are treated with care and respect.</p>

      <h2>Privacy Questions About JigSolitaire</h2>

      <p>If you have questions about privacy or data use related to <strong>JigSolitaire</strong>, you can contact us directly.</p>

      <p>Please review our Privacy Policy first, as it answers many common questions.</p>

      <p>If you still need clarification about how <strong>JigSolitaire</strong> handles data, email us with a clear explanation of your concern.</p>

      <p>We aim to explain privacy matters in a simple and transparent way.</p>

      <h2>Response Time Expectations for JigSolitaire</h2>

      <p>We aim to respond to most messages about <strong>JigSolitaire</strong> within 48 to 72 hours on business days.</p>

      <p>Response times may be longer on weekends, holidays, or during periods of high message volume.</p>

      <p>Some technical or legal questions related to <strong>JigSolitaire</strong> may require additional time to investigate.</p>

      <p>We appreciate your patience and understanding.</p>

      <h2>Final Message from the JigSolitaire Team</h2>

      <p>Thank you for taking the time to visit the Contact Us page for <strong>JigSolitaire</strong>.</p>

      <p>Whether you are reaching out with a question, concern, suggestion, or simply to say hello, we truly appreciate hearing from you.</p>

      <p>Our goal is to make <strong>jigsolitaire.online</strong> a safe, simple, and enjoyable place for players of all ages.</p>

      <p>We look forward to assisting you and hope you continue to enjoy playing <strong>JigSolitaire</strong>.</p>
    </ContentPageLayout>
  );
}

