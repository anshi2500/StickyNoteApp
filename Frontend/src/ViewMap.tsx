// google maps api with react source: Mafia Codes on YouTube
// https://www.youtube.com/watch?v=iP3DnhCUIsE

// adding marker on map using touch or tap: Hitesh Sahu on Stackoverflow
// https://stackoverflow.com/questions/17143129/add-marker-on-android-google-map-via-touch-or-tap

import React, { useEffect, useState } from 'react'
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'
import { useNavigate } from "react-router-dom";
import Navbar from './components/Navbar';
import MapBar from './components/MapBar';

import CreateStickyModal from './components/CreateStickyModal';
import crosshair from './images/crosshair.svg';

// map spawn point: uofc
const center = { lat: 51.0802, lng: -114.1304 }

function ViewMap() {
  const [open, setOpen] = useState(false); // for create sticky modal

  // misc ----------------------------------
  // For react router and navigation for now
  const navigate = useNavigate();

  // for making sure map is loaded, else, puts placeholder text
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  })


  // state vars ----------------------------
  // const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [enableClickListener, setClickListener] = useState(false)

  const getUsername = () => {
    try {
      const u = JSON.parse(localStorage.getItem("user") || "null") as null | { username?: string };
      return (u?.username || "").trim();
    } catch {
      return "";
    }
  };


  // use effects ---------------------------
  useEffect(() => {
    // if map not loaded yet
    if (!map) return;

    // if listener off
    if (!enableClickListener) return;

    // attach listener
    const listener = map.addListener("click", (e: { latLng: { toJSON: () => any } }) => {
      console.log("Map clicked at:", e.latLng?.toJSON())
    })

    // cleans up when:
    // -> enableClickListener changes
    // -> map changes
    // -> component unmounts
    return () => listener.remove()
  }, [map]);


  // functions ---------------------------
  if (!isLoaded) {
    return (
      <div>
        <p>
          Map no load :C
        </p>
      </div>
    )
  }


  // react component -----------------------
  return (<>
    <Navbar />

    <div
      // style={{
      //   display: 'flex',
      //   flexDirection: 'column',
      //   alignItems: 'center',
      //   minHeight: '100vh',
      //   minWidth: '100vw',
      //   position: 'relative'}}
      className="
    flex 
    flex-col 
    items-center 
    min-h-screen 
    min-w-screen 
    bg-amber-100"
    >
      <div
        // style={{
        // display: 'flex',
        // justifyContent: 'center',
        // alignItems: 'center',
        // width: '100%',
        // position: 'relative'
        // }}
        className="
      h-[500px] 
      w-full 
      bg-white"
      >
        
        <GoogleMap
          center={center}
          zoom={18}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            mapId: import.meta.env.VITE_GOOGLE_MAPS_ID,
            // mapId: '9174cbd9ad1bf3f235c5907a',
            zoomControl: true,
            streetViewControl: true,
            mapTypeControl: true,
            fullscreenControl: false,
            scrollwheel: false
          }}
          onLoad={map => setMap(map)}
        >
          {/* <Marker position={center}/> */}

        </GoogleMap>

        {/* center marker overlay */}
        <div 
        className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-0 -translate-y-20">
          <img src={crosshair} alt="center crosshair" className="h-4 w-4" />
        </div>

      </div>
      <MapBar onCreateSticky={() => setOpen(true)} />

      <CreateStickyModal
        open={open}
        onClose={() => setOpen(false)}
        defaultUsername={getUsername()}
        defaultX={center.lng}
        defaultY={center.lat}
      />

    </div>
  </>);
};

export default ViewMap
