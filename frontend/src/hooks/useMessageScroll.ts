import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  type MutableRefObject,
} from "react";

type PrependAnchor = {
  prevHeight: number;
  prevTop: number;
};

type UseMessageScrollArgs = {
  activeConversationId: string | null;
  lastMessageId: string | null;
  messagesLength: number;
  scrollContainerId: string;
};

export function useMessageScroll({
  activeConversationId,
  lastMessageId,
  messagesLength,
  scrollContainerId,
}: UseMessageScrollArgs) {
  const messageEndRef = useRef<HTMLDivElement>(null);
  const prevLastMessageIdRef = useRef<string | null>(null);
  const prevActiveIdRef = useRef<string | null>(null);
  const prependAnchorRef = useRef<PrependAnchor | null>(null);

  const getScrollContainer = useCallback(() => {
    return document.getElementById(scrollContainerId);
  }, [scrollContainerId]);

  useLayoutEffect(() => {
    if (activeConversationId && activeConversationId !== prevActiveIdRef.current) {
      prevActiveIdRef.current = activeConversationId;
      prevLastMessageIdRef.current = null;
      messageEndRef.current?.scrollIntoView({ block: "end" });
    }
  }, [activeConversationId]);

  useEffect(() => {
    if (!lastMessageId) return;
    if (prevLastMessageIdRef.current === null) {
      prevLastMessageIdRef.current = lastMessageId;
      return;
    }

    if (prevLastMessageIdRef.current !== lastMessageId) {
      messageEndRef.current?.scrollIntoView({
        block: "end",
        behavior: "smooth",
      });
    }

    prevLastMessageIdRef.current = lastMessageId;
  }, [lastMessageId]);

  useLayoutEffect(() => {
    const anchor = prependAnchorRef.current;
    if (!anchor) return;
    const container = getScrollContainer();
    if (!container) return;

    const restoreScrollTop = () => {
      const nextTop = container.scrollHeight - anchor.prevHeight + anchor.prevTop;
      container.scrollTop = nextTop;
      prependAnchorRef.current = null;
    };

    if (typeof ResizeObserver === "undefined") {
      requestAnimationFrame(restoreScrollTop);
      return;
    }

    let didRestore = false;
    const observer = new ResizeObserver(() => {
      if (didRestore) return;
      didRestore = true;
      requestAnimationFrame(() => {
        restoreScrollTop();
        observer.disconnect();
      });
    });

    observer.observe(container);

    const fallbackFrame = requestAnimationFrame(() => {
      if (didRestore) return;
      didRestore = true;
      restoreScrollTop();
      observer.disconnect();
    });

    return () => {
      cancelAnimationFrame(fallbackFrame);
      observer.disconnect();
    };
  }, [getScrollContainer, messagesLength]);

  return {
    getScrollContainer,
    messageEndRef,
    prependAnchorRef: prependAnchorRef as MutableRefObject<PrependAnchor | null>,
  };
}
