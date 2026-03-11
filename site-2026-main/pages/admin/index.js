import React, { useEffect, useMemo, useState } from "react";
import {
  auth,
  provider,
  firestore,
  signInWithPopup,
  signOut,
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from "utilities/firebase";
import { onSnapshot, query, orderBy, where } from "firebase/firestore";
import { isAdminEmail } from "@utilities/admin";
import { AWARDS, awardColorById, awardLabelById } from "@utilities/awards";

const TABS = [
  { id: "volunteer-slots", label: "Volunteer Slots" },
  { id: "volunteer-reassign", label: "Volunteer Reassign" },
  { id: "exhibits", label: "Exhibits" },
  { id: "judges", label: "Judges" },
];

function normalizeEmail(email) {
  return (email || "").trim().toLowerCase();
}

function buildVolunteerEventId({ date, name, startTime, endTime }) {
  const safeName = (name || "").trim() || "Volunteer Slot";
  const safeDate = (date || "").trim() || "YYYY-MM-DD";
  const safeStart = (startTime || "").trim() || "HH:MM";
  const safeEnd = (endTime || "").trim() || "HH:MM";
  return `(${safeDate}) ${safeName} ${safeStart}-${safeEnd}`;
}

function slugify(s) {
  return (s || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildExhibitId({ exhibitName, leadExhibitorNetId }) {
  const a = slugify(leadExhibitorNetId || "exhibit");
  const b = slugify(exhibitName || "untitled");
  return `${a}-${b}`.slice(0, 120);
}

function randomCode(bytes = 16) {
  if (typeof window === "undefined" || !window.crypto?.getRandomValues) {
    // Fallback for prerender; code is only generated client-side.
    return Math.random().toString(16).slice(2) + Math.random().toString(16).slice(2);
  }
  const arr = new Uint8Array(bytes);
  window.crypto.getRandomValues(arr);
  return Array.from(arr)
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  const [events, setEvents] = useState([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  const [exhibits, setExhibits] = useState([]);
  const [loadingExhibits, setLoadingExhibits] = useState(true);

  // Create / edit event form
  const [eventForm, setEventForm] = useState({
    name: "",
    date: "",
    startTime: "",
    endTime: "",
    time: "",
    maxCapacity: "",
  });
  const [editingDocId, setEditingDocId] = useState(null);

  // Add volunteer to slot UI
  const [volunteerAdd, setVolunteerAdd] = useState({
    slotDocId: "",
    email: "",
    name: "",
    uid: "",
  });

  // Volunteer move UI
  const [moveFromDocId, setMoveFromDocId] = useState("");
  const [moveToDocId, setMoveToDocId] = useState("");
  const [moveVolunteerUid, setMoveVolunteerUid] = useState("");

  // Exhibits form
  const [exhibitForm, setExhibitForm] = useState({
    exhibitName: "",
    exhibitBuilding: "",
    location: "",
    status: "",
    exhibitNotes: "",
    awardIds: [],
    timestamp: "",
    emailAddress: "",
    netIdsTownHall: "",
    leadExhibitorFirstName: "",
    leadExhibitorLastName: "",
    leadExhibitorNetId: "",
    leadExhibitorPhoneNumber: "",
    alternateEmailAddress: "",
    exhibitAffiliation: "",
    affiliatedToWhich: "",
    department: "",
    advisorName: "",
    advisorEmailAddress: "",
    comprehensiveExhibitDescription: "",
    visitorsGuideDescription: "",
    intendedAudience: "",
    exhibitTag1: "",
    exhibitTag2: "",
    exhibitTag3: "",
    sustainability: "",
    additionalJson: "",
  });
  const [editingExhibitDocId, setEditingExhibitDocId] = useState(null);

  // Judges allowlist
  const [judges, setJudges] = useState([]);
  const [judgeForm, setJudgeForm] = useState({
    email: "",
    displayName: "",
  });

  // Judging setup
  const [judgingQrForm, setJudgingQrForm] = useState({
    exhibitId: "",
    code: "",
    active: true,
  });
  const [assignmentForm, setAssignmentForm] = useState({
    awardId: "",
    exhibitId: "",
    judgeEmail: "",
    stopOrder: "",
  });

  // Schedule viewer/editor (Judges tab)
  const [scheduleJudgeEmail, setScheduleJudgeEmail] = useState("");
  const [scheduleRows, setScheduleRows] = useState([]); // [{exhibitId, stopOrder, awardId, judgeEmail, awardLabel}]
  const [scheduleSaving, setScheduleSaving] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u || null);
      setIsAdmin(isAdminEmail(u?.email));
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isAdmin) return;

    setLoadingEvents(true);
    const eventsRef = collection(firestore, "volunteerEvents2026");
    const q = query(eventsRef, orderBy("date", "asc"), orderBy("startTime", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setEvents(
          snapshot.docs.map((d) => ({
            docId: d.id,
            ...d.data(),
          }))
        );
        setLoadingEvents(false);
      },
      (err) => {
        console.error(err);
        setLoadingEvents(false);
      }
    );

    return () => unsubscribe();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    if (!scheduleJudgeEmail) {
      setScheduleRows([]);
      return;
    }

    const judgeEmail = normalizeEmail(scheduleJudgeEmail);
    const unsubs = [];
    let cancelled = false;

    for (const a of AWARDS) {
      const exhibitsRef = collection(firestore, "awardAssignments", a.id, "exhibits");
      const q = query(exhibitsRef, where("judgeEmail", "==", judgeEmail));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          if (cancelled) return;
          const incoming = snapshot.docs.map((d) => {
            const data = d.data() || {};
            const stopOrderRaw =
              typeof data.stopOrder === "number"
                ? data.stopOrder
                : typeof data.stopIndex === "number"
                  ? data.stopIndex + 1
                  : null;
            return {
              exhibitId: data.exhibitId || d.id,
              awardId: data.awardId || a.id,
              awardLabel: data.awardLabel || awardLabelById(data.awardId || a.id),
              judgeEmail: data.judgeEmail || judgeEmail,
              stopOrder: stopOrderRaw,
              updatedAt: data.updatedAt || null,
            };
          });

          setScheduleRows((prev) => {
            const kept = prev.filter((r) => r.awardId !== a.id);
            const merged = [...kept, ...incoming];
            return merged;
          });
        },
        (err) => console.error(err)
      );
      unsubs.push(unsub);
    }

    return () => {
      cancelled = true;
      for (const u of unsubs) u();
    };
  }, [isAdmin, scheduleJudgeEmail]);

  useEffect(() => {
    if (!isAdmin) return;

    setLoadingExhibits(true);
    const exhibitsRef = collection(firestore, "exhibits2026");
    const q = query(exhibitsRef, orderBy("exhibitName", "asc"));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        setExhibits(snapshot.docs.map((d) => ({ docId: d.id, ...d.data() })));
        setLoadingExhibits(false);
      },
      (err) => {
        console.error(err);
        setLoadingExhibits(false);
      }
    );
    return () => unsubscribe();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;

    const judgesRef = collection(firestore, "judgesAllowlist");
    const unsubscribe = onSnapshot(
      judgesRef,
      (snapshot) => {
        setJudges(
          snapshot.docs
            .map((d) => ({ docId: d.id, ...d.data() }))
            .sort((a, b) => (a.email || a.docId).localeCompare(b.email || b.docId))
        );
      },
      (err) => console.error(err)
    );
    return () => unsubscribe();
  }, [isAdmin]);

  const eventByDocId = useMemo(() => {
    const m = new Map();
    for (const e of events) m.set(e.docId, e);
    return m;
  }, [events]);

  const exhibitByDocId = useMemo(() => {
    const m = new Map();
    for (const e of exhibits) m.set(e.docId, e);
    return m;
  }, [exhibits]);

  const selectedAssignmentExhibit = assignmentForm.exhibitId
    ? exhibitByDocId.get(assignmentForm.exhibitId)
    : null;

  const awardsForSelectedAssignmentExhibit = useMemo(() => {
    const ids = Array.isArray(selectedAssignmentExhibit?.awardIds)
      ? selectedAssignmentExhibit.awardIds
      : [];
    const set = new Set(ids.map((s) => String(s).trim()).filter(Boolean));
    return AWARDS.filter((a) => set.has(a.id));
  }, [selectedAssignmentExhibit]);

  const moveFromEvent = moveFromDocId ? eventByDocId.get(moveFromDocId) : null;
  const moveToEvent = moveToDocId ? eventByDocId.get(moveToDocId) : null;
  const moveVolunteer = useMemo(() => {
    if (!moveFromEvent || !moveVolunteerUid) return null;
    return (moveFromEvent.volunteers || []).find((v) => v.uid === moveVolunteerUid) || null;
  }, [moveFromEvent, moveVolunteerUid]);

  const handleSignIn = async () => {
    await signInWithPopup(auth, provider);
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  const resetEventForm = () => {
    setEventForm({
      name: "",
      date: "",
      startTime: "",
      endTime: "",
      time: "",
      maxCapacity: "",
    });
    setEditingDocId(null);
  };

  const resetExhibitForm = () => {
    setExhibitForm({
      exhibitName: "",
      exhibitBuilding: "",
      location: "",
      status: "",
      exhibitNotes: "",
      awardIds: [],
      timestamp: "",
      emailAddress: "",
      netIdsTownHall: "",
      leadExhibitorFirstName: "",
      leadExhibitorLastName: "",
      leadExhibitorNetId: "",
      leadExhibitorPhoneNumber: "",
      alternateEmailAddress: "",
      exhibitAffiliation: "",
      affiliatedToWhich: "",
      department: "",
      advisorName: "",
      advisorEmailAddress: "",
      comprehensiveExhibitDescription: "",
      visitorsGuideDescription: "",
      intendedAudience: "",
      exhibitTag1: "",
      exhibitTag2: "",
      exhibitTag3: "",
      sustainability: "",
      additionalJson: "",
    });
    setEditingExhibitDocId(null);
  };

  const startEditEvent = (evt) => {
    setEditingDocId(evt.docId);
    setEventForm({
      name: evt.name || "",
      date: evt.date || "",
      startTime: evt.startTime || "",
      endTime: evt.endTime || "",
      time: evt.time || "",
      maxCapacity: typeof evt.maxCapacity === "number" ? String(evt.maxCapacity) : "",
    });
    setActiveTab("volunteer-slots");
  };

  const startEditExhibit = (ex) => {
    setEditingExhibitDocId(ex.docId);
    setExhibitForm({
      exhibitName: ex.exhibitName || "",
      exhibitBuilding: ex.exhibitBuilding || "",
      location: ex.location || "",
      status: ex.status || "",
      exhibitNotes: ex.exhibitNotes || "",
      awardIds: Array.isArray(ex.awardIds) ? ex.awardIds : [],
      timestamp: ex.timestamp || "",
      emailAddress: ex.emailAddress || "",
      netIdsTownHall: ex.netIdsTownHall || "",
      leadExhibitorFirstName: ex.leadExhibitorFirstName || "",
      leadExhibitorLastName: ex.leadExhibitorLastName || "",
      leadExhibitorNetId: ex.leadExhibitorNetId || "",
      leadExhibitorPhoneNumber: ex.leadExhibitorPhoneNumber || "",
      alternateEmailAddress: ex.alternateEmailAddress || "",
      exhibitAffiliation: ex.exhibitAffiliation || "",
      affiliatedToWhich: ex.affiliatedToWhich || "",
      department: ex.department || "",
      advisorName: ex.advisorName || "",
      advisorEmailAddress: ex.advisorEmailAddress || "",
      comprehensiveExhibitDescription: ex.comprehensiveExhibitDescription || "",
      visitorsGuideDescription: ex.visitorsGuideDescription || "",
      intendedAudience: ex.intendedAudience || "",
      exhibitTag1: ex.exhibitTag1 || "",
      exhibitTag2: ex.exhibitTag2 || "",
      exhibitTag3: ex.exhibitTag3 || "",
      sustainability: ex.sustainability || "",
      additionalJson: "",
    });
    setActiveTab("exhibits");
  };

  const upsertVolunteerEvent = async () => {
    const payload = {
      name: (eventForm.name || "").trim(),
      date: (eventForm.date || "").trim(),
      startTime: (eventForm.startTime || "").trim(),
      endTime: (eventForm.endTime || "").trim(),
      time: (eventForm.time || "").trim(),
      maxCapacity:
        eventForm.maxCapacity === "" ? null : Math.max(0, Number(eventForm.maxCapacity)),
      updatedAt: serverTimestamp(),
    };

    if (!payload.name || !payload.date || !payload.startTime || !payload.endTime) {
      alert("Please fill: name, date, start time, end time.");
      return;
    }

    const computedId = buildVolunteerEventId(payload);
    const docId = editingDocId || computedId;

    // If creating, ensure volunteers array exists and set `id` to match docId
    const existing = await getDoc(doc(firestore, "volunteerEvents2026", docId));
    const base = existing.exists()
      ? {}
      : {
          id: docId,
          volunteers: [],
          createdAt: serverTimestamp(),
        };

    await setDoc(
      doc(firestore, "volunteerEvents2026", docId),
      {
        ...base,
        ...payload,
        id: docId,
      },
      { merge: true }
    );

    // If editing an event and the computed ID differs, we *don’t* auto-rename docs here
    // because that would require copy+delete and could break links. Keep docId stable.
    resetEventForm();
  };

  const addVolunteerToSlot = async () => {
    const slotDocId = volunteerAdd.slotDocId;
    const email = normalizeEmail(volunteerAdd.email);
    const name = (volunteerAdd.name || "").trim();
    const uid = (volunteerAdd.uid || "").trim() || email;

    if (!slotDocId) {
      alert("Select a slot.");
      return;
    }
    if (!email) {
      alert("Enter an email.");
      return;
    }
    if (!uid) {
      alert("Enter a UID (or provide an email).");
      return;
    }

    const evt = eventByDocId.get(slotDocId);
    if (!evt) {
      alert("Slot not found.");
      return;
    }
    const vols = Array.isArray(evt.volunteers) ? [...evt.volunteers] : [];
    if (vols.some((v) => v.uid === uid || normalizeEmail(v.email) === email)) {
      alert("That volunteer is already on this slot.");
      return;
    }
    if (evt.maxCapacity && vols.length >= evt.maxCapacity) {
      alert("That slot is full.");
      return;
    }

    vols.push({ uid, email, name });
    await updateDoc(doc(firestore, "volunteerEvents2026", slotDocId), {
      volunteers: vols,
      updatedAt: serverTimestamp(),
    });
    setVolunteerAdd({ slotDocId, email: "", name: "", uid: "" });
  };

  const removeVolunteerFromSlot = async (slotDocId, volunteerUid) => {
    const evt = eventByDocId.get(slotDocId);
    if (!evt) return;
    const vols = Array.isArray(evt.volunteers) ? [...evt.volunteers] : [];
    const v = vols.find((x) => x.uid === volunteerUid);
    if (!v) return;
    if (!window.confirm(`Remove ${v.email || v.uid} from this slot?`)) return;
    const next = vols.filter((x) => x.uid !== volunteerUid);
    await updateDoc(doc(firestore, "volunteerEvents2026", slotDocId), {
      volunteers: next,
      updatedAt: serverTimestamp(),
    });
  };

  const removeVolunteerEvent = async (docId) => {
    const evt = eventByDocId.get(docId);
    const count = (evt?.volunteers || []).length;
    if (
      !window.confirm(
        `Delete "${evt?.name || docId}"?\n\nThis will remove the slot and its ${count} volunteer(s).`
      )
    )
      return;
    await deleteDoc(doc(firestore, "volunteerEvents2026", docId));
  };

  const upsertExhibit = async () => {
    const payload = {
      exhibitName: (exhibitForm.exhibitName || "").trim(),
      exhibitBuilding: (exhibitForm.exhibitBuilding || "").trim(),
      location: (exhibitForm.location || "").trim(),
      status: (exhibitForm.status || "").trim(),
      exhibitNotes: (exhibitForm.exhibitNotes || "").trim(),
      awardIds: Array.isArray(exhibitForm.awardIds)
        ? exhibitForm.awardIds.map((s) => String(s).trim()).filter(Boolean)
        : [],
      timestamp: (exhibitForm.timestamp || "").trim(),
      emailAddress: normalizeEmail(exhibitForm.emailAddress),
      netIdsTownHall: (exhibitForm.netIdsTownHall || "").trim(),
      leadExhibitorFirstName: (exhibitForm.leadExhibitorFirstName || "").trim(),
      leadExhibitorLastName: (exhibitForm.leadExhibitorLastName || "").trim(),
      leadExhibitorNetId: (exhibitForm.leadExhibitorNetId || "").trim(),
      leadExhibitorPhoneNumber: (exhibitForm.leadExhibitorPhoneNumber || "").trim(),
      alternateEmailAddress: normalizeEmail(exhibitForm.alternateEmailAddress),
      exhibitAffiliation: (exhibitForm.exhibitAffiliation || "").trim(),
      affiliatedToWhich: (exhibitForm.affiliatedToWhich || "").trim(),
      department: (exhibitForm.department || "").trim(),
      advisorName: (exhibitForm.advisorName || "").trim(),
      advisorEmailAddress: normalizeEmail(exhibitForm.advisorEmailAddress),
      comprehensiveExhibitDescription: (exhibitForm.comprehensiveExhibitDescription || "").trim(),
      visitorsGuideDescription: (exhibitForm.visitorsGuideDescription || "").trim(),
      intendedAudience: (exhibitForm.intendedAudience || "").trim(),
      exhibitTag1: (exhibitForm.exhibitTag1 || "").trim(),
      exhibitTag2: (exhibitForm.exhibitTag2 || "").trim(),
      exhibitTag3: (exhibitForm.exhibitTag3 || "").trim(),
      sustainability: (exhibitForm.sustainability || "").trim(),
      updatedAt: serverTimestamp(),
    };

    if (!payload.exhibitName) {
      alert("Please provide Exhibit Name.");
      return;
    }

    let extra = null;
    const raw = (exhibitForm.additionalJson || "").trim();
    if (raw) {
      try {
        extra = JSON.parse(raw);
      } catch {
        alert("Additional fields JSON is not valid JSON.");
        return;
      }
    }

    const computedId = buildExhibitId(payload);
    const docId = editingExhibitDocId || computedId;
    const exhibitRef = doc(firestore, "exhibits2026", docId);

    const existing = await getDoc(exhibitRef);
    const base = existing.exists()
      ? {}
      : {
          id: docId,
          createdAt: serverTimestamp(),
        };

    await setDoc(
      exhibitRef,
      {
        ...base,
        ...payload,
        id: docId,
        ...(extra ? { extra } : {}),
      },
      { merge: true }
    );

    resetExhibitForm();
  };

  const removeExhibit = async (docId) => {
    const ex = exhibitByDocId.get(docId);
    if (
      !window.confirm(`Delete exhibit "${ex?.exhibitName || docId}"?\n\nThis cannot be undone.`)
    )
      return;
    await deleteDoc(doc(firestore, "exhibits2026", docId));
  };

  const upsertJudgingQr = async () => {
    const exhibitId = (judgingQrForm.exhibitId || "").trim();
    if (!exhibitId) {
      alert("Select an exhibit.");
      return;
    }

    const code = (judgingQrForm.code || "").trim() || randomCode(16);

    await setDoc(
      doc(firestore, "judgingQrCodes", code),
      {
        exhibitId,
        active: judgingQrForm.active !== false,
        updatedAt: serverTimestamp(),
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    setJudgingQrForm((p) => ({ ...p, code }));
    alert(`Saved QR code.\n\nScan URL:\n${window.location.origin}/judging/scan/${code}`);
  };

  const upsertAwardAssignment = async () => {
    const awardId = (assignmentForm.awardId || "").trim();
    const exhibitId = (assignmentForm.exhibitId || "").trim();
    const judgeEmail = normalizeEmail(assignmentForm.judgeEmail);
    const stopOrderNum = Number(assignmentForm.stopOrder);

    if (!awardId || !exhibitId || !judgeEmail) {
      alert("Fill: award, exhibit, judge.");
      return;
    }
    if (!Number.isFinite(stopOrderNum) || stopOrderNum < 1) {
      alert("Stop # must be a number starting at 1.");
      return;
    }

    await setDoc(
      doc(firestore, "awardAssignments", awardId, "exhibits", exhibitId),
      {
        awardId,
        awardLabel: awardLabelById(awardId),
        exhibitId,
        judgeEmail,
        stopOrder: stopOrderNum,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setAssignmentForm((p) => ({ ...p, stopOrder: "" }));
    alert("Saved award assignment.");
  };

  const moveVolunteerBetweenEvents = async () => {
    if (!moveFromEvent || !moveToEvent || !moveVolunteer) {
      alert("Select a source slot, a volunteer, and a destination slot.");
      return;
    }

    if (moveFromEvent.docId === moveToEvent.docId) {
      alert("Source and destination are the same.");
      return;
    }

    const fromVols = Array.isArray(moveFromEvent.volunteers) ? [...moveFromEvent.volunteers] : [];
    const toVols = Array.isArray(moveToEvent.volunteers) ? [...moveToEvent.volunteers] : [];

    if (toVols.some((v) => v.uid === moveVolunteer.uid)) {
      alert("That volunteer is already in the destination slot.");
      return;
    }

    if (moveToEvent.maxCapacity && toVols.length >= moveToEvent.maxCapacity) {
      alert("Destination slot is full.");
      return;
    }

    const nextFrom = fromVols.filter((v) => v.uid !== moveVolunteer.uid);
    const nextTo = [...toVols, moveVolunteer];

    await updateDoc(doc(firestore, "volunteerEvents2026", moveFromEvent.docId), {
      volunteers: nextFrom,
      updatedAt: serverTimestamp(),
    });
    await updateDoc(doc(firestore, "volunteerEvents2026", moveToEvent.docId), {
      volunteers: nextTo,
      updatedAt: serverTimestamp(),
    });

    setMoveVolunteerUid("");
  };

  const upsertJudge = async () => {
    const email = normalizeEmail(judgeForm.email);
    if (!email) {
      alert("Enter an email.");
      return;
    }

    await setDoc(
      doc(firestore, "judgesAllowlist", email),
      {
        email,
        displayName: (judgeForm.displayName || "").trim(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setJudgeForm({ email: "", displayName: "" });
  };

  const removeJudge = async (emailOrDocId) => {
    if (!window.confirm(`Remove judge allowlist entry for "${emailOrDocId}"?`)) return;
    await deleteDoc(doc(firestore, "judgesAllowlist", emailOrDocId));
  };

  const moveScheduleRowWithinAward = (awardId, exhibitId, dir) => {
    setScheduleRows((prev) => {
      const group = prev.filter((r) => r.awardId === awardId);
      const others = prev.filter((r) => r.awardId !== awardId);
      const idx = group.findIndex((r) => r.exhibitId === exhibitId);
      const j = idx + dir;
      if (idx < 0 || j < 0 || j >= group.length) return prev;
      const nextGroup = [...group];
      const tmp = nextGroup[idx];
      nextGroup[idx] = nextGroup[j];
      nextGroup[j] = tmp;
      return [...others, ...nextGroup];
    });
  };

  const renumberScheduleToMatchOrder = (awardId) => {
    setScheduleRows((prev) => {
      const group = prev
        .filter((r) => r.awardId === awardId)
        .sort((a, b) => {
          const ax = typeof a.stopOrder === "number" ? a.stopOrder : 999999;
          const bx = typeof b.stopOrder === "number" ? b.stopOrder : 999999;
          return ax - bx;
        })
        .map((r, i) => ({ ...r, stopOrder: i + 1 }));
      const others = prev.filter((r) => r.awardId !== awardId);
      return [...others, ...group];
    });
  };

  const saveAllSchedule = async () => {
    if (scheduleRows.length === 0) {
      alert("Nothing to save.");
      return;
    }
    setScheduleSaving(true);
    try {
      const writes = scheduleRows.map((r, i) => {
        const stopOrder =
          Number.isFinite(Number(r.stopOrder)) && Number(r.stopOrder) >= 1
            ? Number(r.stopOrder)
            : i + 1;
        return setDoc(
          doc(firestore, "awardAssignments", r.awardId, "exhibits", r.exhibitId),
          { stopOrder, updatedAt: serverTimestamp() },
          { merge: true }
        );
      });
      await Promise.all(writes);
      alert("Saved schedule.");
    } finally {
      setScheduleSaving(false);
    }
  };

  return (
    <div className="w-screen mt-28 mb-20 flex justify-center">
      <div className="w-11/12 md:w-9/12 lg:w-7/12">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Admin</h1>
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-600">{user.email}</span>
                <button className="underline" onClick={handleSignOut}>
                  Sign out
                </button>
              </>
            ) : (
              <button
                onClick={handleSignIn}
                className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded"
              >
                Sign in with Google
              </button>
            )}
          </div>
        </div>

        {!user ? (
          <div className="p-5 border rounded bg-white shadow">
            <p>Please sign in to access admin tools.</p>
          </div>
        ) : !isAdmin ? (
          <div className="p-5 border rounded bg-red-50 text-red-900 shadow">
            <p className="font-semibold">Unauthorized</p>
            <p className="text-sm mt-1">
              Your account isn’t on the admin allowlist. If you need access, ask an admin to add
              you.
            </p>
          </div>
        ) : (
          <>
            <div className="flex gap-2 mb-6 flex-wrap">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-3 py-2 rounded border ${
                    activeTab === t.id ? "bg-blue-600 text-white border-blue-600" : "bg-white"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {activeTab === "volunteer-slots" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 border rounded bg-white shadow">
                  <h2 className="font-semibold mb-4">
                    {editingDocId ? "Edit volunteer slot" : "Create volunteer slot"}
                  </h2>

                  <div className="grid grid-cols-1 gap-3">
                    <label className="text-sm">
                      Name
                      <input
                        className="mt-1 w-full border rounded p-2"
                        value={eventForm.name}
                        onChange={(e) => setEventForm((p) => ({ ...p, name: e.target.value }))}
                        placeholder="WasteNot Volunteering"
                      />
                    </label>
                    <label className="text-sm">
                      Date
                      <input
                        className="mt-1 w-full border rounded p-2"
                        value={eventForm.date}
                        onChange={(e) => setEventForm((p) => ({ ...p, date: e.target.value }))}
                        placeholder="2026-04-10"
                      />
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <label className="text-sm">
                        Start time
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={eventForm.startTime}
                          onChange={(e) =>
                            setEventForm((p) => ({ ...p, startTime: e.target.value }))
                          }
                          placeholder="09:00"
                        />
                      </label>
                      <label className="text-sm">
                        End time
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={eventForm.endTime}
                          onChange={(e) =>
                            setEventForm((p) => ({ ...p, endTime: e.target.value }))
                          }
                          placeholder="11:00"
                        />
                      </label>
                    </div>
                    <label className="text-sm">
                      Display time (optional)
                      <input
                        className="mt-1 w-full border rounded p-2"
                        value={eventForm.time}
                        onChange={(e) => setEventForm((p) => ({ ...p, time: e.target.value }))}
                        placeholder="9am - 11am"
                      />
                    </label>
                    <label className="text-sm">
                      Max capacity (optional)
                      <input
                        className="mt-1 w-full border rounded p-2"
                        value={eventForm.maxCapacity}
                        onChange={(e) =>
                          setEventForm((p) => ({ ...p, maxCapacity: e.target.value }))
                        }
                        placeholder="10"
                        inputMode="numeric"
                      />
                    </label>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={upsertVolunteerEvent}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      {editingDocId ? "Save" : "Create"}
                    </button>
                    <button onClick={resetEventForm} className="px-4 py-2 border rounded">
                      Reset
                    </button>
                  </div>

                  {editingDocId && (
                    <p className="text-xs text-gray-600 mt-3">
                      Note: Editing a slot does not change its internal identifier.
                    </p>
                  )}

                  <div className="border-t mt-6 pt-4">
                    <h3 className="font-semibold mb-3">Add volunteer to a slot</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <label className="text-sm">
                        Slot
                        <select
                          className="mt-1 w-full border rounded p-2"
                          value={volunteerAdd.slotDocId}
                          onChange={(e) =>
                            setVolunteerAdd((p) => ({ ...p, slotDocId: e.target.value }))
                          }
                        >
                          <option value="">Select…</option>
                          {events.map((evt) => (
                            <option key={evt.docId} value={evt.docId}>
                              {evt.name} · {evt.date} ·{" "}
                              {evt.time || `${evt.startTime}-${evt.endTime}`}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="text-sm">
                        Volunteer email
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={volunteerAdd.email}
                          onChange={(e) =>
                            setVolunteerAdd((p) => ({ ...p, email: e.target.value }))
                          }
                          placeholder="someone@illinois.edu"
                        />
                      </label>
                      <label className="text-sm">
                        Volunteer name (optional)
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={volunteerAdd.name}
                          onChange={(e) =>
                            setVolunteerAdd((p) => ({ ...p, name: e.target.value }))
                          }
                          placeholder="First Last"
                        />
                      </label>
                      <label className="text-sm">
                        Volunteer UID (optional)
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={volunteerAdd.uid}
                          onChange={(e) => setVolunteerAdd((p) => ({ ...p, uid: e.target.value }))}
                          placeholder="If blank, defaults to email"
                        />
                      </label>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={addVolunteerToSlot}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                      >
                        Add volunteer
                      </button>
                      <button
                        onClick={() =>
                          setVolunteerAdd((p) => ({ ...p, email: "", name: "", uid: "" }))
                        }
                        className="px-4 py-2 border rounded"
                      >
                        Clear
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">
                      Note: if the volunteer hasn’t signed in yet, use their email as UID. If they
                      later sign in, they’ll get a different Firebase UID—so treat this as “manual
                      roster”, not a strict identity system.
                    </p>
                  </div>
                </div>

                <div className="p-5 border rounded bg-white shadow">
                  <h2 className="font-semibold mb-4">Existing slots</h2>
                  {loadingEvents ? (
                    <p>Loading…</p>
                  ) : events.length === 0 ? (
                    <p className="text-sm text-gray-600">No slots yet.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {events.map((evt) => (
                        <div key={evt.docId} className="border rounded p-3">
                          <div className="flex justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold truncate">{evt.name || evt.docId}</p>
                              <p className="text-sm text-gray-700">
                                {evt.date} {evt.time ? `· ${evt.time}` : `· ${evt.startTime}-${evt.endTime}`}
                              </p>
                              <p className="text-sm text-gray-700">
                                Volunteers: {(evt.volunteers || []).length}
                                {evt.maxCapacity ? ` / ${evt.maxCapacity}` : ""}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <button
                                onClick={() => startEditEvent(evt)}
                                className="px-3 py-1 border rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeVolunteerEvent(evt.docId)}
                                className="px-3 py-1 border rounded text-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          {(evt.volunteers || []).length > 0 && (
                            <div className="mt-3">
                              <p className="text-sm font-semibold mb-1">Volunteers</p>
                              <div className="flex flex-col gap-2">
                                {(evt.volunteers || []).map((v) => (
                                  <div
                                    key={v.uid}
                                    className="flex items-center justify-between gap-3 border rounded p-2 bg-gray-50"
                                  >
                                    <div className="min-w-0">
                                      <p className="text-sm truncate">
                                        {v.name || v.email || v.uid}
                                      </p>
                                      <p className="text-xs text-gray-600 truncate">
                                        {v.email} · {v.uid}
                                      </p>
                                    </div>
                                    <button
                                      onClick={() => removeVolunteerFromSlot(evt.docId, v.uid)}
                                      className="px-3 py-1 border rounded text-red-700 shrink-0"
                                    >
                                      Remove
                                    </button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "volunteer-reassign" && (
              <div className="p-5 border rounded bg-white shadow">
                <h2 className="font-semibold mb-4">Move a volunteer between slots</h2>
                <p className="text-sm text-gray-700 mb-4">
                  This only works for volunteers who already appear in a slot (since we store their
                  `uid` in the slot doc).
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <label className="text-sm">
                    From slot
                    <select
                      className="mt-1 w-full border rounded p-2"
                      value={moveFromDocId}
                      onChange={(e) => {
                        setMoveFromDocId(e.target.value);
                        setMoveVolunteerUid("");
                      }}
                    >
                      <option value="">Select…</option>
                      {events.map((evt) => (
                        <option key={evt.docId} value={evt.docId}>
                          {evt.name} · {evt.date} · {evt.time || `${evt.startTime}-${evt.endTime}`}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label className="text-sm">
                    To slot
                    <select
                      className="mt-1 w-full border rounded p-2"
                      value={moveToDocId}
                      onChange={(e) => setMoveToDocId(e.target.value)}
                    >
                      <option value="">Select…</option>
                      {events.map((evt) => (
                        <option key={evt.docId} value={evt.docId}>
                          {evt.name} · {evt.date} · {evt.time || `${evt.startTime}-${evt.endTime}`}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="mt-4">
                  <label className="text-sm">
                    Volunteer
                    <select
                      className="mt-1 w-full border rounded p-2"
                      value={moveVolunteerUid}
                      onChange={(e) => setMoveVolunteerUid(e.target.value)}
                      disabled={!moveFromEvent || (moveFromEvent.volunteers || []).length === 0}
                    >
                      <option value="">
                        {!moveFromEvent
                          ? "Select a source slot first…"
                          : (moveFromEvent.volunteers || []).length === 0
                            ? "No volunteers in this slot"
                            : "Select…"}
                      </option>
                      {(moveFromEvent?.volunteers || []).map((v) => (
                        <option key={v.uid} value={v.uid}>
                          {v.name || v.email || v.uid}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={moveVolunteerBetweenEvents}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                  >
                    Move volunteer
                  </button>
                  {moveVolunteer && (
                    <div className="text-sm text-gray-700 flex items-center">
                      Moving <span className="font-semibold mx-1">{moveVolunteer.email}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "exhibits" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 border rounded bg-white shadow">
                  <h2 className="font-semibold mb-4">
                    {editingExhibitDocId ? "Edit exhibit" : "Create exhibit"}
                  </h2>

                  <div className="grid grid-cols-1 gap-3">
                    <label className="text-sm">
                      Exhibit Name
                      <input
                        className="mt-1 w-full border rounded p-2"
                        value={exhibitForm.exhibitName}
                        onChange={(e) =>
                          setExhibitForm((p) => ({ ...p, exhibitName: e.target.value }))
                        }
                      />
                    </label>
                    <label className="text-sm">
                      Awards for this exhibit
                      <select
                        className="mt-1 w-full border rounded p-2"
                        multiple
                        value={Array.isArray(exhibitForm.awardIds) ? exhibitForm.awardIds : []}
                        onChange={(e) => {
                          const next = Array.from(e.target.selectedOptions).map((o) => o.value);
                          setExhibitForm((p) => ({ ...p, awardIds: next }));
                        }}
                      >
                        {AWARDS.map((a) => (
                          <option key={a.id} value={a.id}>
                            {a.label}
                          </option>
                        ))}
                      </select>
                      <p className="text-xs text-gray-600 mt-1">
                        Hold Cmd/Ctrl to select multiple.
                      </p>
                    </label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="text-sm">
                        Exhibit Building
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={exhibitForm.exhibitBuilding}
                          onChange={(e) =>
                            setExhibitForm((p) => ({ ...p, exhibitBuilding: e.target.value }))
                          }
                        />
                      </label>
                      <label className="text-sm">
                        Location
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={exhibitForm.location}
                          onChange={(e) =>
                            setExhibitForm((p) => ({ ...p, location: e.target.value }))
                          }
                        />
                      </label>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="text-sm">
                        Status
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={exhibitForm.status}
                          onChange={(e) => setExhibitForm((p) => ({ ...p, status: e.target.value }))}
                          placeholder="Accepted / Pending / ..."
                        />
                      </label>
                      <label className="text-sm">
                        Timestamp (optional)
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={exhibitForm.timestamp}
                          onChange={(e) =>
                            setExhibitForm((p) => ({ ...p, timestamp: e.target.value }))
                          }
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="text-sm">
                        Lead Exhibitor NetID
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={exhibitForm.leadExhibitorNetId}
                          onChange={(e) =>
                            setExhibitForm((p) => ({ ...p, leadExhibitorNetId: e.target.value }))
                          }
                        />
                      </label>
                      <label className="text-sm">
                        Lead Exhibitor Email
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={exhibitForm.emailAddress}
                          onChange={(e) =>
                            setExhibitForm((p) => ({ ...p, emailAddress: e.target.value }))
                          }
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="text-sm">
                        Lead First Name
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={exhibitForm.leadExhibitorFirstName}
                          onChange={(e) =>
                            setExhibitForm((p) => ({ ...p, leadExhibitorFirstName: e.target.value }))
                          }
                        />
                      </label>
                      <label className="text-sm">
                        Lead Last Name
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={exhibitForm.leadExhibitorLastName}
                          onChange={(e) =>
                            setExhibitForm((p) => ({ ...p, leadExhibitorLastName: e.target.value }))
                          }
                        />
                      </label>
                    </div>

                    <label className="text-sm">
                      Exhibit Notes (optional)
                      <textarea
                        className="mt-1 w-full border rounded p-2"
                        rows={3}
                        value={exhibitForm.exhibitNotes}
                        onChange={(e) =>
                          setExhibitForm((p) => ({ ...p, exhibitNotes: e.target.value }))
                        }
                      />
                    </label>

                    <label className="text-sm">
                      Comprehensive Exhibit Description (optional)
                      <textarea
                        className="mt-1 w-full border rounded p-2"
                        rows={4}
                        value={exhibitForm.comprehensiveExhibitDescription}
                        onChange={(e) =>
                          setExhibitForm((p) => ({
                            ...p,
                            comprehensiveExhibitDescription: e.target.value,
                          }))
                        }
                      />
                    </label>

                    <label className="text-sm">
                      Exhibit Description for Visitor&apos;s Guide (optional)
                      <textarea
                        className="mt-1 w-full border rounded p-2"
                        rows={3}
                        value={exhibitForm.visitorsGuideDescription}
                        onChange={(e) =>
                          setExhibitForm((p) => ({ ...p, visitorsGuideDescription: e.target.value }))
                        }
                      />
                    </label>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <label className="text-sm">
                        Intended Audience (optional)
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={exhibitForm.intendedAudience}
                          onChange={(e) =>
                            setExhibitForm((p) => ({ ...p, intendedAudience: e.target.value }))
                          }
                        />
                      </label>
                      <label className="text-sm">
                        Sustainability? (optional)
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={exhibitForm.sustainability}
                          onChange={(e) =>
                            setExhibitForm((p) => ({ ...p, sustainability: e.target.value }))
                          }
                          placeholder="Yes/No/..."
                        />
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <label className="text-sm">
                        Exhibit Tag 1
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={exhibitForm.exhibitTag1}
                          onChange={(e) =>
                            setExhibitForm((p) => ({ ...p, exhibitTag1: e.target.value }))
                          }
                        />
                      </label>
                      <label className="text-sm">
                        Exhibit Tag 2
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={exhibitForm.exhibitTag2}
                          onChange={(e) =>
                            setExhibitForm((p) => ({ ...p, exhibitTag2: e.target.value }))
                          }
                        />
                      </label>
                      <label className="text-sm">
                        Exhibit Tag 3
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={exhibitForm.exhibitTag3}
                          onChange={(e) =>
                            setExhibitForm((p) => ({ ...p, exhibitTag3: e.target.value }))
                          }
                        />
                      </label>
                    </div>

                    <label className="text-sm">
                      Additional fields (JSON, optional)
                      <textarea
                        className="mt-1 w-full border rounded p-2 font-mono text-xs"
                        rows={6}
                        value={exhibitForm.additionalJson}
                        onChange={(e) =>
                          setExhibitForm((p) => ({ ...p, additionalJson: e.target.value }))
                        }
                        placeholder='{"Advisor Email Address":"...","How many tables?":2}'
                      />
                    </label>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={upsertExhibit}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      {editingExhibitDocId ? "Save" : "Create"}
                    </button>
                    <button onClick={resetExhibitForm} className="px-4 py-2 border rounded">
                      Reset
                    </button>
                  </div>
                  {editingExhibitDocId && (
                    <p className="text-xs text-gray-600 mt-3">
                      Note: Editing an exhibit does not change its internal identifier.
                    </p>
                  )}
                </div>

                <div className="p-5 border rounded bg-white shadow">
                  <h2 className="font-semibold mb-4">Existing exhibits</h2>
                  {loadingExhibits ? (
                    <p>Loading…</p>
                  ) : exhibits.length === 0 ? (
                    <p className="text-sm text-gray-600">No exhibits yet.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {exhibits.map((ex) => (
                        <div key={ex.docId} className="border rounded p-3">
                          <div className="flex justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold truncate">
                                {ex.exhibitName || ex.docId}
                              </p>
                              <p className="text-sm text-gray-700">
                                {ex.exhibitBuilding ? `${ex.exhibitBuilding}` : ""}
                                {ex.location ? ` · ${ex.location}` : ""}
                              </p>
                              {ex.emailAddress && (
                                <p className="text-xs text-gray-600 truncate">{ex.emailAddress}</p>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <button
                                onClick={() => startEditExhibit(ex)}
                                className="px-3 py-1 border rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeExhibit(ex.docId)}
                                className="px-3 py-1 border rounded text-red-700"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "judges" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 border rounded bg-white shadow">
                  <h2 className="font-semibold mb-4">Private judging QR codes</h2>
                  <p className="text-sm text-gray-700 mb-4">
                    Create a QR code for an exhibit. Judges and exhibitors use the same QR.
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    <label className="text-sm">
                      Exhibit
                      <select
                        className="mt-1 w-full border rounded p-2"
                        value={judgingQrForm.exhibitId}
                        onChange={(e) =>
                          setJudgingQrForm((p) => ({ ...p, exhibitId: e.target.value }))
                        }
                      >
                        <option value="">Select…</option>
                        {exhibits.map((ex) => (
                          <option key={ex.docId} value={ex.docId}>
                            {ex.exhibitName || ex.docId}
                            {ex.location ? ` · ${ex.location}` : ""}
                          </option>
                        ))}
                      </select>
                    </label>
                    <label className="text-sm">
                      Code (optional)
                      <input
                        className="mt-1 w-full border rounded p-2 font-mono"
                        value={judgingQrForm.code}
                        onChange={(e) => setJudgingQrForm((p) => ({ ...p, code: e.target.value }))}
                        placeholder="Leave blank to generate"
                      />
                    </label>
                    <label className="text-sm flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={judgingQrForm.active !== false}
                        onChange={(e) =>
                          setJudgingQrForm((p) => ({ ...p, active: e.target.checked }))
                        }
                      />
                      Active
                    </label>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={upsertJudgingQr}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      Save QR code
                    </button>
                    <button
                      onClick={() => setJudgingQrForm({ exhibitId: "", code: "", active: true })}
                      className="px-4 py-2 border rounded"
                    >
                      Reset
                    </button>
                  </div>

                  {judgingQrForm.code && (
                    <p className="text-xs text-gray-600 mt-3 break-all">
                      Scan URL:{" "}
                      <code>{typeof window !== "undefined" ? window.location.origin : ""}/judging/scan/{judgingQrForm.code}</code>
                    </p>
                  )}
                </div>

                <div className="p-5 border rounded bg-white shadow">
                  <h2 className="font-semibold mb-4">Schedule editor</h2>
                  <p className="text-sm text-gray-700 mb-4">
                    Pick a judge, then adjust their single, ordered list of stops (across all awards).
                  </p>

                  <div className="grid grid-cols-1 gap-3">
                    <label className="text-sm">
                      Judge
                      <select
                        className="mt-1 w-full border rounded p-2"
                        value={scheduleJudgeEmail}
                        onChange={(e) => setScheduleJudgeEmail(e.target.value)}
                      >
                        <option value="">Select…</option>
                        {judges.map((j) => (
                          <option key={j.docId} value={j.email || j.docId}>
                            {j.displayName ? `${j.displayName} · ${j.email || j.docId}` : j.email || j.docId}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="border-t mt-5 pt-4">
                    <h3 className="font-semibold mb-3">Add stop for this judge</h3>
                    <div className="grid grid-cols-1 gap-3">
                      <label className="text-sm">
                        Award
                        <select
                          className="mt-1 w-full border rounded p-2"
                          value={assignmentForm.awardId}
                          onChange={(e) =>
                            setAssignmentForm((p) => ({ ...p, awardId: e.target.value, exhibitId: "" }))
                          }
                        >
                          <option value="">Select…</option>
                          {AWARDS.map((a) => (
                            <option key={a.id} value={a.id}>
                              {a.label}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="text-sm">
                        Exhibit
                        <select
                          className="mt-1 w-full border rounded p-2"
                          value={assignmentForm.exhibitId}
                          onChange={(e) =>
                            setAssignmentForm((p) => ({ ...p, exhibitId: e.target.value }))
                          }
                        >
                          <option value="">Select…</option>
                          {exhibits
                            .filter((ex) => {
                              if (!assignmentForm.awardId) return true;
                              const set = new Set(
                                (Array.isArray(ex.awardIds) ? ex.awardIds : [])
                                  .map((s) => String(s).trim())
                                  .filter(Boolean)
                              );
                              return set.has(assignmentForm.awardId);
                            })
                            .map((ex) => (
                              <option key={ex.docId} value={ex.docId}>
                                {ex.exhibitName || ex.docId}
                                {ex.location ? ` · ${ex.location}` : ""}
                              </option>
                            ))}
                        </select>
                      </label>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          if (!scheduleJudgeEmail) {
                            alert("Select a judge first.");
                            return;
                          }
                          setAssignmentForm((p) => ({ ...p, judgeEmail: scheduleJudgeEmail, stopOrder: "" }));
                          return upsertAwardAssignment();
                        }}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                      >
                        Save stop
                      </button>
                      <button
                        onClick={() =>
                          setAssignmentForm({
                            awardId: "",
                            exhibitId: "",
                            judgeEmail: scheduleJudgeEmail || "",
                            stopOrder: "",
                          })
                        }
                        className="px-4 py-2 border rounded"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    {!scheduleJudgeEmail ? (
                      <p className="text-sm text-gray-600">Select a judge to view their schedule.</p>
                    ) : scheduleRows.length === 0 ? (
                      <p className="text-sm text-gray-600">No scheduled exhibits found for this judge.</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {scheduleRows
                          .slice()
                          .sort((a, b) => {
                            const ax = typeof a.stopOrder === "number" ? a.stopOrder : 999999;
                            const bx = typeof b.stopOrder === "number" ? b.stopOrder : 999999;
                            return ax - bx;
                          })
                          .map((r, idx, ordered) => {
                            const ex = exhibitByDocId.get(r.exhibitId);
                            const color = awardColorById(r.awardId);
                            return (
                              <div
                                key={`${r.awardId}__${r.exhibitId}`}
                                className={`border rounded p-3 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-l-4 ${color.accent}`}
                              >
                                <div className="min-w-0 flex items-center gap-2">
                                  <span
                                    className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold ${color.badge}`}
                                  >
                                    {awardLabelById(r.awardId)}
                                  </span>
                                  <div className="min-w-0">
                                    <p className="font-semibold truncate">
                                      {ex?.exhibitName || r.exhibitId}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                      {ex?.location ? `Location: ${ex.location}` : ""}
                                    </p>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 justify-between sm:justify-end">
                                  <div className="flex items-center gap-2">
                                    <button
                                      className="px-2 py-1 border rounded bg-white hover:bg-gray-100 text-sm"
                                      onClick={() => moveScheduleRowWithinAward(r.awardId, r.exhibitId, -1)}
                                      disabled={idx === 0}
                                    >
                                      ↑
                                    </button>
                                    <button
                                      className="px-2 py-1 border rounded bg-white hover:bg-gray-100 text-sm"
                                      onClick={() => moveScheduleRowWithinAward(r.awardId, r.exhibitId, +1)}
                                      disabled={idx === ordered.length - 1}
                                    >
                                      ↓
                                    </button>
                                  </div>

                                  <span className="text-sm font-semibold whitespace-nowrap">
                                    Stop #{idx + 1}
                                  </span>
                                </div>
                              </div>
                            );
                          })}

                        <div className="flex justify-end mt-2">
                          <button
                            className="px-4 py-2 border rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400 text-sm"
                            onClick={saveAllSchedule}
                            disabled={scheduleSaving}
                          >
                            {scheduleSaving ? "Saving…" : "Save all"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="p-5 border rounded bg-white shadow">
                  <h2 className="font-semibold mb-4">Add / update judge</h2>
                  <div className="grid grid-cols-1 gap-3">
                    <label className="text-sm">
                      Email
                      <input
                        className="mt-1 w-full border rounded p-2"
                        value={judgeForm.email}
                        onChange={(e) => setJudgeForm((p) => ({ ...p, email: e.target.value }))}
                        placeholder="judge@illinois.edu"
                      />
                    </label>
                    <label className="text-sm">
                      Display name (optional)
                      <input
                        className="mt-1 w-full border rounded p-2"
                        value={judgeForm.displayName}
                        onChange={(e) =>
                          setJudgeForm((p) => ({ ...p, displayName: e.target.value }))
                        }
                        placeholder="Jane Doe"
                      />
                    </label>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={upsertJudge}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      Save judge
                    </button>
                    <button
                      onClick={() => setJudgeForm({ email: "", displayName: "" })}
                      className="px-4 py-2 border rounded"
                    >
                      Reset
                    </button>
                  </div>
                </div>

                <div className="p-5 border rounded bg-white shadow">
                  <h2 className="font-semibold mb-4">Allowlisted judges</h2>
                  {judges.length === 0 ? (
                    <p className="text-sm text-gray-600">No judges yet.</p>
                  ) : (
                    <div className="flex flex-col gap-3">
                      {judges.map((j) => (
                        <div key={j.docId} className="border rounded p-3">
                          <div className="flex justify-between gap-3">
                            <div className="min-w-0">
                              <p className="font-semibold truncate">{j.displayName || j.email || j.docId}</p>
                              <p className="text-sm text-gray-700">{j.email || j.docId}</p>
                            </div>
                            <div className="flex flex-col gap-2 shrink-0">
                              <button
                                onClick={() =>
                                  setJudgeForm({
                                    email: j.email || j.docId,
                                    displayName: j.displayName || "",
                                  })
                                }
                                className="px-3 py-1 border rounded"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => removeJudge(j.docId)}
                                className="px-3 py-1 border rounded text-red-700"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

