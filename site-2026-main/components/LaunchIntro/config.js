// Launch intro settings: every timing, easing, label and the trail paths live here.
// Remove the feature: delete this folder and the <LaunchIntro /> line (and its import) in pages/_app.js.

// Set to false to turn the intro off everywhere.
export const INTRO_ENABLED = true;

// Plays once per browser session (sessionStorage). Add ?intro=1 to any URL to replay it.
export const SESSION_KEY = "eoh-intro-seen";
export const REPLAY_PARAM = "intro";

// Milliseconds from the moment the page starts loading. About 4.5 s in total; the finished frame
// (headline filled, counter at 100) holds for about 0.8 s before the wipe.
export const TIMING = {
  frameEnd: 700, // grid fades in, rules draw, crop marks and labels appear (0–0.7s)
  rulesStart: 60,
  labelsStart: 300,
  trailsStart: 350, // light trails draw 0.35–2.5s
  trailsEnd: 2500,
  readoutStart: 600, // "EXPLORING │ field" flips 0.6–2.75s
  readoutEnd: 2750,
  headlineTopStart: 900, // "DRIVEN BY" rises
  headlineBottomStart: 1150, // "DISCOVERY" outline rises
  riseDuration: 600,
  fillStart: 1550, // "DISCOVERY" fills left to right 1.55–2.2s
  fillEnd: 2200,
  counterEnd: 2850, // counter 000 → 100 (ease-out), held until the page is ready
  exitStart: 3050, // headline, readout and trails ease up and fade (3.05–3.65s)
  exitDuration: 600,
  handoffDelay: 450, // panel wipe starts 0.45s into the exit (3.5s) …
  handoffDuration: 1000, // … and ends at 4.5s, then the overlay unmounts
  hardCap: 7000, // never longer than this, even if the page isn't ready
};

export const EASING = {
  reveal: "cubic-bezier(.16,1,.3,1)",
  wipe: "cubic-bezier(.83,0,.17,1)",
  trail: "cubic-bezier(.65,0,.35,1)",
};

export const LABELS = {
  topLeft: "EOH — 2027",
  topCenter: "Engineering Open House · No. 105",
  topRight: "40.112° N · 88.227° W",
  date: "April 09 — 10, 2027",
  place: "Bardeen Quad · Urbana-Champaign, IL",
  readout: "Exploring",
  skip: "Skip intro",
};

// The readout flips through these and lands on the last one.
export const FIELDS = ["Aerospace", "Bioengineering", "Computing", "Electrical", "Materials", "Mechanical", "Civil", "Nuclear", "Quantum", "Everything"];

// Trail paths, drawn in the band above the bottom rule (viewBox 0 0 W 300). They run along the
// band, then sweep up and off the right edge like the road in the logo. Lane offsets are in viewBox units.
export const TRAILS = {
  desktop: { viewBox: "0 0 1440 300", d: "M -60 236 C 260 262, 520 168, 820 198 S 1180 268, 1310 148 S 1430 -40, 1520 -80" },
  mobile: { viewBox: "0 0 390 300", d: "M -40 252 C 70 272, 150 196, 222 210 S 320 262, 352 150 S 396 -30, 440 -80" },
  secondLaneOffset: 9, // the second orange trail, parallel to the first
  coolLaneOffset: -30, // the faint cool-white trail in the other lane
};
