type MapBarProps = {
  onCreateSticky: () => void;
  onFetchStickies: () => void;
  fetching?: boolean;
};

export default function MapBar({ onCreateSticky, onFetchStickies, fetching }: MapBarProps) {
  return (
    <div className="sticky bottom-0 z-40 w-full">
      <div className="w-full bg-[#DCC9FE]/80 backdrop-blur-[1px] border-t border-white/40">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-3 sm:px-6">
          {/* Left actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={onCreateSticky}
              className="
                rounded-full border border-white/50 bg-[#D3D3FF] text-[#2B253A]
                font-semibold shadow-sm transition active:translate-y-[1px]
                hover:bg-[#C7C7FF]
                px-4 py-2 text-sm
                sm:px-5 sm:py-2.5 sm:text-sm
              "
            >
              Create Sticky
            </button>

            <button
              onClick={onFetchStickies}
              disabled={fetching}
              className="
                rounded-full border border-white/50 bg-white/70 text-[#2B253A]
                font-semibold shadow-sm transition active:translate-y-[1px]
                hover:bg-white/85
                px-4 py-2 text-sm
                sm:px-5 sm:py-2.5 sm:text-sm
                disabled:opacity-60 disabled:cursor-not-allowed
              "
            >
              {fetching ? "Fetching..." : "Fetch Stickies"}
            </button>
          </div>

          {/* Right side reserved for later */}
          <div />
        </div>
      </div>
    </div>
  );
}
