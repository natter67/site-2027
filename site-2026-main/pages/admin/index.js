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
import {
  pinSha256ForGroup,
  normalizeGroupId,
  coerceAssignmentStopOrder,
  awardAssignmentExhibitDocId,
} from "@utilities/judging";
import { parseJudgingScheduleCsv } from "@utilities/judgingCsv";
import { fetchStrapiExhibitsForJudging } from "@utilities/strapiExhibits";

const TABS = [
  { id: "volunteer-slots", label: "Volunteer Slots" },
  { id: "volunteer-reassign", label: "Volunteer Reassign" },
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

  // Judging — exhibitor URL helper (read-only picker)
  const [exhibitorLinkExhibitId, setExhibitorLinkExhibitId] = useState("");
  const [assignmentForm, setAssignmentForm] = useState({
    awardId: "",
    exhibitId: "",
    stopOrder: "",
    scheduledTime: "",
  });

  const [judgingGroups, setJudgingGroups] = useState([]);
  const [groupForm, setGroupForm] = useState({
    id: "",
    label: "",
    pin: "",
  });
  const [csvImportBusy, setCsvImportBusy] = useState(false);
  /** After parsing a CSV: rows to write + distinct group ids needing 4-digit PINs */
  const [csvPendingRows, setCsvPendingRows] = useState(null);
  const [csvPendingGroupIds, setCsvPendingGroupIds] = useState([]);
  const [csvPinByGroup, setCsvPinByGroup] = useState({});

  const [scheduleGroupId, setScheduleGroupId] = useState("");
  const [scheduleRows, setScheduleRows] = useState([]);
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
    const gid = normalizeGroupId(scheduleGroupId);
    if (!gid) {
      setScheduleRows([]);
      return;
    }

    const unsubs = [];
    let cancelled = false;

    for (const a of AWARDS) {
      const exhibitsRef = collection(firestore, "awardAssignments", a.id, "exhibits");
      const q = query(exhibitsRef, where("judgingGroupId", "==", gid));
      const unsub = onSnapshot(
        q,
        (snapshot) => {
          if (cancelled) return;
            const incoming = snapshot.docs.map((d) => {
            const data = d.data() || {};
            const stopOrderRaw = coerceAssignmentStopOrder(data);
            return {
              assignmentDocId: d.id,
              exhibitId: data.exhibitId || d.id,
              awardId: data.awardId || a.id,
              awardLabel: data.awardLabel || awardLabelById(data.awardId || a.id),
              judgeEmail: data.judgeEmail || "",
              judgingGroupId: data.judgingGroupId || gid,
              scheduledTime: typeof data.scheduledTime === "string" ? data.scheduledTime : "",
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
  }, [isAdmin, scheduleGroupId]);

  useEffect(() => {
    if (!isAdmin) return;
    const ref = collection(firestore, "judgingGroups");
    const unsub = onSnapshot(
      ref,
      (snapshot) => {
        setJudgingGroups(
          snapshot.docs
            .map((d) => ({ docId: d.id, ...d.data() }))
            .sort((a, b) => a.docId.localeCompare(b.docId))
        );
      },
      (err) => console.error(err)
    );
    return () => unsub();
  }, [isAdmin]);

  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    setLoadingExhibits(true);
    fetchStrapiExhibitsForJudging()
      .then((rows) => {
        if (!cancelled) setExhibits(rows);
      })
      .catch((err) => {
        console.error(err);
        if (!cancelled) setExhibits([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingExhibits(false);
      });
    return () => {
      cancelled = true;
    };
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

  const upsertAwardAssignment = async () => {
    const awardId = (assignmentForm.awardId || "").trim();
    const exhibitId = (assignmentForm.exhibitId || "").trim();
    const judgingGroupId = normalizeGroupId(scheduleGroupId);

    if (!awardId || !exhibitId || !judgingGroupId) {
      alert("Select a judging group, award, and exhibit.");
      return;
    }

    let stopOrderNum = Number(assignmentForm.stopOrder);
    if (!Number.isFinite(stopOrderNum) || stopOrderNum < 1) {
      const inGroup = scheduleRows.filter(
        (r) => normalizeGroupId(r.judgingGroupId) === judgingGroupId
      );
      const maxVisit = inGroup.reduce(
        (m, r) => Math.max(m, coerceAssignmentStopOrder(r) ?? 0),
        0
      );
      stopOrderNum = maxVisit + 1;
    }

    const scheduledTime = (assignmentForm.scheduledTime || "").trim();

    const assignmentDocId = awardAssignmentExhibitDocId(judgingGroupId, exhibitId);
    const compositeRef = doc(firestore, "awardAssignments", awardId, "exhibits", assignmentDocId);
    const legacyRef = doc(firestore, "awardAssignments", awardId, "exhibits", exhibitId);

    const payload = {
      awardId,
      awardLabel: awardLabelById(awardId),
      exhibitId,
      judgingGroupId,
      stopOrder: stopOrderNum,
      ...(scheduledTime ? { scheduledTime } : {}),
      updatedAt: serverTimestamp(),
    };

    const [legacySnap, compositeSnap] = await Promise.all([getDoc(legacyRef), getDoc(compositeRef)]);

    if (compositeSnap.exists()) {
      await setDoc(compositeRef, payload, { merge: true });
    } else if (legacySnap.exists()) {
      const leg = legacySnap.data() || {};
      if (normalizeGroupId(leg.judgingGroupId) === judgingGroupId) {
        await setDoc(compositeRef, payload, { merge: true });
        if (legacyRef.id !== compositeRef.id) await deleteDoc(legacyRef);
      } else {
        await setDoc(compositeRef, payload, { merge: true });
      }
    } else {
      await setDoc(compositeRef, payload, { merge: true });
    }

    setAssignmentForm((p) => ({ ...p, stopOrder: "", scheduledTime: "" }));
    alert("Saved stop for this group.");
  };

  const upsertJudgingGroup = async () => {
    const id = normalizeGroupId(groupForm.id);
    if (!id) {
      alert("Enter a group id (e.g. 1 or north-a).");
      return;
    }
    const pin = (groupForm.pin || "").trim();
    let pinSha256 = "";
    if (pin) {
      pinSha256 = await pinSha256ForGroup(id, pin);
    } else {
      const snap = await getDoc(doc(firestore, "judgingGroups", id));
      pinSha256 = (snap.data()?.pinSha256 || "").trim();
      if (!pinSha256) {
        alert("Set a PIN when creating a group (or add one later with a new PIN).");
        return;
      }
    }

    await setDoc(
      doc(firestore, "judgingGroups", id),
      {
        label: (groupForm.label || "").trim(),
        pinSha256,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    setGroupForm({ id: "", label: "", pin: "" });
    alert(`Saved group "${id}". Judges sign in at /judging/${encodeURIComponent(id)}`);
  };

  const removeJudgingGroup = async (id) => {
    if (!window.confirm(`Delete judging group "${id}"? Assignments are not deleted.`)) return;
    await deleteDoc(doc(firestore, "judgingGroups", id));
  };

  const clearCsvImportPending = () => {
    setCsvPendingRows(null);
    setCsvPendingGroupIds([]);
    setCsvPinByGroup({});
  };

  const parseJudgingCsvFile = async (file) => {
    if (!file) {
      alert("Choose a CSV file.");
      return;
    }
    const text = await file.text();
    const { rows, errors } = parseJudgingScheduleCsv(text, exhibits);
    if (errors.length) {
      alert(
        errors.slice(0, 12).join("\n") + (errors.length > 12 ? `\n…${errors.length - 12} more` : "")
      );
      return;
    }
    if (!rows.length) {
      alert("No rows to import.");
      return;
    }
    const groupIds = [
      ...new Set(rows.map((r) => normalizeGroupId(r.groupId)).filter(Boolean)),
    ].sort();
    if (!groupIds.length) {
      alert("CSV has no group IDs.");
      return;
    }
    const initialPins = {};
    for (const g of groupIds) initialPins[g] = "";
    setCsvPendingRows(rows);
    setCsvPendingGroupIds(groupIds);
    setCsvPinByGroup(initialPins);
  };

  const commitJudgingCsvImport = async () => {
    if (!csvPendingRows?.length) return;
    for (const g of csvPendingGroupIds) {
      const pin = String(csvPinByGroup[g] ?? "").trim();
      if (!/^\d{4}$/.test(pin)) {
        alert(`Group "${g}": enter a 4-digit PIN (numbers only).`);
        return;
      }
    }
    const rowCount = csvPendingRows.length;
    const groupCount = csvPendingGroupIds.length;
    if (
      !window.confirm(
        `Save ${groupCount} group PIN(s) and import ${rowCount} assignment row(s) into Firestore?`
      )
    ) {
      return;
    }
    setCsvImportBusy(true);
    try {
      for (const g of csvPendingGroupIds) {
        const pin = csvPinByGroup[g];
        const pinSha256 = await pinSha256ForGroup(g, pin);
        await setDoc(
          doc(firestore, "judgingGroups", g),
          {
            pinSha256,
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      for (const r of csvPendingRows) {
        const assignmentDocId = awardAssignmentExhibitDocId(r.groupId, r.exhibitId);
        await setDoc(
          doc(firestore, "awardAssignments", r.awardId, "exhibits", assignmentDocId),
          {
            awardId: r.awardId,
            awardLabel: r.awardLabel,
            exhibitId: r.exhibitId,
            judgingGroupId: r.groupId,
            stopOrder: r.stopOrder,
            scheduledTime: r.scheduledTime || "",
            updatedAt: serverTimestamp(),
          },
          { merge: true }
        );
      }
      clearCsvImportPending();
      alert(`Imported ${rowCount} assignment(s) and saved 4-digit PINs for ${groupCount} group(s).`);
    } catch (e) {
      console.error(e);
      alert("Import failed. Check the console and try again.");
    } finally {
      setCsvImportBusy(false);
    }
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

  /** Swap two visit slots for the selected group (visit = same stopOrder across awards / one physical stop). */
  const moveVisitInGroup = async (visitOrder, dir) => {
    const gid = normalizeGroupId(scheduleGroupId);
    if (!gid || typeof visitOrder !== "number") return;

    const orders = [
      ...new Set(
        scheduleRows
          .filter((r) => normalizeGroupId(r.judgingGroupId) === gid)
          .map((r) => coerceAssignmentStopOrder(r))
          .filter((n) => typeof n === "number" && n >= 1)
      ),
    ].sort((a, b) => a - b);

    const idx = orders.indexOf(visitOrder);
    const j = idx + dir;
    if (idx < 0 || j < 0 || j >= orders.length) return;

    const orderA = orders[idx];
    const orderB = orders[j];

    let toPersist = [];
    setScheduleRows((prev) => {
      const next = prev.map((r) => {
        if (normalizeGroupId(r.judgingGroupId) !== gid) return r;
        const o = coerceAssignmentStopOrder(r);
        if (o === orderA) return { ...r, stopOrder: orderB };
        if (o === orderB) return { ...r, stopOrder: orderA };
        return r;
      });
      toPersist = next.filter((r) => {
        if (normalizeGroupId(r.judgingGroupId) !== gid) return false;
        const oldR = prev.find(
          (p) =>
            p.awardId === r.awardId &&
            p.exhibitId === r.exhibitId &&
            normalizeGroupId(p.judgingGroupId) === normalizeGroupId(r.judgingGroupId)
        );
        return coerceAssignmentStopOrder(oldR) !== coerceAssignmentStopOrder(r);
      });
      return next;
    });

    if (!toPersist.length) return;
    try {
      await Promise.all(
        toPersist.map((r) =>
          updateDoc(
            doc(firestore, "awardAssignments", r.awardId, "exhibits", r.assignmentDocId || r.exhibitId),
            {
              stopOrder: coerceAssignmentStopOrder(r),
              updatedAt: serverTimestamp(),
            }
          )
        )
      );
    } catch (e) {
      console.error(e);
      alert("Could not save order. Try again.");
    }
  };

  const saveAllSchedule = async () => {
    if (scheduleRows.length === 0) {
      alert("Nothing to save.");
      return;
    }
    setScheduleSaving(true);
    try {
      const gidFallback = normalizeGroupId(scheduleGroupId);
      const byGroup = new Map();
      for (const r of scheduleRows) {
        const g = normalizeGroupId(r.judgingGroupId);
        if (!byGroup.has(g)) byGroup.set(g, []);
        byGroup.get(g).push(r);
      }
      const writes = [];
      for (const [g, list] of byGroup) {
        const visitOrders = [
          ...new Set(
            list
              .map((r) => coerceAssignmentStopOrder(r))
              .filter((n) => typeof n === "number" && n >= 1)
          ),
        ].sort((a, b) => a - b);
        visitOrders.forEach((oldOrder, idx) => {
          const newOrder = idx + 1;
          const atVisit = list.filter((r) => coerceAssignmentStopOrder(r) === oldOrder);
          for (const r of atVisit) {
            writes.push(
              setDoc(
                doc(
                  firestore,
                  "awardAssignments",
                  r.awardId,
                  "exhibits",
                  r.assignmentDocId || awardAssignmentExhibitDocId(g || gidFallback, r.exhibitId)
                ),
                {
                  stopOrder: newOrder,
                  scheduledTime: typeof r.scheduledTime === "string" ? r.scheduledTime : "",
                  judgingGroupId: g || gidFallback,
                  updatedAt: serverTimestamp(),
                },
                { merge: true }
              )
            );
          }
        });
      }
      await Promise.all(writes);
      alert("Saved schedule.");
    } finally {
      setScheduleSaving(false);
    }
  };

  return (
    <div className="w-full min-w-0 max-w-[100vw] overflow-x-hidden mt-28 mb-20 flex justify-center px-3 sm:px-4">
      <div className="w-full sm:w-11/12 md:w-9/12 lg:w-7/12 min-w-0 max-w-6xl">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between mb-6">
          <h1 className="text-xl sm:text-2xl font-bold">Admin</h1>
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

            {activeTab === "judges" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="p-5 border rounded bg-white shadow">
                  <h2 className="font-semibold mb-4">Exhibitor progress link</h2>
                  <p className="text-sm text-gray-700 mb-4">
                    Judges open <code className="text-xs">/judging/run</code> after their group PIN.
                    Exhibitors can use the link below (exhibit number matches Strapi and judging stops; no
                    login).
                  </p>

                  <label className="text-sm block">
                    Exhibit
                    <select
                      className="mt-1 w-full border rounded p-2"
                      value={exhibitorLinkExhibitId}
                      onChange={(e) => setExhibitorLinkExhibitId(e.target.value)}
                    >
                      <option value="">Select an exhibit…</option>
                      {exhibits.map((ex) => (
                        <option key={ex.docId} value={ex.docId}>
                          {ex.exhibitName || ex.docId}
                          {` · #${ex.exhibitNumber || ex.docId}`}
                          {ex.location ? ` · ${ex.location}` : ""}
                        </option>
                      ))}
                    </select>
                  </label>

                  {exhibitorLinkExhibitId ? (
                    <p className="text-sm text-gray-800 mt-4 leading-relaxed">
                      Exhibitor progress can be found at:{" "}
                      <code className="text-xs break-all block mt-2 p-2 bg-gray-50 rounded border">
                        {typeof window !== "undefined" ? window.location.origin : ""}/judging/exhibitor/
                        {exhibitorLinkExhibitId}
                      </code>
                    </p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-4">Choose an exhibit to show the shareable URL.</p>
                  )}
                </div>

                <div className="p-5 border rounded bg-white shadow">
                  <h2 className="font-semibold mb-4">Judging groups & PINs</h2>
                  <p className="text-sm text-gray-700 mb-4">
                    Each group signs in at{" "}
                    <code className="text-xs">
                      {typeof window !== "undefined" ? window.location.origin : ""}/judging/
                      &lt;group-id&gt;
                    </code>{" "}
                    with a PIN.
                  </p>
                  <div className="grid grid-cols-1 gap-3">
                    <label className="text-sm">
                      Group id (URL segment)
                      <input
                        className="mt-1 w-full border rounded p-2 font-mono"
                        value={groupForm.id}
                        onChange={(e) => setGroupForm((p) => ({ ...p, id: e.target.value }))}
                        placeholder="e.g. 1 or north-a"
                      />
                    </label>
                    <label className="text-sm">
                      Label (optional)
                      <input
                        className="mt-1 w-full border rounded p-2"
                        value={groupForm.label}
                        onChange={(e) => setGroupForm((p) => ({ ...p, label: e.target.value }))}
                      />
                    </label>
                    <label className="text-sm">
                      PIN {groupForm.id ? "(leave blank to keep existing)" : ""}
                      <input
                        type="password"
                        className="mt-1 w-full border rounded p-2"
                        value={groupForm.pin}
                        onChange={(e) => setGroupForm((p) => ({ ...p, pin: e.target.value }))}
                        autoComplete="new-password"
                      />
                    </label>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={upsertJudgingGroup}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      Save group
                    </button>
                    <button
                      onClick={() => setGroupForm({ id: "", label: "", pin: "" })}
                      className="px-4 py-2 border rounded"
                    >
                      Reset
                    </button>
                  </div>
                  <div className="border-t mt-4 pt-4">
                    <p className="text-sm font-semibold mb-2">Existing groups</p>
                    {judgingGroups.length === 0 ? (
                      <p className="text-sm text-gray-600">No groups yet.</p>
                    ) : (
                      <ul className="text-sm space-y-2">
                        {judgingGroups.map((g) => (
                          <li key={g.docId} className="flex justify-between gap-2 items-center">
                            <span>
                              <span className="font-mono font-semibold">{g.docId}</span>
                              {g.label ? <span className="text-gray-600"> — {g.label}</span> : null}
                            </span>
                            <button
                              type="button"
                              className="text-red-700 underline text-xs shrink-0"
                              onClick={() => removeJudgingGroup(g.docId)}
                            >
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="p-5 border rounded bg-white shadow lg:col-span-2">
                  <h2 className="font-semibold mb-4">Import schedule CSV</h2>
                  <p className="text-sm text-gray-700 mb-3">
                    <b>Column names</b>: Group #, Expected time, Award (may be multiple), Exhibit #.
                    <br />
                    <br />
                    In the award column use Design, Energy, and/or Outreach (e.g. Design Award is
                    fine too), comma-separated if more than one award is judged in the{" "}
                    <span className="font-medium">same visit</span> (one CSV row = one visit slot for
                    the group; every award listed shares that slot).
                    <br />
                    <br />
                    After you pick a file, enter a <span className="font-semibold">4-digit PIN</span>{" "}
                    for each judging group in the sheet. PINs are saved to Firestore when you confirm
                    import (judges use them at <code className="text-xs">/judging/&lt;group-id&gt;</code>
                    ).
                  </p>
                  <input
                    type="file"
                    accept=".csv,text/csv"
                    className="text-sm w-full max-w-md"
                    disabled={csvImportBusy}
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) parseJudgingCsvFile(f);
                      e.target.value = "";
                    }}
                  />
                  {csvPendingRows?.length ? (
                    <div className="mt-5 border rounded-lg border-amber-200 bg-amber-50/80 p-4">
                      <p className="text-sm font-semibold text-amber-950 mb-3">
                        Set 4-digit PINs ({csvPendingRows.length} assignment row(s),{" "}
                        {csvPendingGroupIds.length} group
                        {csvPendingGroupIds.length !== 1 ? "s" : ""})
                      </p>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                        {csvPendingGroupIds.map((gid) => (
                          <label key={gid} className="text-sm block min-w-0">
                            <span className="font-mono font-semibold text-gray-800">{gid}</span>
                            <input
                              type="password"
                              inputMode="numeric"
                              autoComplete="one-time-code"
                              pattern="[0-9]*"
                              maxLength={4}
                              className="mt-1 w-full border rounded p-2 font-mono tracking-widest"
                              placeholder="0000"
                              value={csvPinByGroup[gid] ?? ""}
                              onChange={(e) => {
                                const digits = e.target.value.replace(/\D/g, "").slice(0, 4);
                                setCsvPinByGroup((p) => ({ ...p, [gid]: digits }));
                              }}
                            />
                          </label>
                        ))}
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          type="button"
                          disabled={csvImportBusy}
                          onClick={() => commitJudgingCsvImport()}
                          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white rounded text-sm font-semibold"
                        >
                          Save PINs & import
                        </button>
                        <button
                          type="button"
                          disabled={csvImportBusy}
                          onClick={clearCsvImportPending}
                          className="px-4 py-2 border rounded text-sm"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : null}
                  {csvImportBusy ? <p className="text-sm text-gray-600 mt-2">Working…</p> : null}
                </div>

                <div className="p-5 border rounded bg-white shadow lg:col-span-2">
                  <h2 className="font-semibold mb-4">Schedule editor (by group)</h2>
                  <p className="text-sm text-gray-700 mb-4">
                    Pick a judging group, reorder stops, then Save all.
                  </p>

                  <div className="grid grid-cols-1 gap-3 max-w-md">
                    <label className="text-sm">
                      Judging group
                      <select
                        className="mt-1 w-full border rounded p-2"
                        value={scheduleGroupId}
                        onChange={(e) => setScheduleGroupId(normalizeGroupId(e.target.value))}
                      >
                        <option value="">Select…</option>
                        {judgingGroups.map((g) => (
                          <option key={g.docId} value={g.docId}>
                            {g.label ? `${g.label} · ` : ""}
                            {g.docId}
                          </option>
                        ))}
                      </select>
                    </label>
                  </div>

                  <div className="border-t mt-5 pt-4">
                    <h3 className="font-semibold mb-3">Add stop for selected group</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                          {awardsForSelectedAssignmentExhibit.length > 0
                            ? awardsForSelectedAssignmentExhibit.map((a) => (
                                <option key={a.id} value={a.id}>
                                  {a.label}
                                </option>
                              ))
                            : AWARDS.map((a) => (
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
                          {exhibits.map((ex) => (
                            <option key={ex.docId} value={ex.docId}>
                              {ex.exhibitName || ex.docId}
                              {` · #${ex.exhibitNumber || ex.docId}`}
                            </option>
                          ))}
                        </select>
                      </label>

                      <label className="text-sm">
                        Visit slot # (optional)
                        <input
                          type="number"
                          min={1}
                          className="mt-1 w-full border rounded p-2"
                          value={assignmentForm.stopOrder}
                          onChange={(e) =>
                            setAssignmentForm((p) => ({ ...p, stopOrder: e.target.value }))
                          }
                          placeholder="Auto next if empty"
                        />
                        <span className="block text-xs text-gray-500 mt-1">
                          Use the same number for another award + exhibit to make one mixed-award visit.
                        </span>
                      </label>
                      <label className="text-sm">
                        Expected time (optional)
                        <input
                          className="mt-1 w-full border rounded p-2"
                          value={assignmentForm.scheduledTime}
                          onChange={(e) =>
                            setAssignmentForm((p) => ({ ...p, scheduledTime: e.target.value }))
                          }
                          placeholder="10:15 AM"
                        />
                      </label>
                    </div>

                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => {
                          if (!scheduleGroupId) {
                            alert("Select a judging group first.");
                            return;
                          }
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
                            stopOrder: "",
                            scheduledTime: "",
                          })
                        }
                        className="px-4 py-2 border rounded"
                      >
                        Reset
                      </button>
                    </div>
                  </div>

                  <div className="mt-4">
                    {!scheduleGroupId ? (
                      <p className="text-sm text-gray-600">Select a group to view its schedule.</p>
                    ) : scheduleRows.length === 0 ? (
                      <p className="text-sm text-gray-600">No stops for this group yet.</p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Visit order</span> is one shared schedule for this group.
                          One row can include several awards if judges cover them in the same stop. ↑ / ↓ swaps
                          whole visits (every award at that slot moves together).
                        </p>
                        {(() => {
                          const gid = normalizeGroupId(scheduleGroupId);
                          const inGroup = scheduleRows.filter(
                            (r) => normalizeGroupId(r.judgingGroupId) === gid
                          );
                          const awardRank = (awardId) => {
                            const i = AWARDS.findIndex((x) => x.id === awardId);
                            return i >= 0 ? i : 99;
                          };
                          const visitOrders = [
                            ...new Set(
                              inGroup
                                .map((r) => coerceAssignmentStopOrder(r))
                                .filter((n) => typeof n === "number" && n >= 1)
                            ),
                          ].sort((a, b) => a - b);

                          return visitOrders.map((visitOrder, visitIdx) => {
                            const visitRows = inGroup.filter(
                              (r) => coerceAssignmentStopOrder(r) === visitOrder
                            );
                            const sortedByAward = [...visitRows].sort(
                              (a, b) => awardRank(a.awardId) - awardRank(b.awardId)
                            );
                            const exhibitIds = [...new Set(visitRows.map((r) => r.exhibitId))];
                            const exhibitConflict = exhibitIds.length > 1;
                            const primaryExhibitId = exhibitIds[0];
                            const ex = exhibitByDocId.get(primaryExhibitId);
                            const color = awardColorById(sortedByAward[0].awardId);
                            const timeVal =
                              visitRows.find((r) => (r.scheduledTime || "").trim())?.scheduledTime ?? "";

                            return (
                              <div
                                key={`visit-${visitOrder}`}
                                className={`border rounded p-3 bg-gray-50 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 border-l-4 ${color.accent}`}
                              >
                                <div className="min-w-0 flex flex-col gap-1.5">
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    {sortedByAward.map((r) => (
                                      <span
                                        key={r.assignmentDocId || `${r.awardId}-${r.exhibitId}-${r.judgingGroupId}`}
                                        className={`inline-flex items-center px-2 py-0.5 rounded border text-xs font-semibold ${awardColorById(r.awardId).badge}`}
                                      >
                                        {awardLabelById(r.awardId)}
                                      </span>
                                    ))}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-semibold truncate">
                                      {ex?.exhibitName || primaryExhibitId}
                                    </p>
                                    <p className="text-xs text-gray-600 truncate">
                                      {ex?.location ? `Location: ${ex.location}` : ""}
                                    </p>
                                    {exhibitConflict ? (
                                      <p className="text-xs text-amber-800 mt-1 font-medium">
                                        Warning: this visit number has different exhibit ids—fix data or re-save.
                                      </p>
                                    ) : null}
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-2 justify-between lg:justify-end">
                                  <label className="text-xs text-gray-600 flex items-center gap-1">
                                    Time
                                    <input
                                      className="border rounded p-1 w-28 text-sm"
                                      value={typeof timeVal === "string" ? timeVal : ""}
                                      onChange={(e) => {
                                        const v = e.target.value;
                                        setScheduleRows((prev) =>
                                          prev.map((row) =>
                                            normalizeGroupId(row.judgingGroupId) === gid &&
                                            coerceAssignmentStopOrder(row) === visitOrder
                                              ? { ...row, scheduledTime: v }
                                              : row
                                          )
                                        );
                                      }}
                                    />
                                  </label>
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      className="px-2 py-1 border rounded bg-white hover:bg-gray-100 text-sm"
                                      onClick={() => void moveVisitInGroup(visitOrder, -1)}
                                      disabled={visitIdx <= 0}
                                      title={
                                        visitIdx <= 0
                                          ? "Already first visit"
                                          : "Move this visit earlier in the group schedule"
                                      }
                                    >
                                      ↑
                                    </button>
                                    <button
                                      type="button"
                                      className="px-2 py-1 border rounded bg-white hover:bg-gray-100 text-sm"
                                      onClick={() => void moveVisitInGroup(visitOrder, +1)}
                                      disabled={visitIdx >= visitOrders.length - 1}
                                      title={
                                        visitIdx >= visitOrders.length - 1
                                          ? "Already last visit"
                                          : "Move this visit later in the group schedule"
                                      }
                                    >
                                      ↓
                                    </button>
                                  </div>

                                  <span className="text-right text-sm font-semibold whitespace-nowrap leading-tight">
                                    <span className="block">Visit {visitIdx + 1}</span>
                                    <span className="block text-xs font-normal text-gray-600">
                                      slot {visitOrder}
                                    </span>
                                  </span>
                                </div>
                              </div>
                            );
                          });
                        })()}

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
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

