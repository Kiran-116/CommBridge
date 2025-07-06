import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { SkillLevel } from "@/types";

/**
 * Merge Tailwind CSS classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format time duration in minutes to human readable format
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (remainingMinutes === 0) {
    return `${hours}h`;
  }

  return `${hours}h ${remainingMinutes}m`;
}

/**
 * Format date to relative time (e.g., "2 hours ago", "3 days ago")
 */
export function formatRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  }

  const diffInWeeks = Math.floor(diffInDays / 7);
  if (diffInWeeks < 4) {
    return `${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  return `${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`;
}

/**
 * Format date to short format (e.g., "Jan 15, 2024")
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

/**
 * Format score as percentage
 */
export function formatScore(score: number): string {
  return `${Math.round(score * 100)}%`;
}

/**
 * Get skill level color
 */
export function getSkillLevelColor(level: SkillLevel): string {
  switch (level) {
    case "beginner":
      return "text-green-600 bg-green-100";
    case "intermediate":
      return "text-blue-600 bg-blue-100";
    case "advanced":
      return "text-purple-600 bg-purple-100";
    case "expert":
      return "text-red-600 bg-red-100";
    default:
      return "text-gray-600 bg-gray-100";
  }
}

/**
 * Get skill level badge
 */
export function getSkillLevelBadge(level: SkillLevel): string {
  switch (level) {
    case "beginner":
      return "🌱";
    case "intermediate":
      return "🚀";
    case "advanced":
      return "⭐";
    case "expert":
      return "👑";
    default:
      return "📚";
  }
}

/**
 * Calculate words per minute
 */
export function calculateWPM(
  wordCount: number,
  durationInSeconds: number
): number {
  const minutes = durationInSeconds / 60;
  return Math.round(wordCount / minutes);
}

/**
 * Generate a random ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

/**
 * Debounce function
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return (...args: Parameters<T>) => {
    if (timeout) {
      clearTimeout(timeout);
    }

    timeout = setTimeout(() => {
      func(...args);
    }, wait);
  };
}

/**
 * Throttle function
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

/**
 * Capitalize first letter of string
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Convert string to title case
 */
export function toTitleCase(str: string): string {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength) + "...";
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length;
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = countWords(text);
  return Math.ceil(wordCount / wordsPerMinute);
}

/**
 * Format file size
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Generate avatar placeholder
 */
export function getAvatarPlaceholder(name: string): string {
  const initials = name
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");

  return `https://ui-avatars.com/api/?name=${initials}&background=0ea5e9&color=ffffff&size=128`;
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Generate color based on string
 */
export function stringToColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  const colors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
  ];

  return colors[Math.abs(hash) % colors.length];
}

/**
 * Safe JSON parse
 */
export function safeJsonParse<T>(str: string, defaultValue: T): T {
  try {
    return JSON.parse(str);
  } catch {
    return defaultValue;
  }
}

/**
 * Generate slug from text
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Check if device is mobile
 */
export function isMobile(): boolean {
  return window.innerWidth < 768;
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback for older browsers
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
      document.execCommand("copy");
      document.body.removeChild(textArea);
      return true;
    } catch {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return new Intl.NumberFormat().format(num);
}

/**
 * Calculate percentage
 */
export function calculatePercentage(value: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((value / total) * 100);
}

/**
 * Get XP required for next level
 */
export function getXPForLevel(level: number): number {
  return level * 1000 + (level - 1) * 500;
}

/**
 * Calculate level from XP
 */
export function getLevelFromXP(xp: number): number {
  let level = 1;
  let totalXP = 0;

  while (totalXP <= xp) {
    totalXP += getXPForLevel(level);
    if (totalXP <= xp) {
      level++;
    }
  }

  return level;
}

/**
 * Get progress to next level
 */
export function getProgressToNextLevel(xp: number): {
  level: number;
  progress: number;
  nextLevelXP: number;
} {
  const currentLevel = getLevelFromXP(xp);
  const currentLevelXP = getXPForLevel(currentLevel);
  const nextLevelXP = getXPForLevel(currentLevel + 1);

  let totalXPForCurrentLevel = 0;
  for (let i = 1; i < currentLevel; i++) {
    totalXPForCurrentLevel += getXPForLevel(i);
  }

  const xpInCurrentLevel = xp - totalXPForCurrentLevel;
  const progress = Math.min(100, (xpInCurrentLevel / currentLevelXP) * 100);

  return {
    level: currentLevel,
    progress,
    nextLevelXP: nextLevelXP - xpInCurrentLevel,
  };
}
