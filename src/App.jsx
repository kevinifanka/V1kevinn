import { useCallback, useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  MotionConfig,
  motion,
  useAnimationControls,
} from "framer-motion";
import Preloader from "./components/Preloader";
import Cursor from "./components/Cursor";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Marquee from "./components/Marquee";
import About from "./components/About";
import Works from "./components/Works";
import Contact from "./components/Contact";
import ExperiencePage from "./pages/ExperiencePage";
import AlbumPage from "./pages/AlbumPage";
import { ease } from "./components/motion";
import { pages } from "./data/portfolio";
import useRoute, { jumpTo } from "./hooks/useRoute";

/* Halaman utama. Saat dibuka dari halaman lain lewat link "#section"
   (mis. "#about" dari Experience), langsung lompat ke section itu. */
function Home({ loaded }) {
  useEffect(() => {
    const id = window.location.hash.slice(1);
    const el = id && !id.startsWith("/") ? document.getElementById(id) : null;
    // Tunggu 1 frame supaya layout (mis. galeri Work) sudah terukur
    requestAnimationFrame(() => {
      if (el) jumpTo(el.getBoundingClientRect().top + window.scrollY);
    });
  }, []);

  return (
    <>
      <Hero start={loaded} />
      <Marquee />
      <About />
      <Works />
      <Contact />
    </>
  );
}

export default function App() {
  const [loaded, setLoaded] = useState(false);
  const handleDone = useCallback(() => setLoaded(true), []);
  const route = useRoute();
  const pageKey = pages[route] ? route : "home";

  /* Transisi halaman "tirai":
     tirai naik menutup layar -> halaman diganti -> tirai naik membuka.
     (Tidak bergantung pada animasi keluar komponen, jadi tidak bisa macet.) */
  const [shownKey, setShownKey] = useState(pageKey);
  const [curtainLabel, setCurtainLabel] = useState("");
  const curtain = useAnimationControls();
  const latestKey = useRef(pageKey);
  latestKey.current = pageKey;
  const busy = useRef(false);

  useEffect(() => {
    if (pageKey === shownKey || busy.current) return;
    busy.current = true;
    (async () => {
      setCurtainLabel(pages[pageKey]?.label ?? "Home");
      await curtain.start({ y: "0%", transition: { duration: 0.55, ease } });
      setShownKey(latestKey.current); // pakai tujuan terbaru (kalau user klik cepat 2x)
      jumpTo(0);
      await new Promise((r) => setTimeout(r, 120));
      await curtain.start({ y: "-100%", transition: { duration: 0.75, ease } });
      curtain.set({ y: "100%" });
      busy.current = false;
    })();
  }, [pageKey, shownKey, curtain]);

  // Kunci scroll selama preloader tampil & mulai dari atas
  useEffect(() => {
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    document.body.style.overflow = loaded ? "" : "hidden";
  }, [loaded]);

  return (
    // reducedMotion="user": animasi otomatis dikurangi jika pengguna
    // mengaktifkan "reduce motion" di sistem operasinya
    <MotionConfig reducedMotion="user">
      <AnimatePresence>
        {!loaded && <Preloader key="preloader" onDone={handleDone} />}
      </AnimatePresence>

      <Cursor />
      <Navbar start={loaded} route={shownKey === "home" ? "" : shownKey} />

      <main key={shownKey}>
        {shownKey === "experience" ? (
          <ExperiencePage />
        ) : shownKey === "album" ? (
          <AlbumPage />
        ) : (
          <Home loaded={loaded} />
        )}
      </main>

      {/* Tirai transisi antar halaman */}
      <motion.div
        className="curtain"
        aria-hidden
        initial={{ y: "100%" }}
        animate={curtain}
      >
        <span className="curtain__label">
          {curtainLabel === "Home" ? (
            "Home"
          ) : (
            <>
              About <em>/ {curtainLabel}</em>
            </>
          )}
        </span>
      </motion.div>
    </MotionConfig>
  );
}
