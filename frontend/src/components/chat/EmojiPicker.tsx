"use client";

import { useEffect, useRef } from "react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

type Props = {
  onSelect: (emoji: string) => void;
  onClose: () => void;
};

export default function EmojiPicker({ onSelect, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // click outside -> close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div
      ref={ref}
      className="absolute bottom-14 right-0 z-50 border-2 border-black shadow-lg"
    >
      <Picker
        data={data}
        onEmojiSelect={(emoji: any) => onSelect(emoji.native)}
        theme="light"
      />
    </div>
  );
}
