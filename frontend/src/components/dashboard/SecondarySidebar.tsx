"use client";

import Image from "next/image";
import FriendsList from "./FriendsList";
import GroupList from "./GroupList";
import UserProfileSwitcher from "./UserProfileSwitcher";
import UserSearchDropdown from "./UserSearchDropdown";
import { useFriendsStore } from "@/lib/store/useFriendsStore";
import { avatarUrl } from "@/lib/data";
import { useState, useRef, useEffect } from "react";
import { useDebouncedCallback } from "use-debounce";
import { Check, Loader2, XCircle } from "lucide-react";
import { toast } from "sonner";
import type { SidebarMainItem } from "./PrimarySidebar";

interface SecondarySidebarProps {
  activeMainItem: SidebarMainItem;
}

export default function SecondarySidebar({
  activeMainItem,
}: SecondarySidebarProps) {
  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [actionId, setActionId] = useState<string | null>(null);
  const {
    friendRequests,
    requestsLoading,
    searchUsers,
    clearSearch,
    fetchRequests,
    fetchSentRequests,
    fetchAllFriends,
    acceptRequest,
    declineRequest,
  } = useFriendsStore();
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Fetch friend requests on mount
  useEffect(() => {
    fetchRequests();
    fetchSentRequests();
    fetchAllFriends();
  }, [fetchAllFriends, fetchRequests, fetchSentRequests]);

  const showChats = activeMainItem === "chats";
  const showGroups = activeMainItem === "groups";
  const showContacts = activeMainItem === "contacts";

  return (
    <aside className="z-10 flex h-full w-80 flex-col border-r-4 border-black bg-[#F4EEDB]">
      <div className="border-b-4 border-black p-4">
        {showChats && (
          <>
            <button className="editorial-shadow editorial-active mb-4 flex w-full items-center gap-3 border-2 border-black bg-white p-3 text-xs font-bold uppercase tracking-widest transition-all">
              <span className="material-symbols-outlined text-base">
                edit_square
              </span>
              New Message
              {friendRequests.length > 0 && (
                <span className="ml-auto flex size-5 items-center justify-center border-2 border-black bg-red-500 text-[10px] font-black text-white">
                  {friendRequests.length > 9 ? "9+" : friendRequests.length}
                </span>
              )}
            </button>
            <div className="relative" ref={searchRef}>
              <input
                ref={inputRef}
                className="w-full border-2 border-black bg-surface-container-lowest p-2 text-xs font-bold placeholder:text-stone-400 focus:outline-none focus:ring-0"
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
              <span className="material-symbols-outlined absolute right-2 top-2 text-base text-stone-400">
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
          <h2 className="font-headline text-sm font-black uppercase tracking-widest text-stone-700">
            Your Groups
          </h2>
        )}

        {showContacts && (
          <h2 className="font-headline text-sm font-black uppercase tracking-widest text-stone-700">
            Friend Requests
          </h2>
        )}
      </div>
      <div className="flex-1 space-y-6 overflow-y-auto p-4">
        {showChats && (
          <>
            <GroupList />
            <FriendsList />
          </>
        )}

        {showGroups && <GroupList />}

        {showContacts && (
          <>
            {requestsLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="animate-spin" size={24} />
              </div>
            ) : friendRequests.length === 0 ? (
              <div className="py-12 text-center">
                <span className="material-symbols-outlined text-5xl text-stone-300">
                  person_search
                </span>
                <p className="mt-4 text-sm font-bold uppercase tracking-widest text-stone-400">
                  No pending requests
                </p>
              </div>
            ) : (
              <ul className="space-y-3">
                {friendRequests.map((req) => {
                  const from = req.from;
                  return (
                    <li
                      key={req._id}
                      className="editorial-shadow flex items-center gap-3 border-4 border-black bg-white p-4"
                    >
                      <Image
                        src={from?.avatarUrl || avatarUrl}
                        alt={from?.displayName || "User"}
                        width={48}
                        height={48}
                        className="h-12 w-12 flex-shrink-0 border-2 border-black object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-black uppercase">
                          {from?.displayName}
                        </p>
                        <p className="truncate text-xs font-bold text-stone-500">
                          @{from?.username}
                        </p>
                        {req.message && (
                          <p className="mt-1 truncate text-xs italic text-stone-400">
                            &ldquo;{req.message}&rdquo;
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={async () => {
                            setActionId(req._id);
                            try {
                              await acceptRequest(req._id);
                              toast.success(
                                `You are now friends with ${from?.displayName}!`
                              );
                            } catch {
                              toast.error("Failed to accept request.");
                            } finally {
                              setActionId(null);
                            }
                          }}
                          disabled={actionId === req._id}
                          className="flex size-9 items-center justify-center border-2 border-black bg-green-400 transition-all hover:shadow-[2px_2px_0px_0px_#1E1C11] disabled:opacity-50"
                          title="Accept"
                        >
                          {actionId === req._id ? (
                            <Loader2 size={14} className="animate-spin" />
                          ) : (
                            <Check size={14} strokeWidth={3} />
                          )}
                        </button>
                        <button
                          onClick={async () => {
                            setActionId(req._id);
                            try {
                              await declineRequest(req._id);
                              toast.success("Request declined.");
                            } catch {
                              toast.error("Failed to decline request.");
                            } finally {
                              setActionId(null);
                            }
                          }}
                          disabled={actionId === req._id}
                          className="flex size-9 items-center justify-center border-2 border-black bg-red-400 transition-all hover:shadow-[2px_2px_0px_0px_#1E1C11] disabled:opacity-50"
                          title="Decline"
                        >
                          <XCircle size={14} strokeWidth={3} />
                        </button>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </>
        )}
      </div>
      <UserProfileSwitcher />
    </aside>
  );
}
