import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isAuthed = localStorage.getItem("authed") === "true";

  const logout = () => {
    localStorage.removeItem("authed");
    setMobileOpen(false);
    navigate("/login", { replace: true });
  };

  // close on ESC
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    if (mobileOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [mobileOpen]);

  const NavItem = ({ to, label }: { to: string; label: string }) => {
    const active = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={() => setMobileOpen(false)}
        className={[
          "rounded-xl px-3 py-2 text-sm font-semibold transition border w-full text-left",
          "bg-white/35 border-white/40 text-[#2B253A] hover:bg-white/50",
          active ? "bg-[#D3D3FF] border-white/60 shadow-sm" : "",
        ].join(" ")}
      >
        {label}
      </Link>
    );
  };

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="w-full bg-[#DCC9FE]/80 backdrop-blur-md border-b border-white/40">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Left: brand */}
          <div className="flex items-center gap-3 select-none pointer-events-none">
            <img
              src="/StickyWorldLogo.png"
              alt="StickyWorld logo"
              className="h-10 w-10 object-contain opacity-100"
            />
            <span className="hidden sm:inline rounded-full bg-white/50 px-3 py-1 text-xs text-[#4B3F66] border border-white/40">
              Community Archive
            </span>
          </div>

          {/* Desktop: buttons on right */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/home"
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold transition border",
                "bg-white/55 border-white/40 text-[#4B3F66] hover:bg-white/75",
                location.pathname === "/home"
                  ? "bg-[#D3D3FF] text-[#2B253A] border-white/60 shadow-sm"
                  : "",
              ].join(" ")}
            >
              Home
            </Link>

            <Link
              to="/map"
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold transition border",
                "bg-white/55 border-white/40 text-[#4B3F66] hover:bg-white/75",
                location.pathname === "/map"
                  ? "bg-[#D3D3FF] text-[#2B253A] border-white/60 shadow-sm"
                  : "",
              ].join(" ")}
            >
              Map
            </Link>

            {isAuthed ? (
              <button
                onClick={logout}
                className="rounded-full px-4 py-2 text-sm font-semibold transition border
                           bg-white/55 border-white/40 text-[#2B253A] hover:bg-white/75"
              >
                Log out
              </button>
            ) : (
              <Link
                to="/login"
                className="rounded-full px-4 py-2 text-sm font-semibold transition border
                           bg-white/55 border-white/40 text-[#2B253A] hover:bg-white/75"
              >
                Log in
              </Link>
            )}
          </div>

          {/* Mobile: hamburger (logout stays inside menu) */}
          <div className="md:hidden flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileOpen((v) => !v)}
              className="rounded-full px-3 py-2 text-sm font-semibold transition border
                         bg-white/55 border-white/40 text-[#2B253A] hover:bg-white/75"
              aria-label="Open menu"
            >
              ☰
            </button>
          </div>
        </div>
      </div>

      {/* Mobile overlay dropdown */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-50">
          {/* Backdrop (lighter, less blur) */}
          <button
            className="absolute inset-0 bg-black/10 backdrop-blur-[1px]"
            onClick={() => setMobileOpen(false)}
            aria-label="Close menu"
          />

          {/* Smaller dropdown panel */}
          <div className="absolute right-4 top-3 w-[260px]">
            <div className="rounded-2xl bg-[#DCC9FE]/95 border border-[#D3D3FF]/70 shadow-[0_12px_30px_rgba(43,37,58,0.18)] p-2">
              {/* Header row */}
              <div className="flex items-center justify-between px-2 py-1.5">
                <span className="text-xs font-semibold text-[#2B253A]">
                  Menu
                </span>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-full px-2 py-1 text-xs font-semibold text-[#2B253A] hover:bg-white/30 transition"
                  aria-label="Close"
                >
                  ✕
                </button>
              </div>

              <div className="flex flex-col gap-2 p-2">
                {/* Make NavItem smaller too: you can adjust NavItem classes, or just keep these */}
                <NavItem to="/home" label="Home" />
                <NavItem to="/map" label="Map" />

                {!isAuthed ? (
                  <NavItem to="/login" label="Log in" />
                ) : (
                  <button
                    onClick={logout}
                    className="rounded-xl px-3 py-2 text-sm font-semibold transition border w-full text-left
                         bg-[#D3D3FF] border-white/40 text-[#2B253A] hover:bg-[#C7C7FF]"
                  >
                    Log out
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
