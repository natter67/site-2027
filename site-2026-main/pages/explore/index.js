import Landing from "@layouts/Landing";
import { PRIMARY_NAV } from "@utilities/navigation";

// Landing page: lists every page in this menu section (edit the list in utilities/navigation.js).
const section = PRIMARY_NAV.find((s) => s.key === "explore");

export default function ExplorePage() {
  return <Landing section={section} title="Explore" />;
}
