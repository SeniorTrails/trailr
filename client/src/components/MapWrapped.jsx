import React, { Component, useEffect, useState } from 'react';
import isEmpty from 'lodash.isempty';
import Marker from './Marker.jsx';
import InfoWindow from './MarkerInfoWindow.jsx';
import GoogleMap from './GoogleMap.jsx';
import SearchBox from './SearchBox.jsx';
import { Link } from 'react-router-dom';
import * as trailData from '../data/trail-data.json';

class MapWithASearchBox extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mapApiLoaded: false,
      mapInstance: null,
      mapApi: null,
      places: trailData.data,
      selectedTrail: null,
      selectedTrailIndex: null,
      userLocation: {
        lat: 30.33735,
        lng: -90.03733,
      },
    };
  }

  // onMarkerClustererClick = () => (markerClusterer) => {
  //   markerClusterer.getMarkers();
  // };

  apiHasLoaded = (map, maps) => {
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
    });
  };

  addPlace = (place) => {
    this.setState({ places: place });
  };

  render() {
    const { places, mapApiLoaded, mapInstance, mapApi } = this.state;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      this.setState({ userLocation: { lat: latitude, lng: longitude } });
    });

    return (
      <>
        {mapApiLoaded && (
          <SearchBox
            map={mapInstance}
            mapApi={mapApi}
            addplace={this.addPlace}
          />
        )}
        <GoogleMap
          defaultZoom={10}
          defaultCenter={{
            lat: 30.33735,
            lng: -90.03733,
          }}
          center={this.state.userLocation}
          bootstrapURLKeys={{
            key: process.env.GOOGLE_MAPS_API_KEY,
            libraries: ['places', 'geometry'],
          }}
          yesIWantToUseGoogleMapApiInternals
          onGoogleApiLoaded={({ map, maps }) => this.apiHasLoaded(map, maps)}
        >
          {!isEmpty(places) &&
            places.map((place, i) => (
              <Marker
                color={i === this.state.selectedTrailIndex ? 'green' : 'blue'}
                key={place.id}
                text={place.name}
                lng={place.lon}
                lat={place.lat}
                clickHandler={() => {
                  if (this.state.selectedTrailIndex === i) {
                    this.setState({ selectedTrail: null });
                    this.setState({ selectedTrailIndex: null });
                  } else {
                    this.setState({ selectedTrail: place });
                    this.setState({ selectedTrailIndex: i });
                  }
                }}
                // lat={place.geometry.location.lat()}
                // lng={place.geometry.location.lng()}
              />
            ))}
          {this.state.selectedTrail && (
            <InfoWindow
              props={this.state}
              onCloseClick={() => {
                this.setState({ selectedTrail: null });
              }}
              position={{
                lat: +this.state.selectedTrail.lat,
                lng: +this.state.selectedTrail.lon,
              }}
            >
              <div>
                <Link
                  to={`/trail/${this.state.selectedTrail.id}`}
                  activeclassname="active"
                >
                  <h2>{this.state.selectedTrail.name}</h2>
                </Link>
                <p>{this.state.selectedTrail.length} miles</p>
                <p>{this.state.selectedTrail.description}</p>
              </div>
            </InfoWindow>
          )}
        </GoogleMap>
      </>
    );
  }
}

export default MapWithASearchBox;
