'use client';

interface StatsProps {
  moves: number;
  time: string;
  progress: number;
}

export default function Stats({ moves, time, progress }: StatsProps) {
  const formattedProgress = Math.round(progress);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 rounded-2xl bg-white/80 px-4 py-3 shadow-sm">
      <div className="flex min-w-[88px] flex-col items-center">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">Moves</span>
        <span className="text-xl font-semibold text-slate-900">{moves}</span>
      </div>
      <div className="flex min-w-[88px] flex-col items-center">
        <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">Time</span>
        <span className="text-xl font-semibold text-slate-900">{time}</span>
      </div>
      <div className="flex min-w-[180px] flex-1 flex-col">
        <div className="flex items-center justify-between text-[11px] font-medium uppercase tracking-[0.14em] text-slate-500">
          <span>Progress</span>
          <span>{formattedProgress}%</span>
        </div>
        <div className="relative mt-1.5 h-1 overflow-hidden rounded-full bg-slate-200">
          <div
            className="absolute inset-y-0 left-0 rounded-full bg-indigo-500 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

