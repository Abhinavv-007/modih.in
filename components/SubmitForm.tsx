"use client";

import { useState } from "react";

const uploadTypes = [
  { value: "UPLOAD_IMAGE", label: "Image" },
  { value: "UPLOAD_GIF", label: "GIF" },
  { value: "UPLOAD_VIDEO", label: "Video" },
  { value: "UPLOAD_AUDIO", label: "Audio" }
];

const embedTypes = [
  { value: "EMBED_YOUTUBE", label: "YouTube" },
  { value: "EMBED_TIKTOK", label: "TikTok" },
  { value: "EMBED_REDDIT", label: "Reddit" },
  { value: "EMBED_INSTAGRAM", label: "Instagram" },
  { value: "EMBED_FACEBOOK", label: "Facebook" }
];

export function SubmitForm() {
  const [mode, setMode] = useState<"upload" | "embed">("upload");
  const [contentKind, setContentKind] = useState(uploadTypes[0].value);

  return (
    <div className="rounded-3xl border border-ink/10 bg-white p-6 shadow-soft">
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">Submit a meme</h3>
        <p className="text-sm text-ink/60">
          Under review — can take up to ~6 hours. All submissions are moderated.
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => {
            setMode("upload");
            setContentKind(uploadTypes[0].value);
          }}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            mode === "upload" ? "bg-ink text-paper" : "border border-ink/20"
          }`}
        >
          Upload
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("embed");
            setContentKind(embedTypes[0].value);
          }}
          className={`rounded-full px-4 py-2 text-sm font-semibold ${
            mode === "embed" ? "bg-ink text-paper" : "border border-ink/20"
          }`}
        >
          Embed
        </button>
      </div>

      <div className="mt-6 grid gap-4">
        <label className="text-sm font-semibold">Content type</label>
        <div className="flex flex-wrap gap-2">
          {(mode === "upload" ? uploadTypes : embedTypes).map((type) => (
            <button
              key={type.value}
              type="button"
              onClick={() => setContentKind(type.value)}
              className={`rounded-full px-3 py-2 text-xs font-semibold ${
                contentKind === type.value
                  ? "bg-accent text-paper"
                  : "border border-ink/15 text-ink"
              }`}
            >
              {type.label}
            </button>
          ))}
        </div>

        {mode === "upload" ? (
          <label className="flex h-40 cursor-pointer items-center justify-center rounded-2xl border border-dashed border-ink/20 bg-ink/5 text-sm text-ink/60">
            Upload file (jpg/png/webp/gif/mp4/webm/mp3/wav)
            <input type="file" className="hidden" />
          </label>
        ) : (
          <div className="grid gap-2">
            <label className="text-sm font-semibold">Embed URL</label>
            <input
              type="url"
              placeholder="Paste a YouTube, TikTok, Reddit, Instagram, or Facebook link"
              className="rounded-2xl border border-ink/15 px-4 py-3 text-sm"
            />
          </div>
        )}

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Caption</label>
          <textarea
            className="min-h-[120px] rounded-2xl border border-ink/15 px-4 py-3 text-sm"
            placeholder="Write a caption that keeps it satirical, not hateful."
          />
        </div>

        <div className="grid gap-2">
          <label className="text-sm font-semibold">Tags</label>
          <input
            type="text"
            className="rounded-2xl border border-ink/15 px-4 py-3 text-sm"
            placeholder="policy, parody, economy"
          />
          <p className="text-xs text-ink/50">Separate tags with commas.</p>
        </div>

        <button className="rounded-full bg-ink px-5 py-3 text-sm font-semibold text-paper">
          Submit for review
        </button>
      </div>
    </div>
  );
}
