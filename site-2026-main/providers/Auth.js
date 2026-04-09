import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  auth,
  firestore,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  doc,
  setDoc,
  serverTimestamp,
} from "../utilities/firebaseApp";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => {
      setUser(u || null);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const signIn = useCallback(async ({ email, password }) => {
    const safeEmail = String(email || "").trim();
    const safePassword = String(password || "");
    return await signInWithEmailAndPassword(auth, safeEmail, safePassword);
  }, []);

  const signUp = useCallback(async ({ email, password, name }) => {
    const safeEmail = String(email || "").trim();
    const safePassword = String(password || "");
    const safeName = String(name || "").trim();

    const userCredential = await createUserWithEmailAndPassword(auth, safeEmail, safePassword);
    const uid = userCredential.user?.uid;
    if (!uid) return userCredential;

    await setDoc(
      doc(firestore, "users", uid),
      {
        email: safeEmail,
        name: safeName,
        points: 0,
        createdAt: serverTimestamp(),
      },
      { merge: true }
    );

    return userCredential;
  }, []);

  const logout = useCallback(async () => {
    return await signOut(auth);
  }, []);

  const value = useMemo(
    () => ({
      user,
      loading,
      signIn,
      signUp,
      signOut: logout,
    }),
    [user, loading, signIn, signUp, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within <AuthProvider />");
  }
  return ctx;
}

