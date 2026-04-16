"use client";
import SecondarySidebar from "@/components/dashboard/SecondarySidebar";
import PrimarySidebar from "@/components/dashboard/PrimarySidebar";
import type { SidebarMainItem } from "@/components/dashboard/PrimarySidebar";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import Loading from "@/components/layout/Loading";
export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { accessToken, refresh, fetchMe, user, loading } = useAuthStore();
  const [starting, setStarting] = useState(true);
  const [isSecondaryOpen, setIsSecondaryOpen] = useState(true);
  const [activeMainItem, setActiveMainItem] = useState<SidebarMainItem>("chats");
  useEffect(() => {
    const init = async () => {
      try {
        if (!accessToken) {
          await refresh();
        }

        const currentToken = useAuthStore.getState().accessToken;
        if (currentToken && !user) {
          await fetchMe();
        }

        // const currentUser = useAuthStore.getState().user;
        // if (currentUser) {
        //   await fetchConversations();
        // }
      } catch {
      } finally {
        setStarting(false);
      }
    };

    init();
  }, []);

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
    <div className="bg-background flex h-screen overflow-hidden font-body text-on-surface">
      <PrimarySidebar
        isSecondaryOpen={isSecondaryOpen}
        onToggleSecondary={() => setIsSecondaryOpen((prev) => !prev)}
        activeMainItem={activeMainItem}
        onMainItemChange={setActiveMainItem}
      />
      <div
        className={`flex-shrink-0 overflow-hidden transition-all duration-700 ease-in-out ${
          isSecondaryOpen
            ? "w-80 translate-x-0 opacity-100"
            : "w-0 -translate-x-4 opacity-0"
        }`}
      >
        <SecondarySidebar activeMainItem={activeMainItem} />
      </div>
      {children}
    </div>
  );
}
