export default function MapBar() {
  return (
    <div className="sticky bottom-0 z-40 w-full">
      <div className="w-full bg-[#DCC9FE]/80 backdrop-blur-[1px] border-t border-white/40">
        <div className="mx-auto flex h-8 max-w-6xl items-center justify-start px-3 sm:px-6">
          <button
            className="
              rounded-full border border-black/50 bg-[#D3D3FF] text-[#2B253A]
              font-semibold shadow-sm transition active:translate-y-[1px]
              hover:bg-[#C7C7FF]
              px-4 py-2.5 text-sm
              sm:px-5 sm:py-1 sm:text-sm
              md:px-6 md:py-2.25 md:text-base
            "
          >
            Create Sticky
          </button>
        </div>
      </div>
    </div>
  );
}
