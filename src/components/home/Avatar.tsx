import React from "react";

export function Avatar({ seed, className }: { seed: string; className?: string }) {
  const url = `https://api.dicebear.com/7.x/bottts-neutral/svg?seed=${encodeURIComponent(seed)}&backgroundColor=000000&primaryColor=ff0055`;
  return (
    <img
      src={url}
      alt=""
      className={`h-full w-full object-cover opacity-90 brightness-110 ${className}`}
      loading="lazy"
    />
  );
}
