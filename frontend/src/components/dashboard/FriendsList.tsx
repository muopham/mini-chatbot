import { UserPlus } from "lucide-react";
import FriendCard from "./FriendCard";
import { useChatStore } from "@/lib/store/useChatStore";

export default function FriendsList() {
  const { conversations } = useChatStore();
  if (!conversations) return null;

  const directConversations = conversations.filter(
    (item) => item.type === "direct"
  );

  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-headline text-[10px] font-black uppercase tracking-widest text-stone-500">
          Friends
        </h2>
        <UserPlus size={20} strokeWidth={2.5} className="cursor-pointer" />
      </div>
      <div className="space-y-2">
        {directConversations.map((item) => (
          <FriendCard conversation={item} key={item._id} />
        ))}
      </div>
    </div>
  );
}
