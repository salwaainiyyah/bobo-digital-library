'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { formatRelativeTime, getCategoryStyle } from '@/components/layout/NotificationBell';
import { NOTIFS_READ_EVENT } from '@/lib/hooks/useUnreadNotifications';

export default function StudentNotificationList({ userId }) {
  const router = useRouter();
  // Kunci yang sama dengan NotificationBell agar status "sudah dibaca" selalu sinkron
  const storageKey = `bobo_read_notifs_${userId || 'guest'}`;

  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'unread' | 'all'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(() => {
      try {
        const saved = window.localStorage.getItem(storageKey);
        setReadIds(saved ? JSON.parse(saved) : []);
      } catch {
        setReadIds([]);
      }
    });
    return () => window.cancelAnimationFrame(frameId);
  }, [storageKey]);

  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const res = await fetch('/api/notifications', { cache: 'no-store' });
        if (!res.ok || !active) return;
        const data = await res.json();
        if (active) setNotifications(data.notifications || []);
      } catch {
        // Abaikan gangguan sementara
      } finally {
        if (active) setIsLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, []);

  const persistReadIds = useCallback(
    (nextIds) => {
      setReadIds(nextIds);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(nextIds));
        window.dispatchEvent(new Event(NOTIFS_READ_EVENT));
      } catch {
        // Abaikan jika storage penuh
      }
    },
    [storageKey]
  );

  const enrichedList = notifications.map((item) => ({
    ...item,
    is_read: readIds.includes(item.id),
  }));
  const unreadCount = enrichedList.filter((item) => !item.is_read).length;
  const displayedList =
    activeTab === 'unread' ? enrichedList.filter((item) => !item.is_read) : enrichedList;

  function handleMarkAllRead() {
    if (unreadCount === 0) return;
    persistReadIds(Array.from(new Set([...readIds, ...notifications.map((n) => n.id)])));
  }

  function handleItemClick(item) {
    if (!item.is_read) {
      persistReadIds(Array.from(new Set([...readIds, item.id])));
    }
    if (item.link_url) {
      router.push(item.link_url);
    }
  }

  return (
    <section className="rounded-[26px] border-2 border-[#E4CEAD] bg-[#FFFDF9] shadow-[0_6px_0_#EAD5B5]/60 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAD5B5] px-5 pt-4">
        <div className="flex items-center gap-5 text-xs">
          <button
            type="button"
            onClick={() => setActiveTab('all')}
            className={`relative pb-3 font-bold transition-colors cursor-pointer ${
              activeTab === 'all' ? 'text-[#5A3E28]' : 'text-[#79543D]/55 hover:text-[#79543D]'
            }`}
          >
            Semua ({enrichedList.length})
            {activeTab === 'all' && (
              <span className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-full bg-[#5A3E28]" />
            )}
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('unread')}
            className={`relative pb-3 font-bold transition-colors cursor-pointer ${
              activeTab === 'unread' ? 'text-[#5A3E28]' : 'text-[#79543D]/55 hover:text-[#79543D]'
            }`}
          >
            Belum dibaca ({unreadCount})
            {activeTab === 'unread' && (
              <span className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-full bg-[#5A3E28]" />
            )}
          </button>
        </div>

        <button
          type="button"
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0}
          className="pb-3 text-[11px] font-semibold text-[#79543D]/70 hover:text-[#929D75] disabled:opacity-40 transition-colors cursor-pointer"
        >
          Tandai semua dibaca
        </button>
      </div>

      <div className="divide-y divide-[#EAD5B5]/60">
        {isLoading ? (
          <div className="py-12 text-center text-xs text-[#79543D]/60">Memuat notifikasi...</div>
        ) : displayedList.length === 0 ? (
          <div className="py-12 px-6 text-center space-y-1">
            <p className="text-sm font-bold text-[#5A3E28]">
              {activeTab === 'unread' ? 'Tidak ada notifikasi baru' : 'Belum ada riwayat notifikasi'}
            </p>
            <p className="text-xs text-[#79543D]/60">
              Seluruh aktivitas peminjaman, denda, dan akun akan tercatat di sini.
            </p>
          </div>
        ) : (
          displayedList.map((item) => {
            const style = getCategoryStyle(item.category);
            const initial = (item.actor_name || 'B').charAt(0).toUpperCase();

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleItemClick(item)}
                className={`w-full text-left px-5 py-4 flex items-start gap-3 transition-colors hover:bg-[#FAF4E8] cursor-pointer ${
                  !item.is_read ? 'bg-[#FAF4E8]/55' : 'bg-transparent'
                }`}
              >
                <div className="relative shrink-0 mt-0.5">
                  <div
                    className={`h-10 w-10 rounded-full border flex items-center justify-center text-xs font-extrabold ${style.bg}`}
                  >
                    {initial}
                  </div>
                  <span
                    className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#FFFDF9] ${style.dot}`}
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm text-[#5A3E28] leading-snug">
                    <strong className="font-bold">{item.actor_name}</strong>{' '}
                    <span className="text-[#6E5038]">{item.message}</span>
                  </p>
                  <p className="text-[11px] text-[#79543D]/60">
                    {formatRelativeTime(item.created_at)} • {style.label}
                  </p>
                </div>

                {!item.is_read && (
                  <span
                    aria-label="Belum dibaca"
                    className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#C96858]"
                  />
                )}
              </button>
            );
          })
        )}
      </div>
    </section>
  );
}