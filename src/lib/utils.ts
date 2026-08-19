import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Discord Snowflake ID extraction:
 * formula: (BigInt(id) >> 22n) + 1420070400000n
 */
export function getDiscordCreationDate(id: string): Date {
  try {
    const timestamp = (BigInt(id) >> 22n) + 1420070400000n;
    return new Date(Number(timestamp));
  } catch (e) {
    return new Date();
  }
}

export function formatDiscordAccountAge(id: string): string {
  const created = getDiscordCreationDate(id);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - created.getTime());
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 30) return `Criada há ${diffDays} dias`;
  
  const diffMonths = Math.floor(diffDays / 30);
  if (diffMonths < 12) return `Criada há ${diffMonths} meses`;
  
  const years = Math.floor(diffMonths / 12);
  const remainingMonths = diffMonths % 12;
  
  if (remainingMonths === 0) return `${years} anos`;
  return `${years} anos e ${remainingMonths} meses`;
}

