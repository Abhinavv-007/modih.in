"use client";

import { useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  signInWithPopup
} from "firebase/auth";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { useAuthUser } from "@/lib/useAuthUser";

export function AuthSignup() {
  const { user } = useAuthUser();
  const [username, setUsername] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const createProfile = async (
    uid: string,
    userEmail?: string | null,
    displayName?: string | null
  ) => {
    const fallback =
      displayName?.split(" ")[0]?.toLowerCase() ||
      userEmail?.split("@")[0] ||
      `user${uid.slice(0, 6)}`;
    const normalizedUsername = (username.trim().toLowerCase() || fallback).replace(/[^a-z0-9_-]/g, "");
    await setDoc(
      doc(db, "users", uid),
      {
        username: normalizedUsername,
        avatarUrl: avatarUrl.trim() || null,
        bio: "",
        role: "user",
        email: userEmail ?? null,
        createdAt: serverTimestamp()
      },
      { merge: true }
    );
  };

  const handleSignup = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      if (username.trim().length < 3) {
        throw new Error("Username must be at least 3 characters.");
      }
      const credential = await createUserWithEmailAndPassword(auth, email.trim(), password);
      await createProfile(credential.user.uid, credential.user.email, credential.user.displayName);
      await sendEmailVerification(credential.user);
      setMessage("Account created. Check your email to verify.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleGoogle = async () => {
    setBusy(true);
    setError(null);
    try {
      const provider = new GoogleAuthProvider();
      const credential = await signInWithPopup(auth, provider);
      await createProfile(credential.user.uid, credential.user.email, credential.user.displayName);
      setMessage("Signed up with Google.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
      {user ? (
        <p className="text-sm text-ink/60">You are already signed in.</p>
      ) : (
        <div className="grid gap-4">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="rounded-2xl border border-ink/15 px-4 py-3"
          />
          <input
            type="url"
            placeholder="Avatar URL (optional)"
            value={avatarUrl}
            onChange={(event) => setAvatarUrl(event.target.value)}
            className="rounded-2xl border border-ink/15 px-4 py-3"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="rounded-2xl border border-ink/15 px-4 py-3"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="rounded-2xl border border-ink/15 px-4 py-3"
          />
          <button
            type="button"
            onClick={handleSignup}
            disabled={busy}
            className="rounded-full bg-ink px-4 py-3 text-sm font-semibold text-paper"
          >
            Create account
          </button>
          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="rounded-full border border-ink/20 px-4 py-3 text-sm font-semibold"
          >
            Sign up with Google
          </button>
        </div>
      )}
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      {message && <p className="mt-3 text-xs text-ink/60">{message}</p>}
    </div>
  );
}
