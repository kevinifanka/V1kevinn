import { Fragment } from "react";
import { motion } from "framer-motion";
import { ease, parseItalic } from "./motion";

/* Teks yang muncul kata per kata dari balik "mask".
   - start: animasi berjalan saat true (dipakai di Hero setelah preloader)
   - inView: animasi berjalan saat elemen terlihat di layar
   - interactive: tiap huruf "melompat" saat disentuh kursor / di-tap
   - teks dengan *bintang* otomatis jadi italic abu-abu */
const container = {
  hidden: {},
  show: (delay = 0) => ({
    transition: { staggerChildren: 0.07, delayChildren: delay },
  }),
};

const word = {
  hidden: { y: "115%", rotate: 4 },
  show: { y: "0%", rotate: 0, transition: { duration: 1.1, ease } },
};

// Efek pegas saat huruf disentuh, dan saat kembali ke posisi semula
export const letterHover = {
  y: "-0.14em",
  rotate: -8,
  transition: { type: "spring", stiffness: 500, damping: 11 },
};
export const letterBack = { type: "spring", stiffness: 260, damping: 13 };

/* Pecah kata menjadi huruf yang bisa bereaksi.
   Teks asli tetap dibaca utuh oleh screen reader lewat .sr-only */
export function Letters({ text }) {
  return (
    <>
      <span className="sr-only">{text}</span>
      {Array.from(text).map((ch, i) => (
        <motion.span
          key={i}
          className="letter"
          aria-hidden
          whileHover={letterHover}
          whileTap={letterHover}
          transition={letterBack}
        >
          {ch}
        </motion.span>
      ))}
    </>
  );
}

export default function RevealText({
  text,
  className = "",
  delay = 0,
  start = true,
  inView = false,
  italic = false,
  interactive = false,
}) {
  const tokens = parseItalic(text);

  const animProps = inView
    ? { initial: "hidden", whileInView: "show", viewport: { once: true, amount: 0.4 } }
    : { initial: "hidden", animate: start ? "show" : "hidden" };

  return (
    <motion.span
      className={`reveal ${className}`}
      variants={container}
      custom={delay}
      {...animProps}
    >
      {tokens.map((t, i) => (
        <Fragment key={i}>
          <span className="reveal__mask">
            <motion.span
              className={`reveal__word ${t.italic || italic ? "it" : ""}`}
              variants={word}
            >
              {interactive ? <Letters text={t.text} /> : t.text}
            </motion.span>
          </span>
          {/* spasi di LUAR mask supaya tidak dibuang browser */}
          {i < tokens.length - 1 && " "}
        </Fragment>
      ))}
    </motion.span>
  );
}
