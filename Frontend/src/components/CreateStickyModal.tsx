import { useEffect, useMemo, useRef, useState } from "react";

type Visibility = "public" | "private";

type CreateStickyPayload = {
  username: string;
  title: string;
  body: string;
  tags: string[];
  category: string;
  xcoord: number; // lng
  ycoord: number; // lat
  prompt?: string;
  visibility: Visibility;
};

type Props = {
  open: boolean;
  onClose: () => void;
  defaultUsername?: string;
  defaultX?: number; // lng
  defaultY?: number; // lat
};

const PROMPT_OPTIONS = [
  "What do you want future visitors to know?",
  "What memory is tied to this place?",
  "What changed here over time?",
] as const;

type PromptOption = "" | (typeof PROMPT_OPTIONS)[number];

export default function CreateStickyModal({
  open,
  onClose,
  defaultUsername = "",
  defaultX,
  defaultY,
}: Props) {
  const API_BASE = "http://localhost:3000";

  const firstRef = useRef<HTMLInputElement | null>(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // form fields (NO username / NO coords state)
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState(""); // comma-separated input
  const [category, setCategory] = useState("general");
  const [prompt, setPrompt] = useState<PromptOption>("");
  const [visibility, setVisibility] = useState<Visibility>("public");

  const storedUser = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null") as null | { username?: string };
    } catch {
      return null;
    }
  }, []);

  const resolvedUsername = (defaultUsername || storedUser?.username || "").trim();

  // when opened: reset transient UI state + focus title
  useEffect(() => {
    if (!open) return;

    setError(null);
    setLoading(false);

    // optional: reset fields each time modal opens
    setTitle("");
    setBody("");
    setTags("");
    setCategory("general");
    setPrompt("");
    setVisibility("public");

    setTimeout(() => firstRef.current?.focus(), 0);
  }, [open]);

  // ESC close
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!resolvedUsername) return setError("You must be logged in to create a sticky.");
    if (!title.trim()) return setError("Title is required.");
    if (!body.trim()) return setError("Body is required.");

    // coords must be provided by parent
    if (!Number.isFinite(defaultX) || !Number.isFinite(defaultY)) {
      return setError("Map coordinates missing. Try moving the map then creating again.");
    }

    const payload: CreateStickyPayload = {
      username: resolvedUsername,
      title: title.trim(),
      body: body.trim(),
      tags: tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
      category,
      xcoord: Number(defaultX), // lng
      ycoord: Number(defaultY), // lat
      prompt: prompt.trim() || undefined,
      visibility,
    };

    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/notes/addnote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const maybe = await res.json().catch(() => null);
        throw new Error(maybe?.error || maybe?.message || `Create failed (${res.status})`);
      }

      onClose();
    } catch (err: any) {
      setError(err.message || "Create failed.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const lng = Number.isFinite(defaultX) ? Number(defaultX).toFixed(6) : "—";
  const lat = Number.isFinite(defaultY) ? Number(defaultY).toFixed(6) : "—";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4" role="dialog" aria-modal="true">
      {/* Backdrop: click off to close */}
      <button
        type="button"
        className="absolute inset-0 bg-black/15 backdrop-blur-[1px]"
        onClick={onClose}
        aria-label="Close create sticky modal"
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg rounded-3xl bg-white/85 border border-white/50 shadow-[0_20px_60px_rgba(43,37,58,0.22)] backdrop-blur-md p-5 sm:p-6">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-[#2B253A]">Create Sticky</h3>
            <p className="mt-1 text-xs sm:text-sm text-[#4B3F66]">Pin a note to the map for your community.</p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-3 py-1 text-sm text-[#4B3F66] hover:text-[#2B253A] hover:bg-black/5 transition"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={submit} className="mt-4 space-y-3">
          {/* Posting as */}
          <div className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3">
            <div className="text-[11px] text-[#4B3F66]/80">Posting as</div>
            <div className="text-sm font-semibold text-[#2B253A]">{resolvedUsername || "Not logged in"}</div>
          </div>

          {/* Coords display (read-only) */}
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3">
              <div className="text-[11px] text-[#4B3F66]/80">lng</div>
              <div className="text-sm font-semibold text-[#2B253A] tabular-nums">{lng}</div>
            </div>
            <div className="rounded-2xl border border-white/60 bg-white/60 px-4 py-3">
              <div className="text-[11px] text-[#4B3F66]/80">lat</div>
              <div className="text-sm font-semibold text-[#2B253A] tabular-nums">{lat}</div>
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#4B3F66] mb-2">Title</label>
            <div className="rounded-2xl border border-white/60 bg-white/70 px-3 py-2.5 focus-within:ring-4 focus-within:ring-[#D3D3FF]/70">
              <input
                ref={firstRef}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Best sunset view"
                className="w-full bg-transparent outline-none text-sm placeholder:text-[#4B3F66]/60 text-[#4B3F66]"
              />
            </div>
          </div>

          {/* Body */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-[#4B3F66] mb-2">Body</label>
            <div className="rounded-2xl border border-white/60 bg-white/70 px-3 py-2.5 focus-within:ring-4 focus-within:ring-[#D3D3FF]/70">
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder="Write your sticky note..."
                rows={4}
                className="w-full resize-none bg-transparent outline-none text-sm placeholder:text-[#4B3F66]/60 text-[#4B3F66]"
              />
            </div>
          </div>

          {/* Tags + Category */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#4B3F66] mb-2">Tags</label>
              <div className="rounded-2xl border border-white/60 bg-white/70 px-3 py-2.5 focus-within:ring-4 focus-within:ring-[#D3D3FF]/70">
                <input
                  value={tags}
                  onChange={(e) => setTags(e.target.value)}
                  placeholder="food, view, study"
                  className="w-full bg-transparent outline-none text-sm placeholder:text-[#4B3F66]/60 text-[#4B3F66]"
                />
              </div>
              <p className="mt-1 text-[11px] text-[#4B3F66]/80">comma-separated</p>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#4B3F66] mb-2">Category</label>
              <div className="rounded-2xl border border-white/60 bg-white/70 px-3 py-2.5 focus-within:ring-4 focus-within:ring-[#D3D3FF]/70">
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-transparent outline-none text-sm text-[#2B253A]"
                >
                  <option value="general">General</option>
                  <option value="food">Food</option>
                  <option value="view">View</option>
                  <option value="study">Study Spot</option>
                  <option value="fun">Fun</option>
                </select>
              </div>
            </div>
          </div>

          {/* Prompt + Visibility */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#4B3F66] mb-2">
                Prompt (optional)
              </label>

              <div className="rounded-2xl border border-white/60 bg-white/70 px-3 py-2.5 focus-within:ring-4 focus-within:ring-[#D3D3FF]/70">
                <select
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value as PromptOption)}
                  className="w-full bg-transparent outline-none text-sm text-[#2B253A]"
                >
                  <option value="">None</option>
                  {PROMPT_OPTIONS.map((p) => (
                    <option key={p} value={p}>
                      {p}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-[#4B3F66] mb-2">Visibility</label>
              <div className="rounded-2xl border border-white/60 bg-white/70 px-3 py-2.5 focus-within:ring-4 focus-within:ring-[#D3D3FF]/70">
                <select
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value as Visibility)}
                  className="w-full bg-transparent outline-none text-sm text-[#2B253A]"
                >
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 w-full rounded-full py-2.5 text-sm font-semibold text-[#2B253A]
              bg-[#D3D3FF] hover:bg-[#C7C7FF] active:translate-y-[1px] transition shadow-md
              disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Sticky"}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-full py-2.5 text-sm font-semibold text-[#2B253A]
              bg-white/70 border border-white/60 hover:bg-white/85 transition"
          >
            Cancel
          </button>
        </form>
      </div>
    </div>
  );
}
