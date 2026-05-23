'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { AuthSession } from '@/types';
import toast from 'react-hot-toast';

const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15分
const WARN_BEFORE_MS  =  2 * 60 * 1000; // ログアウト2分前に警告

export function useAuth() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const warnToastId  = useRef<string | null>(null);

  const fetchSession = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const { data } = await res.json();
        setSession(data);
      } else {
        setSession(null);
      }
    } catch {
      setSession(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSession();
  }, [fetchSession]);

  const logout = useCallback(async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    setSession(null);
    router.push('/login');
  }, [router]);

  // ===== アイドルタイムアウト（15分操作なしで自動ログアウト） =====
  useEffect(() => {
    if (!session) return;

    const clearTimers = () => {
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (warnTimerRef.current) clearTimeout(warnTimerRef.current);
      if (warnToastId.current)  toast.dismiss(warnToastId.current);
      warnToastId.current = null;
    };

    const resetIdleTimer = () => {
      clearTimers();

      // 13分後：警告トースト
      warnTimerRef.current = setTimeout(() => {
        warnToastId.current = toast(
          '⏰ まもなく自動ログアウトします（残り2分）',
          {
            duration: WARN_BEFORE_MS,
            style: {
              background: '#fff7ed',
              color: '#9a3412',
              border: '1px solid #fed7aa',
              fontFamily: 'inherit',
              borderRadius: '12px',
              fontSize: '13px',
            },
          }
        );
      }, IDLE_TIMEOUT_MS - WARN_BEFORE_MS);

      // 15分後：自動ログアウト
      idleTimerRef.current = setTimeout(async () => {
        toast.dismiss();
        await fetch('/api/auth/logout', { method: 'POST' });
        setSession(null);
        toast('🔒 15分間操作がなかったためログアウトしました', {
          duration: 4000,
          style: {
            background: '#f0fdf4',
            color: '#166534',
            border: '1px solid #bbf7d0',
            fontFamily: 'inherit',
            borderRadius: '12px',
            fontSize: '13px',
          },
        });
        router.push('/login');
      }, IDLE_TIMEOUT_MS);
    };

    const ACTIVITY_EVENTS = [
      'mousedown', 'mousemove', 'keydown',
      'scroll', 'touchstart', 'click', 'pointerdown',
    ] as const;

    ACTIVITY_EVENTS.forEach(e =>
      window.addEventListener(e, resetIdleTimer, { passive: true, capture: true })
    );
    resetIdleTimer(); // タイマー開始

    return () => {
      clearTimers();
      ACTIVITY_EVENTS.forEach(e =>
        window.removeEventListener(e, resetIdleTimer, { capture: true })
      );
    };
  }, [session, logout, router]);

  return { session, loading, logout, refetch: fetchSession };
}
