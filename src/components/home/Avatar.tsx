import React from "react";
import { Avatar as _Avatar } from "@/components/home/Avatar"; 

// Using a seed-based generator to match original design
export function Avatar({ seed }: { seed: string }) {
  return <_Avatar seed={seed} />;
}
