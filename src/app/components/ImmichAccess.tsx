import { FormEvent, useEffect, useMemo, useState } from "react";

const IMMICH_URL = import.meta.env.VITE_IMMICH_URL || "";
const PASSWORD_HASH = (import.meta.env.VITE_IMMICH_PASSWORD_SHA256 || "").toLowerCase();

const SESSION_KEY = "immich_access_granted";
const ATTEMPT_KEY = "immich_access_attempts";
const LOCK_UNTIL_KEY = "immich_access_lock_until";
const MAX_ATTEMPTS = 5;
const LOCK_TIME_MS = 15 * 60 * 1000;

function getRemainingLockMs() {
  const lockUntilRaw = localStorage.getItem(LOCK_UNTIL_KEY);
  if (!lockUntilRaw) {
    return 0;
  }

  const lockUntil = Number(lockUntilRaw);
  if (!Number.isFinite(lockUntil)) {
    localStorage.removeItem(LOCK_UNTIL_KEY);
    return 0;
  }

  const remaining = lockUntil - Date.now();
  if (remaining <= 0) {
    localStorage.removeItem(LOCK_UNTIL_KEY);
    localStorage.removeItem(ATTEMPT_KEY);
    return 0;
  }

  return remaining;
}

async function sha256(value: string) {
  const encoded = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest("SHA-256", encoded);
  return Array.from(new Uint8Array(digest))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export function ImmichAccess() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [remainingLockMs, setRemainingLockMs] = useState(getRemainingLockMs());
  const [isUnlocked, setIsUnlocked] = useState(sessionStorage.getItem(SESSION_KEY) === "true");

  useEffect(() => {
    const interval = window.setInterval(() => {
      setRemainingLockMs(getRemainingLockMs());
    }, 1000);

    return () => window.clearInterval(interval);
  }, []);

  useEffect(() => {
    const existingRobots = document.querySelector('meta[name="robots"]');
    const previous = existingRobots?.getAttribute("content") || "";

    if (!existingRobots) {
      const meta = document.createElement("meta");
      meta.name = "robots";
      meta.content = "noindex, nofollow";
      document.head.appendChild(meta);
    } else {
      existingRobots.setAttribute("content", "noindex, nofollow");
    }

    return () => {
      const currentRobots = document.querySelector('meta[name="robots"]');
      if (!currentRobots) {
        return;
      }

      if (previous) {
        currentRobots.setAttribute("content", previous);
      } else {
        currentRobots.remove();
      }
    };
  }, []);

  const lockText = useMemo(() => {
    if (remainingLockMs <= 0) {
      return "";
    }

    const totalSeconds = Math.ceil(remainingLockMs / 1000);
    const minutes = Math.floor(totalSeconds / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");
    return `${minutes}:${seconds}`;
  }, [remainingLockMs]);

  const unlock = () => {
    sessionStorage.setItem(SESSION_KEY, "true");
    localStorage.removeItem(ATTEMPT_KEY);
    localStorage.removeItem(LOCK_UNTIL_KEY);
    setError("");
    setPassword("");
    setIsUnlocked(true);
  };

  const registerFailure = () => {
    const nextAttempts = Number(localStorage.getItem(ATTEMPT_KEY) || "0") + 1;
    localStorage.setItem(ATTEMPT_KEY, String(nextAttempts));

    if (nextAttempts >= MAX_ATTEMPTS) {
      const lockUntil = Date.now() + LOCK_TIME_MS;
      localStorage.setItem(LOCK_UNTIL_KEY, String(lockUntil));
      localStorage.removeItem(ATTEMPT_KEY);
      const remaining = getRemainingLockMs();
      setRemainingLockMs(remaining);
      setError(`Too many attempts. Try again in ${Math.ceil(remaining / 60000)} minutes.`);
      return;
    }

    setError("Incorrect passphrase.");
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (remainingLockMs > 0) {
      setError(`Access temporarily locked. Try again in ${lockText}.`);
      return;
    }

    if (!PASSWORD_HASH) {
      setError("Passphrase hash is not configured yet.");
      return;
    }

    setIsChecking(true);
    setError("");

    try {
      const candidate = await sha256(password.trim());
      if (candidate === PASSWORD_HASH) {
        unlock();
      } else {
        registerFailure();
      }
    } catch {
      setError("Could not validate passphrase in this browser.");
    } finally {
      setIsChecking(false);
    }
  };

  if (isUnlocked) {
    return (
      <main className="min-h-screen bg-neutral-950 text-neutral-100 px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <h1 className="text-2xl md:text-3xl font-semibold tracking-wide">Private Library</h1>
            <button
              onClick={() => {
                sessionStorage.removeItem(SESSION_KEY);
                setIsUnlocked(false);
              }}
              className="rounded-full border border-white/30 px-4 py-2 text-sm hover:bg-white/10"
            >
              Lock
            </button>
          </div>

          {!IMMICH_URL ? (
            <p className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              Immich URL is not configured. Add VITE_IMMICH_URL to your environment.
            </p>
          ) : (
            <>
              <div className="mb-4 flex flex-wrap gap-3">
                <a
                  href={IMMICH_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full bg-white text-black px-5 py-2.5 text-sm font-medium hover:opacity-90"
                >
                  Open Immich
                </a>
              </div>

              <iframe
                src={IMMICH_URL}
                title="Immich"
                className="w-full min-h-[80vh] rounded-2xl border border-white/20 bg-black"
              />
            </>
          )}
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-neutral-100 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 grid place-items-center px-6 py-12">
      <div className="w-full max-w-md rounded-2xl border border-black/10 dark:border-white/20 bg-white/80 dark:bg-white/5 backdrop-blur p-8">
        <h1 className="text-2xl font-semibold mb-2">Restricted Access</h1>
        <p className="text-sm text-neutral-600 dark:text-neutral-300 mb-6">
          Private entry only. This page is intentionally not linked in site navigation.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium" htmlFor="immich-passphrase">
            Passphrase
          </label>
          <input
            id="immich-passphrase"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-black/20 dark:border-white/20 px-4 py-3 bg-transparent"
            placeholder="Enter your passphrase"
            required
          />

          {remainingLockMs > 0 && (
            <p className="text-sm text-amber-600 dark:text-amber-300">
              Locked for {lockText}
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
          )}

          <button
            type="submit"
            disabled={isChecking || remainingLockMs > 0}
            className="w-full rounded-xl bg-black text-white dark:bg-white dark:text-black py-3 font-medium disabled:opacity-60"
          >
            {isChecking ? "Checking..." : "Unlock"}
          </button>
        </form>
      </div>
    </main>
  );
}
