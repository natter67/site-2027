import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { BrowserQRCodeReader } from "@zxing/browser";
import { useAuth } from "../../providers/Auth";
import { scanExhibitLocalWeb } from "@utilities/scanExhibitLocalWeb";

const LOGIN_HREF = `/login?next=${encodeURIComponent("/vv?t=camera")}`;
const LEADERBOARD_HREF = "/vv?t=leaderboard";

async function getVideoStream(preferUserFacing) {
  const md = navigator.mediaDevices;
  if (!md?.getUserMedia) throw new Error("unsupported");
  const facing = preferUserFacing ? "user" : "environment";
  const attempts = [
    { video: { facingMode: facing } },
    { video: { facingMode: { ideal: facing } } },
    { video: true },
  ];
  let lastErr;
  for (const c of attempts) {
    try {
      return await md.getUserMedia(c);
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

function cameraErrKind(e) {
  const n = e?.name || "";
  if (n === "NotAllowedError" || n === "PermissionDeniedError") return "denied";
  return "failed";
}

export default function CameraScan() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const videoRef = useRef(null);
  const controlsRef = useRef(null);
  const readerRef = useRef(null);
  const scanLockRef = useRef(false);
  const mountedRef = useRef(true);
  const autoStartOnceRef = useRef(false);
  const userRef = useRef(user);
  userRef.current = user;

  const [facingUser, setFacingUser] = useState(false);
  const [activeStream, setActiveStream] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  const [openingCamera, setOpeningCamera] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const stopScanner = useCallback(() => {
    try {
      controlsRef.current?.stop();
    } catch {
      /* ignore */
    }
    controlsRef.current = null;
    try {
      readerRef.current?.reset();
    } catch {
      /* ignore */
    }
    readerRef.current = null;
  }, []);

  const stopStream = useCallback((stream) => {
    stream?.getTracks().forEach((t) => {
      try {
        t.stop();
      } catch {
        /* ignore */
      }
    });
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      stopScanner();
    };
  }, [stopScanner]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !activeStream) return;
    v.srcObject = activeStream;
    v.setAttribute("playsinline", "true");
    void v.play().catch(() => {});
  }, [activeStream]);

  const handleEnableCamera = useCallback(async () => {
    setOpeningCamera(true);
    try {
      const stream = await getVideoStream(facingUser);
      if (!mountedRef.current) {
        stopStream(stream);
        return;
      }
      setCameraError(null);
      setActiveStream((prev) => {
        stopStream(prev);
        return stream;
      });
    } catch (e) {
      console.error(e);
      if (mountedRef.current) setCameraError(cameraErrKind(e));
    } finally {
      if (mountedRef.current) setOpeningCamera(false);
    }
  }, [facingUser, stopStream]);

  useEffect(() => {
    if (authLoading || !user) return;
    if (activeStream || cameraError) return;
    if (autoStartOnceRef.current) return;
    autoStartOnceRef.current = true;
    void handleEnableCamera();
  }, [authLoading, user, activeStream, cameraError, handleEnableCamera]);

  const handleFlipCamera = useCallback(async () => {
    const next = !facingUser;
    setFacingUser(next);
    if (!activeStream) return;
    stopScanner();
    stopStream(activeStream);
    setActiveStream(null);
    setOpeningCamera(true);
    try {
      const stream = await getVideoStream(next);
      if (!mountedRef.current) {
        stopStream(stream);
        return;
      }
      setCameraError(null);
      setActiveStream(stream);
    } catch (e) {
      console.error(e);
      if (mountedRef.current) setCameraError(cameraErrKind(e));
    } finally {
      if (mountedRef.current) setOpeningCamera(false);
    }
  }, [activeStream, facingUser, stopScanner, stopStream]);

  useLayoutEffect(() => {
    if (authLoading || !user || !activeStream) {
      stopScanner();
      return undefined;
    }

    const video = videoRef.current;
    if (!video) return undefined;

    const reader = new BrowserQRCodeReader();
    readerRef.current = reader;
    let cancelled = false;

    (async () => {
      try {
        const controls = await reader.decodeFromStream(
          activeStream,
          video,
          (result, _err, inner) => {
            if (!mountedRef.current || scanLockRef.current || cancelled || !result) return;
            scanLockRef.current = true;
            try {
              inner.stop();
            } catch {
              /* ignore */
            }
            controlsRef.current = null;

            void (async () => {
              const scanResult = await scanExhibitLocalWeb(userRef.current?.uid, result.getText());
              if (!mountedRef.current) return;
              if (!scanResult.ok) {
                window.alert(
                  scanResult.reason === "duplicate"
                    ? "Previously Visited\n\nYou've already visited this exhibit!"
                    : scanResult.reason === "unauthenticated"
                      ? "Not Logged In\n\nPlease log in first."
                      : "Invalid exhibit\n\nPlease try again."
                );
                router.push(LEADERBOARD_HREF);
                return;
              }
              setSuccessOpen(true);
            })();
          }
        );
        if (!cancelled) controlsRef.current = controls;
        else {
          try {
            controls.stop();
          } catch {
            /* ignore */
          }
        }
      } catch (e) {
        console.error(e);
        if (!mountedRef.current || cancelled) return;
        setActiveStream((prev) => {
          stopStream(prev);
          return null;
        });
        setCameraError("failed");
      }
    })();

    return () => {
      cancelled = true;
      stopScanner();
    };
  }, [authLoading, user, activeStream, stopScanner, stopStream]);

  useEffect(
    () => () => {
      stopStream(activeStream);
    },
    [activeStream, stopStream]
  );

  const resetCameraSession = useCallback(() => {
    stopScanner();
    stopStream(activeStream);
    setActiveStream(null);
    setCameraError(null);
    setOpeningCamera(false);
  }, [activeStream, stopScanner, stopStream]);

  if (authLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center px-4">
        <p className="font-montserrat text-gray-600">Loading…</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-6 text-center">
        <p className="font-montserrat text-lg text-gray-800">
          Log in to scan exhibit QR codes and earn points.
        </p>
        <Link
          href={LOGIN_HREF}
          className="rounded bg-blue-600 px-6 py-3 font-montserrat font-semibold text-white hover:bg-blue-700"
        >
          Log in
        </Link>
      </div>
    );
  }

  if (!activeStream && !cameraError) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center bg-slate-900 px-6 py-10">
        <div className="max-w-sm rounded-2xl border border-slate-600 bg-slate-800 p-8 text-center shadow-lg">
          <h2 className="font-montserrat text-xl font-bold text-white">Camera</h2>
          <p className="mt-3 text-sm text-slate-400">
            {openingCamera
              ? "Starting camera…"
              : "Allow camera access to scan exhibit QR codes."}
          </p>
          <button
            type="button"
            disabled={openingCamera}
            className="mt-6 w-full rounded-lg bg-orange-500 py-3 font-montserrat font-semibold text-white disabled:opacity-60"
            onClick={() => void handleEnableCamera()}
          >
            {openingCamera ? "…" : "Allow camera access"}
          </button>
        </div>
      </div>
    );
  }

  if (!activeStream && cameraError) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center bg-slate-900 px-6 py-10">
        <div className="max-w-sm rounded-2xl border border-slate-600 bg-slate-800 p-8 text-center shadow-lg">
          <h2 className="font-montserrat text-xl font-bold text-white">Camera</h2>
          <p className="mt-3 text-sm text-slate-400">
            {openingCamera
              ? "…"
              : cameraError === "denied"
                ? "Permission denied. Check browser settings and try again."
                : "Could not open the camera."}
          </p>
          <button
            type="button"
            disabled={openingCamera}
            className="mt-6 w-full rounded-lg bg-orange-500 py-3 font-montserrat font-semibold text-white disabled:opacity-60"
            onClick={() => void handleEnableCamera()}
          >
            {openingCamera ? "…" : "Try again"}
          </button>
          <button
            type="button"
            className="mt-3 w-full text-sm text-slate-400 underline"
            onClick={resetCameraSession}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex min-h-[calc(100vh-8rem)] flex-col bg-black">
      <video
        ref={videoRef}
        className="pointer-events-none absolute inset-0 h-full w-full object-cover"
        muted
        playsInline
        autoPlay
      />
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        {/* This is the QR code outline */}
        <div className="h-80 w-80 sm:h-96 sm:w-96 rounded-2xl border-2 border-white/60 -mt-10" />
      </div>
      <div className="pointer-events-auto relative z-10 mt-auto flex justify-center pb-28">
        <button
          type="button"
          className="flex h-14 w-14 items-center justify-center rounded-full bg-white/95 shadow-lg"
          onClick={() => void handleFlipCamera()}
          aria-label="Flip camera"
        >
          <span className="text-xl text-gray-800">↻</span>
        </button>
      </div>

      {successOpen ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="scan-success-title"
        >
          <div className="w-full max-w-sm rounded-3xl border border-orange-500/30 bg-slate-800 p-9 text-center shadow-lg">
            <h2 id="scan-success-title" className="font-montserrat text-xl font-bold text-white">
              Exhibit scanned
            </h2>
            <p className="mt-2 font-montserrat text-4xl font-extrabold text-orange-500">+10</p>
            <button
              type="button"
              className="mt-7 w-full rounded-xl bg-orange-500 py-3 font-montserrat font-bold text-white"
              onClick={() => {
                setSuccessOpen(false);
                router.push(LEADERBOARD_HREF);
              }}
            >
              Continue to leaderboard
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
