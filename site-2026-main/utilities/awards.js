// awardId values are stored on judgingStops docs and in judge UI state.
export const AWARDS = [
  {
    id: "visitors-favorite",
    label: "Visitor's Favorite Award",
    rubricUrl: "",
    aliases: ["visitors favorite award", "visitor favorite award", "visitor favorite"],
    color: {
      badge: "bg-blue-100 text-blue-800 border-blue-200",
      accent: "border-l-blue-500",
    },
  },
  {
    id: "outstanding-rso",
    label: "Outstanding RSO Exhibit",
    rubricUrl: "https://forms.gle/aX2D4QnhuQdnCSYg9",
    aliases: ["outstanding rso"],
    color: {
      badge: "bg-emerald-100 text-emerald-800 border-emerald-200",
      accent: "border-l-emerald-500",
    },
  },
  {
    id: "outstanding-freshman",
    label: "Outstanding Freshman Exhibit",
    rubricUrl: "https://forms.gle/SJhg2RYaVjuyH3DU9",
    aliases: ["outstanding freshman"],
    color: {
      badge: "bg-teal-100 text-teal-800 border-teal-200",
      accent: "border-l-teal-500",
    },
  },
  {
    id: "most-engaging",
    label: "Most Engaging",
    rubricUrl: "https://forms.gle/iEaBchDgkGavwKEe8",
    aliases: ["most engaging exhibit"],
    color: {
      badge: "bg-amber-100 text-amber-900 border-amber-200",
      accent: "border-l-amber-500",
    },
  },
  {
    id: "outstanding-undergrad-research",
    label: "Outstanding Undergraduate Research",
    rubricUrl: "https://forms.gle/swYbcFzBEU4B2APS8",
    aliases: ["outstanding undergraduate research"],
    color: {
      badge: "bg-violet-100 text-violet-800 border-violet-200",
      accent: "border-l-violet-500",
    },
  },
  {
    id: "most-industry-impact",
    label: "Most Industry Impact",
    rubricUrl: "https://forms.gle/PVG77Gv6wNTtFxta6",
    aliases: ["most industry impact presented by chevron"],
    color: {
      badge: "bg-orange-100 text-orange-900 border-orange-200",
      accent: "border-l-orange-500",
    },
  },
  {
    id: "visionary-impact",
    label: "Visionary Impact Award",
    rubricUrl: "https://forms.gle/f5CEPmXs7QmEAntD9",
    aliases: ["visionary impact"],
    color: {
      badge: "bg-indigo-100 text-indigo-800 border-indigo-200",
      accent: "border-l-indigo-500",
    },
  },
  {
    id: "distinguished-tech",
    label: "Distinguished Tech Award",
    rubricUrl: "https://forms.gle/R5wBQMDg3ngmjR4S7",
    aliases: ["distinguished tech exhibit", "distinguished technology award"],
    color: {
      badge: "bg-cyan-100 text-cyan-900 border-cyan-200",
      accent: "border-l-cyan-600",
    },
  },
  {
    id: "sustainability",
    label: "Sustainability Award",
    rubricUrl: "https://forms.gle/N5YA7WdJDjsgXto87",
    aliases: ["sustainability efforts award"],
    color: {
      badge: "bg-green-100 text-green-800 border-green-200",
      accent: "border-l-green-600",
    },
  },
  {
    id: "forging-future",
    label: "Forging the Future (Theme Award)",
    rubricUrl: "https://forms.gle/6n4YahVVqdRTNK417",
    aliases: ["forging the future", "forging the future theme award", "theme award", "the age of innovation"],
    color: {
      badge: "bg-rose-100 text-rose-800 border-rose-200",
      accent: "border-l-rose-500",
    },
  },
];

export function awardLabelById(awardId) {
  const id = (awardId || "").trim();
  return AWARDS.find((a) => a.id === id)?.label || id || "Award";
}

export function awardColorById(awardId) {
  const id = (awardId || "").trim();
  return (
    AWARDS.find((a) => a.id === id)?.color || {
      badge: "bg-gray-100 text-gray-800 border-gray-200",
      accent: "border-l-gray-400",
    }
  );
}

/** Google Form (or any https URL) for judges; empty string if none. */
export function awardRubricUrlById(awardId) {
  const id = (awardId || "").trim();
  const url = AWARDS.find((a) => a.id === id)?.rubricUrl;
  return typeof url === "string" ? url.trim() : "";
}
