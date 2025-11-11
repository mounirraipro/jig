export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 font-sans">
      <div className="w-full h-screen flex flex-col">
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
