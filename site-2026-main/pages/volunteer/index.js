import {
  auth,
  firestore,
  provider,
  collection,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  signInWithPopup,
  signOut,
} from "@utilities/firebase";

import React, { useState, useEffect } from "react";
import Content from "@/content";
import Button from "@/button";

export default function Volunteer() {
  const [user, setUser] = useState(null);
  const [volunteerEvents, setVolunteerEvents] = useState([]);
  const [requiredEventsSignedUp, setRequiredEventsSignedUp] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [eventEmails, setEventEmails] = useState({});
  const [allEventEmails, setAllEventEmails] = useState([]);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);

      if (firebaseUser) {
        const isAdminUser =
          firebaseUser.email === "tusharj2004@gmail.com" ||
          firebaseUser.email === "kpact2@illinois.edu" ||
          firebaseUser.email === "shaandoshi4@gmail.com" ||
          firebaseUser.email === "aliciak2@illinois.edu" ||
          firebaseUser.email === "azh4@illinois.edu" ||
          firebaseUser.email === "atsig2@illinois.edu" ||
          firebaseUser.email === "arryank2@illinois.edu";
        setIsAdmin(isAdminUser);
      } else {
        setIsAdmin(false);
      }
    });

    const fetchVolunteerEvents = async () => {
      const eventsRef = collection(firestore, "volunteerEvents");
      const snapshot = await getDocs(eventsRef);
      const events = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setVolunteerEvents(events);
    };

    fetchVolunteerEvents();
    return () => unsubscribe();
  }, []);

  const handleViewEventEmails = async (eventId) => {
    const eventRef = doc(firestore, "volunteerEvents", eventId);
    const eventDoc = await getDoc(eventRef);
    if (eventDoc.exists()) {
      const eventData = eventDoc.data();
      if (eventData.volunteers) {
        const emails = eventData.volunteers.map((v) => v.email);
        setEventEmails((prev) => ({ ...prev, [eventId]: emails }));
      }
    }
  };

  const fetchAllEventEmails = async () => {
    let allEmailsSet = new Set();

    for (const event of volunteerEvents) {
      const eventRef = doc(firestore, "volunteerEvents", event.id);
      const eventDoc = await getDoc(eventRef);
      if (eventDoc.exists()) {
        const eventData = eventDoc.data();
        if (eventData.volunteers) {
          eventData.volunteers.forEach((v) => {
            allEmailsSet.add(v.email);
          });
        }
      }
    }

    setAllEventEmails(Array.from(allEmailsSet));
  };

  const isUserSignedUp = (event) =>
    event.volunteers?.some((v) => v.uid === user?.uid);

  const isRequiredEventSignedUp = () => {
    const requiredEvents = [
      "Thursday Set Up",
      "Thursday Set Up 2",
      "Saturday Tear Down",
      "Saturday Tear Down 2",
    ];
    return volunteerEvents.some(
      (event) =>
        requiredEvents.includes(event.name) && isUserSignedUp(event)
    );
  };

  const handleSignUpOrUnsignUp = async (event) => {
    if (!user) {
      alert("Please sign in to volunteer.");
      return;
    }

    if (
      !isRequiredEventSignedUp() &&
      ![
        "Thursday Set Up",
        "Thursday Set Up 2",
        "Saturday Tear Down",
        "Saturday Tear Down 2",
      ].includes(event.name)
    ) {
      alert(
        "You must sign up for one required event before signing up for others."
      );
      return;
    }

    const eventRef = doc(firestore, "volunteerEvents", event.id);

    try {
      let updatedVolunteers = [...(event.volunteers || [])];

      if (isUserSignedUp(event)) {
        updatedVolunteers = updatedVolunteers.filter(
          (v) => v.uid !== user.uid
        );
      } else {
        if (
          event.maxCapacity &&
          updatedVolunteers.length >= event.maxCapacity
        ) {
          alert("Sorry, this event is full.");
          return;
        }

        updatedVolunteers.push({
          uid: user.uid,
          name: user.displayName || "",
          email: user.email || "",
        });
      }

      await updateDoc(eventRef, { volunteers: updatedVolunteers });

      setVolunteerEvents((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? { ...e, volunteers: updatedVolunteers }
            : e
        )
      );
    } catch (error) {
      console.error("Error updating sign up:", error);
      alert("Error signing up. Try again.");
    }
  };

  return (
    <div className="w-screen mt-32 mb-16 flex flex-col items-center">

      {/* HERO SECTION */}
      <div className="text-center max-w-5xl mx-auto px-4 mb-12">
        <h1 className="font-montserrat text-4xl font-bold mb-4">
          Volunteer Sign Ups are NOW OPEN!
        </h1>

        <p className="font-montserrat text-lg max-w-3xl mx-auto mb-6">
          Be a part of the biggest engineering event on campus –
          <span className="font-semibold"> Engineering Open House (EOH)</span>!
          Don’t miss this chance to be at the heart of innovation.
        </p>

        <div className="max-w-xl mx-auto mb-6 p-4 rounded-lg bg-yellow-50 shadow-sm">
          <p className="text-lg">
            <span className="font-bold">📅 Date:</span> April 10–11th
          </p>
          <p className="text-lg">
            <span className="font-bold">⏰ Time:</span> 8:00 AM – 5:00 PM
          </p>
          <p className="text-lg">
            <span className="font-bold">📍 Location:</span> Across the UIUC Engineering Campus
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2">🤝 Collaborative Volunteering</h3>
            <p>Meet and work with fellow engineers and innovators!</p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm">
            <h3 className="text-xl font-bold mb-2">🎓 No Experience Needed</h3>
            <p>No prior volunteering experience required.</p>
          </div>

          <div className="p-6 border rounded-lg shadow-sm bg-yellow-100">
            <h3 className="text-xl font-bold mb-2">👕 Free T-Shirt 🍪 & Snacks</h3>
            <p className="font-semibold">
              Enjoy snacks and take home an exclusive EOH T-shirt.
            </p>
          </div>
        </div>

        <div className="mt-6">
          Questions?{" "}
          <a
            href="mailto:eoh-hospitality@ec.illinois.edu"
            className="font-bold underline"
          >
            eoh-hospitality@ec.illinois.edu
          </a>
        </div>
      </div>


      {/* SIGN IN OR PORTAL */}
      {user ? (
        <div className="w-11/12 md:w-7/12">
          <h2 className="mb-4">
            Welcome{" "}
            {user.displayName
              ? user.displayName.split(" ")[0]
              : user.email.split("@")[0]}{" "}
            <button
              onClick={() => signOut(auth)}
              className="underline text-blue-600"
            >
              (Sign Out)
            </button>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {volunteerEvents.map((event) => (
              <div
                key={event.id}
                className="p-4 border rounded shadow text-center"
              >
                <h2 className="font-bold text-lg">{event.name}</h2>
                {event.time && <p><strong>{event.time}</strong></p>}
                <p>
                  {event.volunteers?.length || 0} /{" "}
                  {event.maxCapacity || "N/A"} Volunteers
                </p>

                <button
                  onClick={() => handleSignUpOrUnsignUp(event)}
                  className={`mt-2 px-4 py-2 rounded text-white ${
                    isUserSignedUp(event)
                      ? "bg-green-400"
                      : "bg-purple-500"
                  }`}
                >
                  {isUserSignedUp(event) ? "Unsign Up" : "Sign Up"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center">
          <p>Please sign in to volunteer</p>
          <button
            onClick={() => signInWithPopup(auth, provider)}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Sign In with Google
          </button>
        </div>
      )}
      {/* Required Sign Ups Yellow Box */}
<div className="mt-8 w-full max-w-3xl bg-yellow-50 border-l-4 border-yellow-400 text-yellow-900 p-6 rounded-xl shadow-md space-y-4">
  
  <div>
    <p className="font-semibold text-lg">📣 Required Sign Ups</p>
    <p className="text-sm mt-2">
      Please Slack, Text, or Email Hospitality Directors{" "}
      <strong>Divya</strong> (408-826-9656) or{" "}
      <strong>Mohannad</strong> (984-325-7002) with any questions!
    </p>
    <p className="text-sm mt-2">
      You are required to sign up for at least one day slot, AND a set up or tear-down slot.
    </p>
  </div>

  <div>
    <p className="font-semibold">📘 Volunteer Guide</p>
    <p className="text-sm mt-1">
      Make sure to read the guide before your shift.
      <br />
      <a
        href="https://docs.google.com/document/d/1kTTXVVkWIa97ATUofiHJ5s6RpGVXGTbLpIfqihlnYZo/edit?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        View Volunteer Guide →
      </a>
    </p>
  </div>

  <div>
    <p className="font-semibold">💬 Join the Slack</p>
    <p className="text-sm mt-1">
      Stay updated and ask questions in our Slack group.
      <br />
      <a
        href="https://join.slack.com/t/eohvolunteering2026/shared_invite/zt-3n582k8qd-dcb3Asc1e5U4pk_Dh7uiXw"
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 underline"
      >
        Join Slack →
      </a>
    </p>
  </div>

</div>

    </div>
  );
}