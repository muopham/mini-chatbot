"use client";
import { conversations } from "@/lib/data";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

const navLinks = [
  { href: "#", icon: "chat", label: "All Chats", active: true },
  { href: "#", icon: "mark_as_unread", label: "Unread", active: false },
  { href: "#", icon: "archive", label: "Archived", active: false },
  { href: "#", icon: "group", label: "Groups", active: false },
];

export default function Sidebar() {
  const router = useRouter();
  const { logOut } = useAuthStore();

  const handleLogout = async () => {
    await logOut();
    router.replace("/login");
  };
  return (
    <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-80 flex-col overflow-y-auto border-r-4 border-black bg-surface-container p-6 dark:bg-stone-900 md:flex">
      {/* Conversation list */}
      <div className="space-y-4">
        {conversations.map((conv, i) => (
          <Link
            key={conv.id}
            href={`/dashboard?conv=${conv.id}`}
            className={`flex items-center gap-3 p-3 transition-all ${
              i === 0
                ? "editorial-shadow border-2 border-black bg-surface-container-lowest"
                : "border-2 border-transparent bg-surface-container-low hover:border-black"
            }`}
          >
            <Image
              src={conv.participant.avatar!}
              alt={conv.participant.name}
              width={48}
              height={48}
              className="flex-shrink-0 border-2 border-black"
            />
            <div className="min-w-0 flex-1">
              <p className="truncate font-bold">{conv.participant.name}</p>
              <p className="truncate text-xs text-stone-500">
                {conv.lastMessage}
              </p>
            </div>
            {conv.unread && (
              <span className="flex-shrink-0 border border-black bg-secondary-container px-2 py-0.5 text-xs font-black text-white">
                {conv.unread}
              </span>
            )}
          </Link>
        ))}
      </div>

      {/* Bottom actions */}
      <div className="mt-auto flex flex-col gap-2 pt-6">
        <button className="editorial-shadow editorial-active mb-4 border-2 border-black bg-secondary-container px-4 py-3 font-headline font-black uppercase text-white">
          New Group
        </button>
        <button className="flex w-full items-center gap-4 px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-600 transition-colors hover:bg-surface-container-low">
          <span className="material-symbols-outlined">help</span> Help
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-4 px-4 py-2 text-xs font-bold uppercase tracking-widest text-stone-600 transition-colors hover:bg-surface-container-low"
        >
          <span className="material-symbols-outlined">logout</span> Logout
        </button>
      </div>
    </aside>
  );
}
