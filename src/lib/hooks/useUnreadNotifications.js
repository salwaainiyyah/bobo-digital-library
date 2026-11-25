'use client';

import { useState, useEffect, useCallback } from 'react';

// Event kustom: dikirim setiap kali status "sudah dibaca" berubah,
// supaya angka di navbar ikut berubah tanpa menunggu polling berikutnya.
export const NOTIFS_READ_EVENT = 'bobo:notifs-read';

/**
 * Menghitung jumlah notifikasi yang belum dibaca untuk seorang pengguna.
 * Sumber data & kunci localStorage sama dengan NotificationBell / StudentNotificationList.
 */
export function useUnreadNotifications(userId) {
  const storageKey = `bobo_read_notifs_${userId || 'guest'}`;
  const [notificationIds, setNotificationIds] = useState([]);
  const [readIds, setReadIds] = useState([]);

  const loadReadIds = useCallback(() => {
    try {
      const saved = window.localStorage.getItem(storageKey);
      setReadIds(saved ? JSON.parse(saved) : []);
    } catch {
      setReadIds([]);
    }
  }, [storageKey]);

  useEffect(() => {
    const frameId = window.requestAnimationFrame(loadReadIds);
    window.addEventListener(NOTIFS_READ_EVENT, loadReadIds);
    window.addEventListener('storage', loadReadIds);
    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener(NOTIFS_READ_EVENT, loadReadIds);
      window.removeEventListener('storage', loadReadIds);
    };
  }, [loadReadIds]);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const res = await fetch('/api/notifications', { cache: 'no-store' });
        if (!res.ok || !active) return;
        const data = await res.json();
        if (active) {
          setNotificationIds((data.notifications || []).map((item) => item.id));
        }
      } catch {
        // Abaikan gangguan sementara
      }
    }

    load();
    const interval = setInterval(load, 15000);
    return () => {
      active = false;
      clearInterval(interval);
    };
  }, []);

  return notificationIds.filter((id) => !readIds.includes(id)).length;
}