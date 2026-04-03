"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/store/useAuthStore";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { accessToken, refresh, fetchMe, user, loading } = useAuthStore();
  const [starting, setStarting] = useState(true);

  const init = async () => {
    if (!accessToken) {
      await refresh();
    }

    if (accessToken && !user) {
      await fetchMe();
    }
    setStarting(false);
  };

  useEffect(() => {
    init();
  }, []);

  useEffect(() => {
    if (!starting && !loading && !accessToken) {
      router.replace("/login");
    }
  }, [starting, loading, accessToken, router]);

  if (starting || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background-light px-6 text-center">
        <p className="font-headline text-xs font-black uppercase tracking-[0.18em] text-stone-500">
          Loading...
        </p>
      </div>
    );
  }

  if (!accessToken) {
    return null;
  }

  return <>{children}</>;
}
