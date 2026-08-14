import React from "react";

export function Avatar({ seed }: { seed: string }) {
  const url = `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(seed)}`;
  return (
    <img
      src={url}
      alt=""
      className="h-full w-full object-cover opacity-80"
      loading="lazy"
    />
  );
}
