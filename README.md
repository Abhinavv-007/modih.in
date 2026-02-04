# modih.in

A production-ready Next.js + Firebase stack for a political satire/parody meme platform.

## Stack
- Next.js (App Router) + TypeScript
- TailwindCSS
- Firebase Auth, Firestore, Storage, Cloud Functions
- Optional: App Check + reCAPTCHA

## Local setup
1. Install dependencies:
   `npm install`
2. Create `.env.local` (use `.env.example` as a template):

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
NEXT_PUBLIC_FIREBASE_APP_ID=...
NEXT_PUBLIC_FIREBASE_APPCHECK_KEY=...
```

3. Run dev server:
   `npm run dev`

## Firebase
- Firestore rules: `firebase/firestore.rules`
- Storage rules: `firebase/storage.rules`
- Functions: `functions/src/index.ts`

## Moderation workflow
- Status values: `PENDING`, `APPROVED`, `REJECTED`.
- All submissions start `PENDING`.
- Public feed only shows `APPROVED` posts with `publishedAt <= now`.
- Moderation delay message: “Under review — can take up to ~6 hours.”

## Security
- User submissions treated as untrusted.
- Embeds validated server-side via oEmbed and rendered in a sandboxed iframe.
- No scraping. Only official share/oEmbed sources.

## Deploy
- Use Firebase Hosting or App Hosting for Next.js.
- Functions deploy separately.
