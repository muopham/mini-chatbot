"use client";

import ConversationList from "./ConversationList";
import GroupList from "./GroupList";
import UserProfileSwitcher from "./UserProfileSwitcher";
import UserSearchDropdown from "./UserSearchDropdown";
import { useFriendsStore } from "@/lib/store/useFriendsStore";
import { useChatStore } from "@/lib/store/useChatStore";
import { useState, useRef, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Loader2 } from "lucide-react";
import FriendRequestList from "./FriendRequestList";
import AllFriendsList from "./AllFriendsList";
import type { SidebarMainItem } from "./PrimarySidebar";

interface SecondarySidebarProps {
  activeMainItem: SidebarMainItem;
  onMainItemChange: (item: SidebarMainItem) => void;
}

export default function SecondarySidebar({
  activeMainItem,
  onMainItemChange,
}: SecondarySidebarProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const {
    friendRequests,
    requestsLoading,
    requestsInitialized,
    searchUsers,
    clearSearch,
    fetchRequests,
    fetchSentRequests,
    fetchAllFriends,
    acceptRequest,
    declineRequest,
  } = useFriendsStore();
  const createDirectConversation = useChatStore(
    (state) => state.createDirectConversation
  );
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const debouncedSearch = useDebouncedCallback((q: string) => {
    if (q.trim()) {
      searchUsers(q);
      setShowDropdown(true);
    } else {
      clearSearch();
      setShowDropdown(false);
    }
  }, 300);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setQuery(val);
    debouncedSearch(val);
  };

  const handleStartChat = async (friendId: string) => {
    await createDirectConversation(friendId);
    onMainItemChange("chats");
  };

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  useEffect(() => {
    fetchRequests();
    fetchSentRequests();
    fetchAllFriends();
  }, [fetchAllFriends, fetchRequests, fetchSentRequests]);

  useEffect(() => {
    if (activeMainItem === "contacts") {
      fetchRequests({ force: true });
      fetchAllFriends();
    }
  }, [activeMainItem, fetchRequests, fetchAllFriends]);

  const showChats = activeMainItem === "chats";
  const showGroups = activeMainItem === "groups";
  const showContacts = activeMainItem === "contacts";

  return (
    <aside className="z-10 flex h-full w-full flex-col border-b-4 border-black bg-[#F4EEDB] dark:border-dark-border dark:bg-dark-bg-sidebar md:w-80 md:border-b-0 md:border-r-4">
      <div className="border-b-4 border-black p-4 dark:border-dark-border">
        {showChats && (
          <>
            <div className="relative" ref={searchRef}>
              <input
                ref={inputRef}
                className="w-full border-2 border-black bg-surface-container-lowest p-2 text-xs font-bold text-on-surface placeholder:text-stone-400 focus:outline-none focus:ring-0 dark:border-dark-border-subtle dark:bg-dark-bg-input dark:text-dark-text-primary dark:placeholder:text-dark-text-tertiary dark:focus:border-dark-accent"
                placeholder="Search chats or find users..."
                type="text"
                value={query}
                onChange={handleInputChange}
                onFocus={() => {
                  if (query.trim()) {
                    setShowDropdown(true);
                  }
                }}
              />
              <span className="material-symbols-outlined absolute right-2 top-2 text-base text-stone-400 dark:text-dark-text-tertiary">
                search
              </span>
              {showDropdown && query.trim() && (
                <UserSearchDropdown
                  query={query}
                  onClose={() => {
                    setShowDropdown(false);
                    setQuery("");
                    clearSearch();
                  }}
                />
              )}
            </div>
          </>
        )}

        {showGroups && (
          <h2 className="font-headline text-sm font-black uppercase tracking-widest text-stone-700 dark:text-dark-text-secondary">
            Your Groups
          </h2>
        )}

        {showContacts && (
          <h2 className="font-headline text-sm font-black uppercase tracking-widest text-stone-700 dark:text-dark-text-secondary">
            Contacts
          </h2>
        )}
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        {showChats && <ConversationList />}

        {showGroups && <GroupList />}

        {showContacts && (
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 font-headline text-[10px] font-black uppercase tracking-widest text-stone-500 dark:text-dark-text-secondary">
                Pending Requests
              </h3>
              {!requestsInitialized || requestsLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="animate-spin" size={24} />
                </div>
              ) : (
                <FriendRequestList
                  friendRequests={friendRequests}
                  onAccept={acceptRequest}
                  onDecline={declineRequest}
                  onStartChat={handleStartChat}
                />
              )}
            </div>

            <div>
              <h3 className="mb-3 font-headline text-[10px] font-black uppercase tracking-widest text-stone-500 dark:text-dark-text-secondary">
                My Friends
              </h3>
              <AllFriendsList onStartChat={handleStartChat} />
            </div>
          </div>
        )}
      </div>
      <UserProfileSwitcher />
    </aside>
  );
}
