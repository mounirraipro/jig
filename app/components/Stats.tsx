'use client';

interface StatsProps {
  moves: number;
  time: string;
  progress: number;
  compact?: boolean;
}

export default function Stats({ moves, time, progress, compact = false }: StatsProps) {
  const formattedProgress = Math.round(progress);

  if (compact) {
    return (
      <div 
        className="flex flex-wrap items-center justify-center gap-1.5 rounded-lg px-1.5 py-1"
        style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-round-medium)',
          boxShadow: 'var(--shadow-soft)',
          padding: 'var(--spacing-xxs) var(--spacing-xs)',
        }}
      >
        <div className="flex min-w-[50px] flex-col items-center">
          <span 
            className="text-xs font-medium uppercase tracking-wide"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '9px',
              lineHeight: '12px',
              letterSpacing: '0.1em',
            }}
          >
            Moves
          </span>
          <span 
            className="font-bold"
            style={{
              color: 'var(--color-text-primary)',
              fontSize: '16px',
              lineHeight: '20px',
              fontWeight: 700,
            }}
          >
            {moves}
          </span>
        </div>
        
        <div className="flex min-w-[50px] flex-col items-center">
          <span 
            className="text-xs font-medium uppercase tracking-wide"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '9px',
              lineHeight: '12px',
              letterSpacing: '0.1em',
            }}
          >
            Time
          </span>
          <span 
            className="font-bold"
            style={{
              color: 'var(--color-text-primary)',
              fontSize: '16px',
              lineHeight: '20px',
              fontWeight: 700,
            }}
          >
            {time}
          </span>
        </div>
        
        <div className="flex min-w-[80px] flex-1 flex-col">
          <div 
            className="flex items-center justify-between text-xs font-medium uppercase tracking-wide"
            style={{
              color: 'var(--color-text-secondary)',
              fontSize: '9px',
              lineHeight: '12px',
              letterSpacing: '0.1em',
            }}
          >
            <span>Progress</span>
            <span>{formattedProgress}%</span>
          </div>
          <div 
            className="relative mt-0.5 h-0.5 overflow-hidden rounded-full"
            style={{
              background: 'var(--color-light-gray)',
              borderRadius: 'var(--radius-pill)',
            }}
          >
            <div
              className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
              style={{ 
                width: `${progress}%`,
                background: 'var(--color-primary)',
                borderRadius: 'var(--radius-pill)',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="flex flex-wrap items-center justify-center gap-4 rounded-2xl px-4 py-3"
      style={{
        background: 'var(--color-surface)',
        borderRadius: 'var(--radius-round-large)',
        boxShadow: 'var(--shadow-soft)',
        padding: 'var(--spacing-md)',
      }}
    >
      <div className="flex min-w-[88px] flex-col items-center">
        <span 
          className="text-xs font-medium uppercase tracking-wide"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '13px',
            lineHeight: '18px',
            letterSpacing: '0.14em',
          }}
        >
          Moves
        </span>
        <span 
          className="text-xl font-bold"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: '28px',
            lineHeight: '34px',
            fontWeight: 700,
          }}
        >
          {moves}
        </span>
      </div>
      
      <div className="flex min-w-[88px] flex-col items-center">
        <span 
          className="text-xs font-medium uppercase tracking-wide"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '13px',
            lineHeight: '18px',
            letterSpacing: '0.14em',
          }}
        >
          Time
        </span>
        <span 
          className="text-xl font-bold"
          style={{
            color: 'var(--color-text-primary)',
            fontSize: '28px',
            lineHeight: '34px',
            fontWeight: 700,
          }}
        >
          {time}
        </span>
      </div>
      
      <div className="flex min-w-[180px] flex-1 flex-col">
        <div 
          className="flex items-center justify-between text-xs font-medium uppercase tracking-wide"
          style={{
            color: 'var(--color-text-secondary)',
            fontSize: '13px',
            lineHeight: '18px',
            letterSpacing: '0.14em',
          }}
        >
          <span>Progress</span>
          <span>{formattedProgress}%</span>
        </div>
        <div 
          className="relative mt-1.5 h-1 overflow-hidden rounded-full"
          style={{
            background: 'var(--color-light-gray)',
            borderRadius: 'var(--radius-pill)',
          }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
            style={{ 
              width: `${progress}%`,
              background: 'var(--color-primary)',
              borderRadius: 'var(--radius-pill)',
            }}
          />
        </div>
      </div>
    </div>
  );
}
