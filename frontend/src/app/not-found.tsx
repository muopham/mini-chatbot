import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[#FFF9E6] font-body text-[#1E1C11]">
      <div className="flex w-full max-w-md flex-col items-center border-4 border-black bg-white p-12 text-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]">
        <span className="material-symbols-outlined mb-4 text-8xl text-stone-300">
          search_off
        </span>
        <h1 className="mb-2 font-headline text-6xl font-black">404</h1>
        <p className="mb-2 text-xl font-black uppercase tracking-tight">
          Page Not Found
        </p>
        <p className="mb-8 text-sm font-bold text-stone-500">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <Link
          href="/"
          className="border-4 border-black bg-yellow-300 px-8 py-3 font-black uppercase shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-x-1 hover:translate-y-1 hover:shadow-none"
        >
          Back to Chat
        </Link>
      </div>
    </div>
  );
}
