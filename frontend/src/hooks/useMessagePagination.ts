import { useCallback, useEffect, useRef, type MutableRefObject } from "react";

type PrependAnchor = {
  prevHeight: number;
  prevTop: number;
};

type UseMessagePaginationArgs = {
  activeConversationId: string | null;
  hasMore: boolean;
  fetchMessages: (conversationId?: string) => Promise<void>;
  getScrollContainer: () => HTMLElement | null;
  prependAnchorRef: MutableRefObject<PrependAnchor | null>;
};

export function useMessagePagination({
  activeConversationId,
  hasMore,
  fetchMessages,
  getScrollContainer,
  prependAnchorRef,
}: UseMessagePaginationArgs) {
  const isFetchingRef = useRef(false);

  const handleLoadMore = useCallback(() => {
    if (!activeConversationId || !hasMore) return;
    if (isFetchingRef.current) return;

    const container = getScrollContainer();
    if (container) {
      prependAnchorRef.current = {
        prevHeight: container.scrollHeight,
        prevTop: container.scrollTop,
      };
    }

    isFetchingRef.current = true;
    fetchMessages(activeConversationId).finally(() => {
      isFetchingRef.current = false;
    });
  }, [activeConversationId, fetchMessages, getScrollContainer, hasMore, prependAnchorRef]);

  useEffect(() => {
    const container = getScrollContainer();
    if (!container) return;

    const onScroll = () => {
      if (container.scrollTop <= 20 && !isFetchingRef.current) {
        handleLoadMore();
      }
    };

    container.addEventListener("scroll", onScroll);
    return () => container.removeEventListener("scroll", onScroll);
  }, [activeConversationId, getScrollContainer, handleLoadMore]);
}
