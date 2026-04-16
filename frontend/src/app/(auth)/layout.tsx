"use client";
import { useAuthStore } from "@/lib/store/useAuthStore";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const pathname = usePathname();

  const { accessToken } = useAuthStore();
  useEffect(() => {
    if (accessToken && (pathname === "/login" || pathname === "/signup")) {
      router.replace("/");
    }
  }, [accessToken, pathname, router]);
  return <>{children}</>;
}
