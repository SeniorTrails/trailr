import React, { useState, setState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as trailData from '../data/trail-data.json';

const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  InfoWindow,
  Marker,
} = require('react-google-maps');
const {
  SearchBox,
} = require('react-google-maps/lib/components/places/SearchBox');
const {
  MarkerClusterer,
} = require('react-google-maps/lib/components/addons/MarkerClusterer');

function Map() {
  const [selectedTrail, setSelectedTrail] = useState(null);
  const [userLocation, setUserLocation] = useState({
    lat: 30.33735,
    lng: -90.03733,
  });
  const [markers, setMarkers] = useState(trailData.data);

  const onMarkerClustererClick = () => (markerClusterer) => {
    markerClusterer.getMarkers();
  };

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
    <GoogleMap
      defaultZoom={10}
      defaultCenter={userLocation}
      center={userLocation}
    >
      <MarkerClusterer
        onClick={onMarkerClustererClick}
        averageCenter
        enableRetinaIcons
        gridSize={60}
      >
        {markers.map((trail) => (
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
              <Link to={`/trail/${selectedTrail.id}`} activeClassName="active">
                <h2>{selectedTrail.name}</h2>
              </Link>
              <p>{selectedTrail.length} miles</p>
              <p>{selectedTrail.description}</p>
            </div>
          </InfoWindow>
        )}
      </MarkerClusterer>
    </GoogleMap>
  );
}

const MapWithASearchBox = withScriptjs(withGoogleMap(Map));

export default MapWithASearchBox;

// import React from 'react';
// import * as trailData from '../data/trail-data.json';

// const _ = require('lodash');
// const {
//   compose,
//   withProps,
//   lifecycle,
//   withHandlers,
//   withState,
// } = require('recompose');
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

// const MapWithASearchBox = compose(
//   withState('places', 'updatePlaces', ''),
//   withState('selectedPlace', 'updateSelectedPlace', null),
//   withProps({
//     googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.GOOGLE_MAPS_API_KEY}`,
//     loadingElement: <div style={{ height: '100%' }} />,
//     containerElement: <div style={{ height: '1000px' }} />,
//     mapElement: <div style={{ height: '100%' }} />,
//   }),
//   lifecycle({
//     componentWillMount() {
//       const refs = {};

//       navigator.geolocation.getCurrentPosition((position) => {
//         const { latitude, longitude } = position.coords;
//         this.setState({
//           center: { lat: latitude, lng: longitude },
//         });
//       });

//       this.setState({
//         bounds: null,
//         selectedTrail: null,
//         center: { lat: 30.33735, lng: -90.03733 },
//         markers: trailData.data,
//         onMapMounted: (ref) => {
//           refs.map = ref;
//         },
//         onBoundsChanged: () => {
//           this.setState({
//             bounds: refs.map.getBounds(),
//             center: refs.map.getCenter(),
//           });
//         },
//         onSearchBoxMounted: (ref) => {
//           refs.searchBox = ref;
//         },
//         onPlacesChanged: () => {
//           const places = refs.searchBox.getPlaces();
//           const bounds = new google.maps.LatLngBounds();

//           places.forEach((place) => {
//             if (place.geometry.viewport) {
//               bounds.union(place.geometry.viewport);
//             } else {
//               bounds.extend(place.geometry.location);
//             }
//           });
//           const nextMarkers = places.map((place) => ({
//             position: place.geometry.location,
//           }));
//           const nextCenter = _.get(
//             nextMarkers,
//             '0.position',
//             this.state.center
//           );

//           this.setState({
//             center: nextCenter,
//             markers: nextMarkers,
//           });
//         },
//       });
//     },
//   }),
//   withHandlers(() => {
//     return {
//       onToggleOpen: ({ updateSelectedPlace }) => (key) => {
//         updateSelectedPlace(key);
//       },
//     };
//   }),
//   withScriptjs,
//   withGoogleMap
// )((props) => (
//   <GoogleMap
//     ref={props.onMapMounted}
//     defaultZoom={10}
//     center={props.center}
//     onBoundsChanged={props.onBoundsChanged}
//   >
//     <SearchBox
//       ref={props.onSearchBoxMounted}
//       bounds={props.bounds}
//       controlPosition={google.maps.ControlPosition.TOP_LEFT}
//       onPlacesChanged={props.onPlacesChanged}
//     >
//       <input
//         type="text"
//         placeholder="Search"
//         style={{
//           boxSizing: 'border-box',
//           border: '1px solid transparent',
//           width: '240px',
//           height: '40px',
//           marginTop: '10px',
//           padding: '0 12px',
//           borderRadius: '3px',
//           boxShadow: '0 2px 2px rgba(0, 0, 0, 0.1)',
//           fontSize: '15px',
//           outline: 'none',
//           textOverflow: 'ellipses',
//         }}
//       />
//     </SearchBox>
//     {props.markers &&
//       props.markers.map((trail, i) => (
//         <Marker
//           onClick={() => props.onToggleOpen(i)}
//           key={trail.id}
//           position={{
//             lat: +trail.lat,
//             lng: +trail.lon,
//           }}
//         >
//           {props.selectedPlace === i && (
//             <InfoWindow onCloseClick={props.onToggleOpen}>
//               <div>
//                 <h6>{trail.name}</h6>
//                 <p>{trail.length} miles</p>
//                 <p>{trail.description}</p>
//               </div>
//             </InfoWindow>
//           )}
//         </Marker>
//       ))}
//   </GoogleMap>
// ));

// export default MapWithASearchBox;
