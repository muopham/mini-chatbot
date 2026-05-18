interface EmptyChatStateProps {
  onSendHello: () => void;
}

export default function EmptyChatState({ onSendHello }: EmptyChatStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-surface-container dark:bg-dark-bg-surface p-12 text-center">
      {/* Text */}
      <div className="max-w-md space-y-6">
        <h2 className="font-headline text-5xl font-black uppercase leading-none tracking-tighter text-zinc-900 dark:text-dark-text-primary">
          Silence is <br /> Golden?
        </h2>

        <div className="inline-block rotate-2 border-2 border-zinc-900 dark:border-dark-accent bg-zinc-900 dark:bg-dark-accent px-6 py-2 text-lg font-black text-primary-container dark:text-dark-accent-on">
          NO MESSAGES YET
        </div>

        <p className="px-8 font-body text-xl font-medium leading-relaxed text-zinc-600 dark:text-dark-text-secondary">
          There are no messages in this conversation yet. Break the ice and
          start talking!
        </p>

        <div className="pt-8">
          <button
            onClick={onSendHello}
            className="border-4 border-zinc-900 dark:border-dark-accent bg-primary-container dark:bg-dark-accent px-10 py-5 font-headline text-xl font-black uppercase text-zinc-900 dark:text-dark-accent-on shadow-[6px_6px_0px_0px_rgba(30,28,17,1)] dark:shadow-amber-lg transition-all hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[10px_10px_0px_0px_rgba(30,28,17,1)] dark:hover:shadow-amber active:translate-x-[6px] active:translate-y-[6px] active:shadow-none"
          >
            Say Hello 👋
          </button>
        </div>
      </div>
    </div>
  );
}
