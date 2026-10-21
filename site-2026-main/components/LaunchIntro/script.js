import { REPLAY_PARAM, SESSION_KEY, TIMING } from "./config";

// The intro's runtime, inlined at the very start of <body> so it runs before the first paint and
// before React hydrates. It decides whether to play (first view this session, ?intro=1, no reduced
// motion), drives the counter from real loading progress, and handles skip and the handoff.
// State is kept as classes on <html>: li-play, li-exit, li-skip, li-done (styles in LaunchIntro.module.css).
const T = TIMING;
const EXIT_TO_DONE = T.handoffDelay + T.handoffDuration;

export const INTRO_SCRIPT = `(function () {
  var d = document, h = d.documentElement, w = window;
  try {
    var force = new RegExp("[?&]${REPLAY_PARAM}=1(&|$)").test(location.search);
    var seen = false;
    try { seen = sessionStorage.getItem("${SESSION_KEY}") === "1"; } catch (e) {}
    var reduce = w.matchMedia && w.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || (seen && !force)) return;
    try { sessionStorage.setItem("${SESSION_KEY}", "1"); } catch (e) {}
    h.classList.add("li-play");
    h.style.overflow = "hidden"; // no scrolling the hidden page during the intro

    var t0 = performance.now(), shown = 0, exitAt = null, doneAt = null;
    var ready = { fonts: false, images: false, load: false };
    w.__eohIntro = { done: false };
    if (d.fonts && d.fonts.ready) d.fonts.ready.then(function () { ready.fonts = true; }); else ready.fonts = true;
    if (d.readyState === "complete") ready.load = true;
    else w.addEventListener("load", function () { ready.load = true; });
    function waitImages() {
      var imgs = [].slice.call(d.querySelectorAll('img[fetchpriority="high"]'));
      Promise.all(imgs.map(function (img) {
        return img.decode ? img.decode().catch(function () {}) : null;
      })).then(function () { ready.images = true; });
    }
    if (d.readyState === "loading") d.addEventListener("DOMContentLoaded", waitImages); else waitImages();

    function exit(skip) {
      if (exitAt !== null) return;
      exitAt = performance.now();
      h.classList.add("li-exit");
      if (skip) h.classList.add("li-skip");
      doneAt = exitAt + (skip ? ${T.handoffDuration} : ${EXIT_TO_DONE});
    }
    function onKey(e) { if (e.key === "Escape") exit(true); }
    function onClick() { exit(true); }
    d.addEventListener("keydown", onKey);
    d.addEventListener("click", onClick, true);

    function frame(now) {
      var t = now - t0;
      var allReady = ready.fonts && ready.images && ready.load;
      var p = Math.min(t / ${T.counterEnd}, 1), eased = 1 - Math.pow(1 - p, 3);
      var cap = allReady ? 100 : 70 + 9 * (ready.fonts + ready.images + ready.load);
      var target = t >= ${T.counterEnd} && !allReady ? shown + (cap - shown) * 0.04 : Math.min(eased * 100, cap);
      shown = Math.max(shown, target);
      var el = d.querySelector("[data-li-count]");
      if (el) el.textContent = ("00" + Math.round(shown)).slice(-3);
      if (exitAt === null && ((allReady && t >= ${T.exitStart}) || t >= ${T.hardCap - EXIT_TO_DONE})) exit(false);
      if (doneAt !== null && now >= doneAt) {
        h.classList.remove("li-play", "li-exit", "li-skip");
        h.classList.add("li-done");
        h.style.overflow = "";
        d.removeEventListener("keydown", onKey);
        d.removeEventListener("click", onClick, true);
        w.__eohIntro.done = true;
        w.dispatchEvent(new Event("eoh-intro-done"));
        return;
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  } catch (e) {
    h.classList.remove("li-play");
    h.style.overflow = "";
  }
})();`;
