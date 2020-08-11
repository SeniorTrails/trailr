import React from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker.jsx';

const Map = ({ location, photoInfo, changeCurrentPhoto, currentPhoto }) => {
  const photoList = photoInfo || [];

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: process.env.GOOGLE_MAPS_API_KEY }}
      defaultCenter={{ lat: 0, lng: 0 }}
      center={location}
      defaultZoom={15}
    >
      <Marker lat={location.lat} lng={location.lng} clickHandler={()=>{}} />
      {photoList.map((item, i) => (
        <Marker
          color={i === currentPhoto ? 'green' : 'blue'}
          clickHandler={()=> changeCurrentPhoto(i)}
          key={item.id}
          lat={item.lat}
          lng={item.lng}
        />
      ))}
    </GoogleMapReact>
  );
};

export default Map;
