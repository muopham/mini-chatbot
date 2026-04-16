export default function EmptyChatState() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-surface-container p-12 text-center">
      {/* Text */}
      <div className="max-w-md space-y-6">
        <h2 className="font-headline text-5xl font-black uppercase leading-none tracking-tighter text-zinc-900">
          Silence is <br /> Golden?
        </h2>

        <div className="inline-block rotate-2 border-2 border-zinc-900 bg-zinc-900 px-6 py-2 text-lg font-black text-primary-container">
          NO MESSAGES YET
        </div>

        <p className="px-8 font-body text-xl font-medium leading-relaxed text-zinc-600">
          There are no messages in this conversation yet. Break the ice and
          start talking!
        </p>

        <div className="pt-8">
          <button className="border-4 border-zinc-900 bg-primary-container px-10 py-5 font-headline text-xl font-black uppercase text-zinc-900 shadow-[6px_6px_0px_0px_rgba(30,28,17,1)] transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(30,28,17,1)] active:translate-x-[6px] active:translate-y-[6px] active:shadow-none">
            Say Hello 👋
          </button>
        </div>
      </div>
    </div>
  );
}
