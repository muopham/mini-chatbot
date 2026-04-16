"use client";

import { useState } from "react";
import GroupCreateModal from "./GroupCreateModal";
import FriendRequestsModal from "./FriendRequestsModal";

export default function EmptyStateMain() {
 const [showGroupModal, setShowGroupModal] = useState(false);
 const [showRequestsModal, setShowRequestsModal] = useState(false);

 return (
 <main className="relative flex flex-1 flex-col items-center justify-center overflow-y-auto bg-surface-container p-8">
 <div className="w-full max-w-md text-center">
 <div className="editorial-shadow mb-8 inline-flex h-32 w-32 items-center justify-center rounded-full border-4 border-black bg-secondary-container">
 <span
 className="material-symbols-outlined text-6xl text-white"
 style={{ fontVariationSettings: '"FILL" 1' }}
 >
 forum
 </span>
 </div>
 <h2 className="mb-4 font-headline text-4xl font-black uppercase leading-none tracking-tighter">
 Welcome back!
 </h2>
 <p className="mb-12 text-sm font-bold uppercase tracking-widest text-stone-500">
 Pick a conversation from the sidebar to start chatting or try one of
 the actions below.
 </p>
 <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
 <button
 onClick={() => setShowGroupModal(true)}
 className="editorial-shadow editorial-active flex flex-col items-center gap-3 border-4 border-black bg-primary-container p-6 transition-all"
 >
 <span className="material-symbols-outlined text-3xl">
 group_add
 </span>
 <span className="font-headline text-xs font-black uppercase tracking-widest">
 Create New Group
 </span>
 </button>
 <button
 onClick={() => setShowRequestsModal(true)}
 className="editorial-shadow editorial-active flex flex-col items-center gap-3 border-4 border-black bg-white p-6 transition-all"
 >
 <span className="material-symbols-outlined text-3xl">
 person_search
 </span>
 <span className="font-headline text-xs font-black uppercase tracking-widest">
 Find Friends
 </span>
 </button>
 </div>
 </div>
 <div className="editorial-shadow absolute bottom-12 right-12 hidden w-48 rotate-3 transform border-4 border-black bg-[#FFF9E8] p-4 lg:block">
 <p className="mb-1 text-[10px] font-black uppercase">Status Update</p>
 <p className="text-xs font-bold">Everything is looking sharp today!</p>
 </div>
 <GroupCreateModal
 isOpen={showGroupModal}
 onClose={() => setShowGroupModal(false)}
 />
 <FriendRequestsModal
 isOpen={showRequestsModal}
 onClose={() => setShowRequestsModal(false)}
 />
 </main>
 );
}
