import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function MapBar() {

  // close on ESC
  // useEffect(() => {
  //   const onKeyDown = (e: KeyboardEvent) => {
  //     if (e.key === "Escape") setMobileOpen(false);
  //   };
  //   if (mobileOpen) window.addEventListener("keydown", onKeyDown);
  //   return () => window.removeEventListener("keydown", onKeyDown);
  // }, [mobileOpen]);

  // const NavItem = ({ to, label }: { to: string; label: string }) => {
  //   const active = location.pathname === to;
  //   return (
  //     <Link
  //       to={to}
  //       onClick={() => setMobileOpen(false)}
  //       className={[
  //         "rounded-xl px-3 py-2 text-sm font-semibold transition border w-full text-left",
  //         "bg-white/35 border-white/40 text-[#2B253A] hover:bg-white/50",
  //         active ? "bg-[#D3D3FF] border-white/60 shadow-sm" : "",
  //       ].join(" ")}
  //     >
  //       {label}
  //     </Link>
  //   );
  // };

  const [createSticky, setCreateSticky] = useState(false);

  useEffect(() => {
    
  }, [createSticky])

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="w-full bg-[#DCC9FE]/80 backdrop-blur-md border-b border-white/40">
        <div className="mx-auto flex h-10 max-w-6xl items-center justify-between px-4 sm:px-6">
          {/* Desktop: buttons on right */}
          <div className="hidden md:flex items-center gap-2">
            <button
              className={[
                "rounded-full px-1.5 py-0.5 text-[8px] font-semibold leading-none",
                "bg-white/55 border border-white/40 text-[#4B3F66] hover:bg-white/75 scale-80"
              ].join(" ")}
              onClick={() => setCreateSticky(!createSticky)}
            >
              Create Sticky
            </button>

            {/* <button
              className={[
                "rounded-full px-4 py-2 text-sm font-semibold transition border",
                "bg-white/55 border-white/40 text-[#4B3F66] hover:bg-white/75"
              ].join(" ")}
            >
              BUTTON 2
            </button> */}

          </div>

          {/* Mobile: hamburger (logout stays inside menu) */}
          <div className="md:hidden flex items-center gap-2">
            <button
              className={[
                "rounded-full px-1.5 py-0.5 text-[8px] font-semibold leading-none",
                "bg-white/55 border border-white/40 text-[#4B3F66] hover:bg-white/75 scale-80"
              ].join(" ")}
              onClick={() => setCreateSticky(!createSticky)}
            >
              Create Sticky
            </button>
          </div>
        </div>
      </div>

    </header>
  );
}
