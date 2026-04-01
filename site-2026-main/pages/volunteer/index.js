import React, { useEffect, useState } from "react";
import {
  auth,
  provider,
  firestore,
  signInWithPopup,
  signOut,
  collection,
  getDocs,
  getDoc,
  doc,
  arrayUnion,
  updateDoc,
} from "utilities/firebase";
import { query, orderBy, writeBatch, onSnapshot } from "firebase/firestore";
import { isAdminEmail } from "@utilities/admin";
// import { seedEvents } from "@utilities/seedVolunteerSlots";

export default function VolunteerPortalReserved() {
  const [user, setUser] = useState(null);
  const [volunteerEvents, setVolunteerEvents] = useState([]);
  const [reservedEventIds, setReservedEventIds] = useState(new Set());

  /* ---------------- Admin State ---------------- */
  const [isAdmin, setIsAdmin] = useState(false);
  const [eventEmails, setEventEmails] = useState({});
  const [allEventEmails, setAllEventEmails] = useState([]);

  /* ---------------- Auth ---------------- */
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        setIsAdmin(isAdminEmail(firebaseUser.email));
      } else {
        setIsAdmin(false);
      }
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const eventsRef = collection(firestore, "volunteerEvents2026");
    const q = query(
      eventsRef,
      orderBy("date", "asc"),
      orderBy("startTime", "asc")
    );
    const unsubscribeEvents = onSnapshot(q, (snapshot) => {
      setVolunteerEvents(snapshot.docs.map((d) => ({
        docId: d.id,   // Firestore document name (incorrect)
        ...d.data()    // includes correct event.id
      })));
    });

    return () => unsubscribeEvents();
  }, []);

  /* ---------------- Fetch Events ---------------- */
  // useEffect(() => {
  //   const fetchVolunteerEvents = async () => {
  //     const eventsRef = collection(firestore, "volunteerEvents2026");
  //     const q = query(eventsRef, orderBy("date", "asc"), orderBy("startTime", "asc"));
  //     const snapshot = await getDocs(q);
  //     setVolunteerEvents(snapshot.docs.map((d) => ({
  //       docId: d.id,   // Firestore document name (incorrect)
  //       ...d.data()    // includes correct event.id
  //     })));
  //   };

  //   fetchVolunteerEvents();
  // }, []);

  /* ---------------- Reservation Logic ---------------- */
  const toggleReserve = (eventId) => {
    setReservedEventIds((prev) => {
      const next = new Set(prev);
      next.has(eventId) ? next.delete(eventId) : next.add(eventId);
      return next;
    });
  };

  const isRegistered = (event) => {
    return event.volunteers?.some((v) => v.uid === user?.uid);
  };

  const handleUnregister = async (event) => {
    if (!user) return;
    if (!window.confirm(`Unregister from "${event.name}"?`)) return;

    try {
      const updatedVolunteers = (event.volunteers || []).filter(
        (v) => v.uid !== user.uid
      );

      await updateDoc(
        doc(firestore, "volunteerEvents2026", event.docId),
        { volunteers: updatedVolunteers }
      );
    } catch (err) {
      console.error(err);
      alert("Failed to unregister. Please try again.");
    }
  };

  const reservedEvents = volunteerEvents.filter((e) => reservedEventIds.has(e.id));

  /* ---------------- Requirements ---------------- */
  const hasMinTwoSlots = reservedEvents.length >= 2;

  const hasSetupOrTearDown = reservedEvents.some((event) =>
    /set up|tear down/i.test(event.name)
  );

  // const canSubmit = hasMinTwoSlots && hasSetupOrTearDown;
  const canSubmit = true;

  /* ---------------- Submit ---------------- */
  const handleSubmit = async () => {
    if (!user || !canSubmit) return;

    try {
      const batch = writeBatch(firestore);

      for (const event of reservedEvents) {
        if (
          event.maxCapacity &&
          event.volunteers &&
          event.volunteers.length >= event.maxCapacity
        ) {
          alert(`"${event.name}" is already full. Please update your reservations.`);
          return;
        }

        const eventRef = doc(firestore, "volunteerEvents2026", event.docId);
        batch.update(eventRef, {
          volunteers: arrayUnion({
            uid: user.uid,
            name: user.displayName || "",
            email: user.email || "",
          }),
        });
      }

      await batch.commit();
      alert("Your volunteer schedule has been submitted!");
      setReservedEventIds(new Set());
    } catch (err) {
      console.error(err);
      alert("Something went wrong. Please try again.");
    }
  };

  /* ---------------- Admin Email Logic ---------------- */
  const handleViewEventEmails = async (event) => {
    const eventRef = doc(firestore, "volunteerEvents2026", event.docId);
    const eventDoc = await getDoc(eventRef);
    if (eventDoc.exists()) {
      const volunteers = eventDoc.data().volunteers || [];
      setEventEmails((prev) => ({
        ...prev,
        [event.id]: volunteers.map((v) => v.email),
      }));
    }
  };

  const fetchAllEventEmails = async () => {
    const emailSet = new Set();
    for (const event of volunteerEvents) {
      const snap = await getDoc(doc(firestore, "volunteerEvents2026", event.docId));
      if (snap.exists()) {
        (snap.data().volunteers || []).forEach((v) => emailSet.add(v.email));
      }
    }
    setAllEventEmails(Array.from(emailSet));
  };

  /* ---------------- Auth Actions ---------------- */
  const handleSignIn = async () => signInWithPopup(auth, provider);
  const handleSignOut = async () => signOut(auth);

  /* ---------------- Render ---------------- */
  return (
    <div className="w-screen mt-32 mb-16 flex justify-center items-center flex-col"> 
      <div className="bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 p-4 mb-6 mx-4 w-11/12 md:w-7/12 rounded shadow-md space-y-3"> 
        <div> 
          <p className="font-semibold">📣 Required Sign Ups</p> 
          <p className="text-sm mt-1">Please Slack, Text, or Email Hospitality Directors <strong>Divya</strong> (408-826-9656) or <strong>Mohannad</strong> (984-325-7002) with any questions!</p> 
          {/* <p className="text-sm mt-1">You are <strong>required</strong> to sign up for at least one day slot, <strong>AND</strong> a set up or tear-down slot.</p>  */}
        </div> 
        <div> 
          <p className="font-semibold">📘 Volunteer Guide</p> 
          <p className="text-sm mt-1"> Make sure to read the guide before your shift. <br /> <a href="https://docs.google.com/document/d/1kTTXVVkWIa97ATUofiHJ5s6RpGVXGTbLpIfqihlnYZo/edit?usp=sharing" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" > View Volunteer Guide → </a> </p> 
        </div> 
        <div> 
          <p className="font-semibold">💬 Join the Slack</p> 
          <p className="text-sm mt-1"> Stay updated and ask questions in our Slack group. <br /> <a href="https://join.slack.com/t/eohvolunteering2026/shared_invite/zt-3toepywds-prURsU8Buq1uOJ9Z285q1A" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline" > Join Slack → </a> </p> 
        </div> 
      </div>



      <div className="w-screen mt-4 mb-16 flex flex-col items-center">
        <h1 className="font-bold text-3xl mb-4">Volunteer Sign Up</h1>

        {/* Requirements */}
        {/* <div className="m-6 py-4 px-40 border rounded bg-gray-50 space-y-2">
          <p className="font-semibold">Requirements</p>
           <p className={hasSetupOrTearDown ? "text-green-600" : "text-gray-600"}>
            {hasSetupOrTearDown ? "✅" : "⬜"} At least 1 Set Up or Tear Down slot
          </p>
          <p className={hasMinTwoSlots ? "text-green-600" : "text-gray-600"}>
            {hasMinTwoSlots ? "✅" : "⬜"} At least 2 total slots
          </p>
        </div> */}

        <button
          disabled={!canSubmit}
          onClick={handleSubmit}
          className={`px-6 py-3 rounded text-white ${canSubmit
            ? "bg-green-600 hover:bg-green-700"
            : "bg-gray-400 cursor-not-allowed"
            }`}
        >
          Submit Volunteer Schedule
        </button>

        {!user ? (
          <div className="text-center">
            <p>Please sign in to reserve volunteer slots</p>
            <button
              onClick={handleSignIn}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded"
            >
              Sign In with Google
            </button>
          </div>
        ) : (
          <div className="w-11/12 md:w-7/12">
            <p className="mb-4">
              Welcome <strong>{user.displayName?.split(" ")[0]}</strong>
              <button onClick={handleSignOut} className="ml-2 underline text-blue-600">
                (Sign Out)
              </button>
            </p>

            {/* Events */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {volunteerEvents.map((event) => (
                <div key={event.id} className="p-4 border rounded shadow">
                  <h2 className="font-bold">{event.name}</h2>
                  {event.time && <p><strong>{event.time}</strong></p>}
                  {event.description && <p>{event.description}</p>}
                  <p>
                    Volunteers: {event.volunteers?.length || 0} / {event.maxCapacity || "N/A"}
                  </p>

                  {isRegistered(event) ? (
                    <button
                      onClick={() => handleUnregister(event)}
                      className="mt-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                    >
                      Unregister
                    </button>
                  ) : (
                    <button
                      onClick={() => toggleReserve(event.id)}
                      className={`mt-2 px-4 py-2 rounded text-white ${reservedEventIds.has(event.id)
                        ? "bg-[#a2d3c2] hover:bg-[#8fb8a8]"
                        : "bg-[#c578d6] hover:bg-[#a864b3]"
                        }`}
                    >
                      {reservedEventIds.has(event.id) ? "Unreserve" : "Reserve"}
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Admin Section */}
            {isAdmin && (
              <div className="mt-10">
                <h2 className="text-xl font-bold mb-4">Admin Section</h2>

                <div className="flex gap-4 mb-4">
                  <button
                    onClick={fetchAllEventEmails}
                    className="px-4 py-2 bg-[#c578d6] text-white rounded"
                  >
                    Fetch All Emails
                  </button>
                  {allEventEmails.length > 0 && (
                    <button
                      onClick={() => setAllEventEmails([])}
                      className="px-4 py-2 bg-gray-400 text-white rounded"
                    >
                      Close
                    </button>
                  )}
                </div>

                {allEventEmails.length > 0 && (
                  <textarea
                    className="w-full p-2 border rounded mb-6"
                    rows={4}
                    readOnly
                    value={allEventEmails.join(", ")}
                  />
                )}

                {volunteerEvents.map((event) => (
                  <div key={event.id} className="mb-4 p-4 border rounded bg-gray-100">
                    <h3 className="font-semibold mb-2">{event.name}</h3>
                    <button
                      onClick={() =>
                        eventEmails[event.id]
                          ? setEventEmails((prev) => {
                            const copy = { ...prev };
                            delete copy[event.id];
                            return copy;
                          })
                          : handleViewEventEmails(event)
                      }
                      className="px-4 py-2 bg-[#c578d6] text-white rounded"
                    >
                      {eventEmails[event.id] ? "Close Emails" : "View Emails"}
                    </button>

                    {eventEmails[event.id] && (
                      <textarea
                        className="w-full mt-2 p-2 border rounded"
                        rows={3}
                        readOnly
                        value={eventEmails[event.id].join(", ")}
                      />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
      );
}