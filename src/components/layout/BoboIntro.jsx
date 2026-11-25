"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export default function BoboIntro() {
  const [visible, setVisible] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const storageKey = "bobo-intro-shown";
    try {
      if (sessionStorage.getItem(storageKey) === "1") return;
    } catch {
      // If sessionStorage is unavailable, still show the intro once on this mount.
    }

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const markAsShown = () => {
      try {
        sessionStorage.setItem(storageKey, "1");
      } catch {
        // Ignore storage errors (e.g. private browsing restrictions).
      }
    };

    const showFrame = window.requestAnimationFrame(() => {
      setVisible(true);
    });

    const leaveTimer = window.setTimeout(() => {
      markAsShown();
      setLeaving(true);
    }, reducedMotion ? 500 : 2600);

    const removeTimer = window.setTimeout(() => {
      markAsShown();
      setVisible(false);
    }, reducedMotion ? 900 : 3400);

    return () => {
      window.cancelAnimationFrame(showFrame);
      window.clearTimeout(leaveTimer);
      window.clearTimeout(removeTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <div
      aria-label="Selamat datang di Bo’bo, Perpustakaan Digital Kampus"
      role="status"
      className={`bobo-intro ${leaving ? "bobo-intro--leave" : ""}`}
    >
      <div className="bobo-intro__grain" aria-hidden="true" />

      <div className="bobo-intro__content">
        <div className="bobo-intro__ornament" aria-hidden="true">
          <span>ᨅᨚᨅᨚ</span>
          <i />
          <span>RUANG BACA DIGITAL</span>
        </div>

        <div className="bobo-intro__scene" aria-hidden="true">
          <div className="bobo-intro__glow" />

          <div className="bobo-intro__mascot">
            <Image
              src="/brand/bo-bo-logo.png"
              alt=""
              width={420}
              height={420}
              priority
              className="bobo-intro__mascot-image"
            />
          </div>

          <span className="bobo-intro__spark bobo-intro__spark--one">✳</span>
          <span className="bobo-intro__spark bobo-intro__spark--two">✦</span>
          <span className="bobo-intro__spark bobo-intro__spark--three">✳</span>
        </div>

        <div className="bobo-intro__brand">
          <h1>Bo’bo</h1>
          <p>Perpustakaan Digital Kampus</p>
          <span>Membaca hari ini, menumbuhkan esok.</span>
        </div>

        <div className="bobo-intro__loading" aria-hidden="true">
          <span />
        </div>
        <p className="bobo-intro__caption">Mempersiapkan ruang untuk cerita baru...</p>
      </div>
    </div>
  );
}