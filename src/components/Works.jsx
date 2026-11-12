import { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import RevealText from "./RevealText";
import { ease, easeOut } from "./motion";
import useMediaQuery from "../hooks/useMediaQuery";
import { projects } from "../data/portfolio";

const pad = (n) => String(n + 1).padStart(2, "0");

function WorksHeading({ progress }) {
  return (
    <div className="works__head">
      <span className="works__label">(02) — Work</span>
      <h2 className="works__title">
        <RevealText text="Works *I* Keep" inView />
      </h2>
      <div className="works__head-meta">
        <span>Selected projects ({String(projects.length).padStart(2, "0")})</span>
        {progress && (
          <span className="works__bar">
            <motion.i style={{ scaleX: progress }} />
          </span>
        )}
      </div>
    </div>
  );
}

function ProjectCard({ project, index, onOpen }) {
  return (
    <motion.article
      className={`card card--${project.size}`}
      data-cursor="View"
      onClick={() => onOpen(project)}
      initial={{ opacity: 0, y: 80 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 1, delay: (index % 2) * 0.1, ease: easeOut }}
    >
      <div className="card__meta">
        <span>{pad(index)}</span>
        <span>{project.year}</span>
      </div>
      <div className="card__media">
        <img
          src={project.image}
          alt={project.title}
          loading="lazy"
          style={{ objectPosition: project.imagePosition }}
        />
      </div>
      <div className="card__caption">
        <h3>{project.caption}</h3>
        <p>
          {project.title} — {project.category}
        </p>
      </div>
    </motion.article>
  );
}

/* Desktop: scroll vertikal menggerakkan galeri secara horizontal */
function HorizontalGallery({ onOpen }) {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const [distance, setDistance] = useState(0);
  const distanceMV = useMotionValue(0);

  useLayoutEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      const d = Math.max(0, trackRef.current.scrollWidth - window.innerWidth);
      setDistance(d);
      distanceMV.set(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(trackRef.current);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [distanceMV]);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 25, mass: 0.4 });
  const x = useTransform([smooth, distanceMV], ([p, d]) => -p * d);

  return (
    <div
      ref={sectionRef}
      className="hgallery"
      style={{ height: `calc(100vh + ${distance}px)` }}
    >
      <div className="hgallery__sticky">
        <WorksHeading progress={smooth} />
        <motion.div ref={trackRef} className="hgallery__track" style={{ x }}>
          {projects.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} onOpen={onOpen} />
          ))}
          <a href="#contact" className="card card--end" data-cursor="Talk">
            <span>
              Have a project <em>in mind?</em>
            </span>
            <span className="card--end__arrow">→</span>
          </a>
        </motion.div>
      </div>
    </div>
  );
}

function ProjectModal({ project, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [onClose]);

  return (
    <motion.div
      className="modal"
      onClick={onClose}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { delay: 0.2 } }}
    >
      <motion.div
        className="modal__panel"
        onClick={(e) => e.stopPropagation()}
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ duration: 0.7, ease }}
      >
        <motion.div
          className="modal__media"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          transition={{ duration: 1.1, ease, delay: 0.15 }}
        >
          {/* Foto muncul abu-abu lalu berubah perlahan ke warna asli */}
          <motion.img
            src={project.image}
            alt={project.title}
            style={{ objectPosition: project.imagePosition }}
            initial={{ filter: "grayscale(1)", scale: 1.08 }}
            animate={{ filter: "grayscale(0)", scale: 1 }}
            transition={{
              filter: { duration: 1.4, delay: 0.7, ease: "easeInOut" },
              scale: { duration: 1.6, delay: 0.15, ease },
            }}
          />
        </motion.div>

        <div className="modal__body">
          <div className="modal__top">
            <span>
              {project.category} — {project.year}
            </span>
            <button onClick={onClose} className="modal__close">
              Close ✕
            </button>
          </div>
          <h3 className="modal__title">
            <RevealText text={project.title} delay={0.25} />
          </h3>
          <motion.div
            className="modal__content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45, ease: easeOut }}
          >
            <p className="modal__caption">{project.caption}</p>
            <p className="modal__desc">{project.description}</p>
            <div className="tags">
              {project.tags.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <a href={project.link} className="modal__link" target="_blank" rel="noreferrer">
              View project <span>↗</span>
            </a>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Works() {
  const isDesktop = useMediaQuery("(min-width: 900px)");
  const [active, setActive] = useState(null);

  return (
    <section id="work" className="works">
      {isDesktop ? (
        <HorizontalGallery onOpen={setActive} />
      ) : (
        <div className="works__mobile">
          <WorksHeading />
          <div className="works__grid">
            {projects.map((p, i) => (
              <ProjectCard key={p.id} project={p} index={i} onOpen={setActive} />
            ))}
          </div>
        </div>
      )}

      <AnimatePresence>
        {active && <ProjectModal project={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
}
