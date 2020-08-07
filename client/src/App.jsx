import React from 'react';
import MapWrapped from './components/MapWrapped.jsx';
import Header from './components/header.jsx';

const app = () => {
  return (
    <div className='container'>
      <Header />
      <div className='row'>
        <div className='col-12' style={{ width: '100%', height: '900px' }}>
          <MapWrapped
            googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=${process.env.GOOGLE_MAPS_API_KEY}`}
            containerElement={<div style={{ height: `100%` }} />}
            mapElement={<div style={{ height: `100%` }} />}
            loadingElement={<div style={{ height: `100%` }} />}
          />
        </div>
      </div>
    </div>
  );
};

export default app;
