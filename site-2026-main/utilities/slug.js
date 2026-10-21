// "Rocket Races" -> "rocket-races" (ids for in-page links)
export const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
