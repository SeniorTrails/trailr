import React, { useState, useEffect } from 'react';
import {
  GoogleMap,
  withGoogleMap,
  withScriptjs,
  Marker,
  InfoWindow,
} from 'react-google-maps';

import * as trailData from '../data/trail-data.json';

let userLocation = { lat: 30.33735, lng: -90.03733 };
navigator.geolocation.getCurrentPosition((position) => {
  const { latitude, longitude } = position.coords;
  userLocation = { lat: latitude, lng: longitude };
});
function Map() {
  const [selectedTrail, setSelectedTrail] = useState(null);

  useEffect(() => {
    const listener = (e) => {
      if (e.key === 'Escape') {
        setSelectedTrail(null);
      }
    };
    window.addEventListener('keydown', listener);

    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  return (
    <GoogleMap defaultZoom={12} defaultCenter={userLocation}>
      {trailData.data.map((trail) => (
        <Marker
          key={trail.id}
          position={{
            lat: +trail.lat,
            lng: +trail.lon,
          }}
          onClick={() => {
            setSelectedTrail(trail);
          }}
        />
      ))}

      {selectedTrail && (
        <InfoWindow
          onCloseClick={() => {
            setSelectedTrail(null);
          }}
          position={{
            lat: +selectedTrail.lat,
            lng: +selectedTrail.lon,
          }}
        >
          <div>
            <h2>{selectedTrail.name}</h2>
            <p>{selectedTrail.description}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

const MapWrapped = withScriptjs(withGoogleMap(Map));

export default MapWrapped;
