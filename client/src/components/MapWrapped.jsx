import React, { useState, useEffect, useRef, Component } from 'react';
import GoogleMapReact from 'google-map-react';

import ReactDOM from 'react-dom';
import { Link } from 'react-router-dom';
import SearchBox from './SearchBox.jsx';
import Marker from './Marker.jsx';
import * as trailData from '../data/trail-data.json';

function MapWithASearchBox() {
  // const mapRef = useRef();
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [userLocation, setUserLocation] = useState({
    lat: 30.33735,
    lng: -90.03733,
  });
  const [markers, setMarkers] = useState(trailData.data);
  const [bounds, setBounds] = useState(null);
  // const [zoom, setZoom] = useState(10);
  // const [center, setCenter] = useState({});

  // const onMarkerClustererClick = () => (markerClusterer) => {
  //   markerClusterer.getMarkers();
  // };

  useEffect(() => {
    const listener = (e) => {
      if (e.key === 'Escape') {
        setSelectedTrail(null);
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

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY }}
        defaultZoom={10}
        center={userLocation}
        yesIWantToUseGoogleMapApiInternals
      >
        {/* <SearchBox
          // ref={onSearchBoxMounted}
          // onPlacesChanged={onPlacesChanged}
          bounds={bounds}
          // controlPosition={google.maps.ControlPosition.TOP_LEFT}
        >
          <input
            type="text"
            placeholder="Search"
            style={{
              boxSizing: 'border-box',
              border: '1px solid transparent',
              width: '240px',
              height: '40px',
              marginTop: '10px',
              padding: '0 12px',
              borderRadius: '3px',
              boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
              fontSize: '15px',
              outline: 'none',
              textOverflow: 'ellipses',
            }}
          />
        </SearchBox> */}
        {/* <MarkerClusterer
          onClick={onMarkerClustererClick}
          averageCenter
          enableRetinaIcons
          gridSize={60}
        > */}
        {markers.map((item, i) => (
          <Marker
            color={i === selectedTrail ? 'green' : 'blue'}
            clickHandler={() => setSelectedTrail(i)}
            key={item.id}
            lng={item.lon}
            lat={item.lat}
          />
        ))}
        {/* {selectedTrail && (
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
              <Link to={`/trail/${selectedTrail.id}`} activeclassname="active">
                <h2>{selectedTrail.name}</h2>
              </Link>
              <p>{selectedTrail.length} miles</p>
              <p>{selectedTrail.description}</p>
            </div>
          </InfoWindow>
        )} */}
        {/* </MarkerClusterer> */}
      </GoogleMapReact>
    </div>
  );
}

export default MapWithASearchBox;
// process.env.GOOGLE_MAPS_API_KEY
// import React, { useState, setState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import * as trailData from '../data/trail-data.json';

// const _ = require('lodash');
// const {
//   withScriptjs,
//   withGoogleMap,
//   GoogleMap,
//   InfoWindow,
//   Marker,
// } = require('react-google-maps');
// const {
//   SearchBox,
// } = require('react-google-maps/lib/components/places/SearchBox');
// const {
//   MarkerClusterer,
// } = require('react-google-maps/lib/components/addons/MarkerClusterer');

// function Map() {
//   const refs = {};
//   const [selectedTrail, setSelectedTrail] = useState(null);
//   const [userLocation, setUserLocation] = useState({
//     lat: 30.33735,
//     lng: -90.03733,
//   });
//   const [markers, setMarkers] = useState(trailData.data);
//   const [bounds, setBounds] = useState();
//   const [center, setCenter] = useState({});

//   const onMarkerClustererClick = () => (markerClusterer) => {
//     markerClusterer.getMarkers();
//   };

//   // SEARCH BAR
//   const onMapMounted = (ref) => {
//     refs.map = ref;
//   };
//   const onSearchBoxMounted = (ref) => {
//     refs.searchBox = ref;
//   };

//   const onBoundsChanged = () => {
//     setBounds(refs.map.getBounds());
//     if (refs.map === null) {
//       setCenter(userLocation);
//     } else {
//       setCenter(refs.map.getCenter());
//     }
//   };
//   const onPlacesChanged = () => {
//     const places = refs.searchBox.getPlaces();
//     const bounds = new google.maps.LatLngBounds();
//     places.forEach((place) => {
//       if (place.geometry.viewport) {
//         bounds.union(place.geometry.viewport);
//       } else {
//         bounds.extend(place.geometry.location);
//       }
//     });
//     const nextMarkers = places.map((place) => ({
//       position: place.geometry.location,
//     }));
//     const nextCenter = _.get(nextMarkers, '0.position', center);
//     setMarkers(nextMarkers);
//     setCenter(nextCenter);
//   };

//   useEffect(() => {
//     const listener = (e) => {
//       if (e.key === 'Escape') {
//         setSelectedTrail(null);
//       }
//     };
//     window.addEventListener('keydown', listener);
//     navigator.geolocation.getCurrentPosition((position) => {
//       const { latitude, longitude } = position.coords;
//       setUserLocation({ lat: latitude, lng: longitude });
//     });
//     return () => {
//       window.removeEventListener('keydown', listener);
//     };
//   }, []);

//   return (
//     <GoogleMap
//       ref={onMapMounted}
//       onBoundsChanged={onBoundsChanged}
//       defaultZoom={10}
//       defaultCenter={userLocation}
//       center={userLocation}
//     >
//       <SearchBox
//         ref={onSearchBoxMounted}
//         onPlacesChanged={onPlacesChanged}
//         bounds={bounds}
//         controlPosition={google.maps.ControlPosition.TOP_LEFT}
//       >
//         <input
//           type="text"
//           placeholder="Search"
//           style={{
//             boxSizing: 'border-box',
//             border: '1px solid transparent',
//             width: '240px',
//             height: '40px',
//             marginTop: '10px',
//             padding: '0 12px',
//             borderRadius: '3px',
//             boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
//             fontSize: '15px',
//             outline: 'none',
//             textOverflow: 'ellipses',
//           }}
//         />
//       </SearchBox>
//       <MarkerClusterer
//         onClick={onMarkerClustererClick}
//         averageCenter
//         enableRetinaIcons
//         gridSize={60}
//       >
//         {markers.map((trail) => (
//           <Marker
//             key={trail.id}
//             position={{
//               lat: +trail.lat,
//               lng: +trail.lon,
//             }}
//             onClick={() => {
//               setSelectedTrail(trail);
//             }}
//           />
//         ))}
//         {selectedTrail && (
//           <InfoWindow
//             onCloseClick={() => {
//               setSelectedTrail(null);
//             }}
//             position={{
//               lat: +selectedTrail.lat,
//               lng: +selectedTrail.lon,
//             }}
//           >
//             <div>
//               <Link to={`/trail/${selectedTrail.id}`} activeclassname="active">
//                 <h2>{selectedTrail.name}</h2>
//               </Link>
//               <p>{selectedTrail.length} miles</p>
//               <p>{selectedTrail.description}</p>
//             </div>
//           </InfoWindow>
//         )}
//       </MarkerClusterer>
//     </GoogleMap>
//   );
// }

// const MapWithASearchBox = withScriptjs(withGoogleMap(Map));

// export default MapWithASearchBox;
