"use client";

import { useState } from "react";
import {
  sendEmailVerification,
  signOut,
  updatePassword,
  verifyBeforeUpdateEmail
} from "firebase/auth";
import { auth } from "@/lib/firebase";
import { useAuthUser } from "@/lib/useAuthUser";

export function AccountSettings() {
  const { user } = useAuthUser();
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

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

  const handleEmailChange = async () => {
    if (!user) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await verifyBeforeUpdateEmail(user, newEmail.trim());
      setMessage("Update email requested. Check your new inbox to confirm.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handlePasswordChange = async () => {
    if (!user) return;
    setBusy(true);
    setError(null);
    setMessage(null);
    try {
      await updatePassword(user, newPassword);
      setMessage("Password updated.");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const handleSignOut = async () => {
    await signOut(auth);
  };

  if (!user) {
    return (
      <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
        <p className="text-sm text-ink/60">Sign in to manage your account.</p>
      </div>
    );
  }

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
      <h3 className="text-lg font-semibold">Account settings</h3>
      <p className="mt-1 text-xs text-ink/60">Email verification, reset, and updates.</p>

      <div className="mt-4 grid gap-3">
        {!user.emailVerified && user.email && (
          <button
            type="button"
            onClick={handleVerify}
            disabled={busy}
            className="rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold"
          >
            Resend verification email
          </button>
        )}

        <div className="grid gap-2">
          <label className="text-xs font-semibold text-ink/60">Change email address</label>
          <input
            type="email"
            value={newEmail}
            onChange={(event) => setNewEmail(event.target.value)}
            placeholder="new@email.com"
            className="rounded-2xl border border-ink/15 px-4 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handleEmailChange}
            disabled={busy || !newEmail}
            className="rounded-full bg-ink px-4 py-2 text-xs font-semibold text-paper"
          >
            Update email
          </button>
        </div>

        <div className="grid gap-2">
          <label className="text-xs font-semibold text-ink/60">Change password</label>
          <input
            type="password"
            value={newPassword}
            onChange={(event) => setNewPassword(event.target.value)}
            placeholder="New password"
            className="rounded-2xl border border-ink/15 px-4 py-2 text-sm"
          />
          <button
            type="button"
            onClick={handlePasswordChange}
            disabled={busy || !newPassword}
            className="rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold"
          >
            Update password
          </button>
        </div>

        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-full border border-ink/20 px-4 py-2 text-xs font-semibold"
        >
          Sign out
        </button>
      </div>

      {error && <p className="mt-3 text-xs text-red-600">{error}</p>}
      {message && <p className="mt-3 text-xs text-ink/60">{message}</p>}
    </div>
  );
}
