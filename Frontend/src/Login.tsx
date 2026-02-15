import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Register modal state
  const [showRegister, setShowRegister] = useState(false);
  const [regUsername, setRegUsername] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirm, setRegConfirm] = useState("");
  const [regError, setRegError] = useState<string | null>(null);

  const API_BASE = "http://localhost:3000";

  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  const [regLoading, setRegLoading] = useState(false);

  const navigate = useNavigate();
  const firstRegInputRef = useRef<HTMLInputElement | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    if (!username.trim() || !password.trim()) {
      setLoginError("Please enter username and password.");
      return;
    }

    try {
      setLoginLoading(true);

      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: username.trim(),
          password: password.trim(),
        }),
      });

      // If backend returns JSON like { message } on error
      if (!res.ok) {
        const maybe = await res.json().catch(() => null);
        throw new Error(maybe?.message || `Login failed (${res.status})`);
      }

      const data = await res.json().catch(() => ({}));

      // Store user + auth (hackathon style)
      localStorage.setItem("authed", "true");
      localStorage.setItem("user", JSON.stringify({ username: username.trim() }));

      // If backend returns a token, store it too (optional)
      if (data?.token) localStorage.setItem("token", data.token);

      navigate("/map", { replace: true });
    } catch (err: any) {
      setLoginError(err.message || "Login failed.");
    } finally {
      setLoginLoading(false);
    }
  };


  const openRegister = () => {
    setRegError(null);
    setShowRegister(true);
  };

  const closeRegister = () => {
    setShowRegister(false);
    setRegError(null);
  };

  // Focus first input when modal opens
  useEffect(() => {
    if (showRegister) {
      setTimeout(() => firstRegInputRef.current?.focus(), 0);
    }
  }, [showRegister]);

  // Close modal on ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRegister();
    };
    if (showRegister) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showRegister]);

  const submitRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegError(null);

    if (!regUsername.trim()) return setRegError("Please enter a Username.");
    if (regPassword.length < 6) return setRegError("Password must be at least 6 characters.");
    if (regPassword !== regConfirm) return setRegError("Passwords do not match.");

    try {
      setRegLoading(true);

      const res = await fetch(`${API_BASE}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: regUsername.trim(),
          password: regPassword,
        }),
      });

      if (!res.ok) {
        const maybe = await res.json().catch(() => null);
        throw new Error(maybe?.message || `Register failed (${res.status})`);
      }

      const data = await res.json().catch(() => ({}));

      // auto-login after register
      localStorage.setItem("user", JSON.stringify({ username: regUsername.trim() }));
      localStorage.setItem("authed", "true");
      if (data?.token) localStorage.setItem("token", data.token);

      closeRegister();
      navigate("/map", { replace: true });
    } catch (err: any) {
      setRegError(err.message || "Register failed.");
    } finally {
      setRegLoading(false);
    }
  };

  return (
    <div className="w-full overflow-hidden font-sans text-[#2B253A]">
      {/* Animated background */}
      <div className="relative w-full bg-[#DCC9FE] min-h-[100svh]">
        {/* moving diagonal band */}
        <div className="pointer-events-none absolute inset-[-40%] opacity-80">
          <div className="h-[220%] w-[120%] -rotate-12 bg-[linear-gradient(90deg,transparent_0%,transparent_38%,#D3D3FF_38%,#D3D3FF_62%,transparent_62%,transparent_100%)] animate-diagonal" />
        </div>

        {/* Content */}
        <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-6xl items-center justify-center px-4 sm:px-6">
          <div className="grid w-full max-w-4xl grid-cols-1 gap-6 lg:gap-8 lg:grid-cols-2">
            {/* Left panel (desktop only) */}
            <div className="hidden lg:flex flex-col justify-center">
              <div className="inline-flex items-center gap-3">
                <div className="rounded-full bg-white/60 px-3 py-1 text-xs text-[#4B3F66] border border-white/40">
                  Community Archive
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <img
                  src="/StickyWorldLogo.png"
                  alt="StickyWorld logo"
                  className="h-72 w-72 object-contain opacity-100"
                />
              </div>

              <p className="mt-3 max-w-md text-base leading-relaxed text-[#4B3F66]">
                Save places as cozy pins, leave sticky notes, and explore what your community has
                archived around the city.
              </p>
            </div>

            {/* Form card */}
            <form
              onSubmit={onSubmit}
              className="w-full rounded-3xl bg-white/75 backdrop-blur-md shadow-[0_20px_60px_rgba(43,37,58,0.18)] border border-white/40
             p-5 sm:p-8 lg:p-10"
            >
              {/* Mobile brand header */}
              <div className="lg:hidden flex flex-col items-center justify-center gap-2 mb-3">
                <img
                  src="/StickyWorldLogo.png"
                  alt="StickyWorld logo"
                  className="h-20 w-20 sm:h-24 sm:w-24 object-contain opacity-100"
                />
                <div className="rounded-full bg-white/60 px-3 py-1 text-[11px] text-[#4B3F66] border border-white/40">
                  Community Archive
                </div>
              </div>

              <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">Welcome back</h2>
              <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#4B3F66]">
                Log in to view the community map.
              </p>

              {loginError && (
                <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {loginError}
                </div>
              )}

              {/* Username */}
              <div className="mt-4 sm:mt-6">
                <label className="block text-xs sm:text-sm font-medium text-[#4B3F66] mb-2">
                  Username
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/60
                px-3 sm:px-4 py-2.5 sm:py-3 transition
                focus-within:ring-4 focus-within:ring-[#D3D3FF]/70">
                  <input
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your username..."
                    className="w-full bg-transparent outline-none text-xs sm:text-sm placeholder:text-[#4B3F66]/60"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mt-3 sm:mt-4">
                <label className="block text-xs sm:text-sm font-medium text-[#4B3F66] mb-2">
                  Password
                </label>
                <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/60
                px-3 sm:px-4 py-2.5 sm:py-3 transition
                focus-within:ring-4 focus-within:ring-[#D3D3FF]/70">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    type="password"
                    placeholder="Enter your password..."
                    className="w-full bg-transparent outline-none text-xs sm:text-sm placeholder:text-[#4B3F66]/60"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between mt-3 sm:mt-4">
                <span className="text-[11px] sm:text-xs text-[#4B3F66]">
                  demo: any username + password
                </span>
              </div>

              <button
                type="submit"
                disabled={loginLoading}
                className="mt-4 sm:mt-6 w-full rounded-full py-2.5 sm:py-3 text-xs sm:text-sm font-semibold
             text-[#2B253A] bg-[#D3D3FF] hover:bg-[#C7C7FF]
             active:translate-y-[1px] transition shadow-md
             disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loginLoading ? "Logging in..." : "Log in"}
              </button>

              <button
                type="button"
                onClick={() => {
                  localStorage.setItem("authed", "true");
                  navigate("/map", { replace: true });
                }}
                className="mt-2.5 sm:mt-3 w-full rounded-full py-2.5 sm:py-3 text-xs sm:text-sm font-semibold
               text-[#2B253A] bg-white/60 border border-white/50 hover:bg-white/80 transition"
              >
                Continue as guest
              </button>

              <p className="text-center mt-3 sm:mt-5 text-xs sm:text-sm text-[#4B3F66]">
                Don’t have an account?{" "}
                <button
                  type="button"
                  onClick={openRegister}
                  className="font-semibold text-[#2B253A] hover:underline"
                >
                  Create one
                </button>
              </p>
            </form>
          </div>
        </div>

        {/* Register Modal */}
        {showRegister && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center px-4"
            aria-modal="true"
            role="dialog"
          >
            {/* Backdrop */}
            <button
              type="button"
              className="absolute inset-0 bg-black/25 backdrop-blur-[2px]"
              onClick={closeRegister}
              aria-label="Close register modal"
            />

            {/* Modal card */}
            <div className="relative w-full max-w-md rounded-3xl bg-white/90 border border-white/40 shadow-[0_20px_60px_rgba(43,37,58,0.22)] backdrop-blur-md p-5 sm:p-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold tracking-tight">Create account</h3>
                  <p className="mt-1 text-xs sm:text-sm text-[#4B3F66]">
                    Make an account to pin notes and save places.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={closeRegister}
                  className="rounded-full px-3 py-1 text-sm text-[#4B3F66] hover:text-[#2B253A] hover:bg-black/5 transition"
                >
                  ✕
                </button>
              </div>

              {regError && (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {regError}
                </div>
              )}

              <form onSubmit={submitRegister} className="mt-4 space-y-3">

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#4B3F66] mb-2">
                    Email
                  </label>
                  <div className="rounded-2xl border border-white/60 bg-white/70 px-3 py-2.5 focus-within:ring-4 focus-within:ring-[#D3D3FF]/70">
                    <input
                      ref={firstRegInputRef}
                      value={regUsername}
                      onChange={(e) => setRegUsername(e.target.value)}
                      placeholder="Type a username..."
                      className="w-full bg-transparent outline-none text-sm placeholder:text-[#4B3F66]/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#4B3F66] mb-2">
                    Password
                  </label>
                  <div className="rounded-2xl border border-white/60 bg-white/70 px-3 py-2.5 focus-within:ring-4 focus-within:ring-[#D3D3FF]/70">
                    <input
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      type="password"
                      placeholder="Type a password..."
                      className="w-full bg-transparent outline-none text-sm placeholder:text-[#4B3F66]/60"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs sm:text-sm font-medium text-[#4B3F66] mb-2">
                    Confirm password
                  </label>
                  <div className="rounded-2xl border border-white/60 bg-white/70 px-3 py-2.5 focus-within:ring-4 focus-within:ring-[#D3D3FF]/70">
                    <input
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      type="password"
                      placeholder="Retype password..."
                      className="w-full bg-transparent outline-none text-sm placeholder:text-[#4B3F66]/60"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={regLoading}
                  className="mt-2 w-full rounded-full py-2.5 text-sm font-semibold text-[#2B253A]
             bg-[#D3D3FF] hover:bg-[#C7C7FF] active:translate-y-[1px] transition shadow-md
             disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {regLoading ? "Creating..." : "Create account"}
                </button>

                <button
                  type="button"
                  onClick={closeRegister}
                  className="w-full rounded-full py-2.5 text-sm font-semibold text-[#2B253A]
               bg-white/70 border border-white/60 hover:bg-white/85 transition"
                >
                  Cancel
                </button>
              </form>
            </div>
          </div>
        )}
      </div>

      <style>{`
    @keyframes diagonalMove {
      0% { transform: translateX(-20%) translateY(-10%); }
      100% { transform: translateX(20%) translateY(10%); }
    }
    .animate-diagonal {
      animation: diagonalMove 7s ease-in-out infinite alternate;
    }
    `}</style>
    </div>
  );
}
