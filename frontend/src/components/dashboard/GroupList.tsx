import { useChatStore } from "@/lib/store/useChatStore";
import { Users } from "lucide-react";
import GroupCard from "./GroupCard";

export default function GroupList() {
  const { conversations } = useChatStore();

  if (!conversations) return null;

  const groupConversations = conversations.filter(
    (item) => item.type === "group"
  );
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-headline text-[10px] font-black uppercase tracking-widest text-stone-500">
          Group Chats
        </h2>
        <Users strokeWidth={2.5} size={20} className="cursor-pointer" />
      </div>
      <div className="space-y-2">
        {groupConversations.map((item) => (
          <GroupCard conversation={item} key={item._id} />
        ))}
      </div>
    </div>
  );
}
