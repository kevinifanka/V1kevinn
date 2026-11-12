import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import RevealText, { letterBack, letterHover } from "./RevealText";
import { ease } from "./motion";
import { hero, profile } from "../data/portfolio";

// Pergantian kata: huruf naik keluar / masuk satu per satu (stagger)
const wordSwap = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035 } },
  exit: { transition: { staggerChildren: 0.02 } },
};
const letterSwap = {
  hidden: { y: "110%", opacity: 0 },
  show: { y: "0%", opacity: 1, transition: { duration: 0.7, ease } },
  exit: { y: "-110%", opacity: 0, transition: { duration: 0.45, ease } },
};

/* Kata yang berganti otomatis */
function RotatingWord({ words, start, delay = 0, interval = 2600 }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!start || words.length < 2) return;
    let timer;
    // Mulai berganti setelah animasi muncul pertama selesai
    const wait = setTimeout(() => {
      timer = setInterval(() => setIndex((n) => (n + 1) % words.length), interval);
    }, delay * 1000 + 1600);
    return () => {
      clearTimeout(wait);
      clearInterval(timer);
    };
  }, [start, words.length, interval, delay]);

  return (
    <span className="reveal__mask rotator">
      <motion.span
        className="rotator__inner"
        initial={{ y: "115%", rotate: 4 }}
        animate={start ? { y: "0%", rotate: 0 } : {}}
        transition={{ duration: 1.1, ease, delay }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={words[index]}
            className="reveal__word it"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={wordSwap}
          >
            <span className="sr-only">{words[index]}</span>
            {Array.from(words[index]).map((ch, i) => (
              // Lapisan luar: animasi masuk/keluar bergantian per huruf
              <motion.span key={i} className="letter-wrap" aria-hidden variants={letterSwap}>
                {/* Lapisan dalam: efek pegas saat disentuh kursor */}
                <motion.span
                  className="letter"
                  whileHover={letterHover}
                  whileTap={letterHover}
                  transition={letterBack}
                >
                  {ch}
                </motion.span>
              </motion.span>
            ))}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </span>
  );
}

export default function Hero({ start }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  // Parallax: judul naik lebih cepat, gambar bergerak lebih lambat
  const yTitle = useTransform(scrollYProgress, [0, 1], ["0%", "-35%"]);
  const ySub = useTransform(scrollYProgress, [0, 1], ["0%", "-15%"]);
  const yImg = useTransform(scrollYProgress, [0, 1], ["-10%", "15%"]);
  const fade = useTransform(scrollYProgress, [0, 0.85], [1, 0]);
  const yBg = useTransform(scrollYProgress, [0, 1], ["0%", "10%"]);

  // Parallax mengikuti mouse (-1 .. 1), dihaluskan dengan spring
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 50, damping: 18, mass: 0.6 });
  const smoothY = useSpring(mouseY, { stiffness: 50, damping: 18, mass: 0.6 });
  const titleX = useTransform(smoothX, (v) => v * -22);
  const subX = useTransform(smoothX, (v) => v * 14);
  const bgX = useTransform(smoothX, (v) => v * 18);
  const bgY = useTransform(smoothY, (v) => v * 12);

  const handleMouseMove = (e) => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    mouseX.set((e.clientX / window.innerWidth - 0.5) * 2);
    mouseY.set((e.clientY / window.innerHeight - 0.5) * 2);
  };
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Setelah animasi muncul selesai, huruf boleh "melompat" keluar dari mask
  const [live, setLive] = useState(false);
  useEffect(() => {
    if (!start) return;
    const t = setTimeout(() => setLive(true), 2200);
    return () => clearTimeout(t);
  }, [start]);

  const rotateWords = hero.line1Rotate?.length ? hero.line1Rotate : null;

  const hasBg = Boolean(hero.background);
  const bgVars = hasBg
    ? {
        "--hero-dim": hero.backgroundDim ?? 0.45,
        "--hero-bg-pos": hero.backgroundPosition ?? "center",
        "--hero-bg-pos-mobile":
          hero.backgroundPositionMobile ?? hero.backgroundPosition ?? "center",
      }
    : undefined;

  return (
    <section
      id="top"
      className={`hero ${hasBg ? "hero--bg" : ""} ${live ? "is-live" : ""}`}
      ref={ref}
      style={bgVars}
      onPointerMove={handleMouseMove}
      onPointerLeave={handleMouseLeave}
    >
      {hasBg && (
        <motion.div
          className="hero__bg"
          aria-hidden
          initial={{ opacity: 0, scale: 1.25 }}
          animate={start ? { opacity: 1, scale: 1.05 } : {}}
          transition={{ duration: 2.2, ease }}
          style={{ x: bgX, y: bgY }}
        >
          <motion.img
            src={hero.background}
            alt=""
            className={hero.backgroundGrayscale ? "is-gray" : ""}
            style={{ y: yBg }}
          />
        </motion.div>
      )}

      <motion.div
        className="hero__meta"
        initial={{ opacity: 0, y: 10 }}
        animate={start ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 1, delay: 1.1, ease }}
      >
        <span>{profile.role}</span>
        <span>{profile.location}</span>
        <span className="hero__status">
          <i /> {profile.available}
        </span>
      </motion.div>

      <motion.h1
        className="hero__title"
        style={{ x: titleX, y: yTitle, opacity: fade }}
      >
        <span className="hero__line">
          <RevealText text={hero.line1} start={start} interactive />{" "}
          {rotateWords ? (
            <RotatingWord words={rotateWords} start={start} delay={0.12} />
          ) : (
            <RevealText
              text={hero.line1Italic}
              start={start}
              italic
              delay={0.12}
              interactive
            />
          )}
        </span>
        <span className="hero__line hero__line--indent">
          <RevealText text={hero.line2} start={start} delay={0.28} interactive />
        </span>
      </motion.h1>

      <div className="hero__bottom">
        <div className="hero__left">
          {hero.image && (
            <motion.figure
              className="hero__img"
              data-cursor="Hi!"
              initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
              animate={start ? { clipPath: "inset(0% 0% 0% 0%)" } : {}}
              transition={{ duration: 1.4, delay: 0.7, ease }}
            >
              <motion.img
                src={hero.image}
                alt={hero.imageAlt}
                style={{ y: yImg, scale: 1.25, objectPosition: hero.imagePosition }}
              />
            </motion.figure>
          )}

          <motion.a
            href="#about"
            className="hero__scroll"
            initial={{ opacity: 0 }}
            animate={start ? { opacity: 1 } : {}}
            transition={{ delay: 1.6, duration: 1 }}
          >
            <span className="hero__scroll-line">
              <motion.i
                animate={{ y: ["-100%", "100%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </span>
            Scroll to explore
          </motion.a>
        </div>

        <motion.p
          className="hero__sub"
          style={{ x: subX, y: ySub, opacity: fade }}
        >
          <span className="hero__sub-line">
            <RevealText text={hero.sub1} start={start} delay={0.55} interactive />
          </span>
          <span className="hero__sub-line hero__sub-line--2">
            <RevealText
              text={hero.subItalic}
              start={start}
              italic
              delay={0.7}
              interactive
            />
          </span>
          <span className="hero__sub-line hero__sub-line--3">
            <RevealText text={hero.sub2} start={start} delay={0.85} interactive />
          </span>
        </motion.p>
      </div>
    </section>
  );
}
