import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import GoogleMapReact from 'google-map-react';

const Wrapper = styled.main`
  width: 100%;
  height: 100%;
`;

/**
 * Wraps the Google Map in a 100% size wrapper and returns it
 */
const GoogleMap = React.memo(({ children, ...props }) => (
  <Wrapper>
    <GoogleMapReact
      bootstrapURLKeys={{
        key: process.env.GOOGLE_MAPS_API_KEY,
      }}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
    >
      {children}
    </GoogleMapReact>
  </Wrapper>
));

GoogleMap.defaultProps = {
  children: null,
};

export default GoogleMap;

GoogleMap.propTypes = {
  children: PropTypes.node,
};
