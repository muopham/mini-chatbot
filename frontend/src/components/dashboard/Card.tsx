import { cn, formatOnlineTime } from "@/lib/utils";
import Image from "next/image";

interface FriendCardProps {
  convosationId: string;
  avatar?: string;
  name: string;
  timestamp?: Date;
  unreadCount?: number;
  onSelect: (id: string) => void;
  isGroup?: boolean;
  isActive: boolean;
  subTitle: React.ReactNode; // sl thành viên or tin nhắn cuối
  statusType?: "online" | "offline";
}

export default function Card({
  convosationId,
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
      key={convosationId}
      onClick={() => onSelect(convosationId)}
      className={cn(
        "flex cursor-pointer items-center gap-3 border-2 border-transparent bg-white p-3 transition-all",
        isActive && "border-black bg-accent-yellow"
      )}
    >
      <div className="relative">
        {isGroup ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
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
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm font-bold text-white">
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
            "truncate text-sm",
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
            unreadCount > 0 ? "font-bold text-black" : "text-gray-400"
          )}
        >
          {formatOnlineTime(timestamp)}
        </span>
      )}
    </div>
  );
}
