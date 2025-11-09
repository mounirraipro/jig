'use client';

interface StatsProps {
  moves: number;
  time: string;
}

export default function Stats({ moves, time }: StatsProps) {
  return (
    <div className="flex gap-4 justify-center">
      <div className="bg-slate-800 px-6 py-3 rounded-xl text-center min-w-[100px]">
        <div className="text-slate-400 text-sm mb-1">Moves</div>
        <div className="text-white text-2xl font-bold">{moves}</div>
      </div>
      <div className="bg-slate-800 px-6 py-3 rounded-xl text-center min-w-[100px]">
        <div className="text-slate-400 text-sm mb-1">Time</div>
        <div className="text-white text-2xl font-bold">{time}</div>
      </div>
    </div>
  );
}

