import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const onSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (email.trim() && password.trim()) {
            localStorage.setItem("authed", "true");
            navigate("/map", { replace: true });
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
                                Save places as cozy pins, leave sticky notes, and explore what your community has archived around the city.
                            </p>
                        </div>

                        {/* Form card */}
                        <form
                            onSubmit={onSubmit}
                            className="w-full rounded-3xl bg-white/75 backdrop-blur-md shadow-[0_20px_60px_rgba(43,37,58,0.18)] border border-white/40
                         p-5 sm:p-8 lg:p-10"
                        >
                            {/* Mobile brand header (smaller + tighter) */}
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

                            {/* Smaller heading on mobile */}
                            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">
                                Welcome back
                            </h2>
                            <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-[#4B3F66]">
                                Log in to view the community map.
                            </p>

                            {/* Email */}
                            <div className="mt-4 sm:mt-6">
                                <label className="block text-xs sm:text-sm font-medium text-[#4B3F66] mb-2">
                                    Email
                                </label>
                                <div className="flex items-center gap-3 rounded-2xl border border-white/50 bg-white/60
                                px-3 sm:px-4 py-2.5 sm:py-3 transition
                                focus-within:ring-4 focus-within:ring-[#D3D3FF]/70">
                                    <input
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        type="email"
                                        placeholder="you@email.com"
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
                                        placeholder="••••••••"
                                        className="w-full bg-transparent outline-none text-xs sm:text-sm placeholder:text-[#4B3F66]/60"
                                    />
                                </div>
                            </div>

                            <div className="flex items-center justify-between mt-3 sm:mt-4">
                                <span className="text-[11px] sm:text-xs text-[#4B3F66]">
                                    demo: any email + password
                                </span>
                            </div>

                            {/* Buttons (slightly shorter on mobile) */}
                            <button
                                type="submit"
                                className="mt-4 sm:mt-6 w-full rounded-full py-2.5 sm:py-3 text-xs sm:text-sm font-semibold
                           text-[#2B253A] bg-[#D3D3FF] hover:bg-[#C7C7FF]
                           active:translate-y-[1px] transition shadow-md"
                            >
                                Log in
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
                                    onClick={() => alert("Add /register")}
                                    className="font-semibold text-[#2B253A] hover:underline"
                                >
                                    Create one
                                </button>
                            </p>
                        </form>
                    </div>
                </div>
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
