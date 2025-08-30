import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDifficulty(difficulty?: string) {
  if (!difficulty) return "";
  const map: Record<string, string> = {
    easy: "Легко",
    medium: "Средне",
    hard: "Сложно",
  };

  const lower = difficulty.toLowerCase();
  if (map[lower]) return map[lower];

  // Fallback: if it's an enum like "Difficulty.EASY" or "SomeEnum.VALUE",
  // take the last token, replace underscores, and title-case it.
  const token = difficulty.split(".").pop() || difficulty;
  const cleaned = token.replace(/_/g, " ").toLowerCase();
  return cleaned
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
