import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "utilities/firebase";

// Firestore collections are created automatically when the first document is written.
// This helper seeds example judges into: judgesAllowlist/{email}
//
// Schema (suggested):
// - email: string (doc id too)
// - displayName: string
// - awards: string[] (optional; e.g. ["design","energy"])
// - phone: string (optional)
// - notes: string (optional)
// - active: boolean
// - createdAt / updatedAt: timestamp (optional; requires serverTimestamp if you want)

const judges = [
  {
    email: "judge1@illinois.edu",
    displayName: "Judge One",
    awards: ["design"],
    active: true,
  },
  {
    email: "judge2@illinois.edu",
    displayName: "Judge Two",
    awards: ["energy", "outreach"],
    active: true,
  },
];

export async function seedJudgesAllowlist() {
  for (const j of judges) {
    const email = (j.email || "").trim().toLowerCase();
    if (!email) continue;
    await setDoc(doc(collection(firestore, "judgesAllowlist"), email), {
      ...j,
      email,
    });
  }
}

