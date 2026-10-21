import Landing from "@layouts/Landing";
import { ABOUT_NAV } from "@utilities/navigation";

// Landing page: lists every page in this menu section (edit the list in utilities/navigation.js).
const section = ABOUT_NAV;

export default function AboutPage() {
  return <Landing section={section} title="About EOH" />;
}
