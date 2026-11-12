import { useEffect, useState } from "react";

/* Router sederhana berbasis hash — tanpa library tambahan.
   "#/experience" -> "experience"   (halaman terpisah)
   "#about", "#top", ""  -> ""      (halaman utama, scroll ke section) */
export function readRoute() {
  const hash = window.location.hash;
  return hash.startsWith("#/") ? hash.slice(2).split(/[?#]/)[0] : "";
}

export default function useRoute() {
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);

  return route;
}

// Scroll instan (tanpa smooth) — dipakai saat berpindah halaman
export function jumpTo(y = 0) {
  const html = document.documentElement;
  const prev = html.style.scrollBehavior;
  html.style.scrollBehavior = "auto";
  window.scrollTo(0, y);
  html.style.scrollBehavior = prev;
}
