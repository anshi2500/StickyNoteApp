export default function MapBar({ onCreateSticky }: { onCreateSticky: () => void }) {
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
        </div>
      </div>
    </div>
  );
}
