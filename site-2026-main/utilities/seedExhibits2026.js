import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "utilities/firebase";

const exhibits = [
  {
    id: "vanir2-solar-demo",
    exhibitName: "Solar Demo",
    exhibitBuilding: "ECEB",
    location: "Lobby",
    status: "Accepted",
    emailAddress: "lead@illinois.edu",
    leadExhibitorFirstName: "Lead",
    leadExhibitorLastName: "Exhibitor",
    leadExhibitorNetId: "lead1",
    comprehensiveExhibitDescription: "A demo exhibit.",
    visitorsGuideDescription: "Come see solar in action.",
    intendedAudience: "All ages",
    exhibitTag1: "Energy",
    exhibitTag2: "Sustainability",
    exhibitTag3: "",
    sustainability: "Yes",
    raw: {
      "Exhibit Name": "Solar Demo",
      "Exhibit Building": "ECEB",
      Location: "Lobby",
    },
  },
];

export async function seedExhibits2026() {
  for (const ex of exhibits) {
    const id = (ex.id || "").trim();
    if (!id) continue;
    await setDoc(doc(collection(firestore, "exhibits2026"), id), ex, { merge: true });
  }
}

