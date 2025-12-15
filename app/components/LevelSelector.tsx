'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { GameImage } from '../types/game';
import { 
    getAllProgress, 
    getPlayerStats, 
    getCompletedLevelsInRange, 
    getStarsInRange,
    isCollectionUnlocked,
    getDailyChallengeLevelIndex,
    isDailyChallengeCompleted,
    isLevelCompleted,
    PlayerStats
} from '../utils/storage';

interface LevelSelectorProps {
    images: GameImage[];
    currentLevel: number | null;
    onSelect: (level: number) => void;
}

// Collection icons as SVG components
const CollectionIcons: Record<string, React.ReactNode> = {
    Discovery: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    ),
    Nature: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
    ),
    Adventure: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M3 21l9-9m0 0l9 9m-9-9v12m0-12L3 3m9 9l9-9" />
        </svg>
    ),
    Serenity: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
    ),
    Heritage: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
    ),
    Horizons: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
        </svg>
    ),
    Cosmos: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
    ),
    Treasures: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
            <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
    ),
};

// Collection theme colors (light mode friendly)
const COLLECTION_THEMES = [
    { name: 'Discovery', color: '#F59E0B', bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
    { name: 'Nature', color: '#10B981', bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
    { name: 'Adventure', color: '#3B82F6', bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
    { name: 'Serenity', color: '#EC4899', bg: 'bg-pink-50', border: 'border-pink-200', text: 'text-pink-700' },
    { name: 'Heritage', color: '#64748B', bg: 'bg-slate-50', border: 'border-slate-200', text: 'text-slate-700' },
    { name: 'Horizons', color: '#8B5CF6', bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700' },
    { name: 'Cosmos', color: '#06B6D4', bg: 'bg-cyan-50', border: 'border-cyan-200', text: 'text-cyan-700' },
    { name: 'Treasures', color: '#D946EF', bg: 'bg-fuchsia-50', border: 'border-fuchsia-200', text: 'text-fuchsia-700' },
];

function groupIntoCollections(images: GameImage[]) {
    const collections: { 
        name: string; 
        levels: number[]; 
        color: string;
        bg: string;
        border: string;
        text: string;
        coverImages: string[];
        index: number;
    }[] = [];
    const chunkSize = 6;
    
    for (let i = 0; i < images.length; i += chunkSize) {
        const themeIndex = Math.floor(i / chunkSize) % COLLECTION_THEMES.length;
        const theme = COLLECTION_THEMES[themeIndex];
        const levels: number[] = [];
        const coverImages: string[] = [];
        
        for (let j = i; j < Math.min(i + chunkSize, images.length); j++) {
            levels.push(j + 1);
            if (images[j]?.url) coverImages.push(images[j].url);
        }
        
        collections.push({
            name: theme.name,
            levels,
            color: theme.color,
            bg: theme.bg,
            border: theme.border,
            text: theme.text,
            coverImages,
            index: collections.length,
        });
    }
    
    return collections;
}

// Star rating component
function StarRating({ filled, total = 3 }: { filled: number; total?: number }) {
    return (
        <div className="flex gap-0.5">
            {Array.from({ length: total }).map((_, i) => (
                <svg 
                    key={i} 
                    className={`w-3 h-3 ${i < filled ? 'text-amber-400' : 'text-slate-200'}`}
                    fill="currentColor" 
                    viewBox="0 0 20 20"
                >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
            ))}
        </div>
    );
}

export default function LevelSelector({ images, currentLevel, onSelect }: LevelSelectorProps) {
    const collections = useMemo(() => groupIntoCollections(images), [images]);
    const [selectedPack, setSelectedPack] = useState<number | null>(null);
    const [stats, setStats] = useState<PlayerStats | null>(null);
    const [, setForceUpdate] = useState(0);

    // Load stats on mount
    useEffect(() => {
        setStats(getPlayerStats());
        // Force re-render to get latest progress
        setForceUpdate(n => n + 1);
    }, [currentLevel]);

    // Daily challenge
    const dailyLevelIndex = useMemo(() => getDailyChallengeLevelIndex(images.length), [images.length]);
    const dailyCompleted = isDailyChallengeCompleted();

    const activePack = selectedPack !== null ? collections[selectedPack] : null;

    const handleQuickPlay = () => {
        const randomLevel = Math.floor(Math.random() * images.length) + 1;
        onSelect(randomLevel);
    };

    const handleDailyChallenge = () => {
        onSelect(dailyLevelIndex + 1);
    };

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm">
            
            {/* Header */}
            <div className="shrink-0 px-4 pt-4 pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between mb-3">
                    <div>
                        <h2 className="text-base font-bold text-slate-900">Collections</h2>
                        <p className="text-xs text-slate-500">{images.length} puzzles</p>
                    </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex gap-2">
                    <button 
                        onClick={handleQuickPlay}
                        className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium transition-colors"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                            <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Quick Play
                    </button>
                    <button 
                        onClick={handleDailyChallenge}
                        className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                            dailyCompleted 
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                                : 'bg-amber-500 hover:bg-amber-600 text-white'
                        }`}
                    >
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {dailyCompleted ? 'Done' : 'Daily'}
                    </button>
                </div>

                {/* Stats Row */}
                {stats && (
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <svg className="w-3.5 h-3.5 text-amber-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="font-medium text-slate-700">{stats.totalStarsEarned}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-medium text-slate-700">{stats.totalPuzzlesSolved}</span>
                            <span>solved</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                            <svg className="w-3.5 h-3.5 text-orange-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <path d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                            </svg>
                            <span className="font-medium text-slate-700">{stats.currentStreak}</span>
                            <span>day{stats.currentStreak !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                )}
            </div>

            {/* Collection List or Level Grid */}
            <div className="flex-1 overflow-hidden relative">
                
                {/* Pack List View */}
                <div className={`absolute inset-0 overflow-y-auto p-3 transition-all duration-300 ${selectedPack === null ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-full pointer-events-none'}`}>
                    <div className="space-y-2">
                        {collections.map((pack, index) => {
                            const isUnlocked = isCollectionUnlocked(index);
                            const completedCount = getCompletedLevelsInRange(pack.levels[0], pack.levels[pack.levels.length - 1]);
                            const starsEarned = getStarsInRange(pack.levels[0], pack.levels[pack.levels.length - 1]);
                            const maxStars = pack.levels.length * 3;
                            const progress = (completedCount / pack.levels.length) * 100;
                            
                            return (
                                <button
                                    key={index}
                                    onClick={() => isUnlocked && setSelectedPack(index)}
                                    disabled={!isUnlocked}
                                    className={`
                                        group w-full relative overflow-hidden rounded-xl border transition-all duration-200
                                        ${isUnlocked 
                                            ? `${pack.bg} ${pack.border} hover:shadow-md cursor-pointer` 
                                            : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'
                                        }
                                    `}
                                >
                                    <div className="p-3 flex items-center gap-3">
                                        {/* Icon */}
                                        <div 
                                            className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${isUnlocked ? pack.text : 'text-slate-400'}`}
                                            style={{ backgroundColor: isUnlocked ? `${pack.color}15` : undefined }}
                                        >
                                            {isUnlocked ? CollectionIcons[pack.name] : (
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                </svg>
                                            )}
                                        </div>
                                        
                                        {/* Info */}
                                        <div className="flex-1 min-w-0 text-left">
                                            <div className="flex items-center justify-between mb-1">
                                                <h3 className={`font-semibold text-sm ${isUnlocked ? 'text-slate-800' : 'text-slate-500'}`}>
                                                    {pack.name}
                                                </h3>
                                                {isUnlocked && starsEarned > 0 && (
                                                    <div className="flex items-center gap-0.5 text-xs text-amber-600">
                                                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                        </svg>
                                                        {starsEarned}/{maxStars}
                                                    </div>
                                                )}
                                            </div>
                                            <p className="text-xs text-slate-500 mb-2">
                                                {isUnlocked 
                                                    ? `${completedCount}/${pack.levels.length} completed`
                                                    : 'Complete previous pack to unlock'
                                                }
                                            </p>
                                            
                                            {/* Progress Bar */}
                                            {isUnlocked && (
                                                <div className="h-1 bg-slate-200 rounded-full overflow-hidden">
                                                    <div 
                                                        className="h-full rounded-full transition-all duration-500"
                                                        style={{ 
                                                            width: `${progress}%`,
                                                            backgroundColor: pack.color
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        
                                        {/* Arrow */}
                                        {isUnlocked && (
                                            <div className="text-slate-300 group-hover:text-slate-400 group-hover:translate-x-0.5 transition-all">
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                                    <path d="M9 5l7 7-7 7"/>
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Level Grid View */}
                <div className={`absolute inset-0 flex flex-col transition-all duration-300 bg-white ${selectedPack !== null ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-full pointer-events-none'}`}>
                    {activePack && (
                        <>
                            {/* Pack Header */}
                            <div className="shrink-0 px-3 py-3 border-b border-slate-100">
                                <button 
                                    onClick={() => setSelectedPack(null)}
                                    className="flex items-center gap-1.5 text-slate-500 hover:text-slate-700 transition-colors mb-2 group"
                                >
                                    <svg className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                        <path d="M15 19l-7-7 7-7"/>
                                    </svg>
                                    <span className="text-xs font-medium">Back</span>
                                </button>
                                
                                <div className="flex items-center gap-2">
                                    <div 
                                        className={`w-8 h-8 rounded-lg flex items-center justify-center ${activePack.text}`}
                                        style={{ backgroundColor: `${activePack.color}15` }}
                                    >
                                        {CollectionIcons[activePack.name]}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-slate-800 text-sm">{activePack.name}</h3>
                                        <p className="text-xs text-slate-500">{activePack.levels.length} puzzles</p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Level Grid */}
                            <div className="flex-1 overflow-y-auto p-3">
                                <div className="grid grid-cols-2 gap-2">
                                    {activePack.levels.map((level) => {
                                        const isActive = currentLevel === level;
                                        const image = images[level - 1];
                                        const completed = isLevelCompleted(level);
                                        const progress = getAllProgress().find(p => p.level === level);
                                        
                                        return (
                                            <button
                                                key={level}
                                                onClick={() => onSelect(level)}
                                                className={`
                                                    group relative aspect-square rounded-xl overflow-hidden transition-all duration-200
                                                    ${isActive 
                                                        ? 'ring-2 ring-amber-500 shadow-lg scale-[1.02]' 
                                                        : 'ring-1 ring-slate-200 hover:ring-slate-300 hover:shadow-md hover:scale-[1.01]'
                                                    }
                                                `}
                                            >
                                                {/* Image */}
                                                <div 
                                                    className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
                                                    style={{ backgroundImage: `url(${image?.url})` }}
                                                />
                                                
                                                {/* Overlay */}
                                                <div className={`
                                                    absolute inset-0 transition-opacity duration-200
                                                    bg-gradient-to-t from-black/70 via-transparent to-transparent
                                                    ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}
                                                `}/>
                                                
                                                {/* Level Info */}
                                                <div className={`
                                                    absolute bottom-0 left-0 right-0 p-2 transition-all duration-200
                                                    ${isActive ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0 group-hover:translate-y-0 group-hover:opacity-100'}
                                                `}>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-white font-semibold text-xs">
                                                            Level {level}
                                                        </span>
                                                        {completed && progress && (
                                                            <StarRating filled={progress.stars} />
                                                        )}
                                                    </div>
                                                </div>
                                                
                                                {/* Completed Badge */}
                                                {completed && (
                                                    <div className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center shadow-sm">
                                                        <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                                                            <path d="M5 13l4 4L19 7" />
                                                        </svg>
                                                    </div>
                                                )}
                                                
                                                {/* Active Indicator */}
                                                {isActive && !completed && (
                                                    <div className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-lg" />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
