export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 font-sans">
      <div className="w-full h-screen flex flex-col">
        <header className="bg-slate-900 border-b border-slate-800 p-4">
          <h1 className="text-white text-2xl font-bold text-center">Jigsolitaire</h1>
        </header>
        <main className="flex-1 w-full">
          <iframe
            src="/game"
            className="w-full h-full border-none"
            title="Jigsolitaire Game"
          />
        </main>
      </div>
    </div>
  );
}
