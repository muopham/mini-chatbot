import { cn, formatOnlineTime } from "@/lib/utils";
import Image from "next/image";

interface FriendCardProps {
  conversationId: string;
  avatar?: string;
  name: string;
  timestamp?: Date;
  unreadCount?: number;
  onSelect: (id: string) => void;
  isGroup?: boolean;
  isActive: boolean;
  subTitle: React.ReactNode;
  statusType?: "online" | "offline";
}

export default function Card({
  conversationId,
  avatar,
  name,
  unreadCount = 0,
  onSelect,
  isGroup = false,
  isActive,
  subTitle,
  timestamp,
  statusType,
}: FriendCardProps) {
  const initial = name.charAt(0).toUpperCase();

  const isValidImage =
    avatar &&
    (avatar.startsWith("http://") ||
      avatar.startsWith("https://") ||
      avatar.startsWith("/"));

  return (
    <div
      key={conversationId}
      onClick={() => onSelect(conversationId)}
      className={cn(
        "flex cursor-pointer items-center gap-3 border-2 border-transparent bg-white dark:bg-dark-bg-card p-3 transition-all",
        isActive && "border-black dark:border-dark-accent bg-accent-yellow dark:bg-dark-accent/20"
      )}
    >
      <div className="relative">
        {isGroup ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black dark:bg-dark-accent text-sm font-bold text-white dark:text-dark-accent-on">
            {initial}
          </div>
        ) : isValidImage ? (
          <Image
            src={avatar!}
            alt={name}
            width={40}
            height={40}
            className="h-10 w-10 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black dark:bg-dark-accent text-sm font-bold text-white dark:text-dark-accent-on">
            {initial}
          </div>
        )}
        {!isGroup && (
          <span
            className={cn(
              "absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white",
              statusType === "online" ? "bg-green-500" : "bg-gray-400"
            )}
          />
        )}

        {unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-blue-500 px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p
          className={cn(
            "truncate text-sm dark:text-dark-text-primary",
            unreadCount && unreadCount > 0 ? "font-bold" : "font-medium"
          )}
        >
          {name}
        </p>

        {subTitle && (
          <div className="flex min-w-0 flex-1 items-center gap-1">
            {subTitle}
          </div>
        )}
      </div>

      {timestamp && (
        <span
          className={cn(
            "text-xs",
            unreadCount > 0 ? "font-bold text-black dark:text-dark-text-primary" : "text-gray-400 dark:text-dark-text-tertiary"
          )}
        >
          {formatOnlineTime(timestamp)}
        </span>
      )}
    </div>
  );
}
