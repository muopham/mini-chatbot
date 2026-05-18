"use client";

import { useEffect } from "react";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ChatError({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("[Chat Error]", error);
  }, [error]);

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-background p-8">
      <div className="flex w-full max-w-md flex-col items-center border-4 border-black bg-[#fff9e8] p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <span className="material-symbols-outlined mb-4 text-6xl text-red-500">
          error
        </span>
        <h2 className="mb-2 font-headline text-2xl font-black uppercase">
          Something went wrong
        </h2>
        <p className="mb-6 text-center text-sm font-bold text-stone-500">
          An error occurred in the chat. Your data is safe.
        </p>
        <button
          onClick={reset}
          className="border-4 border-black bg-yellow-300 px-6 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
