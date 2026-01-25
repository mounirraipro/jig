import { Metadata } from 'next';
import ContentPageLayout from '../components/ContentPageLayout';

export const metadata: Metadata = {
    title: 'JigSolitaire | Image Attributions - Free Online Puzzle Game',
    description: 'Image attributions and copyright information for JigSolitaire puzzle images. Learn about the sources and licenses of our puzzle content.',
    keywords: ['image attributions', 'copyright', 'jigsolitaire images', 'puzzle sources', 'image credits'],
    alternates: {
        canonical: 'https://jigsolitaire.online/attributions',
    },
    openGraph: {
        title: 'JigSolitaire | Image Attributions',
        description: 'Image attributions and copyright information for JigSolitaire puzzle images.',
        images: ['/Jigsolitaire.online_Thmbnail.png'],
    },
};

export default function AttributionsPage() {
    return (
        <ContentPageLayout title="Image Attributions">
            <h2>Image Attributions for JigSolitaire</h2>

            <p>Last Updated: January 2026</p>

            <p><strong>JigSolitaire</strong> is committed to respecting intellectual property rights and properly attributing all content used on our website. This page provides detailed information about the sources and licenses of the puzzle images featured in <strong>JigSolitaire</strong>.</p>

            <h2>Image Sources and Copyright</h2>

            <p>All puzzle images used in <strong>JigSolitaire</strong> are sourced from the following categories:</p>

            <h3>Public Domain Images</h3>

            <p>Many images used in <strong>JigSolitaire</strong> are from the public domain, meaning they are free to use without attribution requirements. Public domain images may come from:</p>

            <ul>
                <li>Government archives and databases</li>
                <li>Historical collections with expired copyrights</li>
                <li>Works explicitly released into the public domain by their creators</li>
                <li>Images from sources like Unsplash, Pexels, and Pixabay</li>
            </ul>

            <h3>Licensed Stock Images</h3>

            <p><strong>JigSolitaire</strong> uses images from reputable stock photo services under appropriate licenses that permit commercial use and distribution. These may include:</p>

            <ul>
                <li>Royalty-free images from stock photo providers</li>
                <li>Creative Commons licensed images (with proper attribution)</li>
                <li>Images licensed specifically for use in web applications</li>
            </ul>

            <h3>Original Content</h3>

            <p>Some puzzle images are original content created specifically for <strong>JigSolitaire</strong> by our team or commissioned artists. All original content is owned by <strong>JigSolitaire</strong> and is protected by copyright.</p>

            <h2>Image Usage Policy</h2>

            <p>The puzzle images on <strong>jigsolitaire.online</strong> are provided for gameplay purposes only. Users may:</p>

            <ul>
                <li>View and interact with images while playing <strong>JigSolitaire</strong></li>
                <li>Take screenshots for personal, non-commercial purposes</li>
                <li>Share gameplay experiences on social media with proper attribution to <strong>JigSolitaire</strong></li>
            </ul>

            <p>Users may NOT:</p>

            <ul>
                <li>Download, extract, or redistribute puzzle images from the website</li>
                <li>Use images for commercial purposes without proper licensing</li>
                <li>Claim ownership of any images from <strong>JigSolitaire</strong></li>
                <li>Remove or alter any copyright notices or watermarks</li>
            </ul>

            <h2>Third-Party Rights</h2>

            <p><strong>JigSolitaire</strong> respects the intellectual property rights of others. If you believe that any content on our website infringes your copyright, please contact us immediately at <a href="mailto:contact@jigsolitaire.online" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>contact@jigsolitaire.online</a>.</p>

            <p>When reporting copyright infringement, please include:</p>

            <ul>
                <li>Your contact information (name, email, phone number)</li>
                <li>Description of the copyrighted work you believe is being infringed</li>
                <li>URL or description of where the material appears on <strong>jigsolitaire.online</strong></li>
                <li>Proof of copyright ownership</li>
                <li>A statement that you believe in good faith that the use is not authorized</li>
            </ul>

            <p>We will investigate all copyright claims promptly and take appropriate action, including removal of infringing content if necessary.</p>

            <h2>Image Quality and Modifications</h2>

            <p>Images used in <strong>JigSolitaire</strong> may be modified for gameplay purposes, including:</p>

            <ul>
                <li>Resizing and cropping to fit game requirements</li>
                <li>Color correction and optimization for web display</li>
                <li>Compression to improve loading times</li>
                <li>Splitting into puzzle pieces for game mechanics</li>
            </ul>

            <p>These modifications are made solely to enhance the gaming experience and do not alter the fundamental nature or attribution requirements of the original images.</p>

            <h2>Content Updates</h2>

            <p><strong>JigSolitaire</strong> regularly updates its puzzle image collection. New images are added following the same strict sourcing and licensing policies outlined on this page.</p>

            <p>This attributions page will be updated as needed to reflect changes in our image sources or licensing.</p>

            <h2>Licensing Compliance</h2>

            <p><strong>JigSolitaire</strong> maintains detailed records of all image sources and licenses. We ensure that:</p>

            <ul>
                <li>All images are properly licensed for commercial web use</li>
                <li>Required attributions are maintained in our internal documentation</li>
                <li>License terms are respected and followed accurately</li>
                <li>Regular audits are conducted to verify ongoing compliance</li>
            </ul>

            <h2>Questions About Image Attributions</h2>

            <p>If you have questions about the source or licensing of any specific image used in <strong>JigSolitaire</strong>, please contact us at <a href="mailto:contact@jigsolitaire.online" style={{ color: 'var(--color-accent)', textDecoration: 'underline' }}>contact@jigsolitaire.online</a>.</p>

            <p>We are committed to transparency and will provide source information for any image upon request, subject to our internal record-keeping procedures.</p>

            <h2>Acknowledgments</h2>

            <p>We would like to thank all photographers, artists, and content creators whose work contributes to making <strong>JigSolitaire</strong> an enjoyable experience. Your creativity makes our game possible.</p>

            <p>Thank you to the following platforms and communities that make high-quality, properly licensed images accessible:</p>

            <ul>
                <li>Unsplash - Free high-resolution photos</li>
                <li>Pexels - Free stock photos and videos</li>
                <li>Pixabay - Free images and royalty-free stock</li>
                <li>Public domain archives and government databases</li>
            </ul>

            <p>Enjoy playing <strong>JigSolitaire</strong> with confidence, knowing that all content is properly sourced and licensed.</p>
        </ContentPageLayout>
    );
}
