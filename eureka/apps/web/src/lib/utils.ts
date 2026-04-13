import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind classes with clsx
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format date to localized string
 */
export function formatDate(date: string | Date): string {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Format date to relative time (e.g., "2 days ago")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)} days ago`;
  
  return formatDate(date);
}

/**
 * Get initials from name
 * Handles both single names and first/last name combinations
 */
export function getInitials(firstName?: string, lastName?: string): string {
  if (!firstName && !lastName) return 'U';

  if (!lastName) {
    // If only one name provided, use first two characters or first character twice
    const name = firstName || '';
    const words = name.trim().split(' ');
    if (words.length > 1) {
      return `${words[0].charAt(0)}${words[words.length - 1].charAt(0)}`.toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  }

  return `${firstName?.charAt(0) || ''}${lastName?.charAt(0) || ''}`.toUpperCase();
}

/** Display name for UI when first/last may be empty (uses display_name or email local part). */
export function getUserDisplayName(
  user: { display_name?: string; first_name?: string; last_name?: string; email?: string } | null | undefined
): string {
  if (!user) return 'Account';
  const d = user.display_name?.trim();
  if (d) return d;
  const n = `${user.first_name || ''} ${user.last_name || ''}`.trim();
  if (n) return n;
  if (user.email?.includes('@')) {
    const local = user.email.split('@')[0] || '';
    return local || 'Account';
  }
  return 'Account';
}

/** Initials for avatars when first/last may be missing. */
export function getUserInitials(
  user: { display_name?: string; first_name?: string; last_name?: string; email?: string } | null | undefined
): string {
  if (!user) return 'U';
  if (user.first_name?.trim() || user.last_name?.trim()) {
    return getInitials(user.first_name, user.last_name);
  }
  if (user.display_name?.trim()) {
    const parts = user.display_name.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
    if (parts[0].length >= 2) return parts[0].slice(0, 2).toUpperCase();
    return parts[0].charAt(0).toUpperCase();
  }
  if (user.email?.includes('@')) {
    const local = user.email.split('@')[0] || 'U';
    return local.slice(0, 2).toUpperCase();
  }
  return 'U';
}

/**
 * Calculate progress percentage
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
}

/**
 * Get role display name
 */
export function getRoleDisplayName(role: string): string {
  const roleNames: Record<string, string> = {
    super_admin: 'Super Admin',
    org_admin: 'Organization Admin',
    teacher: 'Teacher',
    student: 'Student',
    parent: 'Parent',
  };
  return roleNames[role] || role;
}

/**
 * Get tier display name
 */
export function getTierDisplayName(tier: string): string {
  const tierNames: Record<string, string> = {
    high_school: 'High School',
    undergraduate: 'Undergraduate',
    graduate: 'Graduate',
    professional_medical: 'Medical School',
    professional_law: 'Law School',
    professional_mba: 'MBA Program',
    professional_engineering: 'Engineering',
  };
  return tierNames[tier] || tier;
}

/**
 * Format time in seconds to MM:SS or HH:MM:SS format
 */
export function formatTime(seconds: number): string {
  if (seconds < 0) return '0:00';

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Format percentage value
 */
export function formatPercentage(value: number, decimals: number = 1): string {
  return `${value.toFixed(decimals)}%`;
}
