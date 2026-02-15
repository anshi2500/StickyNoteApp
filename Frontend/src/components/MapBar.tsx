import { useState } from "react";


export default function MapBar({ onCreateSticky }: { onCreateSticky: () => void }) {
  const [StickiesInRange, setStickiesInRange] = useState([]);

  const fetchStickiesInRange = async () => {
    // const backendEndpoint = 'http://127.0.0.1:5000/student_courses/' + user['id'];
    //const response = await fetch(backendEndpoint);
    // const data = await response.json();

    //setStickiesInRange(data['student_courses'])
    //console.log(data['student_courses'])
  };

  return (
    <div className="sticky bottom-0 z-40 w-full">
      <div className="w-full bg-[#DCC9FE]/80 backdrop-blur-[1px] border-t border-white/40">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-start px-3 sm:px-6">
          <button
            onClick={onCreateSticky}
            className="rounded-full border border-white/50 bg-[#D3D3FF] text-[#2B253A]
                       font-semibold shadow-sm transition active:translate-y-[1px]
                       hover:bg-[#C7C7FF]
                       px-4 py-2 text-sm sm:px-5 sm:py-2.5 md:px-6 md:py-3 md:text-base"
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
        <div className="md:hidden flex items-center gap-2">
          <button
            className={[
              "rounded-full px-1.5 py-0.5 text-[8px] font-semibold leading-none",
              "bg-white/55 border border-white/40 text-[#4B3F66] hover:bg-white/75 scale-80"
            ].join(" ")}
          >
            Explore Stickies
          </button>
        </div>
      </div>
    </div>
  );
}
