import { collection, doc, setDoc } from "firebase/firestore";
import { firestore } from "utilities/firebase";

// Adjust these to whatever and then call seedEvents in index.js
const events = [
  {
    id: "(4-10-2026) WasteNot Volunteering 9-11",
    name: "WasteNot Volunteering",
    date: "2026-04-10",
    startTime: "09:00",
    endTime: "11:00",
    time: "9am - 11am",
    maxCapacity: 5,
  },
  {
    id: "(4-10-2026) WasteNot Volunteering 11-1",
    name: "WasteNot Volunteering",
    date: "2026-04-10",
    startTime: "11:00",
    endTime: "13:00",
    time: "11am - 1pm",
    maxCapacity: 10,
  },
  {
    id: "(4-10-2026) WasteNot Volunteering 1-3",
    name: "WasteNot Volunteering",
    date: "2026-04-10",
    startTime: "13:00",
    endTime: "15:00",
    time: "1pm - 3pm",
    maxCapacity: 10,
  },
  {
    id: "(4-10-2026) WasteNot Volunteering 3-5",
    name: "WasteNot Volunteering",
    date: "2026-04-10",
    startTime: "15:00",
    endTime: "17:00",
    time: "3pm - 5pm",
    maxCapacity: 5,
  },
  {
    id: "(4-11-2026) WasteNot Volunteering 9-11",
    name: "WasteNot Volunteering",
    date: "2026-04-11",
    startTime: "09:00",
    endTime: "11:00",
    time: "9am - 11am",
    maxCapacity: 5,
  },
  {
    id: "(4-11-2026) WasteNot Volunteering 11-1",
    name: "WasteNot Volunteering",
    date: "2026-04-11",
    startTime: "11:00",
    endTime: "13:00",
    time: "11am - 1pm",
    maxCapacity: 10,
  },
  {
    id: "(4-11-2026) WasteNot Volunteering 1-3",
    name: "WasteNot Volunteering",
    date: "2026-04-11",
    startTime: "13:00",
    endTime: "15:00",
    time: "1pm - 3pm",
    maxCapacity: 10,
  },
  {
    id: "(4-11-2026) WasteNot Volunteering 3-5",
    name: "WasteNot Volunteering",
    date: "2026-04-11",
    startTime: "15:00",
    endTime: "17:00",
    time: "3pm - 5pm",
    maxCapacity: 5,
  },
];

export async function seedEvents() {
  for (const event of events) {
    await setDoc(doc(collection(firestore, "volunteerEvents2026"), event.id), {
      ...event,
      volunteers: [],
    });
  }
}