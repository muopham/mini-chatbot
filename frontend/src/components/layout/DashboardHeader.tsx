import Image from "next/image";
import Link from "next/link";
import { currentUser } from "@/lib/data";

const navLinks = [
  { href: "/dashboard", label: "Chats", active: true },
  { href: "#", label: "Contacts", active: false },
  { href: "#", label: "Settings", active: false },
];

export default function DashboardHeader() {
  return (
    <header className="sticky top-0 z-50 flex w-full items-center justify-between border-b-4 border-black bg-background-light px-8 py-4 shadow-[4px_4px_0px_0px_#1E1C11] dark:bg-stone-950">
      <div className="flex items-center gap-6">
        <Link
          href="/"
          className="font-headline text-2xl font-black uppercase tracking-tighter text-black dark:text-white"
        >
          ChatBot
        </Link>
        <nav className="hidden gap-8 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`font-bold transition-all ${
                link.active
                  ? "border-b-4 border-accent-yellow pb-1 text-black dark:text-white"
                  : "text-stone-500 hover:-translate-x-[2px] hover:-translate-y-[2px] dark:text-stone-400"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-4">
        <button className="editorial-shadow editorial-active border-2 border-black bg-accent-yellow px-6 py-2 font-headline font-black uppercase transition-all hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-[6px_6px_0px_0px_#1E1C11]">
          New Chat
        </button>
        <Image
          src={currentUser.avatar!}
          alt="User profile"
          width={40}
          height={40}
          className="border-2 border-black"
        />
      </div>
    </header>
  );
}
