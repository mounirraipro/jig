'use client';

import { useEffect, useRef } from 'react';

interface AdUnitProps {
    adSlot: string;
    adFormat?: 'auto' | 'fluid' | 'rectangle' | 'vertical' | 'horizontal';
    adStyle?: React.CSSProperties;
    className?: string;
}

/**
 * Reusable Google AdSense component
 * Publisher ID: pub-1032974487169355 (from ads.txt)
 */
export default function AdUnit({
    adSlot,
    adFormat = 'auto',
    adStyle = { display: 'block' },
    className = ''
}: AdUnitProps) {
    const adRef = useRef<HTMLModElement>(null);

    useEffect(() => {
        try {
            // Always load ads - cookie consent is for transparency only
            // Google AdSense will handle personalization based on user's Google settings

            // Push ad to AdSense
            if (typeof window !== 'undefined' && (window as any).adsbygoogle) {
                ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push({});
            }
        } catch (error) {
            console.error('AdSense error:', error);
        }
    }, []);

    return (
        <div className={`ad-container ${className}`}>
            <ins
                ref={adRef}
                className="adsbygoogle"
                style={adStyle}
                data-ad-client="ca-pub-1032974487169355"
                data-ad-slot={adSlot}
                data-ad-format={adFormat}
                data-full-width-responsive="true"
            />
        </div>
    );
}
