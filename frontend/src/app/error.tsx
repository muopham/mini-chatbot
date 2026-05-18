"use client";

import { RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FFF9E6] p-6 font-body text-[#1E1C11]">
      <section className="editorial-shadow-lg w-full max-w-lg border-4 border-black bg-white p-6">
        <div className="mb-6 inline-flex border-4 border-black bg-red-400 px-3 py-2 text-xs font-black uppercase tracking-widest text-white">
          Runtime error
        </div>
        <h1 className="font-headline text-3xl font-black uppercase leading-none">
          Something broke
        </h1>
        <p className="mt-4 text-sm font-bold text-stone-600">
          The chat interface hit an unexpected state. Retry the current view or
          refresh after checking the backend connection.
        </p>
        {error.digest && (
          <p className="mt-4 border-2 border-black bg-stone-100 p-2 text-xs font-bold">
            Digest: {error.digest}
          </p>
        )}
        <button
          type="button"
          onClick={reset}
          className="editorial-shadow editorial-active mt-6 inline-flex items-center gap-2 border-2 border-black bg-secondary-container px-4 py-3 text-sm font-black uppercase text-white"
        >
          <RotateCcw size={18} strokeWidth={3} />
          Retry
        </button>
      </section>
    </main>
  );
}
