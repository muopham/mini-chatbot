import Link from "next/link";

const navItems = [
  { href: "/dashboard", icon: "forum", label: "Chats", active: true },
  { href: "#", icon: "contacts", label: "Contacts", active: false },
  { href: "#", icon: "settings", label: "Settings", active: false },
];

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 z-50 flex h-16 w-full items-center justify-around border-t-4 border-black bg-background-light dark:bg-stone-950 md:hidden">
      {navItems.map((item) => (
        <Link
          key={item.label}
          href={item.href}
          className={`flex h-full w-1/3 flex-col items-center justify-center ${
            item.active
              ? "border-l-2 border-r-2 border-black bg-accent-yellow text-black"
              : "text-stone-600 hover:bg-surface-container dark:text-stone-400"
          }`}
        >
          <span
            className="material-symbols-outlined"
            style={
              item.active
                ? { fontVariationSettings: "'FILL' 1" }
                : undefined
            }
          >
            {item.icon}
          </span>
          <span className="mt-1 font-inter text-[10px] font-black uppercase">
            {item.label}
          </span>
        </Link>
      ))}
    </nav>
  );
}
