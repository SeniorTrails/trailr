/* eslint-disable quotes */
import React, { useState } from 'react';
import axios from 'axios';
import Bird from './Bird.jsx';
import BirdNotReal from '../../assets/imgs/Birdsarentreal.png';

const BirdWatcher = () => {
  const [newUserLocation, setNewUserLocation] = useState('');

  const [birds, setBirds] = useState([]);

  const getBirdsForLocation = (location) => {
    // eslint-disable-next-line quotes
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${location}&key=${process.env.GOOGLE_MAPS_API_KEY}`)
      .then((res) => {
        const birdLoc = {
          lat: Math.trunc(res.data.results[0].geometry.location.lat),
          lng: Math.trunc(res.data.results[0].geometry.location.lng),
        };
        axios.get(`https://api.ebird.org/v2/data/obs/geo/recent?lat=${birdLoc.lat}&lng=${birdLoc.lng}&maxResults=15`, {
          headers: {
            'X-eBirdApiToken': 'jot80u8hfecc',
          },
        })
          .then((resBird) => setBirds(resBird.data));
      });
  };

  const onKeyUp = (event) => {
    if (event.keyCode === 13) {
      getBirdsForLocation(newUserLocation);
      setNewUserLocation('');
    }
  };

  const handleLocation = (event) => {
    setNewUserLocation(event.target.value);
  };

  return (
    <div style={{ margin: 'auto' }}>
      <br />
      <div style={birds.length ? { marginLeft: '420px' } : { marginLeft: '200px' }}>
        <input type="text" placeholder="Find Birds By Location" value={newUserLocation} onChange={handleLocation} onKeyUp={onKeyUp} />
        <button
          onClick={() => {
            getBirdsForLocation(newUserLocation);
            setNewUserLocation('');
          }}
          type="submit"
          style={{
            marginLeft: '10px',
            backgroundColor: 'green',
            borderRadius: '12px',
            color: 'white',
            fontWeight: 'bold',
          }}
        >
          Find Some Birds!
        </button>
      </div>
      <br />
      <div>
        {birds.map((bird) => <Bird bird={bird} key={bird.speciesCode} />)}
      </div>
      {birds.length ? null : <img src={BirdNotReal} alt="Not really Real" />}
      <br />
      <br />
    </div>
  );
};

export default BirdWatcher;
