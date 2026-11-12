import { useEffect, useState } from "react";
import { AnimatePresence, animate, motion } from "framer-motion";
import { ease, easeOut } from "./motion";
import { profile } from "../data/portfolio";
import soundUrl from "../Sound/Sound.mp3";

/* Preloader "Moments we keep" 0–100% + animasi WiFi yang terhubung.
   Di 100%: sinyal penuh, status "Connected", suara diputar,
   lalu preloader menutup.
   Catatan: browser bisa memblokir suara kalau pengunjung belum pernah
   klik/tap di halaman — dalam kasus itu halaman tetap masuk tanpa suara. */

// Lengkungan WiFi (pusat di titik bawah 50,68), dari dalam ke luar.
// `at` = persen saat lengkungan menyala.
const ARCS = [
  { d: "M38.69 56.69 A16 16 0 0 1 61.31 56.69", at: 35 },
  { d: "M28.79 46.79 A30 30 0 0 1 71.21 46.79", at: 65 },
  { d: "M18.89 36.89 A44 44 0 0 1 81.11 36.89", at: 92 },
];
const DOT_AT = 8;

const HOLD_AFTER_CONNECTED = 900; // ms jeda di status "Connected" sebelum masuk

function WifiIcon({ count, connected }) {
  return (
    <motion.svg
      className="wifi"
      viewBox="0 0 100 80"
      aria-hidden
      initial={{ opacity: 0, scale: 0.8 }}
      animate={
        connected
          ? { opacity: 1, scale: [1, 1.14, 1] }
          : { opacity: 1, scale: 1 }
      }
      transition={
        connected
          ? { duration: 0.6, ease: easeOut }
          : { duration: 0.8, ease: easeOut }
      }
    >
      {/* Gelombang radar saat terhubung */}
      <AnimatePresence>
        {connected &&
          [0, 0.18].map((delay) => (
            <motion.circle
              key={delay}
              cx="50"
              cy="68"
              r="10"
              className="wifi__ping"
              initial={{ scale: 0.4, opacity: 0.7 }}
              animate={{ scale: 6, opacity: 0 }}
              transition={{ duration: 1.1, delay, ease: easeOut }}
            />
          ))}
      </AnimatePresence>

      {ARCS.map((arc, i) => {
        const lit = count >= arc.at;
        return (
          <g key={i}>
            {/* Jalur redup: berkedip bergantian = "sedang memindai" */}
            <motion.path
              d={arc.d}
              className="wifi__track"
              animate={
                connected
                  ? { opacity: 0 }
                  : { opacity: [0.12, 0.45, 0.12] }
              }
              transition={
                connected
                  ? { duration: 0.3 }
                  : { duration: 1.2, repeat: Infinity, delay: i * 0.22, ease: "easeInOut" }
              }
            />
            {/* Jalur terang: "tergambar" saat sinyal sampai ke level ini */}
            <motion.path
              d={arc.d}
              className="wifi__arc"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={lit ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              transition={{ duration: 0.55, ease: easeOut }}
            />
          </g>
        );
      })}

      <motion.circle
        cx="50"
        cy="68"
        r="5.5"
        className="wifi__dot"
        initial={{ scale: 0, opacity: 0.3 }}
        animate={{ scale: count >= DOT_AT ? 1 : 0.5, opacity: count >= DOT_AT ? 1 : 0.3 }}
        transition={{ type: "spring", stiffness: 400, damping: 14 }}
      />
    </motion.svg>
  );
}

export default function Preloader({ onDone }) {
  const [count, setCount] = useState(0);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const audio = new Audio(soundUrl);
    audio.preload = "auto";
    audio.volume = 0.7; // 0 = senyap, 1 = penuh

    let timeout;
    const controls = animate(0, 100, {
      duration: 2.4,
      ease: [0.65, 0, 0.35, 1],
      onUpdate: (v) => setCount(Math.round(v)),
      onComplete: () => {
        setConnected(true);
        audio.play().catch(() => {}); // diblokir browser -> lanjut tanpa suara
        timeout = setTimeout(onDone, HOLD_AFTER_CONNECTED);
      },
    });
    return () => {
      controls.stop();
      clearTimeout(timeout);
    };
  }, [onDone]);

  const status = connected
    ? "Connected · Full signal"
    : count < 30
    ? "Searching for network"
    : "Connecting";

  return (
    <motion.div
      className="preloader"
      exit={{ y: "-100%", transition: { duration: 1.1, ease } }}
    >
      <motion.div
        className="preloader__top"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
      >
        <span>{profile.name}</span>
        <span>Portfolio © {profile.year}</span>
      </motion.div>

      <div className="preloader__center">
        <WifiIcon count={count} connected={connected} />
        <div className="preloader__status" aria-live="polite">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={status}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3, ease: easeOut }}
            >
              {status}
              {!connected && <span className="preloader__dots" aria-hidden />}
            </motion.span>
          </AnimatePresence>
        </div>
      </div>

      <div className="preloader__bottom">
        <span className="preloader__word">
          Moments <em>we</em> keep
        </span>
        <span className="preloader__count">
          {count}
          <em>%</em>
        </span>
      </div>
    </motion.div>
  );
}
