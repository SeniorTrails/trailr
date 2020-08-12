import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash.isempty';
import { Link } from 'react-router-dom';
import MarkerClusterer from '@google/markerclusterer';
import Marker from './Marker.jsx';
import InfoWindow from './InfoWindow.jsx';
import GoogleMap from './GoogleMap.jsx';
import SearchBox from './SearchBox.jsx';
import * as trailData from '../data/trail-data.json';

const MapWithASearchBox = React.memo(() => {
  const [mapApiLoaded, setMapApiLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapApi, setMapApi] = useState(null);
  const [places, setPlaces] = useState(trailData.data);
  const [notClusteredPlaces, setNotClusteredPlaces] = useState(null);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [selectedTrailIndex, setSelectedTrailIndex] = useState(null);
  const [userLocation, setUserLocation] = useState({
    lat: 30.33735,
    lng: -90.03733,
  });
  const [zoom, setZoom] = useState(10);

  const addPlace = (place) => {
    setPlaces(place);
  };

  const clearSelectedTrail = () => {
    setSelectedTrail(null);
    setSelectedTrailIndex(null);
  };

  useEffect(() => {
    const script = document.createElement('script');
    script.src =
      'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js';
    script.async = true;
    document.body.appendChild(script);

    const listener = (e) => {
      if (e.key === 'Escape') {
        clearSelectedTrail();
      }
    };
    window.addEventListener('keydown', listener);

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setUserLocation({ lat: latitude, lng: longitude });
    });
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  const setGoogleMapRef = (map, maps) => {
    let currentZoom = currentZoom || 10;
    map.addListener('zoom_changed', () => {
      currentZoom = map.getZoom();
      setZoom(currentZoom);
      clustering();
    });
    setMapInstance(map);
    setMapApi(maps);
    setMapApiLoaded(true);
    let googleRef = maps;
    const clustering = () => {
      const placesClustered = places.reduce((clusteredTrails, currentTrail) => {
        const scaler = 2 ** currentZoom;
        const notInRange = places.reduce((prev, current) => {
          const threshold = 20;
          if (
            Math.abs(+currentTrail.lat - +current.lat) * scaler < threshold &&
            Math.abs(+currentTrail.lon - +current.lon) * scaler < threshold
          ) {
            prev.push(current);
          }
          return prev;
        }, []);
        clusteredTrails.push([...notInRange]);
        return clusteredTrails;
      }, []);
      const clustered = placesClustered[placesClustered.length - 1];
      let notClustered = places.filter((x) => !clustered.includes(x));
      setNotClusteredPlaces(notClustered);
    };

    let locations = places.reduce((coordinates, currentTrail) => {
      coordinates.push({ lat: +currentTrail.lat, lng: +currentTrail.lon });
      return coordinates;
    }, []);
    let markers =
      locations &&
      locations.map((location) => {
        return new googleRef.Marker({ position: location });
      });

    let markerCluster = new MarkerClusterer(map, markers, {
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
      gridSize: 15,
      minimumClusterSize: 2,
    });

    clustering();
  };

  return (
    <>
      {mapApiLoaded && (
        <SearchBox
          map={mapInstance}
          mapApi={mapApi}
          places={places}
          addplace={addPlace}
        />
      )}
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{
          lat: 30.33735,
          lng: -90.03733,
        }}
        center={userLocation}
        bootstrapURLKeys={{
          key: process.env.GOOGLE_MAPS_API_KEY,
          libraries: ['places', 'geometry'],
        }}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => setGoogleMapRef(map, maps)}
        options={{ streetViewControl: false }}
      >
        {!isEmpty(notClusteredPlaces) &&
        zoom < 12 && // zoom threshold switches
          notClusteredPlaces.map((place, i) => (
            <Marker
              color={i === selectedTrailIndex ? 'green' : 'blue'}
              key={place.id}
              text={place.name}
              lat={place.lat || place.geometry.location.lat()}
              lng={place.lon || place.geometry.location.lng()}
              clickHandler={() => {
                if (selectedTrailIndex === i) {
                  clearSelectedTrail();
                } else {
                  setSelectedTrail(place);
                  setSelectedTrailIndex(i);
                }
              }}
            />
          ))}
        {!isEmpty(places) &&
        zoom >= 12 && // zoom threshold switches
          places.map((place, i) => (
            <Marker
              color={i === selectedTrailIndex ? 'green' : 'blue'}
              key={place.id}
              text={place.name}
              lat={place.lat || place.geometry.location.lat()}
              lng={place.lon || place.geometry.location.lng()}
              clickHandler={() => {
                if (selectedTrailIndex === i) {
                  clearSelectedTrail();
                } else {
                  setSelectedTrail(place);
                  setSelectedTrailIndex(i);
                }
              }}
            />
          ))}
        {selectedTrail && (
          <InfoWindow
            selectedTrail={selectedTrail}
            // props={this.state} // props={this.state}
            onCloseClick={() => {
              clearSelectedTrail();
            }}
            position={{
              lat: +selectedTrail.lat,
              lng: +selectedTrail.lon,
            }}
          >
            <div>
              <Link to={`/trail/${selectedTrail.id}`} activeclassname="active">
                <h2>{selectedTrail.name}</h2>
              </Link>
              <p>{selectedTrail.length} miles</p>
              <p>{selectedTrail.description}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </>
  );
});

export default MapWithASearchBox;
