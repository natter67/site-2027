import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { doc, firestore, onSnapshot } from "../utilities/firebaseApp";
import { useAuth } from "../providers/Auth";

function parseNameAndPoints(data) {
  const name = String(data?.name ?? "").trim();
  const rawPoints = data?.points;
  let points = null;
  if (typeof rawPoints === "number" && Number.isFinite(rawPoints)) {
    points = rawPoints;
  } else if (rawPoints != null && rawPoints !== "") {
    const n = Number(rawPoints);
    if (Number.isFinite(n)) points = n;
  }
  return { name, points };
}

export default function AccountPage() {
  const router = useRouter();
  const { user, loading: authLoading, signOut } = useAuth();
  const [profileName, setProfileName] = useState("");
  const [profilePoints, setProfilePoints] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.replace("/login?next=/account");
      return;
    }

    setProfileLoading(true);
    const userRef = doc(firestore, "users", user.uid);
    const unsubscribe = onSnapshot(
      userRef,
      (snap) => {
        if (!snap.exists()) {
          setProfileName("");
          setProfilePoints(null);
        } else {
          const { name, points } = parseNameAndPoints(snap.data() || {});
          setProfileName(name);
          setProfilePoints(points);
        }
        setProfileLoading(false);
      },
      (err) => {
        console.error(err);
        setProfileName("");
        setProfilePoints(null);
        setProfileLoading(false);
      }
    );

    return () => unsubscribe();
  }, [authLoading, user, router]);

  const displayName =
    profileName ||
    (user?.displayName ? String(user.displayName).trim() : "") ||
    "—";
  const email = user?.email || "—";
  const pointsDisplay =
    profileLoading ? "…" : profilePoints === null ? "0" : String(profilePoints);

  const handleSignOut = async () => {
    await signOut();
    router.replace("/");
  };

  if (authLoading || !user) {
    return (
      <div className="w-full min-w-0 max-w-[100vw] overflow-x-hidden mt-28 mb-20 flex justify-center px-3 sm:px-4">
        <p className="font-montserrat text-gray-600">Loading…</p>
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-[100vw] overflow-x-hidden mt-28 mb-20 flex justify-center px-3 sm:px-4">
      <div className="w-full sm:w-11/12 md:w-7/12 lg:w-5/12 min-w-0 max-w-xl">
        <div className="p-6 sm:p-8 border rounded bg-white shadow">
          <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-center">
            Account
          </h1>

          <dl className="mt-8 space-y-4">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Name
              </dt>
              <dd className="mt-1 text-base font-montserrat">
                {profileLoading ? "Loading…" : displayName}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Email
              </dt>
              <dd className="mt-1 text-base font-montserrat break-all">{email}</dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                Points
              </dt>
              <dd className="mt-1 text-base font-montserrat">{pointsDisplay}</dd>
            </div>
          </dl>

          <button
            type="button"
            onClick={() => void handleSignOut()}
            className="mt-8 w-full px-4 py-3 border border-gray-300 rounded font-semibold font-montserrat hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
