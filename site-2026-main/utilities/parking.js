// Parking lots from the 2026 Visitor Guide (utilities/visitorGuide.js): update both each spring.
// Used on /visit. `where` is the cross streets from the guide and feeds the
// Google Maps search for the lot.
export const PARKING = [
  {
    label: "Friday and Saturday",
    lots: [
      { name: "E-14", where: "First St and Kirby Ave", note: "Near State Farm Center. All-day parking; the shuttle stops here." },
      { name: "B-4", where: "University Ave and Mathews Ave", note: "North Campus. All-day parking, no shuttle stop (the closest is B-22)." },
    ],
  },
  {
    label: "Saturday only",
    lots: [
      { name: "B1", where: "Springfield Ave between Mathews Ave and Goodwin Ave" },
      { name: "B17", where: "Harvey St between Clark St and Main St" },
      { name: "C09", where: "Chalmers St and Sixth St" },
      { name: "D09", where: "Illinois St and Lincoln Ave" },
      { name: "F23", where: "Lincoln Ave and Florida Ave" },
      { name: "F28", where: "Peabody Dr and Dorner Dr" },
      { name: "F29", where: "Gregory Dr and Dorner Dr" },
    ],
  },
  {
    label: "School buses",
    lots: [{ name: "B-22", where: "Goodwin Ave and University Ave", note: "Bus pick-up and drop-off only." }],
  },
];

export const mapsUrl = (lot) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${lot.where}, University of Illinois Urbana-Champaign`)}`;
