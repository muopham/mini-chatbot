export default function ChatLoading() {
  return (
    <div className="flex flex-1 items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-black border-t-transparent" />
        <p className="text-xs font-black uppercase tracking-widest text-stone-400">
          Loading...
        </p>
      </div>
    </div>
  );
}
