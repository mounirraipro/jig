import Link from 'next/link';
import React from 'react';

export default function Footer() {
    return (
        <footer className="py-8 border-t border-slate-200 bg-white" style={{ background: 'var(--color-surface)', borderTopColor: 'var(--color-border)' }}>
            <div className="max-w-4xl mx-auto px-6">
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                    <p>&copy; {new Date().getFullYear()} jigsolitaire. All rights reserved.</p>
                    <div className="flex flex-wrap justify-center gap-4 md:gap-6">
                        <Link href="/about" className="hover:opacity-80 transition-opacity">About</Link>
                        <Link href="/privacy-policy" className="hover:opacity-80 transition-opacity">Privacy</Link>
                        <Link href="/terms" className="hover:opacity-80 transition-opacity">Terms</Link>
                        <Link href="/cookies" className="hover:opacity-80 transition-opacity">Cookies</Link>
                        <Link href="/parents" className="hover:opacity-80 transition-opacity">Parents</Link>
                        <Link href="/contact" className="hover:opacity-80 transition-opacity">Contact</Link>
                    </div>
                </div>
                <div className="text-center text-xs opacity-60" style={{ color: 'var(--color-text-secondary)' }}>
                    <p className="mb-1">Developed by <strong>HikariTech</strong> - Casablanca, Morocco</p>
                </div>
            </div>
        </footer>
    );
}
