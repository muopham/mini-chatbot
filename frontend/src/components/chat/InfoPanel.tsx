import Image from "next/image";
import { contacts, sharedFiles, mediaAssets } from "@/lib/data";

const activeContact = contacts[0];

export default function InfoPanel() {
  return (
    <aside className="sticky top-[72px] hidden h-[calc(100vh-72px)] w-[350px] flex-col overflow-y-auto border-l-4 border-black bg-background-light p-8 lg:flex">
      {/* Profile */}
      <div className="mb-10 flex flex-col items-center text-center">
        <div className="relative mb-4">
          <Image
            src={activeContact.avatar!}
            alt={activeContact.name}
            width={128}
            height={128}
            className="border-4 border-black editorial-shadow"
          />
          <div className="absolute -bottom-2 -right-2 border-2 border-black bg-accent-yellow px-3 py-1 font-headline text-xs font-black uppercase shadow-[2px_2px_0px_0px_#000]">
            Active
          </div>
        </div>
        <h2 className="font-headline text-2xl font-black uppercase tracking-tighter">
          {activeContact.name}
        </h2>
        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-stone-500">
          {activeContact.role}
        </p>
      </div>

      <div className="space-y-8">
        {/* Shared Files */}
        <div>
          <h4 className="font-headline mb-4 border-b-2 border-stone-200 pb-2 text-sm font-black uppercase tracking-widest">
            Shared Files
          </h4>
          <div className="space-y-3">
            {sharedFiles.map((file) => (
              <div
                key={file.id}
                className="group flex cursor-pointer items-center gap-3"
              >
                <div
                  className={`flex h-10 w-10 items-center justify-center border-2 border-black ${
                    file.type === "document"
                      ? "bg-accent-yellow"
                      : "bg-secondary-container"
                  }`}
                >
                  <span
                    className={`material-symbols-outlined text-sm ${file.type === "image" ? "text-white" : ""}`}
                  >
                    {file.type === "document" ? "description" : "image"}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="truncate text-sm font-bold transition-colors group-hover:text-secondary">
                    {file.name}
                  </p>
                  <p className="font-headline text-[10px] font-black uppercase text-stone-400">
                    {file.size} • {file.date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Media Assets */}
        <div>
          <h4 className="font-headline mb-4 border-b-2 border-stone-200 pb-2 text-sm font-black uppercase tracking-widest">
            Media Assets
          </h4>
          <div className="grid grid-cols-3 gap-2">
            {mediaAssets.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`Media ${i + 1}`}
                width={100}
                height={100}
                className="aspect-square w-full border-2 border-black object-cover"
              />
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-4 pt-6">
          <button className="flex w-full items-center justify-between border-2 border-black bg-surface-container-high px-4 py-3 text-xs font-bold uppercase tracking-widest transition-colors hover:bg-surface-container-highest">
            Mute Notifications
            <span className="material-symbols-outlined text-sm">
              notifications_off
            </span>
          </button>
          <button className="flex w-full items-center justify-between border-2 border-black bg-surface-container-high px-4 py-3 text-xs font-bold uppercase tracking-widest text-error transition-colors hover:bg-error-container">
            Block User
            <span className="material-symbols-outlined text-sm">block</span>
          </button>
          <button className="flex w-full items-center justify-between border-2 border-black bg-surface-container-high px-4 py-3 text-xs font-bold uppercase tracking-widest text-error transition-colors hover:bg-error-container">
            Report Chat
            <span className="material-symbols-outlined text-sm">report</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
