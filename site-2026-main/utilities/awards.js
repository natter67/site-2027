export const AWARDS = [
  {
    id: "design",
    label: "Design Award",
    color: {
      badge: "bg-blue-100 text-blue-800 border-blue-200",
      accent: "border-l-blue-500",
    },
  },
  {
    id: "energy",
    label: "Energy Award",
    color: {
      badge: "bg-green-100 text-green-800 border-green-200",
      accent: "border-l-green-500",
    },
  },
  {
    id: "outreach",
    label: "Outreach Award",
    color: {
      badge: "bg-purple-100 text-purple-800 border-purple-200",
      accent: "border-l-purple-500",
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

