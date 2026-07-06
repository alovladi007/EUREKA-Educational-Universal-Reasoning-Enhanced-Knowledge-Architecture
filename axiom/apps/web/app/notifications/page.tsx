'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ApiError,
  fetchNotifications,
  getToken,
  markAllNotificationsRead,
  markNotificationRead,
  type NotificationItem,
} from '@/lib/api';
import {
  ErrorPanel,
  HeaderLink,
  PageHeader,
  SignInScreen,
} from '@/components/PageShell';

// The in-app notifications inbox. It lists every notification with a small
// kind badge, the title, the body, and a timestamp. Unread rows are visually
// distinct from read rows. Opening an unread row marks it read and, when it
// carries a link, navigates there. A "Mark all read" button clears the inbox.

type LoadState = 'checking' | 'signed-out' | 'loading' | 'ready' | 'error';

// The colour of each kind badge. Kept in the same emerald/red/brand palette the
// rest of AXIOM uses, with a distinct tint per kind.
const KIND_BADGE: Record<NotificationItem['kind'], string> = {
  assignment:
    'bg-brand-100 text-brand-800 dark:bg-brand-950 dark:text-brand-300',
  badge:
    'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300',
  grade:
    'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300',
  system:
    'bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
};

function formatWhen(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleString();
}

export default function NotificationsPage() {
  const router = useRouter();
  const [state, setState] = useState<LoadState>('checking');
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  async function load() {
    setState('loading');
    try {
      const result = await fetchNotifications(false);
      setItems(result.items);
      setUnreadCount(result.unread_count);
      setState('ready');
    } catch (err) {
      const message =
        err instanceof ApiError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Failed to load your notifications.';
      setErrorMessage(message);
      setState('error');
    }
  }

  useEffect(() => {
    if (!getToken()) {
      setState('signed-out');
      return;
    }
    let cancelled = false;
    (async () => {
      setState('loading');
      try {
        const result = await fetchNotifications(false);
        if (cancelled) {
          return;
        }
        setItems(result.items);
        setUnreadCount(result.unread_count);
        setState('ready');
      } catch (err) {
        if (cancelled) {
          return;
        }
        const message =
          err instanceof ApiError
            ? err.message
            : err instanceof Error
              ? err.message
              : 'Failed to load your notifications.';
        setErrorMessage(message);
        setState('error');
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleMarkAll() {
    try {
      await markAllNotificationsRead();
      await load();
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Failed to mark all as read.';
      setErrorMessage(message);
      setState('error');
    }
  }

  async function handleOpen(item: NotificationItem) {
    if (!item.read) {
      try {
        await markNotificationRead(item.id);
        setItems((prev) =>
          prev.map((n) => (n.id === item.id ? { ...n, read: true } : n)),
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch {
        // A failed mark-read should not block navigation; ignore silently.
      }
    }
    if (item.link) {
      router.push(item.link);
    }
  }

  if (state === 'checking') {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading AXIOM.</p>
      </main>
    );
  }

  if (state === 'signed-out') {
    return <SignInScreen />;
  }

  return (
    <div className="min-h-screen">
      <PageHeader>
        <HeaderLink href="/dashboard">Dashboard</HeaderLink>
        <HeaderLink href="/practice">Practice</HeaderLink>
        <HeaderLink href="/assessments">Assessments</HeaderLink>
        <HeaderLink href="/path">Path</HeaderLink>
        <HeaderLink href="/mastery">Mastery</HeaderLink>
        <HeaderLink href="/review">Review</HeaderLink>
        <HeaderLink href="/achievements">Achievements</HeaderLink>
      </PageHeader>

      <main className="mx-auto max-w-3xl px-6 py-10">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold text-foreground">
              Notifications
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              unread: {unreadCount}
            </p>
          </div>
          {state === 'ready' && items.length > 0 && unreadCount > 0 && (
            <button
              type="button"
              onClick={handleMarkAll}
              className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              Mark all read
            </button>
          )}
        </div>

        {state === 'loading' && (
          <p className="mt-8 text-sm text-muted-foreground">
            Loading your notifications.
          </p>
        )}

        {state === 'error' && (
          <div className="mt-8">
            <ErrorPanel message={errorMessage} />
          </div>
        )}

        {state === 'ready' && (
          <>
            {items.length === 0 ? (
              <div className="mt-8 rounded-lg border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">
                  No notifications yet.
                </p>
              </div>
            ) : (
              <ul className="mt-8 space-y-3">
                {items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={() => handleOpen(item)}
                      className={`w-full rounded-lg border p-4 text-left transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 ${
                        item.read
                          ? 'border-border bg-card hover:bg-muted'
                          : 'border-l-4 border-l-brand-500 border-y-border border-r-border bg-brand-50 hover:bg-brand-100 dark:bg-brand-950/40 dark:hover:bg-brand-950/60'
                      }`}
                    >
                      <div className="flex items-center justify-between gap-3">
                        <span className="flex items-center gap-2">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${KIND_BADGE[item.kind]}`}
                          >
                            {item.kind}
                          </span>
                          <span className="text-sm font-semibold text-card-foreground">
                            {item.title}
                          </span>
                        </span>
                        {!item.read && (
                          <span className="text-xs font-medium text-brand-600 dark:text-brand-300">
                            Unread
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {item.body}
                      </p>
                      <span className="mt-2 block text-xs text-muted-foreground">
                        {formatWhen(item.created_at)}
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </main>
    </div>
  );
}
