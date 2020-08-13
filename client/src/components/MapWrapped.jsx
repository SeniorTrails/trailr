import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash.isempty';
import { Link } from 'react-router-dom';
import MarkerClusterer from '@google/markerclusterer';
import axios from 'axios';
import Marker from './Marker.jsx';
import InfoWindow from './InfoWindow.jsx';
import GoogleMap from './GoogleMap.jsx';
import SearchBox from './SearchBox.jsx';
import * as trailData from '../data/trail-data.json';

// const MapWithASearchBox = React.memo(() => {
const MapWithASearchBox = () => {
  const [mapApiLoaded, setMapApiLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapApi, setMapApi] = useState(null);
  const [places, setPlaces] = useState(trailData.data);
  const [center, setCenter] = useState(null);
  const [userLocation, setUserLocation] = useState({
    lat: 30.33735,
    lng: -90.03733,
  });
  const [notClusteredPlaces, setNotClusteredPlaces] = useState(null);
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [selectedTrailIndex, setSelectedTrailIndex] = useState(null);
  const [zoom, setZoom] = useState(10);

  const addPlace = (place) => {
    setPlaces(place);
  };

  const clearSelectedTrail = () => {
    setSelectedTrail(null);
    setSelectedTrailIndex(null);
  };

  const updateTrails = (radius, lat, lng) => {
    axios
      .get('/api/trails', {
        radius,
        lat,
        lon: lng,
      })
      .then(({ data }) => {
        console.log(`🥾Trails back from API, GET req sent w/ radius:${radius}, lat: ${lat}, lon: ${lng}: `);
        console.log(data);
        setPlaces(data);
      })
      .catch((err) => {
        console.error(err);
      });
  };

  useEffect(() => {
    updateTrails(100, userLocation.lat, userLocation.lng);
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
    let lastSearchedCenter = lastSearchedCenter || userLocation;
    map.addListener('zoom_changed', () => {
      currentZoom = map.getZoom();
      setZoom(currentZoom);
      clustering();
    });
    map.addListener('bounds_changed', () => {
      const currentBounds = map.getBounds();
      const currentCenter = {
        lat: (currentBounds.Za.i + currentBounds.Za.j) / 2,
        lng: (currentBounds.Va.i + currentBounds.Va.j) / 2,
      };
      // setCenter(currentCenter);
      const range = 0.5; // degrees change, approx 69 miles per 1 latitude/longitude
      const radius = 100; // miles
      if (
        Math.abs(+currentCenter.lat - +lastSearchedCenter.lat) > range ||
        Math.abs(+currentCenter.lng - +lastSearchedCenter.lng) > range
      ) {
        lastSearchedCenter = (currentCenter);
        updateTrails(radius, currentCenter.lat, currentCenter.lng);
      }
    });
    setMapInstance(map);
    setMapApi(maps);
    setMapApiLoaded(true);
    const googleRef = maps;
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
      const notClustered = places.filter((x) => !clustered.includes(x));
      setNotClusteredPlaces(notClustered);
    };

    const locations = places.reduce((coordinates, currentTrail) => {
      coordinates.push({ lat: +currentTrail.lat, lng: +currentTrail.lon });
      return coordinates;
    }, []);
    const markers =
      locations &&
      locations.map((location) => {
        return new googleRef.Marker({ position: location });
      });

    new MarkerClusterer(map, markers, {
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
          zoom < 12 &&
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
          zoom >= 12 &&
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
};

export default MapWithASearchBox;
