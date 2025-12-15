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
      <div className="glass-panel rounded-full px-4 py-2 flex items-center gap-6 shadow-lg">
        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Moves</span>
          <span className="text-sm font-bold text-slate-800 tabular-nums">{moves}</span>
        </div>

        <div className="h-6 w-px bg-slate-200"></div>

        <div className="flex flex-col items-center">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Time</span>
          <span className="text-sm font-bold text-slate-800 tabular-nums">{time}</span>
        </div>

        <div className="h-6 w-px bg-slate-200"></div>

        <div className="flex flex-col items-center min-w-[60px]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">Progress</span>
          <div className="flex items-center gap-2 w-full">
            <div className="h-1.5 flex-1 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-yellow-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-slate-700">{formattedProgress}%</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Moves</span>
          <span className="text-2xl font-bold text-slate-800 tabular-nums">{moves}</span>
        </div>

        <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-50 border border-slate-100">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Time</span>
          <span className="text-2xl font-bold text-slate-800 tabular-nums">{time}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2 p-4 rounded-2xl bg-slate-50 border border-slate-100">
        <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-500">
          <span>Progress</span>
          <span>{formattedProgress}%</span>
        </div>
        <div className="relative h-2.5 bg-slate-200 rounded-full overflow-hidden">
          <div
            className="absolute inset-y-0 left-0 bg-yellow-500 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
