"use client";
import ChatWindow from "@/components/chat/ChatWindow";
import InfoPanel from "@/components/chat/InfoPanel";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function DashboardPage() {
  const { user } = useAuthStore();
  console.log("___ ~ DashboardPage ~ user:", user);
  return (
    <>
      {/* <ChatWindow /> */}
      {/* <InfoPanel /> */}
    </>
  );
}
