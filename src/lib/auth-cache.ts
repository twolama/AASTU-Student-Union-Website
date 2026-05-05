import type { CurrentUser } from "@/schemas/user.schema";

const CURRENT_USER_CACHE_KEY = "auth.currentUser";

type CachedCurrentUser = {
  data: CurrentUser;
  updatedAt: number;
};

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

export function readCachedCurrentUser(): CachedCurrentUser | null {
  const storage = getStorage();
  if (!storage) return null;

  try {
    const raw = storage.getItem(CURRENT_USER_CACHE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<CachedCurrentUser> | null;
    if (!parsed || typeof parsed !== "object") return null;
    if (!parsed.data || typeof parsed.updatedAt !== "number") return null;

    return {
      data: parsed.data as CurrentUser,
      updatedAt: parsed.updatedAt,
    };
  } catch {
    return null;
  }
}

export function writeCachedCurrentUser(data: CurrentUser) {
  const storage = getStorage();
  if (!storage) return;

  const payload: CachedCurrentUser = {
    data,
    updatedAt: Date.now(),
  };

  try {
    storage.setItem(CURRENT_USER_CACHE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage failures.
  }
}

export function clearCachedCurrentUser() {
  const storage = getStorage();
  if (!storage) return;

  try {
    storage.removeItem(CURRENT_USER_CACHE_KEY);
  } catch {
    // Ignore storage failures.
  }
}
