interface ConversationListSkeletonProps {
  count?: number;
}

export default function ConversationListSkeleton({
  count = 3,
}: ConversationListSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="flex items-center gap-3 border-2 border-black bg-white p-3 dark:border-dark-border dark:bg-dark-bg-card"
        >
          <div className="size-10 animate-pulse border-2 border-black bg-stone-200 dark:border-dark-border dark:bg-dark-bg-input" />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-3 w-2/3 animate-pulse bg-stone-200" />
            <div className="h-2 w-1/2 animate-pulse bg-stone-200" />
          </div>
        </div>
      ))}
    </>
  );
}
