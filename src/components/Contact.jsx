import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RevealText from "./RevealText";
import Magnetic from "./Magnetic";
import SocialCards from "./SocialCards";
import { easeOut } from "./motion";
import { contact, profile } from "../data/portfolio";

function LocalTime({ timezone }) {
  const format = () =>
    new Intl.DateTimeFormat("en-GB", {
      timeZone: timezone,
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date());

  const [time, setTime] = useState(format);

  useEffect(() => {
    const id = setInterval(() => setTime(format()), 10000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timezone]);

  return <span>Local time {time}</span>;
}

export default function Contact() {
  return (
    <section id="contact" className="section section--dark contact">
      <div>
        <div className="section__label">
          <span>(03) — Contact</span>
          <span>Say hello</span>
        </div>

        <h2 className="contact__title">
          <span className="contact__line">
            <RevealText text={contact.line1} inView />
          </span>
          <span className="contact__line contact__line--indent">
            <RevealText text={contact.line2} inView delay={0.1} />{" "}
            <RevealText text={contact.line2Italic} italic inView delay={0.2} />
          </span>
          <span className="contact__line contact__line--indent2">
            <RevealText text={contact.line3} inView delay={0.3} />
          </span>
        </h2>

        <motion.div
          className="contact__row"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1, ease: easeOut }}
        >
          <div className="contact__links">
            <a href={`mailto:${profile.email}`} className="contact__email">
              {profile.email}
            </a>
          </div>

          <Magnetic strength={0.4}>
            <a href={`mailto:${profile.email}`} className="circle-btn">
              <Magnetic strength={0.25}>
                <span>Get in touch</span>
              </Magnetic>
            </a>
          </Magnetic>
        </motion.div>

        {/* Kartu sosial media interaktif */}
        <SocialCards />
      </div>

      <footer className="footer">
        <span>
          © {profile.year} {profile.name}
        </span>
        <LocalTime timezone={profile.timezone} />
        <a href="#top" className="underline">
          Back to top ↑
        </a>
      </footer>
    </section>
  );
}
