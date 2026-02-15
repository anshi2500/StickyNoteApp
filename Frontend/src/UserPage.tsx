import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "./components/Navbar";

type Sticky = {
  id: string;
  username: string;
  text: string;
  lat: number;
  lng: number;
  visibility: "public" | "private";
  createdAt?: string;
};

export default function UserPage() {
  const { username = "" } = useParams();
  const [stickies, setStickies] = useState<Sticky[]>([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const me = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null") as null | { username?: string; email?: string; name?: string };
    } catch {
      return null;
    }
  }, []);

  const myUsername = me?.username || me?.email?.split("@")[0] || "";
  const isMe = myUsername.toLowerCase() === username.toLowerCase();

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      setErr(null);
      try {
        // One API: backend will filter based on viewer + username
        const viewer = myUsername || "guest";
        const res = await fetch(
          `http://localhost:5000/api/users/${encodeURIComponent(username)}/stickies?viewer=${encodeURIComponent(viewer)}`,
          { headers: { "Content-Type": "application/json" } }
        );

        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        setStickies(data.stickies || []);
      } catch (e: any) {
        setErr(e.message || "Failed to load stickies");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [username, myUsername]);

  return (
    <div className="min-h-screen bg-[#DCC9FE]">
      <Navbar />

      <main className="mx-auto max-w-6xl px-4 sm:px-6 py-6">
        <div className="rounded-3xl bg-white/70 border border-white/40 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-semibold text-[#2B253A]">
                @{username}
              </h1>
              <p className="mt-1 text-sm text-[#4B3F66]">
                {isMe ? "Your stickies (public + private)" : "Public stickies"}
              </p>
            </div>

            <div className="rounded-full bg-[#D3D3FF] px-4 py-2 text-xs font-semibold text-[#2B253A] border border-white/50">
              {stickies.length} stickies
            </div>
          </div>

          {loading && (
            <div className="mt-5 text-sm text-[#4B3F66]">Loading…</div>
          )}

          {err && (
            <div className="mt-5 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {err}
            </div>
          )}

          {!loading && !err && (
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {stickies.map((s) => (
                <div
                  key={s.id}
                  className="rounded-2xl bg-white/80 border border-white/50 p-4 shadow-sm"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#4B3F66]">
                      {s.visibility === "public" ? "Public" : "Private"}
                    </span>
                    {s.createdAt && (
                      <span className="text-[11px] text-[#4B3F66]/80">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </span>
                    )}
                  </div>

                  <p className="mt-2 text-sm text-[#2B253A] whitespace-pre-wrap">
                    {s.text}
                  </p>

                  <div className="mt-3 text-xs text-[#4B3F66]">
                    📍 {s.lat.toFixed(4)}, {s.lng.toFixed(4)}
                  </div>

                  {/* Optional: jump to map */}
                  <a
                    className="mt-3 inline-flex text-xs font-semibold text-[#2B253A] hover:underline"
                    href={`/map?lat=${s.lat}&lng=${s.lng}`}
                  >
                    View on map →
                  </a>
                </div>
              ))}

              {stickies.length === 0 && (
                <div className="text-sm text-[#4B3F66]">
                  No stickies yet.
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
