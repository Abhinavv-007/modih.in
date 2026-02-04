import { initializeApp, applicationDefault } from "firebase-admin/app";
import { getFirestore, FieldValue } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";
import { setGlobalOptions } from "firebase-functions/v2";
import { onCall, HttpsError } from "firebase-functions/v2/https";
import { onDocumentWritten } from "firebase-functions/v2/firestore";
import fetch from "node-fetch";

initializeApp({ credential: applicationDefault() });
setGlobalOptions({ region: "asia-south1" });

const db = getFirestore();
const storage = getStorage();

const LIKE_SHARDS = 20;
const VIEW_SHARDS = 20;
const VIEW_COOLDOWN_MS = 30 * 60 * 1000;

const allowedHosts = new Set([
  "www.youtube.com",
  "youtube.com",
  "youtu.be",
  "www.tiktok.com",
  "tiktok.com",
  "www.reddit.com",
  "reddit.com",
  "www.instagram.com",
  "instagram.com",
  "www.facebook.com",
  "facebook.com"
]);

function isAllowedUrl(urlString: string) {
  const url = new URL(urlString);
  return allowedHosts.has(url.hostname);
}

function extractYouTubeId(urlString: string) {
  const url = new URL(urlString);
  if (url.hostname === "youtu.be") {
    return url.pathname.replace("/", "");
  }
  if (url.pathname.startsWith("/shorts/")) {
    return url.pathname.split("/shorts/")[1]?.split("/")[0];
  }
  if (url.pathname === "/watch") {
    return url.searchParams.get("v");
  }
  return null;
}

function sanitizeIframeHtml(html: string) {
  const match = html.match(/<iframe[^>]+src=["']([^"']+)["'][^>]*>/i);
  if (!match) return null;
  const src = match[1];
  if (!isAllowedUrl(src)) return null;
  return `<iframe src="${src}" allowfullscreen></iframe>`;
}

async function fetchOEmbed(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`oEmbed request failed: ${response.status}`);
  }
  return response.json();
}

async function buildEmbed(sourceUrl: string, embedType: string) {
  if (!isAllowedUrl(sourceUrl)) {
    throw new HttpsError("invalid-argument", "Source URL not allowed");
  }

  if (embedType === "youtube") {
    const id = extractYouTubeId(sourceUrl);
    if (!id) throw new HttpsError("invalid-argument", "Invalid YouTube URL");
    return {
      canonicalUrl: `https://www.youtube.com/embed/${id}`,
      embedType: "youtube",
      sourceUrl
    };
  }

  if (embedType === "tiktok") {
    const oembed = await fetchOEmbed(`https://www.tiktok.com/oembed?url=${encodeURIComponent(sourceUrl)}`);
    return {
      embedType: "tiktok",
      sourceUrl,
      title: oembed.title,
      author: oembed.author_name,
      thumbnail: oembed.thumbnail_url,
      html: sanitizeIframeHtml(oembed.html)
    };
  }

  if (embedType === "reddit") {
    const oembed = await fetchOEmbed(`https://www.reddit.com/oembed?url=${encodeURIComponent(sourceUrl)}`);
    return {
      embedType: "reddit",
      sourceUrl,
      title: oembed.title,
      author: oembed.author_name,
      thumbnail: oembed.thumbnail_url,
      html: sanitizeIframeHtml(oembed.html)
    };
  }

  if (embedType === "instagram" || embedType === "facebook") {
    const token = process.env.META_OEMBED_ACCESS_TOKEN;
    if (!token) {
      throw new HttpsError("failed-precondition", "Missing Meta oEmbed access token");
    }
    const endpoint = embedType === "instagram" ? "instagram_oembed" : "oembed_post";
    const oembed = await fetchOEmbed(
      `https://graph.facebook.com/v19.0/${endpoint}?url=${encodeURIComponent(sourceUrl)}&access_token=${token}`
    );
    return {
      embedType,
      sourceUrl,
      title: oembed.title,
      author: oembed.author_name,
      thumbnail: oembed.thumbnail_url,
      html: sanitizeIframeHtml(oembed.html)
    };
  }

  throw new HttpsError("invalid-argument", "Unsupported embed type");
}

async function enforceRateLimit(uid: string, key: string, maxCount: number, windowMs: number) {
  const ref = db.collection("rateLimits").doc(uid);
  const now = Date.now();
  const windowKey = `${key}WindowStart`;
  const countKey = `${key}Count`;

  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    const data = snap.data() || {};
    const windowStart = typeof data[windowKey] === "number" ? data[windowKey] : 0;
    const count = typeof data[countKey] === "number" ? data[countKey] : 0;

    const reset = now - windowStart > windowMs;
    const nextWindowStart = reset ? now : windowStart;
    const nextCount = reset ? 1 : count + 1;

    if (!reset && count >= maxCount) {
      throw new HttpsError("resource-exhausted", `Rate limit exceeded for ${key}`);
    }

    tx.set(
      ref,
      {
        [windowKey]: nextWindowStart,
        [countKey]: nextCount,
        updatedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );
  });
}

async function ensureCounterDoc(postId: string) {
  const ref = db.collection("counters").doc(postId);
  await ref.set(
    { numShardsLikes: LIKE_SHARDS, numShardsViews: VIEW_SHARDS },
    { merge: true }
  );
}

export const prepareEmbed = onCall({ enforceAppCheck: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required");
  }

  const { sourceUrl, embedType } = request.data as { sourceUrl?: string; embedType?: string };
  if (!sourceUrl || !embedType) {
    throw new HttpsError("invalid-argument", "Missing sourceUrl or embedType");
  }

  return buildEmbed(sourceUrl, embedType);
});

export const submitPost = onCall({ enforceAppCheck: true }, async (request) => {
  if (!request.auth) {
    throw new HttpsError("unauthenticated", "Authentication required");
  }

  const {
    contentKind,
    caption,
    tags,
    media,
    embedType,
    sourceUrl
  } = request.data as {
    contentKind?: string;
    caption?: string;
    tags?: string[];
    media?: { storagePath?: string };
    embedType?: string;
    sourceUrl?: string;
  };

  if (!contentKind || !caption || !Array.isArray(tags)) {
    throw new HttpsError("invalid-argument", "Missing required fields");
  }

  const allowedKinds = new Set([
    "UPLOAD_IMAGE",
    "UPLOAD_GIF",
    "UPLOAD_VIDEO",
    "UPLOAD_AUDIO",
    "EMBED_YOUTUBE",
    "EMBED_TIKTOK",
    "EMBED_REDDIT",
    "EMBED_INSTAGRAM",
    "EMBED_FACEBOOK"
  ]);

  if (!allowedKinds.has(contentKind)) {
    throw new HttpsError("invalid-argument", "Invalid contentKind");
  }

  await enforceRateLimit(request.auth.uid, "post", 3, 60 * 60 * 1000);

  const trimmedTags = tags
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag.length > 0 && tag.length <= 24 && /^[a-z0-9-_]+$/.test(tag))
    .slice(0, 8);

  const safeCaption = caption.trim().slice(0, 220);
  if (safeCaption.length < 3) {
    throw new HttpsError("invalid-argument", "Caption too short");
  }

  const postRef = db.collection("posts").doc();
  const payload: Record<string, unknown> = {
    userId: request.auth.uid,
    status: "PENDING",
    contentKind,
    caption: safeCaption,
    tags: trimmedTags,
    createdAt: FieldValue.serverTimestamp(),
    submittedAt: FieldValue.serverTimestamp(),
    likeCount: 0,
    viewCount: 0
  };

  if (contentKind.startsWith("UPLOAD")) {
    if (!media?.storagePath) {
      throw new HttpsError("invalid-argument", "Missing upload storagePath");
    }
    payload.media = { storagePath: media.storagePath };
  } else {
    const embedTypeByKind: Record<string, string> = {
      EMBED_YOUTUBE: "youtube",
      EMBED_TIKTOK: "tiktok",
      EMBED_REDDIT: "reddit",
      EMBED_INSTAGRAM: "instagram",
      EMBED_FACEBOOK: "facebook"
    };
    const expectedEmbedType = embedTypeByKind[contentKind];
    if (!sourceUrl || !expectedEmbedType) {
      throw new HttpsError("invalid-argument", "Missing embed details");
    }
    payload.embed = await buildEmbed(sourceUrl, expectedEmbedType);
  }

  await postRef.set(payload);
  await ensureCounterDoc(postRef.id);

  return { postId: postRef.id };
});

export const registerLike = onCall({ enforceAppCheck: true }, async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Authentication required");
  const { postId } = request.data as { postId?: string };
  if (!postId) throw new HttpsError("invalid-argument", "Missing postId");

  await enforceRateLimit(request.auth.uid, "like", 30, 60 * 1000);

  const likeRef = db.collection("posts").doc(postId).collection("likes").doc(request.auth.uid);
  const likeSnap = await likeRef.get();
  if (likeSnap.exists) return { ok: true };

  await likeRef.set({ createdAt: FieldValue.serverTimestamp() });
  await ensureCounterDoc(postId);
  const shardId = Math.floor(Math.random() * LIKE_SHARDS).toString();
  const shardRef = db.collection("counters").doc(postId).collection("likes_shards").doc(shardId);
  await shardRef.set({ count: FieldValue.increment(1) }, { merge: true });

  return { ok: true };
});

export const registerView = onCall({ enforceAppCheck: true }, async (request) => {
  const viewerId = request.auth?.uid ?? request.data?.viewerId;
  const { postId } = request.data as { postId?: string };
  if (!viewerId) throw new HttpsError("unauthenticated", "Viewer required");
  if (!postId) throw new HttpsError("invalid-argument", "Missing postId");

  const viewRef = db.collection("posts").doc(postId).collection("views").doc(viewerId);
  const viewSnap = await viewRef.get();
  const lastViewedAt = viewSnap.data()?.lastViewedAt?.toMillis?.() ?? 0;
  const now = Date.now();
  if (now - lastViewedAt < VIEW_COOLDOWN_MS) return { ok: true };

  await viewRef.set({ lastViewedAt: FieldValue.serverTimestamp() }, { merge: true });
  await ensureCounterDoc(postId);
  const shardId = Math.floor(Math.random() * VIEW_SHARDS).toString();
  const shardRef = db.collection("counters").doc(postId).collection("views_shards").doc(shardId);
  await shardRef.set({ count: FieldValue.increment(1) }, { merge: true });

  return { ok: true };
});

export const createComment = onCall({ enforceAppCheck: true }, async (request) => {
  if (!request.auth) throw new HttpsError("unauthenticated", "Authentication required");
  const { postId, text } = request.data as { postId?: string; text?: string };
  if (!postId || !text) throw new HttpsError("invalid-argument", "Missing postId or text");

  await enforceRateLimit(request.auth.uid, "comment", 12, 60 * 1000);

  const commentRef = db.collection("posts").doc(postId).collection("comments").doc();
  await commentRef.set({
    userId: request.auth.uid,
    text: text.slice(0, 280),
    createdAt: FieldValue.serverTimestamp()
  });

  return { ok: true };
});

export const onPostStatusChange = onDocumentWritten("posts/{postId}", async (event) => {
  const after = event.data?.after;
  const before = event.data?.before;
  if (!after) return;

  const afterData = after.data();
  const beforeData = before?.data();

  if (!afterData) return;

  const statusChanged = beforeData?.status !== afterData.status;
  if (!statusChanged || afterData.status !== "APPROVED") return;

  const postRef = db.collection("posts").doc(after.id);

  const updates: Record<string, unknown> = {
    reviewedAt: FieldValue.serverTimestamp(),
    publishedAt: FieldValue.serverTimestamp()
  };

  if (afterData.media?.storagePath) {
    const storagePath: string = afterData.media.storagePath;
    const fileName = storagePath.split("/").pop() ?? "upload";
    const publicPath = `public/${after.id}/${fileName}`;
    const bucket = storage.bucket();
    await bucket.file(storagePath).copy(bucket.file(publicPath));
    updates["media.publicUrl"] = `https://storage.googleapis.com/${bucket.name}/${publicPath}`;
  }

  await postRef.set(updates, { merge: true });
});

async function sumShards(path: string) {
  const snapshot = await db.collection(path).get();
  return snapshot.docs.reduce((sum, doc) => sum + (doc.data().count || 0), 0);
}

export const rollupLikes = onDocumentWritten("counters/{postId}/likes_shards/{shardId}", async (event) => {
  const postId = event.params.postId as string;
  const total = await sumShards(`counters/${postId}/likes_shards`);
  await db.collection("posts").doc(postId).set({ likeCount: total }, { merge: true });
});

export const rollupViews = onDocumentWritten("counters/{postId}/views_shards/{shardId}", async (event) => {
  const postId = event.params.postId as string;
  const total = await sumShards(`counters/${postId}/views_shards`);
  await db.collection("posts").doc(postId).set({ viewCount: total }, { merge: true });
});
