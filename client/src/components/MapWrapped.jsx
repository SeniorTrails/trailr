import React, { useEffect, useState } from 'react';
import isEmpty from 'lodash.isempty';
import { Link } from 'react-router-dom';
import MarkerClusterer from '@google/markerclusterer';
import axios from 'axios';
import Marker from './Marker.jsx';
import InfoWindow from './InfoWindow.jsx';
import GoogleMap from './GoogleMap.jsx';
import SearchBox from './SearchBox.jsx';
import transparentMarker from '../../assets/imgs/transparentMarker.png';
import * as trailData from '../data/trail-data.json';

// const MapWithASearchBox = React.memo(() => {
const MapWithASearchBox = () => {
  const [mapApiLoaded, setMapApiLoaded] = useState(false);
  const [mapInstance, setMapInstance] = useState(null);
  const [mapApi, setMapApi] = useState(null);
  const [places, setPlaces] = useState(trailData.data);
  const [geolocation, setGeolocation] = useState(false);
  const [userLocation, setUserLocation] = useState({
    lat: 30.33735,
    lng: -90.03733,
  });
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [selectedTrailIndex, setSelectedTrailIndex] = useState(null);

  const addPlace = (place) => {
    setPlaces(place);
  };

  const clearSelectedTrail = () => {
    setSelectedTrail(null);
    setSelectedTrailIndex(null);
  };

  const updateTrails = (radius, lat, lng) => {
    const strungRadius = radius.toString();
    const strungLat = lat.toString();
    const strungLng = lng.toString();
    axios
      .get('/api/trails', {
        params: {
          radius: strungRadius,
          lat: strungLat,
          lon: strungLng,
        },
      })
      .then(({ data }) => {
        // console.log(
        //   `🥾Trails back from API, GET req sent w/ radius:${radius}, lat: ${lat}, lon: ${lng}: `
        // );
        // console.log(data);
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

    if (!geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({ lat: latitude, lng: longitude });
        setGeolocation(true);
      });
    }
    return () => {
      window.removeEventListener('keydown', listener);
    };
  }, []);

  const setGoogleMapRef = (map, maps) => {
    if (map && maps) {
      let currentZoom = currentZoom || 10;
      let lastSearchedCenter = lastSearchedCenter || userLocation;
      map.addListener('zoom_changed', () => {
        currentZoom = map.getZoom();
      });
      map.addListener('bounds_changed', () => {
        const currentBounds = map.getBounds();
        const currentCenter = {
          lat: (currentBounds.Za.i + currentBounds.Za.j) / 2,
          lng: (currentBounds.Va.i + currentBounds.Va.j) / 2,
        };
        const range = 0.6; // degrees change, approx 69 miles per 1 latitude/longitude
        const radius = 100; // miles
        if (
          Math.abs(+currentCenter.lat - +lastSearchedCenter.lat) > range ||
          Math.abs(+currentCenter.lng - +lastSearchedCenter.lng) > range
        ) {
          lastSearchedCenter = currentCenter;
          updateTrails(radius, currentCenter.lat, currentCenter.lng);
        }
      });

      setMapInstance(map);
      setMapApi(maps);
      setMapApiLoaded(true);
      const googleRef = maps;
      if (places) {
        const locations = places.reduce((coordinates, currentTrail) => {
          coordinates.push({ lat: +currentTrail.lat, lng: +currentTrail.lon });
          return coordinates;
        }, []);
        const markers =
          locations &&
          locations.map((location) => {
            return new googleRef.Marker({
              position: location,
              icon: transparentMarker,
            });
          });

        new MarkerClusterer(map, markers, {
          imagePath:
            'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
          // styles: {
          //   textColor: 'white',
          //   url:
          //     'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
          //   height: 1,
          //   width: 1,
          // },
          gridSize: 15,
          minimumClusterSize: 2,
        });
      }
    }
  };

  useEffect(() => {
    setGoogleMapRef(mapInstance, mapApi);
  }, [places]);

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
        {!isEmpty(places) &&
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
