import { motion } from "framer-motion";
import { easeOut } from "./motion";

/* Navigasi besar di bawah halaman: ← sebelumnya / berikutnya → */
export default function PageNav({ prev, next }) {
  return (
    <motion.nav
      className="page-nav"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.9, ease: easeOut }}
    >
      {prev ? (
        <a href={prev.href} className="page-nav__link page-nav__link--prev">
          <span className="page-nav__hint">Previous</span>
          <span className="page-nav__label">
            <span className="page-nav__arrow">←</span> {prev.label}
          </span>
        </a>
      ) : (
        <span />
      )}
      {next && (
        <a href={next.href} className="page-nav__link page-nav__link--next">
          <span className="page-nav__hint">Next</span>
          <span className="page-nav__label">
            <em>{next.label}</em> <span className="page-nav__arrow">→</span>
          </span>
        </a>
      )}
    </motion.nav>
  );
}
