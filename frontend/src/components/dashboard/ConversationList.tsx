import { useChatStore } from "@/lib/store/useChatStore";
import FriendCard from "./FriendCard";
import GroupCard from "./GroupCard";
import ConversationListSkeleton from "./ConversationListSkeleton";

export default function ConversationList() {
  const conversations = useChatStore((state) => state.conversations);
  const converLoading = useChatStore((state) => state.converLoading);

  if (!conversations) return null;

  return (
    <div className="space-y-2">
      {converLoading ? (
        <ConversationListSkeleton count={5} />
      ) : conversations.length === 0 ? (
        <div className="py-12 text-center">
          <span className="material-symbols-outlined text-5xl text-stone-300">
            chat_bubble_outline
          </span>
          <p className="mt-4 text-sm font-bold uppercase tracking-widest text-stone-400">
            No conversations yet
          </p>
        </div>
      ) : (
        conversations.map((item) =>
          item.type === "group" ? (
            <GroupCard conversation={item} key={item._id} />
          ) : (
            <FriendCard conversation={item} key={item._id} />
          )
        )
      )}
    </div>
  );
}
