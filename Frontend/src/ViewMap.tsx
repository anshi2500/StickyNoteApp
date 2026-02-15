import React, { useEffect, useState } from "react";
import { useJsApiLoader, GoogleMap } from "@react-google-maps/api";
import Navbar from "./components/Navbar";
import MapBar from "./components/MapBar";
import CreateStickyModal from "./components/CreateStickyModal";
import crosshair from "./images/crosshair.png";

const center = { lat: 51.0802, lng: -114.1304 };

type Sticky = {
  id: string;
  Title?: string;
  Body?: string;
  Tags?: string[] | string;
  Category?: string;
  Prompt?: string;
  Visibility?: "public" | "private";
  Username?: string;
  XCoord: number; // lng
  YCoord: number; // lat
};

const API_BASE = "http://localhost:3000";

function ViewMap() {
  const [open, setOpen] = useState(false);
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [mapCenter, setMapCenter] = useState(center);

  // stickies state (MUST be inside component)
  const [stickies, setStickies] = useState<Sticky[]>([]);
  const [stickiesLoading, setStickiesLoading] = useState(false);
  const [stickiesError, setStickiesError] = useState<string | null>(null);

  const getUsername = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null") as null | { username?: string };
      return (u?.username || "").trim();
    } catch {
      return "";
    }
  };

  // keep mapCenter updated when map stops moving
  useEffect(() => {
    if (!map) return;

    const updateCenter = () => {
      const c = map.getCenter();
      if (!c) return;
      setMapCenter({ lat: c.lat(), lng: c.lng() });
    };

    updateCenter();
    const listener = map.addListener("idle", updateCenter);
    return () => listener.remove();
  }, [map]);

  const fetchStickies = async () => {
    try {
      setStickiesError(null);
      setStickiesLoading(true);

      const lng = mapCenter.lng;
      const lat = mapCenter.lat;

      const res = await fetch(
        `${API_BASE}/notes/fetchAll?userx=${encodeURIComponent(lng)}&usery=${encodeURIComponent(lat)}`
      );

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.error || data?.message || `Fetch failed (${res.status})`);
      }

      setStickies(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setStickiesError(err.message || "Failed to fetch stickies.");
    } finally {
      setStickiesLoading(false);
    }
  };

  if (!isLoaded) {
    return (
      <div className="p-6">
        <p>Map no load :C</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />

      <div className="flex flex-col items-center min-h-screen w-full bg-amber-100">
        <div className="relative h-[500px] w-full bg-white">
          <GoogleMap
            center={mapCenter}
            zoom={18}
            mapContainerStyle={{ width: "100%", height: "100%" }}
            options={{
              mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: false,
              scrollwheel: false,
            }}
            onLoad={(m) => setMap(m)}
          />

          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img src={crosshair} alt="center crosshair" className="h-4 w-4" />
          </div>
        </div>

        <MapBar
          onCreateSticky={() => setOpen(true)}
          onFetchStickies={fetchStickies}
          fetching={stickiesLoading}
        />

        {/* Results under the map */}
        <div className="w-full max-w-6xl px-3 sm:px-6 mt-3 pb-24">
          <div className="rounded-3xl bg-white/75 border border-white/50 shadow-[0_10px_30px_rgba(43,37,58,0.12)] backdrop-blur-[2px] p-4">
            <div className="text-sm font-semibold text-[#2B253A]">Nearby stickies</div>
            <div className="text-xs text-[#4B3F66]">
              Center: {mapCenter.lat.toFixed(5)}, {mapCenter.lng.toFixed(5)}
            </div>

            {stickiesError && (
              <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {stickiesError}
              </div>
            )}

            <div className="mt-3">
              {stickiesLoading ? (
                <div className="text-sm text-[#4B3F66]">Loading stickies…</div>
              ) : stickies.length === 0 ? (
                <div className="text-sm text-[#4B3F66]">No stickies fetched yet.</div>
              ) : (
                <div className="space-y-2">
                  {stickies.map((s) => (
                    <div key={s.id} className="rounded-2xl bg-white/70 border border-white/60 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-semibold text-[#2B253A] truncate">
                            {s.Title || "Untitled"}
                          </div>
                          <div className="text-xs text-[#4B3F66]">
                            @{s.Username || "anon"} {s.Category ? `• ${s.Category}` : ""}{" "}
                            {s.Visibility ? `• ${s.Visibility}` : ""}
                          </div>
                        </div>
                        <div className="text-[11px] text-[#4B3F66]/80 tabular-nums">
                          {Number(s.YCoord).toFixed(4)}, {Number(s.XCoord).toFixed(4)}
                        </div>
                      </div>

                      {s.Body ? (
                        <div className="mt-2 text-sm text-[#4B3F66] whitespace-pre-wrap">{s.Body}</div>
                      ) : null}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <CreateStickyModal
          open={open}
          onClose={() => setOpen(false)}
          defaultUsername={getUsername()}
          defaultX={mapCenter.lng}
          defaultY={mapCenter.lat}
        />
      </div>
    </>
  );
}

export default ViewMap;
