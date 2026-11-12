import { useEffect, useRef, useState } from "react";
import {
  motion,
  useAnimationFrame,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import RevealText from "./RevealText";
import { easeOut } from "./motion";
import { skills } from "../data/portfolio";

const ROWS = 3;
const SPEEDS = [40, 32, 48]; // px per detik untuk tiap baris
const REPEAT = 4; // isi baris diulang supaya selalu lebih lebar dari layar

// Bagi tools menjadi beberapa baris berurutan
function toRows(list, rows) {
  const size = Math.ceil(list.length / rows);
  return Array.from({ length: rows }, (_, i) => list.slice(i * size, i * size + size)).filter(
    (r) => r.length
  );
}

function ToolChip({ tool }) {
  const { name, icon } = tool;
  return (
    <motion.span
      className="tool"
      style={{ "--brand": icon ? `#${icon.hex}` : "var(--paper)" }}
      whileHover={{ y: -5, scale: 1.04 }}
      transition={{ type: "spring", stiffness: 400, damping: 18 }}
    >
      {icon ? (
        <svg className="tool__icon" viewBox="0 0 24 24" aria-hidden>
          <path d={icon.path} />
        </svg>
      ) : (
        <span className="tool__mono" aria-hidden>
          {name.slice(0, 2)}
        </span>
      )}
      <span className="tool__name">{name}</span>
    </motion.span>
  );
}

function ToolRow({ items, direction, speed, boost, offset }) {
  const trackRef = useRef(null);
  const x = useMotionValue(-offset);
  const [hovered, setHovered] = useState(false);
  // 1 = berjalan normal, 0 = berhenti. Dihaluskan supaya melambat pelan.
  const factor = useSpring(1, { stiffness: 70, damping: 20 });

  useEffect(() => {
    factor.set(hovered ? 0 : 1);
  }, [hovered, factor]);

  useAnimationFrame((_, delta) => {
    const half = trackRef.current ? trackRef.current.scrollWidth / 2 : 0;
    if (!half) return;
    const step = speed * (delta / 1000) * factor.get() * (1 + boost.get());
    let next = x.get() - direction * step;
    // Putar ulang tanpa jeda: posisi selalu di antara -half .. 0
    next = -((((-next) % half) + half) % half);
    x.set(next);
  });

  const group = Array.from({ length: REPEAT }, () => items).flat();

  return (
    <motion.div
      className="tools__row"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      initial={{ opacity: 0, x: direction * 120 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: 1.2, ease: easeOut }}
    >
      <motion.div ref={trackRef} className="tools__track" style={{ x }}>
        {[0, 1].map((half) => (
          <div className="tools__group" key={half}>
            {group.map((tool, i) => (
              <ToolChip key={`${half}-${i}`} tool={tool} />
            ))}
          </div>
        ))}
      </motion.div>
    </motion.div>
  );
}

export default function SkillsMarquee() {
  // Scroll halaman = baris berjalan lebih cepat sesaat
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 300 });
  const boost = useTransform(smooth, (v) => Math.min(Math.abs(v) / 400, 5));

  const rows = toRows(skills, ROWS);

  return (
    <section className="tools" aria-labelledby="tools-title">
      <div className="tools__head">
        <div className="section__label">
          <span>Tools &amp; craft</span>
          <span>
            {String(skills.length).padStart(2, "0")} tools
            <span className="tools__hint"> · hover to pause</span>
          </span>
        </div>
        <h2 className="tools__title" id="tools-title">
          <RevealText text="Tools I" inView />{" "}
          <RevealText text="build" italic inView delay={0.1} />{" "}
          <RevealText text="with" inView delay={0.18} />
        </h2>
      </div>

      {/* Daftar untuk screen reader (marquee di bawah hanya visual) */}
      <ul className="sr-only">
        {skills.map((s) => (
          <li key={s.name}>{s.name}</li>
        ))}
      </ul>

      <div className="tools__rows" aria-hidden>
        {rows.map((items, i) => (
          <ToolRow
            key={i}
            items={items}
            direction={i % 2 === 0 ? 1 : -1}
            speed={SPEEDS[i % SPEEDS.length]}
            boost={boost}
            offset={i * 140}
          />
        ))}
      </div>
    </section>
  );
}
