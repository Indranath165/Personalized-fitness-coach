import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date): string {
  const safeDate = safeParseDate(date);
  if (!safeDate) return 'Invalid Date';
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(safeDate);
}

// Safe date parsing utility
export function safeParseDate(date: string | Date | null | undefined): Date | null {
  if (!date) return null;
  
  try {
    const parsed = new Date(date);
    // Check if the date is valid
    if (isNaN(parsed.getTime())) {
      return null;
    }
    return parsed;
  } catch (error) {
    console.warn('Invalid date value:', date);
    return null;
  }
}

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

export function getEquipmentLabel(equipment: string): string {
  return equipment
    .split('_')
    .map(word => capitalizeFirst(word))
    .join(' ');
}

export function getGoalLabel(goal: string): string {
  return goal
    .split('_')
    .map(word => capitalizeFirst(word))
    .join(' ');
}
