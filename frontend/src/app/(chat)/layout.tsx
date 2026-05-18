"use client";
import SecondarySidebar from "@/components/dashboard/SecondarySidebar";
import PrimarySidebar from "@/components/dashboard/PrimarySidebar";
import type { SidebarMainItem } from "@/components/dashboard/PrimarySidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useChatStore } from "@/lib/store/useChatStore";
import Loading from "@/components/layout/Loading";
import { SocketInitializer } from "@/providers/SocketInitializer";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { accessToken, refresh, fetchMe, user, loading } = useAuthStore();
  const [starting, setStarting] = useState(true);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(true);
  const [activeMainItem, setActiveMainItem] =
    useState<SidebarMainItem>("chats");
  useEffect(() => {
    const init = async () => {
      try {
        if (!accessToken) {
          await refresh();
        }

        const currentToken = useAuthStore.getState().accessToken;
        const currentUser = useAuthStore.getState().user;
        if (currentToken && !currentUser) {
          await fetchMe();
        }

        if (currentToken) {
          await useChatStore.getState().fetchConversation();
        }
      } catch {
      } finally {
        setStarting(false);
      }
    };

    init();
  }, [accessToken, fetchMe, refresh, user]);

  useEffect(() => {
    if (!starting && !useAuthStore.getState().accessToken) {
      router.replace("/login");
    }
  }, [starting, router]);

  if (starting || loading) {
    return <Loading />;
  }

  if (!useAuthStore.getState().accessToken) {
    return null;
  }

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background font-body text-on-surface md:flex-row">
      <SocketInitializer />
      <PrimarySidebar
        isSecondaryOpen={isSecondaryOpen}
        onToggleSecondary={() => setIsSecondaryOpen((prev) => !prev)}
        activeMainItem={activeMainItem}
        onMainItemChange={setActiveMainItem}
      />
      <div
        className={`flex-shrink-0 overflow-hidden transition-all duration-700 ease-in-out ${
          isSecondaryOpen
            ? "h-72 w-full translate-y-0 opacity-100 md:h-auto md:w-80 md:translate-x-0"
            : "h-0 w-full -translate-y-4 opacity-0 md:h-auto md:w-0 md:-translate-x-4 md:translate-y-0"
        }`}
      >
        <SecondarySidebar
          activeMainItem={activeMainItem}
          onMainItemChange={setActiveMainItem}
        />
      </div>
      {children}
    </div>
  );
}
