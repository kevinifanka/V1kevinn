import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useScroll, useTransform } from "framer-motion";
import { ease, easeOut, parseItalic } from "./motion";
import { about } from "../data/portfolio";

/* Paragraf yang kata-katanya "menyala" satu per satu saat di-scroll */
function ScrollWords({ text }) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "end 0.45"],
  });
  const tokens = parseItalic(text);

  return (
    <p ref={ref} className="about__text">
      {tokens.map((t, i) => {
        const start = i / tokens.length;
        const end = start + 1 / tokens.length;
        return (
          <Word key={i} progress={scrollYProgress} range={[start, end]} italic={t.italic}>
            {t.text}
          </Word>
        );
      })}
    </p>
  );
}

function Word({ children, progress, range, italic }) {
  const opacity = useTransform(progress, range, [0.12, 1]);
  return (
    <motion.span style={{ opacity }} className={italic ? "it" : ""}>
      {children}{" "}
    </motion.span>
  );
}

function Counter({ to, suffix = "" }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 2,
      ease: easeOut,
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref}>
      {value}
      {suffix}
    </span>
  );
}

export default function About() {
  const imgRef = useRef(null);
  // Pemicu reveal dipasang di <figure> (yang TIDAK di-clip).
  // Kalau dipasang di elemen yang di-clip, browser menganggapnya 0% terlihat
  // sehingga animasi tidak pernah jalan.
  const portraitInView = useInView(imgRef, { once: true, amount: 0.3 });

  // Foto latar di area kalimat besar: parallax pelan saat di-scroll
  const statementRef = useRef(null);
  const { scrollYProgress: statementProgress } = useScroll({
    target: statementRef,
    offset: ["start end", "end start"],
  });
  const bgY = useTransform(statementProgress, [0, 1], ["-6%", "6%"]);

  const hasBg = Boolean(about.background);
  const bgVars = hasBg
    ? {
        "--about-dim": about.backgroundDim ?? 0.55,
        "--about-bg-pos": about.backgroundPosition ?? "center",
        "--about-bg-pos-mobile":
          about.backgroundPositionMobile ?? about.backgroundPosition ?? "center",
      }
    : undefined;

  return (
    <section
      id="about"
      className={`section about ${hasBg ? "about--bg" : ""}`}
      style={bgVars}
    >
      <div className="section__label">
        <span>(01) — About</span>
        <span>Who I am</span>
      </div>

      {/* Foto latar hanya di area ini: dari bawah garis label sampai atas "Based in" */}
      <div ref={statementRef} className="about__statement">
        {hasBg && (
          <div className="about__bg" aria-hidden>
            <motion.img src={about.background} alt="" style={{ y: bgY, scale: 1.15 }} />
          </div>
        )}
        <ScrollWords text={about.statement} />
      </div>

      <div className={`about__grid ${about.portrait ? "" : "about__grid--no-photo"}`}>
        {about.portrait && (
          <figure ref={imgRef} className="about__portrait" data-cursor="Me">
            <motion.div
              className="about__portrait-clip"
              initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
              animate={portraitInView ? { clipPath: "inset(0% 0% 0% 0%)" } : {}}
              transition={{ duration: 1.4, ease }}
            >
              <motion.img
                src={about.portrait}
                alt="Portrait"
                style={{ objectPosition: about.portraitPosition }}
                initial={{ scale: 1.15 }}
                animate={portraitInView ? { scale: 1 } : {}}
                transition={{ duration: 1.8, ease }}
              />
            </motion.div>
          </figure>
        )}

        <div className="about__info">
          <dl className="about__facts">
            {about.facts.map((f, i) => (
              <motion.div
                className="about__fact"
                key={f.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: i * 0.1, ease: easeOut }}
              >
                <dt>{f.label}</dt>
                <dd>{f.value}</dd>
              </motion.div>
            ))}
          </dl>

          <div className="about__stats">
            {about.stats.map((s) => (
              <div className="stat" key={s.label}>
                <div className="stat__num">
                  <Counter to={s.value} suffix={s.suffix} />
                </div>
                <div className="stat__label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
