// google maps api with react source: Mafia Codes on YouTube
// https://www.youtube.com/watch?v=iP3DnhCUIsE

import React, { useEffect, useState } from 'react'
import { useJsApiLoader, GoogleMap, Marker } from '@react-google-maps/api'

// map spawn point: uofc
const center = { lat: 51.0802, lng: -114.1304 }

function ViewMap() {
  // for making sure map is loaded, else, puts placeholder text
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  })

  // const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [map, setMap] = useState<google.maps.Map | null>(null)

  // useEffect(() => {
  //   if (!map) return; // map not loaded yet

  //   map.setZoom(12);
  //   map.panTo({ lat: 51.0802, lng: -114.1304 });
  // }, [map]);



  if (!isLoaded) {
    return (
      <div>
        <p>
          Map no load :C
        </p>
      </div>
    )
  }
  
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
