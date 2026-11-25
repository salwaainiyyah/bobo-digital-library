'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';

export function formatRelativeTime(dateString) {
  const now = new Date();
  const past = new Date(dateString);
  const diffSeconds = Math.max(1, Math.floor((now - past) / 1000));

  if (diffSeconds < 60) return 'Baru saja';
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes} menit lalu`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} jam lalu`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} hari lalu`;

  return past.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function getCategoryStyle(category) {
  switch (category) {
    case 'AKUN':
      return {
        bg: 'bg-[#EEF4E6] text-[#556B43] border-[#8BA372]/40',
        dot: 'bg-[#7B9663]',
        label: 'Akun',
      };
    case 'DENDA':
      return {
        bg: 'bg-[#FBECE9] text-[#A84A3B] border-[#C96858]/40',
        dot: 'bg-[#C96858]',
        label: 'Denda',
      };
    case 'PERPANJANGAN':
      return {
        bg: 'bg-[#FDF5E4] text-[#855B10] border-[#E2B15B]/50',
        dot: 'bg-[#E2B15B]',
        label: 'Perpanjangan',
      };
    default:
      return {
        bg: 'bg-[#FAF4E8] text-[#79543D] border-[#DFC7A2]',
        dot: 'bg-[#929D75]',
        label: 'Sirkulasi',
      };
  }
}

export default function NotificationBell({ userId }) {
  const router = useRouter();
  const wrapperRef = useRef(null);
  const storageKey = `bobo_read_notifs_${userId || 'guest'}`;

  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('unread'); // 'unread' | 'all'
  const [notifications, setNotifications] = useState([]);
  const [readIds, setReadIds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Muat riwayat status "sudah dibaca" dari localStorage per akun
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

  const persistReadIds = useCallback(
    (nextIds) => {
      setReadIds(nextIds);
      try {
        window.localStorage.setItem(storageKey, JSON.stringify(nextIds));
      } catch {
        // Abaikan jika storage penuh
      }
    },
    [storageKey]
  );

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications', { cache: 'no-store' });
      if (!res.ok) return;
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch {
      // Abaikan gangguan sementara
    } finally {
      setIsLoading(false);
    }
  }, []);

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
    const interval = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  // Tutup popover saat klik di luar area
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const enrichedList = notifications.map((item) => ({
    ...item,
    is_read: readIds.includes(item.id),
  }));

  const unreadCount = enrichedList.filter((item) => !item.is_read).length;

  function handleMarkAllRead() {
    if (unreadCount === 0) return;
    const allIds = Array.from(new Set([...readIds, ...notifications.map((n) => n.id)]));
    persistReadIds(allIds);
  }

  function handleItemClick(item) {
    if (!item.is_read) {
      const nextIds = Array.from(new Set([...readIds, item.id]));
      persistReadIds(nextIds);
    }

    setIsOpen(false);
    if (item.link_url) {
      router.push(item.link_url);
      router.refresh();
    }
  }

  const displayedList =
    activeTab === 'unread'
      ? enrichedList.filter((item) => !item.is_read)
      : enrichedList;

  return (
    <div ref={wrapperRef} className="sm:relative">
      {/* Tombol Ikon Lonceng Bulat di Navbar */}
      <button
        type="button"
        onClick={() => {
          setIsOpen((prev) => !prev);
          if (!isOpen) fetchNotifications();
        }}
        aria-label="Notifikasi"
        className={`relative flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full border transition-all cursor-pointer ${
          isOpen
            ? 'border-[#68774E] bg-[#E6ECD8] text-[#54603B]'
            : 'border-[#EBCFA9] bg-[#F7EBD8] text-[#79543D] hover:bg-[#E6ECD8]/60'
        }`}
      >
        <svg
          className="h-[18px] w-[18px]"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.73 21a2 2 0 0 1-3.46 0" />
        </svg>

        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-[#C96858] px-1 text-[10px] font-bold text-white ring-2 ring-[#FFFDF9]">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Daftar Notifikasi */}
      {isOpen && (
        <div className="absolute inset-x-3 top-full mt-2 sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-3 sm:w-[390px] z-50 rounded-3xl border-2 border-[#E4CEAD] bg-[#FFFDF9] shadow-[0_18px_40px_rgba(90,60,42,0.2)] overflow-hidden">
          {/* Segitiga Pointer Atas */}
          <div
            aria-hidden="true"
            className="hidden sm:block absolute -top-2 right-[13px] h-3.5 w-3.5 rotate-45 border-l-2 border-t-2 border-[#E4CEAD] bg-[#FFFDF9]"
          />

          {/* Header Popover */}
          <div className="flex items-center justify-between px-5 pt-4 pb-2.5">
            <h3 className="text-sm font-extrabold text-[#5A3E28]">Notifikasi</h3>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0}
              className="text-[11px] font-semibold text-[#79543D]/70 hover:text-[#929D75] disabled:opacity-40 transition-colors cursor-pointer"
            >
              Tandai semua dibaca
            </button>
          </div>

          {/* Tab Filter: Masuk (Belum Dibaca) & Semua */}
          <div className="flex items-center gap-5 border-b border-[#EAD5B5] px-5 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('unread')}
              className={`relative flex items-center gap-1.5 pb-2.5 font-bold transition-colors cursor-pointer ${
                activeTab === 'unread'
                  ? 'text-[#5A3E28]'
                  : 'text-[#79543D]/55 hover:text-[#79543D]'
              }`}
            >
              <span>Masuk</span>
              <span
                className={`rounded-full px-1.5 py-0.2 text-[10px] font-extrabold ${
                  activeTab === 'unread'
                    ? 'bg-[#5A3E28] text-white'
                    : 'bg-[#F3E7D3] text-[#79543D]'
                }`}
              >
                {unreadCount}
              </span>
              {activeTab === 'unread' && (
                <span className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-full bg-[#5A3E28]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('all')}
              className={`relative flex items-center gap-1.5 pb-2.5 font-bold transition-colors cursor-pointer ${
                activeTab === 'all'
                  ? 'text-[#5A3E28]'
                  : 'text-[#79543D]/55 hover:text-[#79543D]'
              }`}
            >
              <span>Semua</span>
              <span className="rounded-full bg-[#F3E7D3] px-1.5 py-0.2 text-[10px] font-bold text-[#79543D]">
                {enrichedList.length}
              </span>
              {activeTab === 'all' && (
                <span className="absolute inset-x-0 bottom-0 h-[2.5px] rounded-full bg-[#5A3E28]" />
              )}
            </button>
          </div>

          {/* Daftar Item Notifikasi */}
          <div className="max-h-[360px] overflow-y-auto divide-y divide-[#EAD5B5]/60">
            {isLoading ? (
              <div className="py-10 text-center text-xs text-[#79543D]/60">
                Memuat notifikasi...
              </div>
            ) : displayedList.length === 0 ? (
              <div className="py-10 px-6 text-center space-y-1">
                <p className="text-xs font-bold text-[#5A3E28]">
                  {activeTab === 'unread'
                    ? 'Tidak ada notifikasi baru'
                    : 'Belum ada riwayat notifikasi'}
                </p>
                <p className="text-[11px] text-[#79543D]/60">
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
                    className={`w-full text-left px-5 py-3.5 flex items-start gap-3 transition-colors hover:bg-[#FAF4E8] cursor-pointer ${
                      !item.is_read ? 'bg-[#FAF4E8]/55' : 'bg-transparent'
                    }`}
                  >
                    {/* Avatar Inisial + Titik Status */}
                    <div className="relative shrink-0 mt-0.5">
                      <div
                        className={`h-9 w-9 rounded-full border flex items-center justify-center text-xs font-extrabold ${style.bg}`}
                      >
                        {initial}
                      </div>
                      <span
                        className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full ring-2 ring-[#FFFDF9] ${style.dot}`}
                      />
                    </div>

                    {/* Isi Pesan & Waktu */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-xs text-[#5A3E28] leading-snug">
                        <strong className="font-bold">{item.actor_name}</strong>{' '}
                        <span className="text-[#6E5038]">{item.message}</span>
                      </p>
                      <p className="text-[10.5px] text-[#79543D]/60">
                        {formatRelativeTime(item.created_at)} • {style.label}
                      </p>
                    </div>

                    {/* Titik Penanda Belum Dibaca */}
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
        </div>
      )}
    </div>
  );
}