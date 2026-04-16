"use client";

import Logo from "../ui/Logo";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useFriendsStore } from "@/lib/store/useFriendsStore";
import { useEffect, useState } from "react";

const mainItems = [
  { id: "chats", icon: "chat", label: "Chats" },
  { id: "groups", icon: "group", label: "Groups" },
  { id: "contacts", icon: "person", label: "Contacts" },
] as const;

export type SidebarMainItem = (typeof mainItems)[number]["id"];

interface PrimarySidebarProps {
  isSecondaryOpen: boolean;
  onToggleSecondary: () => void;
  activeMainItem: SidebarMainItem;
  onMainItemChange: (item: SidebarMainItem) => void;
}

export default function PrimarySidebar({
  isSecondaryOpen,
  onToggleSecondary,
  activeMainItem,
  onMainItemChange,
}: PrimarySidebarProps) {
  const router = useRouter();
  const { logOut } = useAuthStore();
  const { friendRequests, fetchRequests } = useFriendsStore();
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const root = document.documentElement;
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      const nextDark = saved === "dark";
      root.classList.toggle("dark", nextDark);
      setIsDark(nextDark);
      return;
    }
    const prefersDark =
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches;
    root.classList.toggle("dark", prefersDark);
    setIsDark(prefersDark);
  }, []);

  // Fetch friend requests when the sidebar becomes visible
  useEffect(() => {
    if (isSecondaryOpen) {
      fetchRequests();
    }
  }, [isSecondaryOpen, fetchRequests]);

  const handleLogout = async () => {
    await logOut();
    router.replace("/login");
  };

  const handleThemeToggle = () => {
    setIsDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle("dark", next);
      localStorage.setItem("theme", next ? "dark" : "light");
      return next;
    });
  };

  return (
    <>
      <aside className="z-20 flex h-full w-16 flex-col items-center border-r-4 border-black bg-[#F4EEDB] py-4">
        <div className="mb-6">
          <Logo size="sm" showText={false} variant="yellow" />
        </div>

        <button
          type="button"
          onClick={onToggleSecondary}
          title={isSecondaryOpen ? "Hide sidebar" : "Show sidebar"}
          aria-label={isSecondaryOpen ? "Hide sidebar" : "Show sidebar"}
          aria-pressed={isSecondaryOpen}
          className={`mb-6 flex size-11 items-center justify-center border-2 border-black text-stone-800 transition-colors ${
            isSecondaryOpen
              ? "editorial-shadow bg-accent-yellow"
              : "bg-white hover:bg-accent-yellow/60"
          }`}
        >
          <span className="material-symbols-outlined text-xl">
            {isSecondaryOpen ? "dock_to_left" : "menu"}
          </span>
        </button>

        <div className="flex flex-1 flex-col items-center gap-3">
          {mainItems.map((item) => {
            const isActive = activeMainItem === item.id;
            const isContacts = item.id === "contacts";
            const pendingCount = isContacts ? friendRequests.length : 0;
            return (
              <div key={item.id} className="relative">
                <button
                  type="button"
                  onClick={() => onMainItemChange(item.id)}
                  title={item.label}
                  aria-label={item.label}
                  className={`flex size-11 items-center justify-center border-2 border-black text-stone-800 transition-colors ${
                    isActive
                      ? "editorial-shadow bg-accent-yellow"
                      : "bg-white hover:bg-accent-yellow/60"
                  }`}
                >
                  <span className="material-symbols-outlined text-xl">
                    {item.icon}
                  </span>
                </button>
                {isContacts && pendingCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex size-4 items-center justify-center border-2 border-black bg-red-500 text-[8px] font-black leading-none text-white">
                    {pendingCount > 9 ? "9+" : pendingCount}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-6 flex flex-col items-center gap-3">
          <button
            type="button"
            onClick={handleThemeToggle}
            title="Theme"
            aria-label="Theme"
            className="flex size-11 items-center justify-center border-2 border-black bg-white text-stone-800 transition-colors hover:bg-accent-yellow/60"
          >
            <span className="material-symbols-outlined text-xl">
              {isDark ? "dark_mode" : "light_mode"}
            </span>
          </button>

          <button
            type="button"
            onClick={handleLogout}
            title="Logout"
            aria-label="Logout"
            className="flex size-11 items-center justify-center border-2 border-black bg-white text-stone-800 transition-colors hover:bg-accent-yellow/60"
          >
            <span className="material-symbols-outlined text-xl">logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
