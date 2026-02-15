// google maps api with react source: Mafia Codes on YouTube
// https://www.youtube.com/watch?v=iP3DnhCUIsE

// adding marker on map using touch or tap: Hitesh Sahu on Stackoverflow
// https://stackoverflow.com/questions/17143129/add-marker-on-android-google-map-via-touch-or-tap

import React, { useEffect, useState } from 'react'
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'

// map spawn point: uofc
const center = { lat: 51.0802, lng: -114.1304 }

function ViewMap() {
  // misc ----------------------------------
  // for making sure map is loaded, else, puts placeholder text
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  })


  // state vars ----------------------------
  // const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [map, setMap] = useState<google.maps.Map | null>(null)


  // use effects ---------------------------
  useEffect(() => {
    if (!map) return; // map not loaded yet

    const listener = map.addListener("click", (e: { latLng: { toJSON: () => any } }) => { 
      console.log("Map clicked at:", e.latLng?.toJSON())
    })
    
    return () => listener.remove() // cleanup

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
  return (
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
          center = {center}
          zoom = {18}
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
          <Marker position={center}/>

        </GoogleMap>

      </div>
    </div>

    
  );
};

export default ViewMap
