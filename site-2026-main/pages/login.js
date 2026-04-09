import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "../providers/Auth";

function mapFirebaseAuthError(err) {
  const code = err?.code;
  if (code === "auth/email-already-in-use") return "This email is already in use";
  if (code === "auth/invalid-email") return "Invalid email address";
  if (code === "auth/weak-password") return "Password should be at least 6 characters";
  if (code === "auth/user-not-found") return "No account found with this email";
  if (code === "auth/wrong-password") return "Incorrect password";
  if (code === "auth/invalid-credential") return "Invalid email or password";
  if (typeof err?.message === "string" && err.message) {
    return err.message.replace("Firebase: ", "");
  }
  return "Something went wrong";
}

export default function LoginPage() {
  const router = useRouter();
  const { user, loading, signIn, signUp } = useAuth();

  const nextUrl = useMemo(() => {
    const raw = router.query?.next;
    if (!raw) return "/account";
    const val = Array.isArray(raw) ? raw[0] : raw;
    if (typeof val !== "string") return "/account";
    if (!val.startsWith("/")) return "/account";
    return val;
  }, [router.query]);

  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!loading && user) {
      router.replace(nextUrl);
    }
  }, [loading, user, router, nextUrl]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const safeEmail = String(email || "").trim();
    const safePassword = String(password || "");
    const safeName = String(name || "").trim();

    if (!safeEmail || !safePassword) {
      setError("Please enter both email and password");
      return;
    }
    if (isSignUp && !safeName) {
      setError("Please enter your name");
      return;
    }

    try {
      setSubmitting(true);
      if (isSignUp) {
        await signUp({ email: safeEmail, password: safePassword, name: safeName });
      } else {
        await signIn({ email: safeEmail, password: safePassword });
      }
      router.replace(nextUrl);
    } catch (err) {
      setError(mapFirebaseAuthError(err));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-w-0 max-w-[100vw] overflow-x-hidden mt-28 mb-20 flex justify-center px-3 sm:px-4">
      <div className="w-full sm:w-11/12 md:w-7/12 lg:w-5/12 min-w-0 max-w-xl">
        <div className="p-6 sm:p-8 border rounded bg-white shadow">
          <h1 className="text-2xl sm:text-3xl font-bold font-montserrat text-center">
            {isSignUp ? "Create Account" : "Welcome Back"}
          </h1>

          <p className="text-sm text-gray-600 text-center mt-2">
            {isSignUp ? "Sign up with your email and password." : "Sign in to your account."}
          </p>

          {error ? (
            <div className="mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-900">
              {error}
            </div>
          ) : null}

          <form onSubmit={onSubmit} className="mt-6 space-y-4">
            <label className="text-sm block">
              Email
              <input
                type="email"
                className="mt-1 w-full border rounded p-3"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
              />
            </label>

            <label className="text-sm block">
              Password
              <input
                type="password"
                className="mt-1 w-full border rounded p-3"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? "new-password" : "current-password"}
                placeholder="••••••••"
              />
            </label>

            {isSignUp ? (
              <label className="text-sm block">
                Full Name
                <input
                  type="text"
                  className="mt-1 w-full border rounded p-3"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                  placeholder="First Last"
                />
              </label>
            ) : null}

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded font-semibold"
            >
              {submitting ? "Working…" : isSignUp ? "Sign Up" : "Sign In"}
            </button>
          </form>

          <button
            type="button"
            className="w-full text-center mt-5 underline text-sm"
            onClick={() => {
              setIsSignUp((v) => !v);
              setError("");
            }}
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
}

