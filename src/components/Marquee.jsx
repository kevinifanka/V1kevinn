import { Fragment } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import { marquee } from "../data/portfolio";

/* Teks berjalan tanpa henti, ikut miring sesuai kecepatan scroll */
export default function Marquee() {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 300 });
  const skew = useTransform(smooth, [-2000, 0, 2000], [-8, 0, 8], { clamp: true });

  const group = [...marquee, ...marquee];

  return (
    <div className="marquee" aria-hidden>
      <motion.div style={{ skewX: skew }}>
        <motion.div
          className="marquee__track"
          animate={{ x: ["0%", "-50%"] }}
          transition={{ duration: 40, ease: "linear", repeat: Infinity }}
        >
          {[0, 1].map((half) => (
            <div className="marquee__group" key={half}>
              {group.map((item, i) => {
                const italic = item.startsWith("*");
                return (
                  <Fragment key={i}>
                    <span className={`marquee__item ${italic ? "it" : ""}`}>
                      {item.replaceAll("*", "")}
                    </span>
                    <span className="marquee__star">✦</span>
                  </Fragment>
                );
              })}
            </div>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
