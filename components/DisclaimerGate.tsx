"use client";

import { useEffect, useState } from "react";

const STORAGE_KEY = "modih_disclaimer_ok";

export function DisclaimerGate() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    const accepted = window.localStorage.getItem(STORAGE_KEY) === "true";
    setIsOpen(!accepted);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink/70 px-6">
      <div className="max-w-lg rounded-3xl bg-paper p-8 shadow-glow">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-accent">Parody Disclaimer</p>
        <h2 className="mt-3 text-2xl font-display">Satire only. No affiliation.</h2>
        <p className="mt-4 text-sm text-ink/70">
          modih.in is a parody and political satire platform. Content is user generated, moderated,
          and should be interpreted as satire, commentary, or parody. If you do not agree, please exit.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => {
              window.location.href = "https://www.google.com";
            }}
            className="flex-1 rounded-full border border-ink/20 px-4 py-2 text-sm font-semibold"
          >
            Exit
          </button>
          <button
            type="button"
            onClick={() => {
              window.localStorage.setItem(STORAGE_KEY, "true");
              setIsOpen(false);
            }}
            className="flex-1 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper"
          >
            I Understand & Enter
          </button>
        </div>
      </div>
    </div>
  );
}
