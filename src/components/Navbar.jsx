import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useAnimationControls,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "framer-motion";
import { easeOut } from "./motion";
import { navLinks, pages, profile } from "../data/portfolio";
import useMediaQuery from "../hooks/useMediaQuery";

/* ============================================================
   Dynamic Island navbar
   3 bentuk yang saling "morph":
   - compact : pill kecil (section aktif + progress scroll)
   - nav     : pill lebar berisi link (desktop: di atas halaman / hover)
   - menu    : kartu besar (mobile: saat di-tap)
   ============================================================ */

const SECTIONS = [{ id: "top", label: "Home" }, ...navLinks];

// Spring utama untuk perubahan ukuran island — sedikit "membal" seperti iPhone
const islandSpring = { type: "spring", bounce: 0.32, duration: 0.7 };

// Animasi isi island saat berganti bentuk
const view = {
  initial: { opacity: 0, scale: 0.9, filter: "blur(6px)" },
  animate: {
    opacity: 1,
    scale: 1,
    filter: "blur(0px)",
    transition: { duration: 0.4, delay: 0.08, ease: easeOut },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    filter: "blur(6px)",
    transition: { duration: 0.15 },
  },
};

// Radius per bentuk (= setengah tinggi untuk pill)
const RADIUS = { compact: 20, nav: 24, menu: 30 };

/* Ukur ukuran asli konten, supaya island bisa dianimasikan
   ke width/height yang pas (tanpa efek "gepeng" dari scale) */
function useMeasure() {
  const ref = useRef(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize?.[0];
      setSize(
        box
          ? { width: box.inlineSize, height: box.blockSize }
          : { width: entry.contentRect.width, height: entry.contentRect.height }
      );
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return [ref, size];
}

function useClock(timeZone) {
  const format = () =>
    new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      timeZone,
    }).format(new Date());

  const [time, setTime] = useState(format);
  useEffect(() => {
    const t = setInterval(() => setTime(format()), 10_000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeZone]);
  return time;
}

// Section yang sedang dilihat = section terakhir yang top-nya sudah lewat 35% layar
function getActiveSection() {
  const line = window.innerHeight * 0.35;
  let current = SECTIONS[0].id;
  for (const s of SECTIONS) {
    const el = document.getElementById(s.id);
    if (el && el.getBoundingClientRect().top <= line) current = s.id;
  }
  return current;
}

const pad = (n) => String(n).padStart(2, "0");

function ProgressRing({ progress }) {
  return (
    <svg className="island__ring" viewBox="0 0 20 20" aria-hidden>
      <circle cx="10" cy="10" r="8" className="island__ring-track" />
      <motion.circle
        cx="10"
        cy="10"
        r="8"
        className="island__ring-bar"
        style={{ pathLength: progress }}
      />
    </svg>
  );
}

export default function Navbar({ start, route = "" }) {
  const isMobile = useMediaQuery("(max-width: 760px)");
  const { scrollY, scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const [atTop, setAtTop] = useState(true);
  const [active, setActive] = useState("top");
  const [hovered, setHovered] = useState(false); // desktop: mouse di atas island
  const [pinned, setPinned] = useState(false); // desktop: dibuka lewat klik / keyboard
  const [hoverLink, setHoverLink] = useState(null);
  const [subFor, setSubFor] = useState(null); // desktop: sub-menu yang terbuka (mis. "about")
  const [open, setOpen] = useState(false); // mobile: menu besar

  // Sedang di halaman terpisah (Experience / Album)?
  const page = route ? pages[route] : null;
  const routeRef = useRef(route);
  routeRef.current = route;

  const time = useClock(profile.timezone);
  const [measureRef, size] = useMeasure();
  const islandRef = useRef(null);
  const bump = useAnimationControls();

  const mode = isMobile
    ? open
      ? "menu"
      : "compact"
    : atTop || hovered || pinned
    ? "nav"
    : "compact";

  // Di halaman terpisah: menu induknya (About) yang aktif, label = nama halaman
  const activeKey = page ? page.parent : active;
  const activeIndex = SECTIONS.findIndex((s) => s.id === activeKey);
  const activeLabel = page ? page.label : SECTIONS[activeIndex]?.label ?? "Home";

  // Sub-menu yang sedang aktif (Overview / Experience / Album)
  const isChildActive = (c) =>
    c.href === `#/${route}` || (!route && c.href === `#${active}`);

  useMotionValueEvent(scrollY, "change", (y) => {
    setAtTop(y < 80);
    if (!routeRef.current) setActive(getActiveSection());
  });

  // Saat berpindah halaman, hitung ulang posisi setelah halaman baru tampil
  useEffect(() => {
    const t = setTimeout(() => {
      setAtTop(window.scrollY < 80);
      if (!route) setActive(getActiveSection());
    }, 50);
    return () => clearTimeout(t);
  }, [route]);

  // Pindah ke desktop -> tutup menu mobile
  useEffect(() => {
    if (!isMobile) setOpen(false);
  }, [isMobile]);

  // Island "membal" kecil setiap kali section / halaman aktif berganti (seperti notifikasi iPhone)
  const prevLabel = useRef(activeLabel);
  useEffect(() => {
    if (prevLabel.current === activeLabel) return;
    prevLabel.current = activeLabel;
    if (mode !== "compact") return;
    bump.start({
      scale: [1, 1.08, 0.97, 1],
      transition: { duration: 0.55, ease: "easeOut" },
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeLabel]);

  // Escape untuk menutup + kunci scroll saat menu mobile terbuka
  useEffect(() => {
    if (!open && !pinned) return;
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      setOpen(false);
      setPinned(false);
    };
    window.addEventListener("keydown", onKey);
    if (open) document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      if (open) document.body.style.overflow = "";
    };
  }, [open, pinned]);

  // Saat dibuka lewat klik/keyboard, pindahkan fokus ke dalam island
  // (tombol compact hilang setelah morph, jadi fokus jangan sampai "jatuh")
  useEffect(() => {
    if (!(open || pinned)) return;
    if (document.activeElement !== document.body) return;
    islandRef.current?.querySelector("a, button")?.focus({ preventScroll: true });
  }, [mode, open, pinned]);

  const openIsland = () => (isMobile ? setOpen(true) : setPinned(true));

  const closeAll = () => {
    setOpen(false);
    setPinned(false);
  };

  const highlighted = hoverLink ?? activeKey;

  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="island-backdrop"
            onClick={() => setOpen(false)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          />
        )}
      </AnimatePresence>

      <motion.header
        className="island-wrap"
        initial={{ y: -90, opacity: 0, scale: 0.6 }}
        animate={
          start
            ? { y: 0, opacity: 1, scale: 1 }
            : { y: -90, opacity: 0, scale: 0.6 }
        }
        transition={{ type: "spring", bounce: 0.35, duration: 1 }}
      >
        <motion.div
          className="island-bump"
          animate={bump}
          onMouseEnter={() => !isMobile && setHovered(true)}
          onMouseLeave={() => {
            setHovered(false);
            setPinned(false);
            setHoverLink(null);
            setSubFor(null);
          }}
          onBlur={(e) => {
            // Fokus keluar dari island (bukan karena elemen di-unmount)
            if (e.relatedTarget && !e.currentTarget.contains(e.relatedTarget)) {
              setPinned(false);
            }
          }}
        >
          <motion.div
            ref={islandRef}
            className="island"
            data-mode={mode}
            initial={false}
            animate={{
              width: size.width || "auto",
              height: size.height || "auto",
              borderRadius: RADIUS[mode],
            }}
            transition={islandSpring}
          >
            <div ref={measureRef} className="island__measure">
              <AnimatePresence mode="popLayout" initial={false}>
                {/* ---------- COMPACT ---------- */}
                {mode === "compact" && (
                  <motion.button
                    key="compact"
                    type="button"
                    className="island__view island__view--compact"
                    onClick={openIsland}
                    aria-label={`Open navigation — current section: ${activeLabel}`}
                    aria-expanded={false}
                    variants={view}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <span className="island__live" aria-hidden />
                    <span className="island__label">
                      <AnimatePresence mode="popLayout" initial={false}>
                        <motion.span
                          key={activeLabel}
                          initial={{ y: 16, opacity: 0, filter: "blur(4px)" }}
                          animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                          exit={{ y: -16, opacity: 0, filter: "blur(4px)" }}
                          transition={{
                            type: "spring",
                            bounce: 0.2,
                            duration: 0.5,
                            filter: { duration: 0.3 }, // blur tanpa pegas (tidak boleh negatif)
                          }}
                        >
                          {activeLabel}
                        </motion.span>
                      </AnimatePresence>
                    </span>
                    <span className="island__count">
                      {pad(activeIndex)}/{pad(navLinks.length)}
                    </span>
                    <ProgressRing progress={progress} />
                  </motion.button>
                )}

                {/* ---------- NAV (desktop) ---------- */}
                {mode === "nav" && (
                  <motion.div
                    key="nav"
                    className="island__view island__view--navwrap"
                    variants={view}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className="island__view--nav">
                      <a href="#top" className="island__logo" onClick={closeAll}>
                        {profile.name}
                        <sup>©</sup>
                      </a>

                      <nav
                        className="island__links"
                        onMouseLeave={() => setHoverLink(null)}
                      >
                        {navLinks.map((l) => (
                          <a
                            key={l.id}
                            href={`#${l.id}`}
                            className={`island__link ${
                              activeKey === l.id ? "is-active" : ""
                            } ${l.children ? "has-sub" : ""}`}
                            aria-current={activeKey === l.id ? "true" : undefined}
                            aria-haspopup={l.children ? "true" : undefined}
                            aria-expanded={l.children ? subFor === l.id : undefined}
                            onMouseEnter={() => {
                              setHoverLink(l.id);
                              setSubFor(l.children ? l.id : null);
                            }}
                            onFocus={() => {
                              setHoverLink(l.id);
                              setSubFor(l.children ? l.id : null);
                            }}
                            onClick={closeAll}
                          >
                            {highlighted === l.id && (
                              <motion.span
                                layoutId="island-pill"
                                className="island__pill"
                                transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                              />
                            )}
                            <span className="island__link-text">
                              {l.label}
                              {l.children && (
                                <motion.span
                                  className="island__caret"
                                  aria-hidden
                                  animate={{ rotate: subFor === l.id ? 180 : 0 }}
                                  transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
                                >
                                  ▾
                                </motion.span>
                              )}
                            </span>
                          </a>
                        ))}
                      </nav>

                      <ProgressRing progress={progress} />
                    </div>

                    {/* Sub-menu: island memanjang ke bawah saat "About" di-hover */}
                    {navLinks
                      .filter((l) => l.children && subFor === l.id)
                      .map((l) => (
                        <nav key={l.id} className="island__subrow" aria-label={`${l.label} menu`}>
                          {l.children.map((c, i) => (
                            <motion.a
                              key={c.href}
                              href={c.href}
                              className={`island__sublink ${isChildActive(c) ? "is-active" : ""}`}
                              aria-current={isChildActive(c) ? "page" : undefined}
                              onClick={() => {
                                closeAll();
                                setSubFor(null);
                              }}
                              initial={{ opacity: 0, y: -8, filter: "blur(4px)" }}
                              animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                              transition={{ duration: 0.35, delay: 0.08 + i * 0.05, ease: easeOut }}
                            >
                              <span className="island__sublink-num">{pad(i + 1)}</span>
                              {c.label}
                            </motion.a>
                          ))}
                        </nav>
                      ))}
                  </motion.div>
                )}

                {/* ---------- MENU (mobile) ---------- */}
                {mode === "menu" && (
                  <motion.div
                    key="menu"
                    className="island__view island__view--menu"
                    variants={view}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                  >
                    <div className="island__menu-head">
                      <span className="island__status">
                        <span className="island__live" aria-hidden />
                        {profile.available}
                      </span>
                      <button
                        type="button"
                        className="island__close"
                        onClick={() => setOpen(false)}
                        aria-expanded={true}
                      >
                        Close
                      </button>
                    </div>

                    <nav className="island__menu-links">
                      {navLinks.map((l, i) => (
                        <div key={l.id} className="island__menu-group">
                          <motion.a
                            href={`#${l.id}`}
                            className={`island__menu-link ${
                              activeKey === l.id ? "is-active" : ""
                            }`}
                            aria-current={activeKey === l.id ? "true" : undefined}
                            onClick={() => setOpen(false)}
                            initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
                            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                            transition={{
                              type: "spring",
                              bounce: 0.2,
                              duration: 0.6,
                              delay: 0.15 + i * 0.05,
                              filter: { duration: 0.4, delay: 0.15 + i * 0.05 },
                            }}
                          >
                            <span className="island__menu-num">{pad(i + 1)}</span>
                            <span className="island__menu-label">
                              {i % 2 === 1 ? <em>{l.label}</em> : l.label}
                            </span>
                            {activeKey === l.id && (
                              <span className="island__menu-now">Now</span>
                            )}
                          </motion.a>

                          {/* Sub-menu (mis. About › Overview / Experience / Album) */}
                          {l.children && (
                            <motion.div
                              className="island__menu-sub"
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: 0.22 + i * 0.05, ease: easeOut }}
                            >
                              {l.children.map((c) => (
                                <a
                                  key={c.href}
                                  href={c.href}
                                  className={isChildActive(c) ? "is-active" : ""}
                                  aria-current={isChildActive(c) ? "page" : undefined}
                                  onClick={() => setOpen(false)}
                                >
                                  {c.label}
                                </a>
                              ))}
                            </motion.div>
                          )}
                        </div>
                      ))}
                    </nav>

                    <div className="island__menu-foot">
                      <span>
                        {profile.location.split(",")[0]} — {time}
                      </span>
                      <a href={`mailto:${profile.email}`}>{profile.email}</a>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </motion.div>
      </motion.header>
    </>
  );
}
