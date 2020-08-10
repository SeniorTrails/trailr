import React, {useState, useEffect} from 'react';
import {
  GoogleMap,
  withGoogleMap,
  withScriptjs,
  Marker,
  InfoWindow,
} from 'react-google-maps';

const selectedDot = {url: "http://maps.google.com/mapfiles/ms/icons/green-dot.png" };
const dot = { url: "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" };

const Map = ({ location, id, photoInfo, changeCurrentPhoto, currentPhoto }) => {
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
    <GoogleMap defaultZoom={15} defaultCenter={location}>
      <Marker key={id} position={location} />
      {photoInfo.map((item, i) => (
        <Marker
          icon={i === currentPhoto ? selectedDot : dot}
          onClick={()=> changeCurrentPhoto(i)}
          key={item.id}
          position={{ lat: item.lat, lng: item.lng }}
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
};

const MapWrapped = withScriptjs(withGoogleMap(Map));

export default MapWrapped;
