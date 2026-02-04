"use client";

import { useState } from "react";
import {
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInAnonymously,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthUser } from "@/lib/useAuthUser";

export function AuthLogin() {
  const { user, loading } = useAuthUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleEmailSignIn = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      setMessage("Signed in.");
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
      await signInWithPopup(auth, provider);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleAnonymous = async () => {
    setBusy(true);
    setError(null);
    try {
      await signInAnonymously(auth);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async () => {
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, email.trim());
      setMessage("Password reset email sent.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleVerify = async () => {
    if (!user) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await sendEmailVerification(user);
      setMessage("Verification email sent.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
      {loading ? (
        <p className="text-sm text-ink/60">Checking session...</p>
      ) : user ? (
        <div className="space-y-3">
          <p className="text-sm text-ink/70">Signed in as {user.email ?? "Anonymous"}</p>
          {!user.emailVerified && user.email && (
            <button
              type="button"
              onClick={handleVerify}
              className="rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold"
            >
              Send verification email
            </button>
          )}
          <button
            type="button"
            onClick={handleSignOut}
            className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper"
          >
            Sign out
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
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
            onClick={handleEmailSignIn}
            disabled={busy}
            className="rounded-full bg-ink px-4 py-3 text-sm font-semibold text-paper"
          >
            Sign in with Email
          </button>
          <button
            type="button"
            onClick={handleGoogle}
            disabled={busy}
            className="rounded-full border border-ink/20 px-4 py-3 text-sm font-semibold"
          >
            Continue with Google
          </button>
          <button
            type="button"
            onClick={handleAnonymous}
            disabled={busy}
            className="rounded-full border border-ink/20 px-4 py-3 text-sm font-semibold"
          >
            Continue as Guest
          </button>
          <button
            type="button"
            onClick={handleReset}
            disabled={busy || !email}
            className="text-left text-xs font-semibold text-accent"
          >
            Forgot password? Send reset email
          </button>
        </div>
      )}
      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      {message && <p className="mt-3 text-xs text-ink/60">{message}</p>}
    </div>
  );
}
