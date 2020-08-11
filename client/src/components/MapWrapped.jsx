import React, { Component, useEffect, useState } from 'react';
import isEmpty from 'lodash.isempty';
import { Link } from 'react-router-dom';
import MarkerClusterer from '@google/markerclusterer';
import Marker from './Marker.jsx';
import InfoWindow from './InfoWindow.jsx';
import GoogleMap from './GoogleMap.jsx';
import SearchBox from './SearchBox.jsx';
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

    this.escHandler = this.escHandler.bind(this);
  }

  componentDidMount() {
    window.addEventListener('keydown', this.escHandler);

    const script = document.createElement('script');
    script.src =
      'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/markerclusterer.js';
    script.async = true;
    document.body.appendChild(script);
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.escHandler);
  }

  setGoogleMapRef(map, maps) {
    this.setState({
      mapApiLoaded: true,
      mapInstance: map,
      mapApi: maps,
    });
    this.googleMapRef = map;
    this.googleRef = maps;
    const { places } = this.state;
    let locations = places.reduce((coordinates, currentTrail) => {
      coordinates.push({ lat: +currentTrail.lat, lng: +currentTrail.lon });
      return coordinates;
    }, []);
    let markers =
      locations &&
      locations.map((location) => {
        return new this.googleRef.Marker({ position: location });
      });

    let markerCluster = new MarkerClusterer(map, markers, {
      imagePath:
        'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m',
      gridSize: 10,
      minimumClusterSize: 2,
    });
  }

  addPlace = (place) => {
    this.setState({ places: place });
  };

  clearSelectedTrail = () => {
    this.setState({ selectedTrail: null });
    this.setState({ selectedTrailIndex: null });
  };

  escHandler(event) {
    if (event.key === 'Escape') {
      this.clearSelectedTrail();
    }
  }

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
          onGoogleApiLoaded={({ map, maps }) => this.setGoogleMapRef(map, maps)}
          options={{ streetViewControl: false }}
        >
          {!isEmpty(places) &&
            places.map((place, i) => (
              <Marker
                color={i === this.state.selectedTrailIndex ? 'green' : 'blue'}
                key={place.id}
                text={place.name}
                lat={place.lat || place.geometry.location.lat()}
                lng={place.lon || place.geometry.location.lng()}
                clickHandler={() => {
                  if (this.state.selectedTrailIndex === i) {
                    this.clearSelectedTrail();
                  } else {
                    this.setState({ selectedTrail: place });
                    this.setState({ selectedTrailIndex: i });
                  }
                }}
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
