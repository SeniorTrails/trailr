import React, { useState, useEffect } from 'react';
import * as trailData from '../data/trail-data.json';

trailData.data.forEach((trail) => {
  if (trail.isOpen === undefined) {
    trail.isOpen = 'false';
  }
});

// const { FaAnchor } = require('react-icons/fa');
const _ = require('lodash');
const {
  compose,
  withProps,
  lifecycle,
  withStateHandlers,
} = require('recompose');
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

const MapWithASearchBox = compose(
  withStateHandlers(
    () => ({
      isOpen: false,
    }),
    {
      onToggleOpen: ({ isOpen }) => () => ({
        isOpen: !isOpen,
      }),
    },
  ),
  withProps({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.GOOGLE_MAPS_API_KEY}`,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '1000px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  }),
  lifecycle({
    selectPlace(i) {
      console.log(i);
      this.setState({
        selectedPlace: i,
      });
    },
    componentWillMount() {
      const refs = {};

      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        this.setState({
          center: { lat: latitude, lng: longitude },
        });
      });

      this.setState({
        bounds: null,
        selectedTrail: null,
        center: { lat: 30.33735, lng: -90.03733 },
        markers: trailData.data,
        onMapMounted: (ref) => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          });
        },
        onSearchBoxMounted: (ref) => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new google.maps.LatLngBounds();

          places.forEach((place) => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport);
            } else {
              bounds.extend(place.geometry.location);
            }
          });
          const nextMarkers = places.map((place) => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(
            nextMarkers,
            '0.position',
            this.state.center,
          );

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
        },
      });
    },
  }),
  withScriptjs,
  withGoogleMap
)((props) => (
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={10}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
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
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
          fontSize: '15px',
          outline: 'none',
          textOverflow: 'ellipses',
        }}
      />
    </SearchBox>
    {props.markers.map((trail, i) => (
      <Marker
        key={trail.id}
        position={{
          lat: +trail.lat,
          lng: +trail.lon,
        }}
        onClick={props.onToggleOpen}
        // onClick={props.selectPlace.bind(i)}
      >
        {props.isOpen && (
          <InfoWindow
            onCloseClick={props.onToggleOpen}
            position={{
              lat: +trail.lat,
              lng: +trail.lon,
            }}
          >
            <div>
              <h6>{trail.name}</h6>
              <p>{trail.length} miles</p>
            </div>
          </InfoWindow>
        )}
      </Marker>
    ))}
  </GoogleMap>
));

export default MapWithASearchBox;