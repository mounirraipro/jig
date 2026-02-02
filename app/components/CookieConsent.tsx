'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function CookieConsent() {
    const [showBanner, setShowBanner] = useState(false);

    useEffect(() => {
        // Check if user has already made a choice
        const consent = localStorage.getItem('jigsolitaire-consent');
        if (!consent) {
            // Delay showing banner slightly for better UX
            setTimeout(() => setShowBanner(true), 1000);
        }
    }, []);

    const handleAccept = () => {
        localStorage.setItem('jigsolitaire-consent', 'accepted');
        setShowBanner(false);
        // Reload to enable ads/analytics
        window.location.reload();
    };

    const handleDecline = () => {
        localStorage.setItem('jigsolitaire-consent', 'declined');
        setShowBanner(false);
    };

    if (!showBanner) return null;

    return (
        <div
            style={{
                position: 'fixed',
                bottom: 0,
                left: 0,
                right: 0,
                backgroundColor: 'rgba(43, 55, 59, 0.98)',
                backdropFilter: 'blur(10px)',
                padding: '1.25rem',
                boxShadow: '0 -4px 20px rgba(0, 0, 0, 0.3)',
                zIndex: 9999,
                borderTop: '2px solid rgba(245, 158, 11, 0.3)',
            }}
        >
            <div
                style={{
                    maxWidth: '1200px',
                    margin: '0 auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                }}
            >
                <div style={{ color: '#fff', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    <strong>🍪 We value your privacy</strong>
                    <p style={{ margin: '0.5rem 0 0 0', color: '#e5e7eb' }}>
                        JigSolitaire uses cookies to enhance your experience and show relevant ads.
                        We also use analytics to improve our game. By clicking "Accept", you consent to our use of cookies.
                        See our{' '}
                        <Link
                            href="/cookies"
                            style={{ color: '#f59e0b', textDecoration: 'underline' }}
                        >
                            Cookie Policy
                        </Link>
                        {' '}and{' '}
                        <Link
                            href="/privacy-policy"
                            style={{ color: '#f59e0b', textDecoration: 'underline' }}
                        >
                            Privacy Policy
                        </Link>
                        {' '}for more information.
                    </p>
                </div>

                <div
                    style={{
                        display: 'flex',
                        gap: '0.75rem',
                        flexWrap: 'wrap',
                    }}
                >
                    <button
                        onClick={handleAccept}
                        style={{
                            backgroundColor: '#f59e0b',
                            color: '#fff',
                            padding: '0.65rem 1.5rem',
                            borderRadius: '0.5rem',
                            border: 'none',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.backgroundColor = '#ea580c';
                            e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.backgroundColor = '#f59e0b';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        Accept All
                    </button>

                    <button
                        onClick={handleDecline}
                        style={{
                            backgroundColor: 'transparent',
                            color: '#e5e7eb',
                            padding: '0.65rem 1.5rem',
                            borderRadius: '0.5rem',
                            border: '2px solid #4b5563',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseOver={(e) => {
                            e.currentTarget.style.borderColor = '#6b7280';
                            e.currentTarget.style.color = '#fff';
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.borderColor = '#4b5563';
                            e.currentTarget.style.color = '#e5e7eb';
                        }}
                    >
                        Decline
                    </button>
                </div>
            </div>
        </div>
    );
}
