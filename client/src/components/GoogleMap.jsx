import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import isEmpty from 'lodash.isempty';
import Marker from './Marker.jsx';
import SearchBox from './SearchBox.jsx';
import { Link } from 'react-router-dom';
import * as trailData from '../data/trail-data.json';
import GoogleMapReact from 'google-map-react';

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
`;

const GoogleMap = ({ children, ...props }) => (
  <Wrapper>
    <GoogleMapReact
      bootstrapURLKeys={{
        key: process.env.REACT_APP_MAP_KEY,
      }}
      {...props}
    >
      {children}
      {/* {!isEmpty(places) &&
            places.map((place, i) => (
              <Marker
                color={i === this.state.selectedTrailIndex ? 'green' : 'blue'}
                key={place.id}
                text={place.name}
                lng={place.lon}
                lat={place.lat}
                clickHandler={() => {
                  this.setState({ selectedTrail: place });
                  this.setState({ selectedTrailIndex: i });
                }}
                // lat={place.geometry.location.lat()}
                // lng={place.geometry.location.lng()}
              />
            ))} */}
    </GoogleMapReact>
  </Wrapper>
);

GoogleMap.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.arrayOf(PropTypes.node),
  ]),
};

GoogleMap.defaultProps = {
  children: null,
};

export default GoogleMap;