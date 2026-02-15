import React, { useEffect, useState } from "react";
import { useJsApiLoader, GoogleMap, Marker } from "@react-google-maps/api";
import { useNavigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import MapBar from "./components/MapBar";
import CreateStickyModal from "./components/CreateStickyModal";
import crosshair from "./images/crosshair.png";

// map spawn point: uofc
const center = { lat: 51.0802, lng: -114.1304 };

function ViewMap() {
  const [open, setOpen] = useState(false);

  const navigate = useNavigate();

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);

  // track current center of the map
  const [mapCenter, setMapCenter] = useState(center);

  const getUsername = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null") as
        | null
        | { username?: string };
      return (u?.username || "").trim();
    } catch {
      return "";
    }
  };

  // Update mapCenter when user moves the map
  useEffect(() => {
    if (!map) return;

    const updateCenter = () => {
      const c = map.getCenter();
      if (!c) return;
      setMapCenter({ lat: c.lat(), lng: c.lng() });
    };

    // run once on load
    updateCenter();

    // listen to movement
    const listener = map.addListener("idle", updateCenter); // 'idle' fires after pan/zoom ends
    return () => listener.remove();
  }, [map]);

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
        {/* Make this RELATIVE so the absolute crosshair positions correctly */}
        <div className="relative h-[500px] w-full bg-white">
          <GoogleMap
            center={mapCenter} // use tracked center
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
          >
            {/* Optional: remove this marker if you only want the crosshair */}
            {/* <Marker position={mapCenter} /> */}
          </GoogleMap>

          {/* center marker overlay */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img src={crosshair} alt="center crosshair" className="h-4 w-4" />
          </div>
        </div>

        <MapBar onCreateSticky={() => setOpen(true)} />

        <CreateStickyModal
          open={open}
          onClose={() => setOpen(false)}
          defaultUsername={getUsername()}
          defaultX={mapCenter.lng} // x = lng
          defaultY={mapCenter.lat} // y = lat
        />
      </div>
    </>
  );
}

export default ViewMap;
