import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./components/Navbar";

type BackendSticky = {
  id: string;
  Title?: string;
  Body?: string;
  Tags?: string[] | string;
  Category?: string;
  Prompt?: string;
  Visibility?: "public" | "private"; // might be missing in your DB right now
  Username?: string;                 // might be missing too
  XCoord?: number; // lng
  YCoord?: number; // lat
  Timestamp?: any;
};

const API_BASE = "http://localhost:3000";

const safeNum = (v: any) => (typeof v === "number" && Number.isFinite(v) ? v : null);

export default function UserPage() {
  const { username = "" } = useParams();
  const [stickies, setStickies] = useState<BackendSticky[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const me = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null") as null | { username?: string; email?: string };
    } catch {
      return null;
    }
  }, []);

  const myUsername = (me?.username || me?.email?.split("@")[0] || "").trim();
  const isMe = myUsername.toLowerCase() === username.toLowerCase();

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setErr(null);

      try {
        const res = await fetch(
          `${API_BASE}/notes/fetchUsersNotes?username=${encodeURIComponent(username)}`
        );

        const data = await res.json().catch(() => null);

        if (!res.ok) {
          throw new Error(data?.error || `HTTP ${res.status}`);
        }

        // backend returns { stickies: [...] }
        const arr = Array.isArray(data?.stickies) ? data.stickies : Array.isArray(data) ? data : [];
        setStickies(arr);
      } catch (e: any) {
        setErr(e.message || "Failed to load stickies");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [username]);

  return (
    <div className="min-h-screen bg-[#DCC9FE]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <div className="rounded-3xl bg-white/70 border border-white/40 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#2B253A]">@{username}</h1>
              <p className="mt-1 text-sm text-[#4B3F66]">
                {isMe ? "Your stickies (public + private)" : "Public stickies"}
              </p>
            </div>

            <div className="rounded-full bg-[#D3D3FF] px-4 py-2 text-xs font-semibold text-[#2B253A] border border-white/50">
              {stickies.length} stickies
            </div>
          </div>

          {loading && <div className="mt-5 text-sm text-[#4B3F66]">Loading…</div>}

          {err && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}

          {!loading && !err && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stickies.map((s) => {
                const lat = safeNum(s.YCoord);
                const lng = safeNum(s.XCoord);

                return (
                  <div key={s.id} className="rounded-2xl bg-white/80 border border-white/50 p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-[#4B3F66]">
                        {s.Visibility === "private" ? "Private" : "Public"}
                      </span>
                      <span className="text-[11px] text-[#4B3F66]/80">
                        {s.Category ? s.Category : ""}
                      </span>
                    </div>

                    <div className="mt-2 text-sm font-semibold text-[#2B253A]">
                      {s.Title || "Untitled"}
                    </div>

                    <p className="mt-1 text-sm text-[#4B3F66] whitespace-pre-wrap">
                      {s.Body || ""}
                    </p>

                    <div className="mt-3 text-xs text-[#4B3F66]">
                      📍 {lat !== null ? lat.toFixed(4) : "—"}, {lng !== null ? lng.toFixed(4) : "—"}
                    </div>
                  </div>
                );
              })}

              {stickies.length === 0 && (
                <div className="text-sm text-[#4B3F66]">No stickies yet.</div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
