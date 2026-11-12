import { useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { easeOut } from "./motion";
import { profile } from "../data/portfolio";

function Icon({ icon, className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path d={icon.path} />
    </svg>
  );
}

function SocialCard({ item, index }) {
  const { platform, handle, href, icon, copy, action, color } = item;
  const brand = color ?? `#${icon.hex}`;
  const ref = useRef(null);
  const [copied, setCopied] = useState(false);

  // Posisi kursor di dalam kartu (px) -> spotlight + tilt 3D
  const px = useMotionValue(-300);
  const py = useMotionValue(-300);
  const nx = useMotionValue(0.5); // 0..1
  const ny = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(ny, [0, 1], [7, -7]), { stiffness: 220, damping: 20 });
  const rotateY = useSpring(useTransform(nx, [0, 1], [-9, 9]), { stiffness: 220, damping: 20 });
  const spotlight = useMotionTemplate`radial-gradient(280px circle at ${px}px ${py}px, ${brand}2e, transparent 70%)`;

  const handleMove = (e) => {
    if (e.pointerType && e.pointerType !== "mouse") return;
    const r = ref.current.getBoundingClientRect();
    px.set(e.clientX - r.left);
    py.set(e.clientY - r.top);
    nx.set((e.clientX - r.left) / r.width);
    ny.set((e.clientY - r.top) / r.height);
  };
  const handleLeave = () => {
    nx.set(0.5);
    ny.set(0.5);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(handle);
    } catch {
      // Clipboard tidak tersedia (mis. bukan HTTPS) — tetap tampilkan umpan balik
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const footLabel = copy ? (copied ? "Copied" : "Copy username") : action ?? "Connect";

  const content = (
    <>
      <motion.span className="social-card__spot" style={{ background: spotlight }} aria-hidden />
      <Icon icon={icon} className="social-card__mark" />

      <div className="social-card__top">
        <span className="social-card__icon">
          <Icon icon={icon} />
        </span>
        <span className="social-card__text">
          <span className="social-card__name">{platform}</span>
          <span className="social-card__handle">{handle}</span>
        </span>
      </div>

      <div className="social-card__foot">
        <span className="social-card__action">
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={footLabel}
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -12, opacity: 0 }}
              transition={{ duration: 0.25, ease: easeOut }}
            >
              {footLabel}
            </motion.span>
          </AnimatePresence>
        </span>
        <span className="social-card__arrow" aria-hidden>
          {copy ? (copied ? "✓" : "⧉") : "↗"}
        </span>
      </div>
    </>
  );

  const shared = {
    ref,
    className: `social-card ${copied ? "is-copied" : ""}`,
    style: { "--brand": brand, rotateX, rotateY },
    onPointerMove: handleMove,
    onPointerLeave: handleLeave,
    initial: { opacity: 0, y: 50 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.3 },
    transition: { duration: 0.8, delay: (index % 3) * 0.08, ease: easeOut },
  };

  return copy ? (
    <motion.button
      type="button"
      {...shared}
      onClick={handleCopy}
      aria-label={`Copy ${platform} username ${handle}`}
      data-cursor={copied ? "Copied" : "Copy"}
    >
      {content}
    </motion.button>
  ) : (
    <motion.a
      {...shared}
      href={href}
      target={href?.startsWith("mailto:") ? undefined : "_blank"}
      rel="noreferrer"
      aria-label={`${platform}: ${handle}`}
    >
      {content}
    </motion.a>
  );
}

export default function SocialCards() {
  return (
    <div className="socials-grid">
      {profile.socials.map((item, i) => (
        <SocialCard key={item.platform} item={item} index={i} />
      ))}
    </div>
  );
}
