import { useEffect, useState } from "react";
import styles from "./LaunchIntro.module.css";
import { EASING, FIELDS, INTRO_ENABLED, LABELS, TIMING, TRAILS } from "./config";
import { INTRO_SCRIPT } from "./script";

// Launch intro ("launch sequence") shown on the first page view of a browser session.
// Mounted once in pages/_app.js. The page underneath renders normally; this overlay only sits on top.
// Hidden unless the inline script (./script.js) adds `li-play` to <html>, so it never shows without
// JavaScript, for returning views, or with reduced motion. Settings: ./config.js.

const ms = (n) => `${n}ms`;
const CSS_VARS = {
  "--frame-end": ms(TIMING.frameEnd),
  "--rules-start": ms(TIMING.rulesStart),
  "--labels-start": ms(TIMING.labelsStart),
  "--trails-start": ms(TIMING.trailsStart),
  "--trails-end": ms(TIMING.trailsEnd),
  "--readout-start": ms(TIMING.readoutStart),
  "--readout-end": ms(TIMING.readoutEnd),
  "--headline-top-start": ms(TIMING.headlineTopStart),
  "--headline-bottom-start": ms(TIMING.headlineBottomStart),
  "--rise-dur": ms(TIMING.riseDuration),
  "--fill-start": ms(TIMING.fillStart),
  "--fill-end": ms(TIMING.fillEnd),
  "--exit-dur": ms(TIMING.exitDuration),
  "--handoff-delay": ms(TIMING.handoffDelay),
  "--handoff-dur": ms(TIMING.handoffDuration),
  "--ease-reveal": EASING.reveal,
  "--ease-wipe": EASING.wipe,
  "--ease-trail": EASING.trail,
  "--flip-steps": FIELDS.length - 1,
};

function Trails({ trail, className }) {
  const second = `translate(0 ${TRAILS.secondLaneOffset})`;
  const cool = `translate(0 ${TRAILS.coolLaneOffset})`;
  return (
    <svg className={`${styles.trails} ${className}`} viewBox={trail.viewBox} preserveAspectRatio="xMidYMax slice">
      <path d={trail.d} transform={cool} pathLength="1000" className={styles.trailCool} />
      <g className={styles.glow}>
        <path d={trail.d} pathLength="1000" className={styles.trail} />
        <path d={trail.d} transform={second} pathLength="1000" className={`${styles.trail} ${styles.trailSecond}`} />
      </g>
      <path d={trail.d} pathLength="1000" className={styles.head} />
    </svg>
  );
}

export default function LaunchIntro() {
  const [gone, setGone] = useState(false);

  useEffect(() => {
    // Unmount once the handoff is done (or straight away if the intro isn't playing this time).
    if (!document.documentElement.classList.contains("li-play") || window.__eohIntro?.done) {
      setGone(true);
      return;
    }
    const onDone = () => setGone(true);
    window.addEventListener("eoh-intro-done", onDone);
    return () => window.removeEventListener("eoh-intro-done", onDone);
  }, []);

  if (!INTRO_ENABLED || gone) return null;

  return (
    <>
      <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      <div className={styles.root} style={CSS_VARS}>
        <button type="button" className={styles.skip}>
          {LABELS.skip}
        </button>
        <div className={styles.panel} aria-hidden="true">
          <div className={styles.grid} />
          <span className={`${styles.crop} ${styles.cropTL}`} />
          <span className={`${styles.crop} ${styles.cropTR}`} />
          <span className={`${styles.crop} ${styles.cropBL}`} />
          <span className={`${styles.crop} ${styles.cropBR}`} />
          <div className={`${styles.rule} ${styles.ruleTop}`} />
          <div className={`${styles.rule} ${styles.ruleBottom}`} />
          <p className={`${styles.label} ${styles.topLeft}`}>{LABELS.topLeft}</p>
          <p className={`${styles.label} ${styles.topCenter}`}>{LABELS.topCenter}</p>
          <p className={`${styles.label} ${styles.topRight}`}>{LABELS.topRight}</p>
          <div className={styles.bottomRight}>
            <p className={`${styles.label} ${styles.bright}`}>{LABELS.date}</p>
            <p className={styles.label}>{LABELS.place}</p>
          </div>
          <p className={styles.counter}>
            <span data-li-count suppressHydrationWarning>
              000
            </span>
          </p>

          <Trails trail={TRAILS.desktop} className={styles.trailsDesktop} />
          <Trails trail={TRAILS.mobile} className={styles.trailsMobile} />

          <div className={styles.headline}>
            <span className={styles.mask}>
              <span className={styles.top}>Driven by</span>
            </span>
            <span className={styles.mask}>
              <span className={styles.bottom}>
                <span className={styles.outline}>Discovery</span>
                <span className={styles.fill}>Discovery</span>
              </span>
            </span>
            <p className={styles.readout}>
              <span>{LABELS.readout}</span>
              <span className={styles.bar}>│</span>
              <span className={styles.flip}>
                <span className={styles.flipList}>
                  {FIELDS.map((field) => (
                    <span key={field}>{field}</span>
                  ))}
                </span>
              </span>
            </p>
          </div>

          <div className={styles.grain} />
          <div className={styles.vignette} />
        </div>
        <div className={styles.handoffLine} aria-hidden="true" />
      </div>
    </>
  );
}
