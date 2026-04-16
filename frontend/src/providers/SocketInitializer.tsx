"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useSocketStore } from "@/lib/store/useSocketStore";

export function SocketInitializer() {
  const { accessToken } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();

  useEffect(() => {
    if (accessToken) {
      connectSocket();
    }
    return () => disconnectSocket();
  }, [accessToken, connectSocket, disconnectSocket]);

  return null;
}
