import React from "react";

export function Avatar({ seed }: { seed: string }) {
  return (
    <img
      src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${encodeURIComponent(seed)}&backgroundType=gradientLinear`}
      alt=""
      className="h-full w-full object-cover"
      loading="lazy"
    />
  );
}
