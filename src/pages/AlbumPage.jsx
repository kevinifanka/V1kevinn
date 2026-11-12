import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import RevealText from "../components/RevealText";
import PageNav from "../components/PageNav";
import { ease, easeOut } from "../components/motion";
import { album } from "../data/portfolio";

const pad = (n) => String(n).padStart(2, "0");

// Geser foto di lightbox: masuk dari arah navigasi
const slide = {
  enter: (dir) => ({ x: dir > 0 ? "40%" : "-40%", opacity: 0, scale: 0.96 }),
  center: { x: 0, opacity: 1, scale: 1, transition: { duration: 0.55, ease: easeOut } },
  exit: (dir) =>
    dir === 0
      ? { opacity: 0, transition: { duration: 0.2 } } // saat ditutup: cukup memudar
      : {
          x: dir > 0 ? "-40%" : "40%",
          opacity: 0,
          scale: 0.96,
          transition: { duration: 0.35, ease },
        },
};

function Lightbox({ index, startIndex, direction, onClose, onNav }) {
  const photo = album[index];

  // Keyboard: ← → untuk pindah, Esc untuk tutup + kunci scroll halaman
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onNav(1);
      if (e.key === "ArrowLeft") onNav(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose, onNav]);

  const stop = (e) => e.stopPropagation();

  return (
    <div className="lightbox" role="dialog" aria-modal="true" aria-label={photo.caption}>
      <motion.div
        className="lightbox__backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
      />

      <div className="lightbox__stage" onClick={onClose}>
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={index}
            src={photo.src}
            alt={photo.caption}
            className="lightbox__img"
            // Foto pertama "terbang" dari grid ke layar penuh (shared layout)
            layoutId={index === startIndex ? `album-photo-${index}` : undefined}
            custom={direction}
            variants={slide}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ layout: { type: "spring", bounce: 0.18, duration: 0.65 } }}
            onClick={stop}
            // Geser (swipe) di HP / drag di desktop untuk pindah foto
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.5}
            onDragEnd={(e, { offset, velocity }) => {
              if (offset.x < -80 || velocity.x < -500) onNav(1);
              else if (offset.x > 80 || velocity.x > 500) onNav(-1);
            }}
            draggable={false}
          />
        </AnimatePresence>
      </div>

      <motion.div
        className="lightbox__ui"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.4, delay: 0.15 }}
      >
        <div className="lightbox__info">
          <span className="lightbox__count">
            {pad(index + 1)} / {pad(album.length)}
          </span>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={index}
              className="lightbox__caption"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {photo.caption} <em>— {photo.year}</em>
            </motion.span>
          </AnimatePresence>
        </div>
        <div className="lightbox__controls">
          <button type="button" onClick={() => onNav(-1)} aria-label="Previous photo">
            ←
          </button>
          <button type="button" onClick={() => onNav(1)} aria-label="Next photo">
            →
          </button>
          <button type="button" className="lightbox__close" onClick={onClose}>
            Close ✕
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function AlbumPage() {
  const [index, setIndex] = useState(null); // foto yang dibuka (null = tertutup)
  const [startIndex, setStartIndex] = useState(null);
  const [direction, setDirection] = useState(0);

  const open = (i) => {
    setStartIndex(i);
    setDirection(0);
    setIndex(i);
  };
  // Set arah 0 dulu (animasi keluar = memudar), baru tutup di frame berikutnya
  const close = () => {
    setDirection(0);
    requestAnimationFrame(() => setIndex(null));
  };
  const nav = (dir) => {
    setDirection(dir);
    setIndex((i) => (i === null ? i : (i + dir + album.length) % album.length));
  };

  return (
    <section className="section page album-page">
      <div className="section__label">
        <span>(01) — About / Album</span>
        <span>{pad(album.length)} photos</span>
      </div>

      <h1 className="page-title">
        <RevealText text="Moments" />{" "}
        <span className="page-title__indent">
          <RevealText text="captured" italic delay={0.12} />
        </span>
      </h1>

      <motion.p
        className="page-intro"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.4, ease: easeOut }}
      >
        A small archive of days worth keeping. Click a photo to see it in full
        colour.
      </motion.p>

      <div className="album-grid">
        {album.map((p, i) => (
          <motion.figure
            key={i}
            className="album-item"
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.9, ease: easeOut, delay: (i % 3) * 0.08 }}
          >
            <button
              type="button"
              className="album-item__btn"
              onClick={() => open(i)}
              data-cursor="View"
              aria-label={`Open photo: ${p.caption}`}
            >
              <motion.img
                layoutId={`album-photo-${i}`}
                src={p.src}
                alt={p.caption}
                loading="lazy"
                transition={{ layout: { type: "spring", bounce: 0.18, duration: 0.65 } }}
              />
            </button>
            <figcaption>
              <span>
                <span className="album-item__num">{pad(i + 1)}</span> {p.caption}
              </span>
              <span>{p.year}</span>
            </figcaption>
          </motion.figure>
        ))}
      </div>

      <AnimatePresence>
        {index !== null && (
          <Lightbox
            key="lightbox"
            index={index}
            startIndex={startIndex}
            direction={direction}
            onClose={close}
            onNav={nav}
          />
        )}
      </AnimatePresence>

      <PageNav
        prev={{ label: "Experience", href: "#/experience" }}
        next={{ label: "Work", href: "#work" }}
      />
    </section>
  );
}
