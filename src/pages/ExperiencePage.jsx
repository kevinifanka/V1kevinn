import { forwardRef, useRef, useState } from "react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useInView,
  useScroll,
  useSpring,
} from "framer-motion";
import RevealText from "../components/RevealText";
import PageNav from "../components/PageNav";
import SkillsMarquee from "../components/SkillsMarquee";
import { ease, easeOut } from "../components/motion";
import { timeline, timelineTypes } from "../data/portfolio";

// "Graduated *Cum Laude*" -> Graduated <em>Cum Laude</em>
function Italic({ text }) {
  return text
    .split(/(\*[^*]+\*)/g)
    .filter(Boolean)
    .map((part, i) =>
      part.startsWith("*") && part.endsWith("*") ? (
        <em key={i}>{part.slice(1, -1)}</em>
      ) : (
        <span key={i}>{part}</span>
      )
    );
}

const keyOf = (item) => `${item.year}-${item.title}-${item.place}`;

// forwardRef: dibutuhkan AnimatePresence "popLayout" untuk animasi keluar saat filter
const TimelineItem = forwardRef(function TimelineItem({ item }, forwardedRef) {
  const ref = useRef(null);
  const setRefs = (node) => {
    ref.current = node;
    if (typeof forwardedRef === "function") forwardedRef(node);
    else if (forwardedRef) forwardedRef.current = node;
  };
  // "Aktif" saat item melewati tengah layar -> titik menyala
  const active = useInView(ref, { margin: "-45% 0px -45% 0px" });
  const [open, setOpen] = useState(false);
  const hasPoints = item.points?.length > 0;

  const toggle = () => hasPoints && setOpen((o) => !o);

  return (
    <motion.li
      ref={setRefs}
      layout
      className={`tl-item ${active ? "is-active" : ""}`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      exit={{ opacity: 0, x: -40, transition: { duration: 0.25 } }}
      transition={{ duration: 0.8, ease: easeOut }}
    >
      <div className="tl-item__year">{item.year}</div>

      <div className="tl-item__node" aria-hidden>
        <motion.span
          className="tl-item__dot"
          animate={{ scale: active ? 1 : 0.55 }}
          transition={{ type: "spring", stiffness: 420, damping: 16 }}
        />
        {active && (
          <motion.span
            className="tl-item__ping"
            initial={{ scale: 1, opacity: 0.6 }}
            animate={{ scale: 2.8, opacity: 0 }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeOut" }}
          />
        )}
      </div>

      <motion.div
        layout
        className={`tl-card ${hasPoints ? "is-clickable" : ""} ${open ? "is-open" : ""}`}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggle();
          }
        }}
        role={hasPoints ? "button" : undefined}
        tabIndex={hasPoints ? 0 : undefined}
        aria-expanded={hasPoints ? open : undefined}
        data-cursor={hasPoints ? (open ? "Less" : "More") : undefined}
        whileHover={{ y: -4 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
      >
        <motion.div layout="position" className="tl-card__top">
          <span className="tl-card__type">{timelineTypes[item.type] ?? item.type}</span>
          {hasPoints && (
            <motion.span
              className="tl-card__toggle"
              animate={{ rotate: open ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              +
            </motion.span>
          )}
        </motion.div>
        <motion.h3 layout="position" className="tl-card__title">
          <Italic text={item.title} />
        </motion.h3>
        <motion.p layout="position" className="tl-card__place">
          {item.place}
        </motion.p>
        <motion.p layout="position" className="tl-card__desc">
          {item.description}
        </motion.p>

        <AnimatePresence initial={false}>
          {open && (
            <motion.ul
              className="tl-card__points"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.45, ease }}
            >
              {item.points.map((p, i) => (
                <motion.li
                  key={p}
                  initial={{ x: -12, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.06, duration: 0.4, ease: easeOut }}
                >
                  {p}
                </motion.li>
              ))}
            </motion.ul>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.li>
  );
});

export default function ExperiencePage() {
  const [filter, setFilter] = useState("all");
  const listRef = useRef(null);

  // Garis timeline terisi mengikuti scroll
  const { scrollYProgress } = useScroll({
    target: listRef,
    offset: ["start 60%", "end 60%"],
  });
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });

  const types = ["all", ...Object.keys(timelineTypes).filter((t) => timeline.some((i) => i.type === t))];
  const count = (t) => (t === "all" ? timeline.length : timeline.filter((i) => i.type === t).length);
  const items = filter === "all" ? timeline : timeline.filter((i) => i.type === filter);

  return (
    <section className="section page timeline-page">
      <div className="section__label">
        <span>(01) — About / Experience</span>
        <span>Where I&apos;ve been</span>
      </div>

      <h1 className="page-title">
        <RevealText text="My" />{" "}
        <RevealText text="journey" italic delay={0.1} />
        <br />
        <span className="page-title__indent">
          <RevealText text="so far" delay={0.22} />
        </span>
      </h1>

      <motion.p
        className="page-intro"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.45, ease: easeOut }}
      >
        Education, internships and the moments that shaped how I think about
        technology. Tap a card to read more.
      </motion.p>

      {/* Filter kategori — pill hitam "meluncur" ke pilihan aktif */}
      <LayoutGroup id="timeline-filter">
        <motion.div
          className="tl-filters"
          role="tablist"
          aria-label="Filter timeline"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.55, ease: easeOut }}
        >
          {types.map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={filter === t}
              className={`tl-filter ${filter === t ? "is-active" : ""}`}
              onClick={() => setFilter(t)}
            >
              {filter === t && (
                <motion.span
                  layoutId="tl-filter-pill"
                  className="tl-filter__pill"
                  transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                />
              )}
              <span className="tl-filter__text">
                {t === "all" ? "All" : timelineTypes[t]}
                <sup>{String(count(t)).padStart(2, "0")}</sup>
              </span>
            </button>
          ))}
        </motion.div>
      </LayoutGroup>

      <div className="tl" ref={listRef}>
        <div className="tl__line" aria-hidden>
          <motion.i style={{ scaleY: fill }} />
        </div>
        <motion.ol layout className="tl__list">
          <AnimatePresence mode="popLayout" initial={false}>
            {items.map((item) => (
              <TimelineItem key={keyOf(item)} item={item} />
            ))}
          </AnimatePresence>
        </motion.ol>
      </div>

      <SkillsMarquee />

      <PageNav
        prev={{ label: "Overview", href: "#about" }}
        next={{ label: "Album", href: "#/album" }}
      />
    </section>
  );
}
