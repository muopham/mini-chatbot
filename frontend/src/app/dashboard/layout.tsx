import type { Metadata } from "next";
import DashboardHeader from "@/components/layout/DashboardHeader";
import Sidebar from "@/components/layout/Sidebar";
import BottomNav from "@/components/layout/BottomNav";

export const metadata: Metadata = {
  title: "ChatBot – Dashboard",
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background-light text-on-surface">
      <DashboardHeader />
      <div className="flex flex-1">
        <Sidebar />
        {children}
      </div>
      <BottomNav />
    </div>
  );
}
