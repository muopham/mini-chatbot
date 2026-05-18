import { useChatStore } from "@/lib/store/useChatStore";
import { Users } from "lucide-react";
import GroupCard from "./GroupCard";
import GroupCreateModal from "./GroupCreateModal";
import { useState } from "react";
import ConversationListSkeleton from "./ConversationListSkeleton";

export default function GroupList() {
  const conversations = useChatStore((state) => state.conversations);
  const converLoading = useChatStore((state) => state.converLoading);
  const [showCreateModal, setShowCreateModal] = useState(false);

  if (!conversations) return null;

  const groupConversations = conversations.filter(
    (item) => item.type === "group"
  );
  return (
    <div>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-headline text-[10px] font-black uppercase tracking-widest text-stone-500 dark:text-dark-text-secondary">
          Group Chats
        </h2>
        <Users
          strokeWidth={2.5}
          size={20}
          className="cursor-pointer dark:text-dark-text-secondary"
          onClick={() => setShowCreateModal(true)}
        />
      </div>
      <div className="space-y-2">
        {converLoading ? (
          <ConversationListSkeleton count={2} />
        ) : (
          groupConversations.map((item) => (
            <GroupCard conversation={item} key={item._id} />
          ))
        )}
      </div>
      <GroupCreateModal isOpen={showCreateModal} onClose={() => setShowCreateModal(false)} />
    </div>
  );
}
